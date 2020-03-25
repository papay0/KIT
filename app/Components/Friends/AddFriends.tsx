import React from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import { UserProfile } from "../../Models/UserProfile";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import Routes from "../Routes/Routes";
import NetworkManager from "../../Network/NetworkManager";
import AddFriendsListItem from "./AddFriendsListItem";
import IFriendRequest from "../../Models/FriendRequest";
import { getDateNow, addOpcacityToRGB } from "../Utils/Utils";
import UserListItem from "../PlatformUI/UserListItem";

interface IAddFriendsProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<AddFriendsNavigatorParams, Routes.ADD_FRIENDS>;
}

type AddFriendsNavigatorParams = {
  [Routes.ADD_FRIENDS]: {
    user: User;
    currentFriendsUuid: string[];
  };
};

interface IAddFriendsState {
  userProfiles: UserProfile[];
}

export default class AddFriends extends React.Component<
  IAddFriendsProps,
  IAddFriendsState
> {
  constructor(props: IAddFriendsProps) {
    super(props);
  }

  state = {
    userProfiles: Array<UserProfile>(),
    currentFriends: Array<string>()
  };

  componentDidMount = async () => {
    this.getUsers();
  };

  getUsers = async () => {
    const users = await NetworkManager.getUsers();
    let userProfiles = Array<UserProfile>();
    for (const user of users) {
      const profile = await NetworkManager.getProfileByUuid(user.userUuid);
      const userProfile = new UserProfile(user, profile);
      userProfiles.push(userProfile);
    }
    userProfiles = this.removeMyCurrentFriends(userProfiles);
    userProfiles = this.sortAlphabetically(userProfiles);
    this.setState({ userProfiles: userProfiles });
  };

  removeMyCurrentFriends = (userProfiles: UserProfile[]): UserProfile[] => {
    return userProfiles.filter(userProfile => {
      return !this.props.route.params.currentFriendsUuid.includes(
        userProfile.user.userUuid
      ) && this.props.route.params.user.userUuid !== userProfile.user.userUuid;
    });
  };

  sortAlphabetically = (userProfiles: UserProfile[]): UserProfile[] => {
    return userProfiles.sort((userProfileA, userProfileB) => {
      const nameA = userProfileA.user.displayName.toUpperCase();
      const nameB = userProfileB.user.displayName.toUpperCase();
      return nameA < nameB ? -1 : 0;
    });
  };

  addFriend = async (friendUuid: string) => {
    const db = firebase.firestore();
    const user = this.props.route.params.user;
    const friendRequest: IFriendRequest = {
      senderUuid: user.userUuid,
      receiverUuid: friendUuid,
      accepted: false,
      ack: false,
      createdAt: getDateNow(),
      updatedAt: getDateNow()
    };
    await NetworkManager.createFriendRequest(friendRequest);
  };

  render() {
    const user = this.props.route.params.user;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.userProfiles}
          renderItem={({ item }) => (
            <UserListItem
              title={item.user.displayName}
              subtitle={undefined}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.profile.color,
                0.8
              )}
              containsTrailingIcon={true}
              photoUrl={item.profile.photoUrl}
              trailingIcon="➕"
              backgroundTrailingIcon="white"
              onPress={() => {
                this.addFriend(item.user.userUuid);
              }}
              disabled={false}
            />
          )}
          keyExtractor={item => item.user.userUuid}
        />
        {/* <FlatList
          data={this.state.userProfiles}
          renderItem={({ item }) =>
            item.user.userUuid !== user.userUuid && (
              <AddFriendsListItem
                user={item.user}
                profile={item.profile}
                onPress={() => {
                  this.addFriend(item.user.userUuid);
                }}
                currentFriendsUuid={this.props.route.params.currentFriendsUuid}
              />
            )
          }
          keyExtractor={item => item.user.userUuid}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
