import React from "react";
import { StyleSheet, Text, View, YellowBox } from "react-native";
import { User } from "../../Models/User";
import * as firebase from "firebase";
import LoggedIn from "../LoggedIn/LoggedIn";
import Login from "../Login/Login";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import NetworkManager from "../../Network/NetworkManager";
import * as AppleAuthentication from "expo-apple-authentication";
import { ILoginMetadata } from "../Login/LoginMetadata";

interface IRootProps {
  navigation: StackNavigationProp<ParamListBase>;
}

interface IRootState {
  currentFirebaseUser?: firebase.User;
  currentFirebaseUserLoaded: boolean;
  user: User | undefined;
}

export default class Root extends React.Component<IRootProps, IRootState> {
  constructor(props) {
    super(props);
    this.state = {
      currentFirebaseUser: null,
      currentFirebaseUserLoaded: false,
      user: undefined
    };
  }

  unsubscribe = () => {};
  componentDidMount = async () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(async firebaseUser => {
      let user: User = undefined;
      if (firebaseUser) {
        user = await NetworkManager.getUserByUuid(firebaseUser.uid);
      }
      this.setState({
        currentFirebaseUser: firebaseUser,
        currentFirebaseUserLoaded: true,
        user: user
      });
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  signedIn = async (userUuid: string) => {
    const updatedUser = await NetworkManager.getUserByUuid(userUuid);
    this.setState({user: updatedUser});
  };

  signOut = async () => {
    await firebase.auth().signOut();
    this.setState({currentFirebaseUserLoaded: false, currentFirebaseUser: null});
  };

  render() {
    const firebaseUser = this.state.currentFirebaseUser;
    const currentFirebaseUserLoaded = this.state.currentFirebaseUserLoaded;
    const user = this.state.user;
    return (
      <View style={styles.container}>
        {!currentFirebaseUserLoaded ? (
          <Text>Loading...</Text>
        ) : user ? (
          <LoggedIn
            user={user}
            signOut={this.signOut}
            navigation={this.props.navigation}
          />
        ) : (
          <Login
            signedIn={this.signedIn}
            navigation={this.props.navigation}
          />
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
