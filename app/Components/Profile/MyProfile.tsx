import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { User } from "../../Models/User";

interface IMyProfileProps {
  user: User;
}

export default class MyProfile extends React.Component<IMyProfileProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const user = this.props.user;
    return (
      <View style={styles.container}>
        <View style={styles.containerProfilePicture}>
          <Image style={styles.image} source={{ uri: user.photoUrl }} />
        </View>
        <View style={styles.containerInfoProfile}>
            <Text style={styles.names}>{user.firstname}</Text>
            <Text style={styles.names}>{user.lastname}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 20
  },
  containerProfilePicture: {
    alignItems: "flex-start"
  },
  containerInfoProfile: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    margin: 10
  },
  names: {
    fontSize: 20
  },
  image: {
    marginTop: 15,
    width: 100,
    height: 100,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});
