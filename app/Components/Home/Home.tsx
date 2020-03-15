import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import "firebase/firestore";
import { ParamListBase } from "@react-navigation/native";

import { User } from "../../Models/User";
import { StackNavigationProp } from "@react-navigation/stack";
import Routes from "../Routes/Routes";

interface IHomeProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
}

interface IHomeState {}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(Routes.PROFILE, {
              user: this.props.user
            })
          }
          style={{
            backgroundColor: "transparent",
            paddingRight: 15
          }}
        >
          <ProfileImage />
        </TouchableOpacity>
      )
    });
  }

  render() {
    const user = this.props.user;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentView}>
          <Image style={styles.image} source={{ uri: user.photoUrl }} />
        </View>
        <FloatingButton />
      </SafeAreaView>
    );
  }
}

function FloatingButton(): JSX.Element {
  return (
    <View style={styles.floatingButton}>
      <TouchableOpacity
        onPress={() => {}
          // this.props.navigation.navigate("KitStarter", { name: "Arthur" })
        }
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
          Send a Coucou
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileImage(): JSX.Element {
  return (
    <Image
      style={{ width: 25, height: 25 }}
      source={require("../../../assets/profilePicture.png")}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentView: {
    flex: 1
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
