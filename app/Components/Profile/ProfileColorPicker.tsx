import React from "react";
import { StyleSheet, Text, View, Image, Button, FlatList } from "react-native";
import ProfileColorManager, { ProfileColor } from "../../Models/ProfileColor";
import ProfileColorPickerListItem from "./ProfileColorPickerListItem";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import Routes from "../Routes/Routes";
import NetworkManager from "../../Network/NetworkManager";
import { Profile } from "../../Models/Profile";

interface IProfileColorPickerProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<PROFILECOLORPICKERNavigatorParams, Routes.PROFILE_COLOR_PICKER>;
}

type PROFILECOLORPICKERNavigatorParams = {
  [Routes.PROFILE_COLOR_PICKER]: {
    profile: Profile;
  };
};

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
    this.state = { profileColors: profileColors, currentColor: props.route.params.profile.color };
  }

  onPress = async (color: ProfileColor) => {
    this.setState({currentColor: color});
    const newProfile = new Profile(this.props.route.params.profile.userUuid, color);
    await NetworkManager.updateProfile(newProfile);
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.profileColors}
          renderItem={({ item }) => (
            <View>
              <ProfileColorPickerListItem
                color={item}
                isSelected={this.state.currentColor === item}
                onPress={() => {
                  this.onPress(item);
                }}
              />
            </View>
          )}
          keyExtractor={item => item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  colorComponent: {
    height: 50,
    width: 50
  }
});
