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
import NetworkManager from "../../Network/NetworkManager";

interface IConfigGoogleAuth {
  androidClientId: string;
  iosClientId: string;
  scopes: string[];
}

interface IRootProps {
  navigation: StackNavigationProp<ParamListBase>;
}

interface IRootState {
  currentFirebaseUser: firebase.User | undefined;
  currentFirebaseUserLoaded: boolean;
}

export default class Root extends React.Component<IRootProps, IRootState> {
  constructor(props) {
    super(props);
    this.state = {
      currentFirebaseUser: undefined,
      currentFirebaseUserLoaded: false
    };
  }

  unsubscribe = () => {};
  componentDidMount = async () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        currentFirebaseUser: user,
        currentFirebaseUserLoaded: true
      });
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

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
          Localization.timezone,
          result.user.email
        );
        await NetworkManager.updateUser(user);
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
    const user = this.state.currentFirebaseUser;
    const currentFirebaseUserLoaded = this.state.currentFirebaseUserLoaded;
    return (
      <View style={styles.container}>
        {!currentFirebaseUserLoaded ? (
          <Text>Loading...</Text>
        ) : user ? (
          <LoggedIn
            userUuid={user.uid}
            signOut={this.signOut}
            navigation={this.props.navigation}
          />
        ) : (
          <Login signIn={this.signIn} navigation={this.props.navigation} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
