import React from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import Routes from "../Routes/Routes";
import AddFriendListItem from "./AddFriendListItem";

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
  users: User[];
}

export default class AddFriend extends React.Component<
  IAddFriendProps,
  IAddFriendState
> {
  constructor(props) {
    super(props);
  }

  state = { users: Array<User>(), currentFriends: Array<string>() };

  componentDidMount = async () => {
    await this.getUsers();
  };

  getUsers = async () => {
    const db = firebase.firestore();
    const documents = await db.collection("users").get();
    const users = Array<User>();
    for (const doc of documents.docs) {
      const userData = doc.data();
      const user = new User(
        userData.displayName,
        userData.photoUrl,
        userData.userUuid,
        userData.firstname,
        userData.lastname,
        userData.timezone,
        userData.email,
        userData.profile
      );
      users.push(user);
    }
    this.setState({ users });
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
          data={this.state.users}
          renderItem={({ item }) =>
            item.userUuid !== user.userUuid && (
              <AddFriendListItem
                user={item}
                onPress={() => {this.addFriend(item.userUuid)}}
                currentFriendsUuid={this.props.route.params.currentFriendsUuid}
              />
            )
          }
          keyExtractor={user => user.userUuid}
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
