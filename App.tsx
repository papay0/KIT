import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ApiKeys from "./App/Constants/ApiKeys";
import * as firebase from "firebase/app";
import Profile from "./App/Components/Profile/Profile";
import * as Expo from "expo";
import * as Google from "expo-google-app-auth";
import Login from "./App/Components/Login/Login";

export default class App extends React.Component {
  state = { signedIn: false, name: "", photoUrl: "" };

  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    }
  }

  signIn = async () => {
    try {
      const config = {
        androidClientId: ApiKeys.GoogleAuthConfig.androidClientId,
        iosClientId: ApiKeys.GoogleAuthConfig.iosClientId,
        scopes: ["profile", "email"]
      };
      const result = await Google.logInAsync(config);
      if (result.type === "success" && result.user) {
        this.setState({
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        });
      } else {
        console.log("cancelled");
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.signedIn ? (
          <Text>Logged in!</Text>
        ) : (
          <Login name="Arthur" signIn={this.signIn} />
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
