import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { User } from "../../Models/User";

interface IAddFriendProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
}

export default class AddFriend extends React.Component<IAddFriendProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Add friend</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
