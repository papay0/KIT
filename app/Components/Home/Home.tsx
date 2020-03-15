import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity
} from "react-native";
import "firebase/firestore";
import { ParamListBase } from "@react-navigation/native";

import { User } from "../../Models/User";
import { StackNavigationProp } from "@react-navigation/stack";
import Routes from "../Routes/Routes";

interface IHomeProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
}

interface IHomeState {}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(Routes.PROFILE, {user: this.props.user})}
          style={{
            backgroundColor: "transparent",
            paddingRight: 15
          }}
        >
          <ProfileImage />
        </TouchableOpacity>
      )
    });
  }

  render() {
    const user = this.props.user;
    return (
      <View>
        <Text style={styles.header}>Welcome: {user.firstname}</Text>
        <Image style={styles.image} source={{ uri: user.photoUrl }} />
      </View>
    );
  }
}

function ProfileImage() {
  return (
    <Image
      style={{ width: 25, height: 25 }}
      source={require("../../../assets/profilePicture.png")}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});
