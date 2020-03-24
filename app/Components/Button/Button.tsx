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
  buttonStyle: ButtonStyle;
}

interface IButtonState {}

export default class Button extends React.Component<
  IButtonProps,
  IButtonState
> {

  getStyleButton = () => {
    const additionalStyle = this.props.buttonStyle == ButtonStyle.PRIMARY ? styles.primaryStyleTouchableOpacity : styles.secondaryStyleTouchableOpacity;
    return {...styles.baseStyleTouchableOpacity, ...additionalStyle};
  }

  getStyleTitleText = () => {
    const additionalStyle = this.props.buttonStyle == ButtonStyle.PRIMARY ? styles.primaryStyleTitleText : styles.secondarStyleTitleText;
    return {...styles.baseStyleTitleText, ...additionalStyle};
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.isHidden ? (
          <View />
        ) : (
          <TouchableOpacity
            onPress={() => this.props.onPress()}
            style={this.getStyleButton()}
          >
            <View style={styles.baseStyleTitleView}>
              <Text style={this.getStyleTitleText()}>{this.props.title}</Text>
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
  primaryStyleTouchableOpacity: {
    backgroundColor: "#5468FF"
  },
  secondaryStyleTouchableOpacity: {
    backgroundColor: "white",
    borderColor: "#5468FF",
    borderWidth: 2
  },
  baseStyleTouchableOpacity: {
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row"
  },
  baseStyleTitleView: {
    justifyContent: "center",
    flex: 1
  },
  primaryStyleTitleText: {
    color: "white",
  },
  secondarStyleTitleText: {
    color: "#5468FF",
  },
  baseStyleTitleText: {
    fontWeight: "600",
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
