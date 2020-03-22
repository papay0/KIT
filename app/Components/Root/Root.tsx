import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
  loginMetadata?: ILoginMetadata;
}

export default class Root extends React.Component<IRootProps, IRootState> {
  constructor(props) {
    super(props);
    this.state = {
      currentFirebaseUser: null,
      currentFirebaseUserLoaded: false,
      loginMetadata: null
    };
  }

  unsubscribe = () => {};
  componentDidMount = async () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      this.setState({
        currentFirebaseUser: user,
        currentFirebaseUserLoaded: true
      });
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  signedIn = async (user: User, loginMetadata: ILoginMetadata, shouldUpdateUser: boolean) => {
    if (shouldUpdateUser) {
      await NetworkManager.createOrUpdateUser(user);
    }
    this.setState({loginMetadata: loginMetadata});
  };

  signOut = async () => {
    await firebase.auth().signOut();
    this.setState({currentFirebaseUserLoaded: false, currentFirebaseUser: null});
  };

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
            loginMetadata={this.state.loginMetadata}
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
