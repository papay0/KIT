import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import "firebase/firestore";

import { User } from "../../Models/User";

interface IHomeProps {
  user: User;
}

interface IHomeState {}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props) {
    super(props);
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
