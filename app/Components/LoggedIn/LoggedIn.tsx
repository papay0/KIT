import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

import { User } from "../../Models/User";
import Home from "../Home/Home";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

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
    await this.getUserByUuid(this.props.userUuid);
  };

  getUserByUuid = async (userUuid: string) => {
    const db = firebase.firestore();
    const document = await db
      .collection("users")
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
        data.timezone,
        data.email
      );
      this.setState({ user });
    }
  };

  render() {
    const user = this.state && this.state.user;
    return (
      <View style={{flex: 1}}>
        {user && <Home user={user} navigation={this.props.navigation} />}
      </View>
    );
  }
}