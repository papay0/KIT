import React from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import { UserProfile } from "../../Models/UserProfile";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import Routes from "../Routes/Routes";
import NetworkManager from "../../Network/NetworkManager";
import AddFriendsListItem from "./AddFriendsListItem";

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
