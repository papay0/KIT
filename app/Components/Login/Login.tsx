import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import * as firebase from "firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import * as Google from "expo-google-app-auth";
import * as AppleAuthentication from "expo-apple-authentication";
import ApiKeys from "../../Constants/ApiKeys";
import * as Localization from "expo-localization";
import { User } from "../../Models/User";
import NetworkManager from "../../Network/NetworkManager";
import { isAvailableSignInWithApple, signInApple } from "./AppleLogin";
import * as Crypto from "expo-crypto";
import { ILoginMetadata } from "./LoginMetadata";
import { getDateNow } from "../Utils/Utils";
import { Profile } from "../../Models/Profile";
import { ProfileColor } from "../../Models/ProfileColor";
import Button from "../Button/Button";

interface ILoginProps {
  signedIn: (userUuid: string) => Promise<void>;
  navigation: StackNavigationProp<ParamListBase>;
}

interface ILoginState {
  signInWithAppleAvailable: boolean;
}

interface IConfigGoogleAuth {
  androidClientId: string;
  iosClientId: string;
  scopes: string[];
}

export default class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props) {
    super(props);
    this.state = { signInWithAppleAvailable: false };
  }

  componentDidMount = async () => {
    this.props.navigation.setOptions({ headerShown: false });
    this.setState({
      signInWithAppleAvailable: await isAvailableSignInWithApple()
    });
  };

  getConfig(): IConfigGoogleAuth {
    return {
      androidClientId: ApiKeys.GoogleAuthConfig.androidClientId,
      iosClientId: ApiKeys.GoogleAuthConfig.iosClientId,
      scopes: ["profile", "email"]
    };
  }

  onPressGoogleLogin = async () => {
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
        const userUuid = firebase.auth().currentUser.uid;
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        const token =
          status === "granted"
            ? await Notifications.getExpoPushTokenAsync()
            : "";
        const user = new User(
          result.user.name,
          userUuid,
          result.user.givenName,
          result.user.familyName,
          result.user.email,
          token,
          "",
          getDateNow(),
          Localization.locale
        );
        let currentUser = await NetworkManager.getUserByUuid(user.userUuid);
        if (currentUser) {
          // update
          currentUser.locale = Localization.locale;
          await NetworkManager.updateUser(currentUser);
        } else {
          // create
          await NetworkManager.createUser(user);
          currentUser = user;
        }
        const existingProfile = await NetworkManager.getProfileByUuid(
          user.userUuid
        );
        if (existingProfile) {
          // update
          existingProfile.timezone = Localization.timezone;
          await NetworkManager.updateProfile(existingProfile);
        } else {
          // create
          const profile = new Profile(
            user.userUuid,
            result.user.photoUrl,
            Localization.timezone,
            ProfileColor.NONE,
            getDateNow(),
            getDateNow()
          );
          await NetworkManager.createProfile(profile);
        }
        this.props.signedIn(userUuid);
      } else {
        console.error("cancelled");
      }
    } catch (e) {
      console.error("error", e);
    }
  };

  getRandomID = () => {
    const db = firebase.firestore();
    return db.collection("randomId").doc().id;
  };

  loginWithApple = async () => {
    const csrf = Math.random()
      .toString(36)
      .substring(2, 15);
    const nonce = Math.random()
      .toString(36)
      .substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ],
      state: csrf,
      nonce: hashedNonce
    });
    const { identityToken, email, fullName } = appleCredential;
    if (identityToken) {
      const provider = new firebase.auth.OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce
      });
      await firebase.auth().signInWithCredential(credential);
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      const token =
        status === "granted" ? await Notifications.getExpoPushTokenAsync() : "";
      const userUuid = firebase.auth().currentUser.uid;
      const user = new User(
        fullName.givenName + " " + fullName.familyName,
        userUuid,
        fullName.givenName,
        fullName.familyName,
        email,
        token,
        "",
        getDateNow(),
        Localization.locale
      );
      let currentUser = await NetworkManager.getUserByUuid(user.userUuid);
      if (currentUser) {
        // update
        currentUser.locale = Localization.locale;
        await NetworkManager.updateUser(currentUser);
      } else {
        // create
        await NetworkManager.createUser(user);
        currentUser = user;
      }
      const existingProfile = await NetworkManager.getProfileByUuid(
        user.userUuid
      );
      if (existingProfile !== undefined) {
        // update
        existingProfile.timezone = Localization.timezone;
        await NetworkManager.updateProfile(existingProfile);
      } else {
        // create
        const profile = new Profile(
          user.userUuid,
          "https://www.zooniverse.org/assets/simple-avatar.png",
          Localization.timezone,
          ProfileColor.NONE,
          getDateNow(),
          getDateNow()
        );
        await NetworkManager.createProfile(profile);
      }
      this.props.signedIn(userUuid);
    }
  };

  render() {
    const signInWithAppleAvailable = this.state.signInWithAppleAvailable;
    return (
      <View style={styles.container}>
        <Button
          title="Sign in with Google"
          onPress={this.onPressGoogleLogin}
          isHidden={false}
          trailingIcon=""
        />
        {signInWithAppleAvailable && (
          <Button
            title="Sign in with Apple"
            onPress={this.loginWithApple}
            isHidden={false}
            trailingIcon=""
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center"
  }
});
