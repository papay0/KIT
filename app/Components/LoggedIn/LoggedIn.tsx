import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

import { User } from "../../Models/User";
import Home from "../Home/Home";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import NetworkManager from "../../Network/NetworkManager";

interface ILoggedInProps {
  userUuid: string;
  signOut: () => Promise<void>;
  navigation: StackNavigationProp<ParamListBase>;
}

interface ILoggedInState {
  user: User | undefined;
}

export default class LoggedIn extends React.Component<
  ILoggedInProps,
  ILoggedInState
> {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    const user = await NetworkManager.getUserByUuid(this.props.userUuid);
    this.setState({ user });
  };

  render() {
    const user = this.state && this.state.user;
    return (
      <View style={{ flex: 1 }}>
        {user && <Home user={user} navigation={this.props.navigation} />}
      </View>
    );
  }
}
