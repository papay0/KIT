import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  Platform,
  Linking
} from "react-native";
import Button, { ButtonStyle } from "../Button/Button";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import * as IntentLauncher from "expo-intent-launcher";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, useFocusEffect } from "@react-navigation/native";

interface IPushNotificationPermissionRequestProps {
  didAcceptPushNotificationPermission: (token: string) => void;
  navigation: StackNavigationProp<ParamListBase>;
}

interface IPushNotificationPermissionRequestState {
  pushNotificationsChecked: boolean;
  userAlreadySaidNo: boolean;
  showReloadButton: boolean;
}

export default class PushNotificationPermissionRequest extends React.Component<
  IPushNotificationPermissionRequestProps,
  IPushNotificationPermissionRequestState
> {
  constructor(props: IPushNotificationPermissionRequestProps) {
    super(props);
    this.state = {
      pushNotificationsChecked: false,
      userAlreadySaidNo: false,
      showReloadButton: false
    };
  }

  unsubscribe = () => {};
  componentDidMount = async () => {
    this.setBaseHeaderOptions();
    this.checkForPushNotifications();
  };
  componentWillUnmount() {
    this.unsubscribe();
  }

  setBaseHeaderOptions = () => {
    this.props.navigation.setOptions({
      headerShown: false,
      headerTitle: null
    });
  };

  checkForPushNotifications = async () => {
    const { status, canAskAgain } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    if (status === "granted") {
      this.onPressAllowButton();
    } else {
      this.setState({
        pushNotificationsChecked: true,
        userAlreadySaidNo: !canAskAgain
      });
    }
  };

  onPressAllowButton = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status === "granted") {
      try {
        const token =
        status === "granted" ? await Notifications.getExpoPushTokenAsync() : "";
      this.props.didAcceptPushNotificationPermission(token);
      } catch (e) {
        console.error("error onPressAllowButton = " + e);
      }
    } else {
      this.setState({ userAlreadySaidNo: true });
    }
  };

  onPressOpenSettings = async () => {
    if (Platform.OS === "ios") {
      Linking.openURL(`app-settings:`);
    } else {
      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_APP_NOTIFICATION_SETTINGS,
        {}
      );
    }
    this.setState({ showReloadButton: true });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {!this.state.pushNotificationsChecked ? (
          <View>{/* <Text>Loading view...</Text> */}</View>
        ) : this.state.userAlreadySaidNo ? (
          <View style={{ flex: 1, margin: 5 }}>
            <View style={styles.emptyRequestStyleContainer}>
              <Image
                source={require("../../../assets/illustration-permissions-push-notification.png")}
                style={styles.emptyRequestStyle}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleText}>Turn on your notifications</Text>
              <Text style={styles.subtitleText}>
                Coucou will not work if you don’t allow notifications. Please
                open your settings to allow notifications, so you know when your
                friends are available to talk.
              </Text>
            </View>
            {this.state.showReloadButton ? (
              <Button
                title="RELOAD"
                onPress={this.checkForPushNotifications}
                isHidden={false}
                trailingIcon={require("../../../assets/arrow-right-blue.png")}
                buttonStyle={ButtonStyle.PRIMARY}
              />
            ) : (
              <View>
                <Button
                  title="OPEN SETTINGS"
                  onPress={this.onPressOpenSettings}
                  isHidden={false}
                  trailingIcon={require("../../../assets/arrow-right-blue.png")}
                  buttonStyle={ButtonStyle.PRIMARY}
                />
                <Button
                  title="SKIP"
                  onPress={() => {
                    this.props.didAcceptPushNotificationPermission("");
                  }}
                  isHidden={false}
                  trailingIcon={require("../../../assets/arrow-right-blue.png")}
                  buttonStyle={ButtonStyle.SECONDARY}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={{ flex: 1, margin: 5 }}>
            <View style={styles.emptyRequestStyleContainer}>
              <Image
                source={require("../../../assets/illustration-permissions-push-notification.png")}
                style={styles.emptyRequestStyle}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleText}>
                Allow your friends to reach you
              </Text>
              <Text style={styles.subtitleText}>
                We will need you to allow notifications so you know when your
                friends want to talk.
              </Text>
            </View>
            <Button
              title="ALLOW"
              onPress={this.onPressAllowButton}
              isHidden={false}
              trailingIcon={require("../../../assets/arrow-right-blue.png")}
              buttonStyle={ButtonStyle.PRIMARY}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyRequestStyleContainer: {
    paddingTop: 100,
    paddingBottom: 70,
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto"
  },
  emptyRequestStyle: {
    width: 240,
    height: 264
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center"
  },
  subtitleText: {
    fontSize: 17,
    color: "#8E8E93",
    textAlign: "center"
  }
});
