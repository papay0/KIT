import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface IFloatingButtonProps {
  onPress: () => void;
  title: string;
  isHidden: boolean;
  trailingIcon: string;
}

interface IFloatingButtonState {}

export default class FloatingButton extends React.Component<
  IFloatingButtonProps,
  IFloatingButtonState
> {
  render() {
    return (
      <View style={styles.floatingButton}>
        {this.props.isHidden ? (
          <View />
        ) : (
            <TouchableOpacity
              onPress={() => this.props.onPress()}
              style={{
                backgroundColor: "#5468FF",
                // backgroundColor: "yellow",
                borderRadius: 16,
                // height: 40,
                flex: 1,
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  // flexDirection: "row",
                  justifyContent: "center",
                  // backgroundColor: "green",
                  flex: 1
                }}
              >
                <Text style={styles.title}>{this.props.title}</Text>
              </View>
              <View
                style={{
                  // flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  // marginRight: 10,
                  margin: 12,
                  position: "absolute",
                  right: 0,
                  alignContent: "center",
                  // backgroundColor: "red"
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
    flex: 1
  },
  contentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  floatingButton: {
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
    height: 60,
    margin: 10
    // flexDirection: "row"
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
