import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import ProfileColorManager, { ProfileColor } from "../../Models/ProfileColor";

interface IProfileColorPickerProps {
}

interface IProfileColorPickerState {
  profileColors: ProfileColor[];
}

export default class ProfileColorPicker extends React.Component<
  IProfileColorPickerProps,
  IProfileColorPickerState
> {
  constructor(props) {
    super(props);
    const profileColors = ProfileColorManager.getAllColors();
    this.state = { profileColors: profileColors };
  }

  render() {
    return (
      <View>
        <Text>Profile Color Picker</Text>
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
  }
});
