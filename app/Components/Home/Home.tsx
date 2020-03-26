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
import { sortUserProfilesAlphabetically } from "../Utils/Utils";

interface IHomeProps {
  userProfile: UserProfile;
  navigation: StackNavigationProp<ParamListBase>;
}

interface IHomeState {
  profile: Profile;
  user: User;
  friendUserProfiles: UserProfile[];
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.userProfile.profile,
      friendUserProfiles: [],
      user: this.props.userProfile.user
    };
  }

  unsubscribeProfile = () => {};
  unsubscribeFriends = () => {};
  unsubscribeUser = () => {};
  componentDidMount() {
    this.setBaseHeaderOptions();
    this.setHeaderLeftOption(this.state.user.firstname);
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
          this.setState({user: user});
        }
      });
    this.getFriends(this.props.userProfile.user.userUuid);
  }

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
    })
  }

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
    })
  }

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
  }

  routeToSendKIT = () => {
    this.props.navigation.navigate(Routes.SEND_KIT, {
      user: this.state.user,
      friendUserProfiles: this.state.friendUserProfiles
    });
  };

  render() {
    const user = this.props.userProfile.user;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentView}>
          <RequestsKit user={user} />
        </View>
        <Button
          title="SAY COUCOU"
          onPress={this.routeToSendKIT}
          isHidden={false}
          trailingIcon={require("../../../assets/arrow-right-blue.png")}
          buttonStyle={ButtonStyle.PRIMARY}
        />
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
