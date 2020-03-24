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
import UserListItem from "../PlatformUI/UserListItem";
import { getLocalTime, addOpcacityToRGB } from "../Utils/Utils";
import * as Sharing from 'expo-sharing';

interface IFriendsProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
  friendUserProfiles: UserProfile[];
}

interface IFriendsState {
  friendUserProfiles: UserProfile[];
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
      friendRequestsNumber: 0
    };
  }

  componentDidMount = async () => {
    this.listenerToFriendRequestsNumber();
    await this.getCurrentFriends(this.props.user.userUuid);
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  getUserByUuid = async (userUuid: string): Promise<User | undefined> => {
    const db = firebase.firestore();
    const document = await db
      .collection(Collections.USERS)
      .doc(userUuid)
      .get();
    if (document.exists) {
      const data = document.data();
      const user = FirebaseModelUtils.getUserFromFirebaseUser(data);
      return user;
    }
    return undefined;
  };

  unsubscribe = () => {};

  listenerToFriendRequestsNumber = async () => {
    const db = firebase.firestore();
    db.collection(Collections.FRIEND_REQUESTS)
      .where("receiverUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        this.setState({ friendRequestsNumber: documents.docs.length });
      });
  };

  getCurrentFriends = async (userUuid: string) => {
    const db = firebase.firestore();
    this.unsubscribe = db
      .collection(Collections.FRIENDS)
      .doc(userUuid)
      .onSnapshot(async document => {
        const friendUserProfiles = Array<UserProfile>();
        if (document.exists) {
          const data = document.data();
          for (const userUuid of data.friendsUuid) {
            const friend = await NetworkManager.getUserByUuid(userUuid);
            const profile = await NetworkManager.getProfileByUuid(userUuid);
            const userProfile = new UserProfile(friend, profile);
            friendUserProfiles.push(userProfile);
          }
        }
        this.setState({ friendUserProfiles });
      });
  };

  onPressAddFriends = () => {
    this.props.navigation.navigate(Routes.ADD_FRIENDS, {
      user: this.props.user,
      currentFriendsUuid: this.state.friendUserProfiles.map(
        friendProfile => friendProfile.user.userUuid
      )
    });
  };

  onPressFriendRequests = () => {
    this.props.navigation.navigate(Routes.FRIEND_REQUESTS, {
      user: this.props.user
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
    if (Platform.OS === 'ios') {
      await Share.share({
        url: "http://www.google.com",
        title: "Invite a friend to use Coucou 🥳",
        message: "Invite a friend to use Coucou 🥳"
      });
    } else {
      await Share.share({
        url: "http://www.google.com",
        title: "Invite a friend to use Coucou 🥳",
        message: "Invite a friend to use Coucou 🥳"
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="INVITE FRIENDS TO USE COUCOU"
          trailingIcon=""
          onPress={this.onPressInviteFriends}
          isHidden={false}
          buttonStyle={ButtonStyle.PRIMARY}
        />
        <Button
          title="ADD FRIENDS"
          trailingIcon="➕"
          onPress={this.onPressAddFriends}
          isHidden={false}
          buttonStyle={ButtonStyle.PRIMARY}
        />
        {this.state.friendRequestsNumber > 0 && (
          <Button
            title={this.getFriendRequestsTitle()}
            trailingIcon="➡️"
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
              containsTrailingIcon={false}
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
