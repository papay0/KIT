import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface IPillButtonProps {
  title: string;
  onPress: () => void;
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
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.onPress()}
          style={{
            backgroundColor: "#007AFF",
            borderRadius: 24,
            height: 30,
            justifyContent: "center",
            margin: 10
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    // justifyContent: 'space-between',
  },
  header: {
    fontSize: 25
  }
});
