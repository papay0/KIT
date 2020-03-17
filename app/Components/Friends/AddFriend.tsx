import React from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import { UserProfile } from "../../Models/UserProfile";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import Routes from "../Routes/Routes";
import AddFriendListItem from "./AddFriendListItem";
import NetworkManager from "../../Network/NetworkManager";

interface IAddFriendProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<AddFriendNavigatorParams, Routes.ADD_FRIEND>;
}

type AddFriendNavigatorParams = {
  [Routes.ADD_FRIEND]: {
    user: User;
    currentFriendsUuid: string[];
  };
};

interface IAddFriendState {
  userProfiles: UserProfile[];
}

export default class AddFriend extends React.Component<
  IAddFriendProps,
  IAddFriendState
> {
  constructor(props) {
    super(props);
  }

  state = {
    userProfiles: Array<UserProfile>(),
    currentFriends: Array<string>()
  };

  componentDidMount = async () => {
    await this.getUsers();
  };

  getUsers = async () => {
    const users = await NetworkManager.getUsers();
    const userProfiles = Array<UserProfile>();
    for (const user of users) {
      const profile = await NetworkManager.getProfileByUuid(user.userUuid);
      const userProfile = new UserProfile(user, profile);
      userProfiles.push(userProfile);
    }
    this.setState({ userProfiles });
  };

  addFriend = async (friendUuid: string) => {
    const db = firebase.firestore();
    await db
      .collection(Collections.FRIENDS)
      .doc(this.props.route.params.user.userUuid)
      .set(
        { friendsUuid: firebase.firestore.FieldValue.arrayUnion(friendUuid) },
        { merge: true }
      );
  };

  render() {
    const user = this.props.route.params.user;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.userProfiles}
          renderItem={({ item }) =>
            item.user.userUuid !== user.userUuid && (
              <AddFriendListItem
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
