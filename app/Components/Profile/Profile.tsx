import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Friends from "../Friends/Friends";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";

type ProfileNavigatorParams = {
  [Routes.PROFILE]: {
    user: User
  }
}

interface IProfileProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<ProfileNavigatorParams, Routes.PROFILE>;
}

export default class Profile extends React.Component<IProfileProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Profile of {this.props.route.params.user.firstname}!</Text>
        <Friends user={this.props.route.params.user} navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
