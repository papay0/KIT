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
import { Profile } from "../../Models/Profile";
import { getDateNow } from "../Utils/Utils";
import ProfileColorManager, { ProfileColor } from "../../Models/ProfileColor";

interface ILoggedInProps {
  user: User;
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
    this.state = {
      userProfile: undefined
    };
  }

  unsubscribeUser = () => {};
  componentDidMount = async () => {
    const user = this.props.user;
    user.locale = Localization.locale;
    NetworkManager.updateUser(user);
    const profile = await NetworkManager.getProfileByUuid(user.userUuid);
    profile.timezone = Localization.timezone;
    NetworkManager.updateProfile(profile);
    const userProfile = new UserProfile(user, profile);
    this.setState({ userProfile });
  };
  componentWillUnmount = () => {
    this.unsubscribeUser();
  };

  render() {
    const userProfile = this.state && this.state.userProfile;
    return (
      <View style={{ flex: 1 }}>
        {userProfile ? (
          <Home userProfile={userProfile} navigation={this.props.navigation} />
        ) : (
          <View>
            <Text>
              Here I need a loading screen because I have not received my user
              yet.
            </Text>
          </View>
        )}
      </View>
    );
  }
}
