import React from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import Friends from "../Friends/Friends";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";

type ProfileNavigatorParams = {
  [Routes.PROFILE]: {
    user: User;
  };
};

interface IProfileProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<ProfileNavigatorParams, Routes.PROFILE>;
}

export default class Profile extends React.Component<IProfileProps> {
  constructor(props) {
    super(props);
  }

  signOut = async () => {
    this.props.navigation.navigate(Routes.ROOT, {});
    await firebase.auth().signOut();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Friends
          user={this.props.route.params.user}
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
