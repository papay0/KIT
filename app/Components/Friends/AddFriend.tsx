import React from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import Routes from "../Routes/Routes";

interface IAddFriendProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<AddFriendNavigatorParams, Routes.ADD_FRIEND>;
}

type AddFriendNavigatorParams = {
  [Routes.ADD_FRIEND]: {
    user: User;
  };
};

interface IAddFriendState {
  users: User[];
  currentFriendsUuid: string[];
}

export default class AddFriend extends React.Component<
  IAddFriendProps,
  IAddFriendState
> {
  constructor(props) {
    super(props);
  }

  state = { users: Array<User>(), currentFriendsUuid: Array<string>() };

  componentDidMount = async () => {
    await this.getCurrentFriendsUuid(this.props.route.params.user.userUuid);
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
        userData.timezone
      );
      users.push(user);
    }
    this.setState({ users });
  };

  getCurrentFriendsUuid = async (userUuid: string) => {
    const db = firebase.firestore();
    const document = await db
      .collection(Collections.FRIENDS)
      .doc(userUuid)
      .get();
    const currentFriendsUuid = Array<string>();
    if (document.exists) {
      const data = document.data();
      for (const userUuid of data.friendsUuid) {
        currentFriendsUuid.push(userUuid);
      }
    }
    this.setState({ currentFriendsUuid });
  };

  addFriend = async (friendUuid: string) => {
    const db = firebase.firestore();
    console.log("route user = " + this.props.route.params.user.userUuid);
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
              <FriendListItem
                user={item}
                addFriend={this.addFriend}
                currentFriendsUuid={this.state.currentFriendsUuid}
              />
            )
          }
          keyExtractor={user => user.userUuid}
        />
      </View>
    );
  }
}

interface IFriendListItemProps {
  user: User;
  currentFriendsUuid: string[];
  addFriend: (userUuid: string) => Promise<void>;
}

interface IFriendListItemState {
  title: string;
  disabled: boolean;
}

class FriendListItem extends React.Component<
  IFriendListItemProps,
  IFriendListItemState
> {
  constructor(props: IFriendListItemProps) {
    super(props);
    const alreadyFriend = props.currentFriendsUuid.includes(
      props.user.userUuid
    );
    this.state = {
      title: alreadyFriend ? "Added" : "Add",
      disabled: alreadyFriend
    };
  }

  onPressButton = () => {
    this.setState({
      title: "Added",
      disabled: true
    });
    this.props.addFriend(this.props.user.userUuid);
  };

  //   state = { title: "Add", disabled: false };

  render() {
    const user = this.props.user;
    return (
      <View style={styles.containerFriendList}>
        <Image source={{ uri: user.photoUrl }} style={styles.image} />
        <View style={styles.container_content}>
          <Text style={styles.title}>{user.firstname}</Text>
          <Text style={styles.title}>{user.lastname}</Text>
        </View>
        <View style={styles.addButton}>
          <Button
            title={this.state.title}
            disabled={this.state.disabled}
            onPress={() => this.onPressButton()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  addButton: {
    justifyContent: "center"
  },
  image: {
    width: 50,
    height: 50,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
  containerFriendList: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "#FFF"
    // elevation: 2
  },
  title: {
    fontSize: 16,
    color: "#000",
    justifyContent: "flex-start"
  },
  container_content: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    justifyContent: "center"
  },
  description: {
    fontSize: 11,
    fontStyle: "italic"
  },
  photo: {
    height: 50,
    width: 50
  }
});
