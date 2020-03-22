import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface IFloatingButtonProps {
  onPress: () => void;
  title: string;
  isHidden: boolean;
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
              backgroundColor: "#007AFF",
              borderRadius: 24,
              height: 40,
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                paddingLeft: 20,
                paddingRight: 20
              }}
            >
              {this.props.title}
            </Text>
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
    alignItems: "center",
    margin: 10
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
