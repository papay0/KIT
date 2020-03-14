import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

import { User } from "../../Models/User";
import Home from "../Home/Home";

interface ILoggedInProps {
  userUuid: string;
  signOut: () => Promise<void>;
}

interface ILoggedInState {
  user: User;
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
    console.log("userUuid = " + userUuid);
    const document = await db
      .collection("users")
      .doc(userUuid)
      .get();
    if (document.exists) {
      const data = document.data();
      console.log("data = " + JSON.stringify(data));
      const user = new User(
        data.displayName,
        data.photoUrl,
        data.userUuid,
        data.firstname,
        data.lastname,
        data.timezone
      );
      this.setState({ user });
    }
  };

  render() {
    const user = this.state && this.state.user;
    return (
      <View style={styles.container}>
        {user && <Home user={user} />}
        <Button title="Sign Out" onPress={() => this.props.signOut()} />
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
  },
  header: {
    fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});
