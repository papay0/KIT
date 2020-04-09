import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface IPillButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  disabled: boolean;
}
interface IPillButtonState {}

export default class PillButton extends React.Component<
  IPillButtonProps,
  IPillButtonState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const additionalButtonstyle = this.props.selected
      ? styles.selectedButtonStyle
      : styles.unselectedButtonStyle;
    const additionalTextStyle = this.props.selected
      ? styles.selectedTextStyle
      : styles.unselectedTextStyle;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.onPress()}
          disabled={this.props.disabled}
          style={{ ...styles.buttonStyle, ...additionalButtonstyle }}
        >
          <Text style={{...styles.textStyle, ...additionalTextStyle}}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  buttonStyle: {
    borderRadius: 16,
    height: 60,
    justifyContent: "center",
    margin: 10
  },
  selectedButtonStyle: { backgroundColor: "#5458FF" },
  unselectedButtonStyle: { backgroundColor: "white" },
  textStyle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20
  },
  selectedTextStyle: {color: "white"},
  unselectedTextStyle: {
    color: "#5458FF"
  },
  header: {
    fontSize: 25
  }
});
