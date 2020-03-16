import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity
} from "react-native";
import moment from "moment-timezone";

import { User } from "../../Models/User";
import { Profile } from "../../Models/Profile";
import { ProfileColor } from "../../Models/ProfileColor";

interface IProfileColorPickerListItemProps {
  color: ProfileColor;
  isSelected: boolean;
  onPress: () => void
}

interface IProfileColorPiclerListItemState {
}

export default class ProfileColorPickerListItem extends React.Component<
  IProfileColorPickerListItemProps,
  IProfileColorPiclerListItemState
> {
  constructor(props: IProfileColorPickerListItemProps) {
    super(props);
    this.state = {};
  }

  onPress = async () => {
      await this.props.onPress();
  };

  render() {
    const color = this.props.color;
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <View>
          <View style={{ ...styles.colorComponent, backgroundColor: color }} />
        </View>
        <View style={styles.containerColorInfo}>
          <Text>{this.props.isSelected ? "✅" : "☑️"}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 20
  },
  colorComponent: {
    flex: 1,
    height: 80,
    width: 80,
    margin: 20,
    borderRadius: 20,
    alignItems: "flex-start"
  },
  containerColorInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    margin: 20
  }
});
