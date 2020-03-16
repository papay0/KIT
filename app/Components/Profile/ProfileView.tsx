import React from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import Friends from "../Friends/Friends";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import Routes from "../Routes/Routes";
import MyProfile from "./MyProfile";
import { UserProfile } from "../../Models/UserProfile";

type ProfileNavigatorParams = {
  [Routes.PROFILE]: {
    userProfile: UserProfile;
  };
};

interface IProfileProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<ProfileNavigatorParams, Routes.PROFILE>;
}

export default class ProfileView extends React.Component<IProfileProps> {
  constructor(props: IProfileProps) {
    super(props);
  }

  signOut = async () => {
    this.props.navigation.navigate(Routes.ROOT, {});
    await firebase.auth().signOut();
  };

  render() {
    const userProfile = this.props.route.params.userProfile;
    const user = userProfile.user;
    const profile = userProfile.profile;
    return (
      <SafeAreaView style={styles.container}>
        <MyProfile user={user} profile={profile} navigation={this.props.navigation}/>
        <Friends
          user={user}
          navigation={this.props.navigation}
        />
        <Button title="Sign Out" onPress={() => this.signOut()} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
