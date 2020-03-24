import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export enum ButtonStyle {
  PRIMARY,
  SECONDARY
}

interface IButtonProps {
  onPress: () => void;
  title: string;
  isHidden: boolean;
  trailingIcon: string;
  // buttonStyle: ButtonStyle;
}

interface IButtonState {}

export default class Button extends React.Component<
  IButtonProps,
  IButtonState
> {
  render() {
    return (
      <View style={styles.container}>
        {this.props.isHidden ? (
          <View />
        ) : (
          <TouchableOpacity
            onPress={() => this.props.onPress()}
            style={styles.styleTouchableOpacity}
          >
            <View style={styles.titleView}>
              <Text style={styles.titleText}>{this.props.title}</Text>
            </View>
            <View style={styles.styleTrailingIcon}>
              <Text style={{ fontSize: 30 }}>{this.props.trailingIcon}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: 60,
    margin: 10
  },
  styleTouchableOpacity: {
    backgroundColor: "#5468FF",
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row"
  },
  titleView: {
    justifyContent: "center",
    flex: 1
  },
  titleText: {
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  styleTrailingIcon: {
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 12,
    position: "absolute",
    right: 0,
    alignContent: "center"
  }
});
