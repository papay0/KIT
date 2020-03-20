import React from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";

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

interface IFriendsProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
  friendUserProfiles: UserProfile[];
}

interface IFriendsState {
  friendUserProfiles: UserProfile[];
}

export default class Friends extends React.Component<
  IFriendsProps,
  IFriendsState
> {
  constructor(props: IFriendsProps) {
    super(props);
    this.state = { friendUserProfiles: props.friendUserProfiles };
  }

  componentDidMount = async () => {
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

  unsubscribe = () => {}

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

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Add friend"
          onPress={() =>
            this.props.navigation.navigate(Routes.ADD_FRIENDS, {
              user: this.props.user,
              currentFriendsUuid: this.state.friendUserProfiles.map(
                friendProfile => friendProfile.user.userUuid
              )
            })
          }
        />
        <Button
          title="Friend requests"
          onPress={() =>
            this.props.navigation.navigate(Routes.FRIEND_REQUESTS, {
            })
          }
        />
        <FlatList
          data={this.state.friendUserProfiles}
          renderItem={({ item }) => (
            <FriendsListItem
              user={item.user}
              profile={item.profile}
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
