import React from "react";
import { StyleSheet, Text, View, YellowBox } from "react-native";
import { User } from "../../Models/User";
import * as firebase from "firebase";
import LoggedIn from "../LoggedIn/LoggedIn";
import Login from "../Login/Login";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import NetworkManager from "../../Network/NetworkManager";
import * as Permissions from "expo-permissions";
import PushNotificationPermissionRequest from "../PushNotificationPermissionRequest/PushNotificationPermissionRequest";
import * as Analytics from "expo-firebase-analytics";

interface IRootProps {
  navigation: StackNavigationProp<ParamListBase>;
}

interface IRootState {
  currentFirebaseUser?: firebase.User;
  currentFirebaseUserLoaded: boolean;
  user: User | undefined;
  userHasEnabledPushNotifications: boolean;
  pushNotificationsChecked: boolean;
  alreadyAskedUserForPushNotificationAndRefused: boolean;
}

export default class Root extends React.Component<IRootProps, IRootState> {
  constructor(props) {
    super(props);
    this.state = {
      currentFirebaseUser: null,
      currentFirebaseUserLoaded: false,
      user: undefined,
      userHasEnabledPushNotifications: false,
      pushNotificationsChecked: false,
      alreadyAskedUserForPushNotificationAndRefused: false
    };
  }

  unsubscribe = () => {};
  componentDidMount = async () => {
    this.checkForPushNotifications(false);
    this.unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async firebaseUser => {
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

  focusListener = () => {};

  checkForPushNotifications = async (alreadyAskedUser: boolean) => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== "granted") {
      this.setState({
        pushNotificationsChecked: true,
        userHasEnabledPushNotifications: false,
        alreadyAskedUserForPushNotificationAndRefused: alreadyAskedUser
      });
    } else {
      this.setState({
        pushNotificationsChecked: true,
        userHasEnabledPushNotifications: true,
        alreadyAskedUserForPushNotificationAndRefused: alreadyAskedUser
      });
    }
  };

  signedIn = async (userUuid: string) => {
    Analytics.logEvent("login_success", {});
    const updatedUser = await NetworkManager.getUserByUuid(userUuid);
    this.setState({ user: updatedUser });
  };

  signOut = async () => {
    await firebase.auth().signOut();
    this.setState({
      currentFirebaseUserLoaded: false,
      currentFirebaseUser: null
    });
  };

  didAcceptPushNotificationPermission = (token: string) => {
    this.checkForPushNotifications(true);
    const user = this.state.user;
    user.pushNotificationToken = token;
    NetworkManager.updateUser(user);
  };

  render() {
    const firebaseUser = this.state.currentFirebaseUser;
    const currentFirebaseUserLoaded = this.state.currentFirebaseUserLoaded;
    const user = this.state.user;
    return (
      <View style={styles.container}>
        {!currentFirebaseUserLoaded || !this.state.pushNotificationsChecked ? (
          <View />
        ) : // <Text>Loading...</Text>
        user && !this.state.userHasEnabledPushNotifications && !this.state.alreadyAskedUserForPushNotificationAndRefused ? (
          <PushNotificationPermissionRequest
            didAcceptPushNotificationPermission={
              this.didAcceptPushNotificationPermission
            }
            navigation={this.props.navigation}
          />
        ) : user ? (
          <LoggedIn
            user={user}
            signOut={this.signOut}
            navigation={this.props.navigation}
          />
        ) : (
          <Login signedIn={this.signedIn} navigation={this.props.navigation} />
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
