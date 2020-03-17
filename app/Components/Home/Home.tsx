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
import * as firebase from "firebase";
import "firebase/firestore";
import { ParamListBase } from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import Routes from "../Routes/Routes";
import FloatingButton from "../FloatingButton/FloatingButton";
import RequestsKit from "../KIT/RequestsKit";
import { UserProfile } from "../../Models/UserProfile";
import Collections from "../Collections/Collections";
import { Profile } from "../../Models/Profile";
import NetworkManager from "../../Network/NetworkManager";
import KitsSent from "../KIT/KitsSent";

interface IHomeProps {
  userProfile: UserProfile;
  navigation: StackNavigationProp<ParamListBase>;
}

interface IHomeState {
  profile: Profile;
  friendUserProfiles: UserProfile[];
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.userProfile.profile,
      friendUserProfiles: []
    };
  }

  unsubscribeProfile = () => {};
  unsubscribeFriends = () => {};
  componentDidMount() {
    const db = firebase.firestore();
    this.unsubscribeProfile = db
      .collection(Collections.PROFILES)
      .doc(this.props.userProfile.user.userUuid)
      .onSnapshot(async document => {
        if (document.exists) {
          const data = document.data();
          const profile = new Profile(data.userUuid, data.color);
          this.setState({ profile });
        }
      });
    this.setHeaderOptions();
    this.getFriends(this.props.userProfile.user.userUuid);
  }

  getFriends = async (userUuid: string) => {
    const db = firebase.firestore();
    this.unsubscribeFriends = db
      .collection(Collections.FRIENDS)
      .doc(userUuid)
      .onSnapshot(async document => {
        const friendUserProfiles = Array<UserProfile>();
        if (document.exists) {
          const data = document.data();
          for (const userUuid of data.friendsUuid) {
            const friend = await NetworkManager.getUserByUuid(userUuid);
            const profile = await NetworkManager.getProfileByUuid(userUuid);
            const userProfile = new UserProfile(friend, profile);
            friendUserProfiles.push(userProfile);
          }
        }
        this.setState({ friendUserProfiles });
      });
  };

  setHeaderOptions = () => {
    this.props.navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const userProfile = new UserProfile(
              this.props.userProfile.user,
              this.state.profile
            );
            this.props.navigation.navigate(Routes.PROFILE, {
              userProfile: userProfile,
              friendUserProfiles: this.state.friendUserProfiles
            });
          }}
          style={{
            backgroundColor: "transparent",
            paddingRight: 15
          }}
        >
          <ProfileImage />
        </TouchableOpacity>
      )
    });
  };

  componentWillUnmount() {
    this.unsubscribeProfile();
    this.unsubscribeFriends();
  }

  routeToSendKIT = () => {
    this.props.navigation.navigate(Routes.SEND_KIT, {
      user: this.props.userProfile.user,
      friendUserProfiles: this.state.friendUserProfiles
    });
  };

  render() {
    const user = this.props.userProfile.user;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentView}>
          <RequestsKit user={user} />
          <KitsSent user={user} />
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
