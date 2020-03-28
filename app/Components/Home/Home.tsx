import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import * as firebase from "firebase";
import { ParamListBase } from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import Routes from "../Routes/Routes";
import Button, { ButtonStyle } from "../Button/Button";
import RequestsKit from "../KIT/RequestsKit";
import { UserProfile } from "../../Models/UserProfile";
import Collections from "../Collections/Collections";
import { Profile } from "../../Models/Profile";
import NetworkManager from "../../Network/NetworkManager";
import KitsSent from "../KIT/KitsSent";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import { User } from "../../Models/User";
import { sortUserProfilesAlphabetically, getDateNow } from "../Utils/Utils";
import { TabView, TabBar } from "react-native-tab-view";
import IRequestKit from "../../Models/RequestKit";
import IRequestUser from "../../Models/RequestUser";
import moment from "moment";

interface IHomeProps {
  userProfile: UserProfile;
  navigation: StackNavigationProp<ParamListBase>;
}

interface ROUTE_TAB_VIEW {
  key: string;
  title: string;
}

interface IHomeState {
  profile: Profile;
  user: User;
  friendUserProfiles: UserProfile[];
  requestUsers: IRequestUser[];
  kitsSent: IRequestUser[];
  index: number;
  routes: ROUTE_TAB_VIEW[];
  time: number;
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  interval: NodeJS.Timeout;
  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      profile: this.props.userProfile.profile,
      friendUserProfiles: [],
      user: this.props.userProfile.user,
      requestUsers: [],
      kitsSent: [],
      index: 0,
      routes: this.loadRoutes(),
      time: 0
    };
  }

  loadRoutes = (): ROUTE_TAB_VIEW[] => {
    return [
      { key: "received", title: "RECEIVED" },
      { key: "sent", title: "SENT" }
    ];
  };

  unsubscribeProfile = () => {};
  unsubscribeFriends = () => {};
  unsubscribeUser = () => {};
  unsubscribeRequestsReceived = () => {};
  unsubscribeRequestsSent = () => {};
  componentDidMount() {
    this.setUpTimer();
    this.setBaseHeaderOptions();
    this.setHeaderLeftOption(this.state.user.firstname);
    this.getRequests();
    this.listenToRequests();
    this.listenerToKitsSent();
    const db = firebase.firestore();
    const userUuid = this.props.userProfile.user.userUuid;
    this.unsubscribeProfile = db
      .collection(Collections.PROFILES)
      .doc(userUuid)
      .onSnapshot(async document => {
        if (document.exists) {
          const data = document.data();
          const profile = FirebaseModelUtils.getProfileFromFirebaseUser(data);
          this.setState({ profile });
          this.setHeaderRightOption();
        }
      });
    this.unsubscribeUser = db
      .collection(Collections.USERS)
      .doc(userUuid)
      .onSnapshot(async document => {
        if (document.exists) {
          const data = document.data();
          const user = FirebaseModelUtils.getUserFromFirebaseUser(data);
          this.setState({ user: user });
        }
      });
    this.getFriends(this.props.userProfile.user.userUuid);
  }

  getRequests = async () => {
    let requestUsers = await NetworkManager.getRequestUsersForUserUuid(
      this.props.userProfile.user.userUuid
    );
    requestUsers = requestUsers.filter(requestUser => {
      const minutes = this.getDuration(requestUser.request);
      return minutes > 0;
    })
    this.setState({ requestUsers: requestUsers });
  };

  getDuration = (request: IRequestKit): number => {
    const now = moment(getDateNow());
    const duration = moment.duration(moment(request.availableUntil).diff(now));
    return Math.floor(duration.asMinutes());
  };

  routeToCorrectIndexTabView = () => {
    const requestsReceived = this.state.requestUsers;
    const requestsSent = this.state.kitsSent;
    const currentIndex = this.state.index;
    var index = 0;
    if (requestsReceived.length === 0 && requestsSent.length > 0) {
      index = 1;
    }
    if (currentIndex !== index) {
      this.setState({ index: index });
    }
  };

  listenerToKitsSent = async () => {
    const db = firebase.firestore();
    this.unsubscribeRequestsSent = db
      .collection(Collections.REQUESTS)
      .where("senderUuid", "==", this.props.userProfile.user.userUuid)
      .onSnapshot(async documents => {
        const requests = Array<IRequestKit>();
        for (const doc of documents.docs) {
          const data = doc.data();
          const request = FirebaseModelUtils.getRequestFromFirebaseRequest(
            data
          );
          const minutes = this.getDuration(request);
          if (minutes > 0) {
            requests.push(request);
          }
        }
        const kitsSent = Array<IRequestUser>();
        for (const request of requests) {
          const user = await NetworkManager.getUserByUuid(request.receiverUuid);
          const profile = await NetworkManager.getProfileByUuid(
            request.receiverUuid
          );
          const userProfile = new UserProfile(user, profile);
          const kitSent: IRequestUser = {
            userProfile: userProfile,
            request: request
          };
          kitsSent.push(kitSent);
        }
        this.setState({ kitsSent: kitsSent });
        this.routeToCorrectIndexTabView();
      });
  };

  listenToRequests = async () => {
    const db = firebase.firestore();
    this.unsubscribeRequestsReceived = db
      .collection(Collections.REQUESTS)
      .where("receiverUuid", "==", this.props.userProfile.user.userUuid)
      .onSnapshot(async documents => {
        const requests = Array<IRequestKit>();
        for (const doc of documents.docs) {
          const data = doc.data();
          const request = FirebaseModelUtils.getRequestFromFirebaseRequest(
            data
          );
          const minutes = this.getDuration(request);
          if (minutes > 0) {
            requests.push(request);
          }
        }
        const requestUsers = await NetworkManager.getRequestUsersFromRequests(
          requests
        );
        this.setState({ requestUsers: requestUsers });
        this.routeToCorrectIndexTabView();
      });
  };

  setUpTimer = () => {
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      10000
    );
  };

  getFriends = async (userUuid: string) => {
    const db = firebase.firestore();
    this.unsubscribeFriends = db
      .collection(Collections.FRIENDS)
      .doc(userUuid)
      .onSnapshot(async document => {
        let friendUserProfiles = Array<UserProfile>();
        if (document.exists) {
          const data = document.data();
          for (const userUuid of data.friendsUuid) {
            const friend = await NetworkManager.getUserByUuid(userUuid);
            const profile = await NetworkManager.getProfileByUuid(userUuid);
            const userProfile = new UserProfile(friend, profile);
            friendUserProfiles.push(userProfile);
          }
        }
        friendUserProfiles = sortUserProfilesAlphabetically(friendUserProfiles);
        this.setState({ friendUserProfiles });
      });
  };

  setBaseHeaderOptions = () => {
    this.props.navigation.setOptions({
      headerShown: true,
      headerTitle: null
    });
  };

  setHeaderLeftOption = (firstname: string) => {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            marginLeft: 20
          }}
        >
          <Text style={styles.headerTitleCoucou}>Coucou, </Text>
          <Text style={styles.headerTitleName}>{firstname}</Text>
        </View>
      )
    });
  };

  setHeaderRightOption = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const userProfile = new UserProfile(
              this.state.user,
              this.state.profile
            );
            this.props.navigation.navigate(Routes.PROFILE, {
              userProfile: userProfile,
              friendUserProfiles: this.state.friendUserProfiles
            });
          }}
          style={{
            backgroundColor: "transparent",
            paddingRight: 15
          }}
        >
          {ProfileImage(this.state.profile)}
        </TouchableOpacity>
      )
    });
  };

  componentWillUnmount() {
    this.unsubscribeProfile();
    this.unsubscribeFriends();
    this.unsubscribeUser();
    this.unsubscribeRequestsReceived();
    this.unsubscribeRequestsSent();
    clearInterval(this.interval);
  }

  routeToSendKIT = () => {
    this.props.navigation.navigate(Routes.SEND_KIT, {
      user: this.state.user,
      friendUserProfiles: this.state.friendUserProfiles
    });
  };

  _handleIndexChange = (index: number) => this.setState({ index });

  _renderScene = ({ route }) => {
    switch (route.key) {
      case "received":
        return (
          <RequestsKit
            user={this.state.user}
            requestUsers={this.state.requestUsers}
          />
        );
      case "sent":
        return (
          <KitsSent user={this.state.user} kitsSent={this.state.kitsSent} />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TabView
          navigationState={{
            index: this.state.index,
            routes: this.state.routes
          }}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderLabel={({ route, focused, color }) => (
                <Text
                  style={{
                    color: focused ? "#5468FF" : "grey",
                    fontWeight: "bold"
                  }}
                >
                  {route.title}
                </Text>
              )}
              indicatorStyle={{ backgroundColor: "#5468FF" }}
              style={{ backgroundColor: "white" }}
            />
          )}
        />
        {this.state.friendUserProfiles.length > 0 && (
          <Button
            title="SAY COUCOU"
            onPress={this.routeToSendKIT}
            isHidden={false}
            trailingIcon={require("../../../assets/arrow-right-blue.png")}
            buttonStyle={ButtonStyle.PRIMARY}
          />
        )}
      </SafeAreaView>
    );
  }
}

function ProfileImage(profile: Profile): JSX.Element {
  return (
    <Image
      style={{ ...styles.profileImage, borderColor: profile.color }}
      source={{ uri: profile.photoUrl }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentView: {
    flex: 1,
    flexDirection: "column"
  },
  profileImage: {
    width: 40,
    height: 40,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderRadius: 150
  },
  floatingButton: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10
  },
  headerTitleCoucou: {
    fontWeight: "bold",
    fontSize: 34
  },
  headerTitleName: {
    fontWeight: "normal",
    fontSize: 28
  }
});
