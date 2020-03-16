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
import FloatingButton from "../FloatingButton/FloatingButton";
import RequestsKit from "../KIT/RequestsKit";

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

  routeToSendKIT = () => {
    this.props.navigation.navigate(Routes.SEND_KIT, { user: this.props.user });
  };

  render() {
    const user = this.props.user;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentView}>
          <RequestsKit user={user} />
        </View>
        <FloatingButton
          title="Send a Coucou"
          onPress={this.routeToSendKIT}
          isHidden={false}
        />
      </SafeAreaView>
    );
  }
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
