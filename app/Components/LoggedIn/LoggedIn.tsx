import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import "firebase/firestore";

import Home from "../Home/Home";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import NetworkManager from "../../Network/NetworkManager";
import { UserProfile } from "../../Models/UserProfile";
import * as Localization from "expo-localization";

interface ILoggedInProps {
  userUuid: string;
  signOut: () => Promise<void>;
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

  componentDidMount = async () => {
    const user = await NetworkManager.getUserByUuid(this.props.userUuid);
    user.timezone = Localization.timezone;
    await NetworkManager.updateUser(user);
    let profile = await NetworkManager.getProfileByUuid(this.props.userUuid);
    if (profile === undefined) {
      await NetworkManager.createProfile(this.props.userUuid);
      profile = await NetworkManager.getProfileByUuid(this.props.userUuid);
    }
    const userProfile = new UserProfile(user, profile);
    this.setState({ userProfile });
  };

  render() {
    const userProfile = this.state && this.state.userProfile;
    return (
      <View style={{ flex: 1 }}>
        {userProfile && <Home userProfile={userProfile} navigation={this.props.navigation} />}
      </View>
    );
  }
}
