import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

interface ILoginProps {
    signIn: () => Promise<void>;
}

export default class Login extends React.Component<ILoginProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Sign In With Google</Text>
        <Button title="Sign in with Google" onPress={() => this.props.signIn()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 25
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
