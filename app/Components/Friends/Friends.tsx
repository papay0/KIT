import React from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import FriendListItem from "./FriendListItem";

interface IFriendsProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
}

interface IFriendsState {
  friends: User[];
}

export default class Friends extends React.Component<
  IFriendsProps,
  IFriendsState
> {
  constructor(props) {
    super(props);
    this.state = { friends: [] };
  }

  componentDidMount = async () => {
    await this.getCurrentFriends(this.props.user.userUuid);
  };

  getUserByUuid = async (userUuid: string): Promise<User | undefined> => {
    const db = firebase.firestore();
    const document = await db
      .collection(Collections.USERS)
      .doc(userUuid)
      .get();
    if (document.exists) {
      const data = document.data();
      const user = new User(
        data.displayName,
        data.photoUrl,
        data.userUuid,
        data.firstname,
        data.lastname,
        data.timezone
      );
      return user;
    }
    return undefined;
  };

  getCurrentFriends = async (userUuid: string) => {
    const db = firebase.firestore();
    const document = await db
      .collection(Collections.FRIENDS)
      .doc(userUuid)
      .onSnapshot(async document => {
        const friends = Array<User>();
        if (document.exists) {
          const data = document.data();
          for (const userUuid of data.friendsUuid) {
            const friend = await this.getUserByUuid(userUuid);
            friends.push(friend);
          }
        }
        this.setState({ friends });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Friends!</Text>
        <Button
          title="Add friend"
          onPress={() =>
            this.props.navigation.navigate(Routes.ADD_FRIEND, {
              user: this.props.user,
              currentFriendsUuid: this.state.friends.map(
                friend => friend.userUuid
              )
            })
          }
        />
        <FlatList
          data={this.state.friends}
          renderItem={({ item }) => (
            <FriendListItem
              user={item}
              shouldShowAddButton={false}
              addFriend={undefined}
              currentFriendsUuid={[]}
            />
          )}
          keyExtractor={user => user.userUuid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center"
  }
});
