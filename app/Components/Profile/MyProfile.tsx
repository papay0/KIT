import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from "react-native";
import { User } from "../../Models/User";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import Routes from "../Routes/Routes";
import { Profile } from "../../Models/Profile";
import ProfileColorPicker from "./ProfileColorPicker";

interface IMyProfileProps {
  user: User;
  profile: Profile;
  navigation: StackNavigationProp<ParamListBase>;
}

export default class MyProfile extends React.Component<IMyProfileProps> {
  constructor(props: IMyProfileProps) {
    super(props);
  }

  onPressPickProfileColor = () => {
    // Update photo
  };

  render() {
    const user = this.props.user;
    const profile = this.props.profile;
    return (
      <View style={{ ...styles.container }}>
        <ProfileColorPicker profile={profile} />
        <TouchableOpacity
          style={styles.containerProfilePicture}
          onPress={this.onPressPickProfileColor}
        >
          <Image
            style={{ ...styles.image, borderColor: profile.color }}
            source={{ uri: profile.photoUrl }}
          />
        </TouchableOpacity>
        <View style={styles.containerInfoProfile}>
          <Text style={styles.names}>{user.displayName}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10
  },
  containerProfilePicture: {
    alignItems: "center"
  },
  containerInfoProfile: {
    justifyContent: "center",
    alignItems: "center",
    margin: 22
  },
  names: {
    fontSize: 20,
    fontWeight: "bold"
  },
  image: {
    width: 130,
    height: 130,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 4,
    borderRadius: 150
  }
});
