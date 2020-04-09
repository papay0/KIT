import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import moment from "moment-timezone";

import { User } from "../../Models/User";
import { Profile } from "../../Models/Profile";
import { ProfileColor } from "../../Models/ProfileColor";

interface IProfileColorPickerListItemProps {
  color: ProfileColor;
  isSelected: boolean;
  onPress: () => void;
}

interface IProfileColorPiclerListItemState {}

export default class ProfileColorPickerListItem extends React.Component<
  IProfileColorPickerListItemProps,
  IProfileColorPiclerListItemState
> {
  constructor(props: IProfileColorPickerListItemProps) {
    super(props);
    this.state = {};
  }

  onPress = async () => {
    this.props.onPress();
  };

  render() {
    const color = this.props.color;
    return (
      <TouchableOpacity key={color} style={{}} onPress={this.onPress}>
        <View style={{ ...styles.colorComponent, backgroundColor: color }} />
        {this.props.isSelected && (
          <View
            style={{
              position: "absolute",
              top: 22,
              left: 24
            }}
          >
            <Image
              source={require("../../../assets/check-white.png")}
              style={styles.checkStyle}
            />
          </View>
        )}
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
    height: 50,
    width: 50,
    borderRadius: 16,
    margin: 10
  },
  containerColorInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    margin: 20
  },
  checkStyle: {
    height: 25,
    width: 25,
  }
});
