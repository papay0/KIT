import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  SafeAreaView
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import Collections from "../Collections/Collections";
import SelectFriendsListItem from "../Friends/SelectFriendsListItem";
import FloatingButton from "../FloatingButton/FloatingButton";

interface ISendKitProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<SENDKITNavigatorParams, Routes.SEND_KIT>;
}

type SENDKITNavigatorParams = {
  [Routes.SEND_KIT]: {
    user: User;
  };
};

interface ISendKitState {
  friends: User[];
  selectedFriends: User[];
}

export default class SendKit extends React.Component<
  ISendKitProps,
  ISendKitState
> {
  constructor(props) {
    super(props);
    this.state = { friends: [], selectedFriends: [] };
  }

  componentDidMount = async () => {
    await this.getCurrentFriends(this.props.route.params.user.userUuid);
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

  routeToSelectTime = () => {};

  onSelect = (user: User, selected: boolean) => {
    let selectedFriends = this.state.selectedFriends;
    if (selected) {
      selectedFriends.push(user);
    } else {
      selectedFriends = selectedFriends.filter(
        friend => friend.userUuid !== user.userUuid
      );
    }
    this.setState({ selectedFriends });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.friends}
          renderItem={({ item }) => (
            <SelectFriendsListItem user={item} onSelect={this.onSelect} />
          )}
          keyExtractor={user => user.userUuid}
        />
        <FloatingButton
          title="Continue"
          onPress={this.routeToSelectTime}
          isHidden={this.state.selectedFriends.length === 0}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    fontSize: 25
  }
});
