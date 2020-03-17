import React from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import Friends from "../Friends/Friends";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import Routes from "../Routes/Routes";
import MyProfile from "./MyProfile";
import { UserProfile } from "../../Models/UserProfile";
import Collections from "../Collections/Collections";
import { Profile } from "../../Models/Profile";

type ProfileNavigatorParams = {
  [Routes.PROFILE]: {
    userProfile: UserProfile;
  };
};

interface IProfileProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<ProfileNavigatorParams, Routes.PROFILE>;
}

interface IProfileState {
  profile: Profile;
}

export default class ProfileView extends React.Component<
  IProfileProps,
  IProfileState
> {
  constructor(props: IProfileProps) {
    super(props);
    this.state = { profile: props.route.params.userProfile.profile };
  }

  unsubscribe = () => {};
  componentDidMount = async () => {
    const userUuid = this.props.route.params.userProfile.user.userUuid;
    const db = firebase.firestore();
    this.unsubscribe = db
      .collection(Collections.PROFILES)
      .doc(userUuid)
      .onSnapshot(async document => {
        if (document.exists) {
          const data = document.data();
          const profile = new Profile(data.userUuid, data.color);
          this.setState({ profile });
        }
      });
      this.setHeaderStyle();
  };

  setHeaderStyle = () => {
    this.props.navigation.setOptions({
      headerStyle: { shadowColor: "transparent" }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  signOut = async () => {
    this.props.navigation.navigate(Routes.ROOT, {});
    await firebase.auth().signOut();
  };

  render() {
    const userProfile = this.props.route.params.userProfile;
    const user = userProfile.user;
    const profile = this.state.profile;
    return (
      <SafeAreaView style={styles.container}>
        <MyProfile
          user={user}
          profile={profile}
          navigation={this.props.navigation}
        />
        <Friends user={user} navigation={this.props.navigation} />
        <Button title="Sign Out" onPress={() => this.signOut()} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
