import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";

interface ILoginProps {
  signIn: () => Promise<void>;
  navigation: StackNavigationProp<ParamListBase>;
}

export default class Login extends React.Component<ILoginProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setOptions({headerShown: false});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Sign In With Google</Text>
        <Button
          title="Sign in with Google"
          onPress={() => this.props.signIn()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 25
  }
});
