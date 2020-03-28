import React from "react";
import { StyleSheet, View, FlatList, Platform, Share } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import FriendsListItem from "./FriendsListItem";
import { UserProfile } from "../../Models/UserProfile";
import NetworkManager from "../../Network/NetworkManager";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import Button, { ButtonStyle } from "../Button/Button";
import UserListItem, { TralingType } from "../PlatformUI/UserListItem";
import {
  getLocalTime,
  addOpcacityToRGB,
  sortUserProfilesAlphabetically
} from "../Utils/Utils";
import IFriendRequest, { IFriendRequestUserProfile } from "../../Models/FriendRequest";

interface IFriendsProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
  friendUserProfiles: UserProfile[];
}

interface IFriendsState {
  friendUserProfiles: UserProfile[];
  userFriendRequestsSent: IFriendRequest[];
  friendRequestUserProfiles: IFriendRequestUserProfile[];
  friendRequestsNumber: number;
}

export default class Friends extends React.Component<
  IFriendsProps,
  IFriendsState
> {
  constructor(props: IFriendsProps) {
    super(props);
    this.state = {
      friendUserProfiles: props.friendUserProfiles,
      userFriendRequestsSent: [],
      friendRequestUserProfiles: [],
      friendRequestsNumber: 0
    };
  }

  componentDidMount = async () => {
    this.listenerToFriendRequests();
    this.getCurrentFriends(this.props.user.userUuid);
    this.getUserFriendRequestsSent(this.props.user.userUuid);
  };

  componentWillUnmount() {
    this.unsubscribeFriends();
    this.unsubscribeFriendRequests();
  }

  unsubscribeFriendRequests = () => {};
  unsubscribeFriends = () => {};

  listenerToFriendRequests = async () => {
    const db = firebase.firestore();
    db.collection(Collections.FRIEND_REQUESTS)
      .where("receiverUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        this.setState({ friendRequestsNumber: documents.docs.length });
        const friendRequestUserProfiles = Array<IFriendRequestUserProfile>();
        for (const document of documents.docs) {
          if (document.exists) {
            const data = document.data();
            const friendRequest = FirebaseModelUtils.getFriendRequestFromFirebaseFriendRequest(
              data
            );
            const userProfile = await NetworkManager.getUserProfileByUuid(
              friendRequest.senderUuid
            );
            const friendRequestUserProfile: IFriendRequestUserProfile = {
              friendRequest: friendRequest,
              userProfile: userProfile
            };
            friendRequestUserProfiles.push(friendRequestUserProfile);
          }
        }
        this.setState({ friendRequestUserProfiles: friendRequestUserProfiles });
      });
  };

  getCurrentFriends = async (userUuid: string) => {
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

  getUserFriendRequestsSent = async (userUuid: string) => {
    const db = firebase.firestore();
    this.unsubscribeFriendRequests = db
      .collection(Collections.FRIEND_REQUESTS)
      .where("senderUuid", "==", userUuid)
      .onSnapshot(async documents => {
        const userFriendRequestsSent = Array<IFriendRequest>();
        for (const doc of documents.docs) {
          const friendRequest = FirebaseModelUtils.getFriendRequestFromFirebaseFriendRequest(
            doc.data()
          );
          userFriendRequestsSent.push(friendRequest);
        }
        this.setState({ userFriendRequestsSent });
      });
  };

  onPressAddFriends = () => {
    this.props.navigation.navigate(Routes.ADD_FRIENDS, {
      user: this.props.user,
      currentFriendsUuid: this.state.friendUserProfiles.map(
        friendProfile => friendProfile.user.userUuid
      ),
      userFriendRequestsSent: this.state.userFriendRequestsSent
    });
  };

  onPressFriendRequests = () => {
    this.props.navigation.navigate(Routes.FRIEND_REQUESTS, {
      friendRequestUserProfiles: this.state.friendRequestUserProfiles
    });
  };

  getFriendRequestsTitle = (): string => {
    const friendRequestsNumber = this.state.friendRequestsNumber;
    const initialTitle = "FRIEND REQUEST";
    if (friendRequestsNumber == 0) {
      return initialTitle;
    } else if (friendRequestsNumber == 1) {
      return String(friendRequestsNumber) + " " + initialTitle;
    } else {
      return String(friendRequestsNumber) + " " + initialTitle + "S";
    }
  };

  onPressInviteFriends = async () => {
    if (Platform.OS === "ios") {
      await Share.share({
        url: "http://www.google.com",
        message: "Hey 👋 download & join me on Coucou 🥳"
      });
    } else {
      await Share.share(
        {
          title: "Hey 👋 download & join me on Coucou 🥳",
          message: "http://www.google.com"
        },
        {
          dialogTitle: "Invite a friend to use Coucou 🥳"
        }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="INVITE FRIENDS TO USE COUCOU"
          onPress={this.onPressInviteFriends}
          isHidden={false}
          buttonStyle={ButtonStyle.PRIMARY}
        />
        <Button
          title="ADD FRIENDS"
          trailingIcon={require("../../../assets/plus-blue.png")}
          onPress={this.onPressAddFriends}
          isHidden={false}
          buttonStyle={ButtonStyle.PRIMARY}
        />
        {this.state.friendRequestsNumber > 0 && (
          <Button
            title={this.getFriendRequestsTitle()}
            trailingIcon={require("../../../assets/arrow-right-blue.png")}
            onPress={this.onPressFriendRequests}
            isHidden={false}
            buttonStyle={ButtonStyle.SECONDARY}
          />
        )}
        <FlatList
          data={this.state.friendUserProfiles}
          renderItem={({ item }) => (
            <UserListItem
              title={item.user.displayName}
              subtitle={getLocalTime(item.profile)}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.profile.color,
                0.8
              )}
              tralingType={TralingType.NONE}
              photoUrl={item.profile.photoUrl}
              trailingIcon={undefined}
              backgroundTrailingIcon={undefined}
              onPress={() => {}}
              disabled={true}
            />
          )}
          keyExtractor={item => item.user.userUuid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
