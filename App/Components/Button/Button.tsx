import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

export enum ButtonStyle {
  PRIMARY,
  SECONDARY
}

interface IButtonProps {
  onPress: () => void;
  title: string;
  isHidden: boolean;
  trailingIcon?: any;
  leadingIcon?: any;
  buttonStyle: ButtonStyle;
}

interface IButtonState {}

export default class Button extends React.Component<
  IButtonProps,
  IButtonState
> {
  getStyleButton = () => {
    const additionalStyle =
      this.props.buttonStyle == ButtonStyle.PRIMARY
        ? styles.primaryStyleTouchableOpacity
        : styles.secondaryStyleTouchableOpacity;
    return { ...styles.baseStyleTouchableOpacity, ...additionalStyle };
  };

  getStyleTitleText = () => {
    const additionalStyle =
      this.props.buttonStyle == ButtonStyle.PRIMARY
        ? styles.primaryStyleTitleText
        : styles.secondarStyleTitleText;
    return { ...styles.baseStyleTitleText, ...additionalStyle };
  };

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
            <View style={styles.styleLeadingIconContainer}>
              <Image
                source={this.props.leadingIcon}
                style={styles.styleLeadingIcon}
              />
            </View>
            <View style={styles.baseStyleTitleView}>
              <Text style={this.getStyleTitleText()}>{this.props.title}</Text>
            </View>
            <View style={styles.styleTrailingIconContainer}>
              <Image
                source={this.props.trailingIcon}
                style={styles.styleTrailingIcon}
              />
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
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5
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
    color: "white"
  },
  secondarStyleTitleText: {
    color: "#5468FF"
  },
  baseStyleTitleText: {
    fontWeight: "600",
    fontSize: 17,
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  styleLeadingIcon: {
    height: 24,
    width: 24
  },
  styleLeadingIconContainer: {
    justifyContent: "center",
    top: 0,
    bottom: 0,
    position: "absolute",
    left: 50
  },
  styleTrailingIcon: {
    height: 35,
    width: 35
  },
  styleTrailingIconContainer: {
    justifyContent: "center",
    top: 0,
    bottom: 0,
    position: "absolute",
    right: 15
  }
});
