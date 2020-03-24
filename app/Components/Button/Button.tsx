import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface IButtonProps {
  onPress: () => void;
  title: string;
  isHidden: boolean;
  trailingIcon: string;
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
              style={{
                backgroundColor: "#5468FF",
                borderRadius: 16,
                flex: 1,
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  flex: 1
                }}
              >
                <Text style={styles.title}>{this.props.title}</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  margin: 12,
                  position: "absolute",
                  right: 0,
                  alignContent: "center",
                }}
              >
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
  contentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});
