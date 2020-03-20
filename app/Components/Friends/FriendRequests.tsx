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

interface IFriendRequestsProps {
}

interface IFriendRequestsState {
}

export default class FriendRequests extends React.Component<
IFriendRequestsProps,
IFriendRequestsState
> {
  constructor(props: IFriendRequestsProps) {
    super(props);
  }

  componentDidMount = async () => {
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Friend requests</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
