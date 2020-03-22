import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as firebase from "firebase";

import Home from "../Home/Home";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import NetworkManager from "../../Network/NetworkManager";
import { UserProfile } from "../../Models/UserProfile";
import * as Localization from "expo-localization";
import Collections from "../Collections/Collections";
import { User } from "../../Models/User";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import { ILoginMetadata } from "../Login/LoginMetadata";

interface ILoggedInProps {
  userUuid: string;
  signOut: () => Promise<void>;
  loginMetadata?: ILoginMetadata;
  navigation: StackNavigationProp<ParamListBase>;
}

interface ILoggedInState {
  userProfile: UserProfile | undefined;
}

export default class LoggedIn extends React.Component<
  ILoggedInProps,
  ILoggedInState
> {
  constructor(props) {
    super(props);
  }

  unsubscribeUser = () => {};
  componentDidMount = async () => {
    console.log("in loggedIn");
    const db = firebase.firestore();
    this.unsubscribeUser = db
      .collection(Collections.USERS)
      .doc(this.props.userUuid)
      .onSnapshot(async document => {
        console.log("2222.")
        if (document.exists) {
          console.log("2222.1")
          const data = document.data();
          const user = FirebaseModelUtils.getUserFromFirebaseUser(data);
          if (user) {
            await this.handleUserLoggedIn(user);
          }
        }
      });
  };
  componentWillUnmount = () => {
    this.unsubscribeUser();
  };

  handleUserLoggedIn = async (user: User) => {
    console.log("1. handleUserLoggedIn");
    await NetworkManager.updateUser(user);
    let profile = await NetworkManager.getProfileByUuid(this.props.userUuid);
    const loginMetadata = this.props.loginMetadata;
    if (profile === undefined && loginMetadata !== null) {
      await NetworkManager.createProfile(
        this.props.userUuid,
        loginMetadata.photoUrl,
        Localization.timezone
      );
      profile = await NetworkManager.getProfileByUuid(this.props.userUuid);
    } else {
      profile.timezone = Localization.timezone;
      await NetworkManager.updateProfile(profile);
    }
    const userProfile = new UserProfile(user, profile);
    this.setState({ userProfile });
  };

  render() {
    const userProfile = this.state && this.state.userProfile;
    return (
      <View style={{ flex: 1 }}>
        {userProfile && (
          <Home userProfile={userProfile} navigation={this.props.navigation} />
        )}
      </View>
    );
  }
}
