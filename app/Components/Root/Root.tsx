import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { User } from "../../Models/User";
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";
import * as Localization from "expo-localization";
import ApiKeys from "../../Constants/ApiKeys";
import LoggedIn from "../LoggedIn/LoggedIn";
import Login from "../Login/Login";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";

interface IConfigGoogleAuth {
  androidClientId: string;
  iosClientId: string;
  scopes: string[];
}

interface IRootProps {
    navigation: StackNavigationProp<ParamListBase>;
  }

export default class Root extends React.Component<IRootProps> {
  constructor(props) {
    super(props);
  }

  updateUser = async (user: User) => {
    // firebase
    const db = firebase.firestore();
    db.collection("users")
      .doc(user.userUuid)
      .set(JSON.parse(JSON.stringify(user)), { merge: true });
  };

  signIn = async () => {
    try {
      const config = this.getConfig();
      const result = await Google.logInAsync(config);
      if (result.type === "success" && result.user) {
        // Super hack lol, what a great way to start this project! =)
        try {
          await firebase
            .auth()
            .signInWithEmailAndPassword(result.user.email, result.user.id);
        } catch (e) {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(result.user.email, result.user.id);
        }
        const user = new User(
          result.user.name,
          result.user.photoUrl,
          firebase.auth().currentUser.uid,
          result.user.givenName,
          result.user.familyName,
          Localization.timezone
        );
        this.updateUser(user);
        this.forceUpdate();
      } else {
        console.log("cancelled");
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  signOut = async () => {
    await firebase.auth().signOut();
    this.forceUpdate();
  };

  getConfig(): IConfigGoogleAuth {
    return {
      androidClientId: ApiKeys.GoogleAuthConfig.androidClientId,
      iosClientId: ApiKeys.GoogleAuthConfig.iosClientId,
      scopes: ["profile", "email"]
    };
  }

  render() {
    const currentUser = firebase.auth().currentUser;
    console.log("currentUser = " + JSON.stringify(currentUser));
    return (
      <View style={styles.container}>
        {currentUser ? (
          <LoggedIn userUuid={currentUser.uid} signOut={this.signOut} navigation={this.props.navigation} />
        ) : (
          <Login signIn={this.signIn} />
        )}
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
