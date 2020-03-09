import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ApiKeys from "./App/Constants/ApiKeys";
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";
import Login from "./App/Components/Login/Login";
import LoggedIn from "./App/Components/LoggedIn/LoggedIn";
import { User } from "./App/Models/User";

interface IConfigGoogleAuth {
  androidClientId: string;
  iosClientId: string;
  scopes: string[];
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    }
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
          result.user.familyName
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
          <LoggedIn userUuid={currentUser.uid} signOut={this.signOut} />
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
