import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";

interface IFriendsProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
}

export default class Friends extends React.Component<IFriendsProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Friends!</Text>
        <Button
          title="Add friend"
          onPress={() =>
            this.props.navigation.navigate(Routes.ADD_FRIEND, {
              user: this.props.user
            })
          }
        />
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
