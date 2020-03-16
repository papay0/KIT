import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { User } from "../../Models/User";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import Routes from "../Routes/Routes";
import { Profile } from "../../Models/Profile";

interface IMyProfileProps {
  user: User;
  profile: Profile;
  navigation: StackNavigationProp<ParamListBase>;
}

export default class MyProfile extends React.Component<IMyProfileProps> {
  constructor(props) {
    super(props);
  }

  onPressPickProfileColor = () => {
    this.props.navigation.navigate(Routes.PROFILE_COLOR_PICKER, {
      profile: this.props.profile
    });
  };

  render() {
    const user = this.props.user;
    const profile = this.props.profile;
    return (
      <View style={{ ...styles.container, backgroundColor: profile.color }}>
        <View style={styles.containerProfilePicture}>
          <Image style={styles.image} source={{ uri: user.photoUrl }} />
        </View>
        <View style={styles.containerInfoProfile}>
          <Text style={styles.names}>{user.firstname}</Text>
          <Text style={styles.names}>{user.lastname}</Text>
          <Button
            title="Pick your profile color"
            onPress={this.onPressPickProfileColor}
          ></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 20,
    padding: 10,
    borderRadius: 10
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
    width: 100,
    height: 100,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});
