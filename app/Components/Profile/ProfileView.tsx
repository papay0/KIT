import React from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import Friends from "../Friends/Friends";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import MyProfile from "./MyProfile";

type ProfileNavigatorParams = {
  [Routes.PROFILE]: {
    user: User;
  };
};

interface IProfileProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<ProfileNavigatorParams, Routes.PROFILE>;
}

export default class ProfileView extends React.Component<IProfileProps> {
  constructor(props) {
    super(props);
  }

  signOut = async () => {
    this.props.navigation.navigate(Routes.ROOT, {});
    await firebase.auth().signOut();
  };

  render() {
    const user = this.props.route.params.user;
    console.log("user = " + user);
    console.log("user = " + user.profile.color);
    return (
      <SafeAreaView style={styles.container}>
        <MyProfile user={user}/>
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
