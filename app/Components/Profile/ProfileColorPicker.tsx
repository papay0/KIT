import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  FlatList,
  ScrollView,
  TouchableOpacity
} from "react-native";
import ProfileColorManager, { ProfileColor } from "../../Models/ProfileColor";
import ProfileColorPickerListItem from "./ProfileColorPickerListItem";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import Routes from "../Routes/Routes";
import NetworkManager from "../../Network/NetworkManager";
import { Profile } from "../../Models/Profile";

interface IProfileColorPickerProps {
  profile: Profile;
}

interface IProfileColorPickerState {
  profileColors: ProfileColor[];
  currentColor: ProfileColor;
}

export default class ProfileColorPicker extends React.Component<
  IProfileColorPickerProps,
  IProfileColorPickerState
> {
  constructor(props: IProfileColorPickerProps) {
    super(props);
    const profileColors = ProfileColorManager.getAllColors();
    this.state = {
      profileColors: profileColors,
      currentColor: props.profile.color
    };
  }

  onPress = async (color: ProfileColor) => {
    this.setState({ currentColor: color });
    const newProfile = this.props.profile;
    newProfile.color = color;
    await NetworkManager.updateProfile(newProfile);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {this.state.profileColors.map(color => {
            return (
              <ProfileColorPickerListItem
                onPress={() => {
                  this.onPress(color);
                }}
                color={color}
                isSelected={this.state.currentColor === color}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  colorComponent: {
    height: 70,
    width: 70,
    borderRadius: 16,
    margin: 10
  }
});
