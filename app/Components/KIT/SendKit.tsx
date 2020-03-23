import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  SafeAreaView,
  TouchableOpacityBase
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import Collections from "../Collections/Collections";
import SelectFriendsListItem from "../Friends/SelectFriendsListItem";
import FloatingButton from "../FloatingButton/FloatingButton";
import TimeKit from "./TimeKit";
import IRequestKit from "../../Models/RequestKit";
import { UserProfile } from "../../Models/UserProfile";
import NetworkManager from "../../Network/NetworkManager";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";

interface ISendKitProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<SENDKITNavigatorParams, Routes.SEND_KIT>;
}

type SENDKITNavigatorParams = {
  [Routes.SEND_KIT]: {
    user: User;
    friendUserProfiles: UserProfile[];
  };
};

interface ISendKitState {
  selectedFriendUserProfiles: UserProfile[];
  time: number | undefined;
  requestsFromMe: IRequestKit[];
}

export default class SendKit extends React.Component<
  ISendKitProps,
  ISendKitState
> {
  constructor(props) {
    super(props);
    this.state = {
      selectedFriendUserProfiles: [],
      time: undefined,
      requestsFromMe: []
    };
  }

  componentDidMount = async () => {
    await this.getRequestsFromMe();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  getRequestsFromMe = async () => {
    const db = firebase.firestore();
    const user = this.props.route.params.user;
    const documents = await db
      .collection(Collections.REQUESTS)
      .where("senderUuid", "==", user.userUuid)
      .get();
    const requestsFromMe = Array<IRequestKit>();
    for (const doc of documents.docs) {
      const data = doc.data();
      const request = FirebaseModelUtils.getRequestFromFirebaseRequest(data);
      requestsFromMe.push(request);
    }
    this.setState({ requestsFromMe });
  };

  unsubscribe = () => {};

  routeToSummarySendKit = () => {
    this.props.navigation.navigate(Routes.SUMMARY_SEND_KIT, {
      friendUserProfiles: this.state.selectedFriendUserProfiles,
      time: this.state.time,
      user: this.props.route.params.user,
      requestsFromMe: this.state.requestsFromMe
    });
  };

  onSelectFriend = (userProfile: UserProfile, selected: boolean) => {
    let selectedFriendUserProfiles = this.state.selectedFriendUserProfiles;
    if (selected) {
      selectedFriendUserProfiles.push(userProfile);
    } else {
      selectedFriendUserProfiles = selectedFriendUserProfiles.filter(
        friendUserProfile => friendUserProfile.user.userUuid !== userProfile.user.userUuid
      );
    }
    this.setState({ selectedFriendUserProfiles });
  };

  onSelectTime = (time: number | undefined) => {
    this.setState({ time });
  };

  render() {
    const friendsNumber = this.state.selectedFriendUserProfiles.length;
    const friendsString = friendsNumber > 1 ? " friends " : " friend ";
    const timeString = this.state.time + " min";
    const title =
      "Continue - " + friendsNumber + friendsString + " - " + timeString;
    const isContinueButtonHidden =
      this.state.selectedFriendUserProfiles.length === 0 || this.state.time === undefined;
    const friendUserProfiles = this.props.route.params.friendUserProfiles;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.timeKit}>
          <TimeKit onSelectTime={this.onSelectTime} />
        </View>
        <FlatList
          data={friendUserProfiles}
          renderItem={({ item }) => (
            <SelectFriendsListItem
              user={item.user}
              profile={item.profile}
              onSelect={this.onSelectFriend}
            />
          )}
          keyExtractor={item => item.user.userUuid}
        />
        <FloatingButton
          title={title}
          onPress={this.routeToSummarySendKit}
          isHidden={isContinueButtonHidden}
          trailingIcon="➡️"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  timeKit: {
    margin: 10
  },
  header: {
    fontSize: 25
  }
});
