import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  YellowBox
} from "react-native";

YellowBox.ignoreWarnings([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead."
]);
console.ignoredYellowBox = [
  "VirtualizedLists should never be nested"
];

import Friends from "../Friends/Friends";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import Routes from "../Routes/Routes";
import MyProfile from "./MyProfile";
import { UserProfile } from "../../Models/UserProfile";
import Collections from "../Collections/Collections";
import { Profile } from "../../Models/Profile";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";

type ProfileNavigatorParams = {
  [Routes.PROFILE]: {
    userProfile: UserProfile;
    friendUserProfiles: UserProfile[];
  };
};

interface IProfileProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<ProfileNavigatorParams, Routes.PROFILE>;
}

interface IProfileState {
  profile: Profile;
}

export default class ProfileView extends React.Component<
  IProfileProps,
  IProfileState
> {
  constructor(props: IProfileProps) {
    super(props);
    this.state = { profile: props.route.params.userProfile.profile };
    YellowBox.ignoreWarnings([
      "VirtualizedLists should never be nested" // TODO: Remove when fixed
    ]);
    console.disableYellowBox = true;
    console.ignoredYellowBox = [
      "VirtualizedLists should never be nested"
    ];
  }

  unsubscribe = () => {};
  componentDidMount = async () => {
    const userUuid = this.props.route.params.userProfile.user.userUuid;
    const db = firebase.firestore();
    this.unsubscribe = db
      .collection(Collections.PROFILES)
      .doc(userUuid)
      .onSnapshot(async document => {
        if (document.exists) {
          const data = document.data();
          const profile = FirebaseModelUtils.getProfileFromFirebaseUser(data);
          this.setState({ profile });
        }
      });
    this.setHeaderOptions();
  };

  setHeaderOptions = () => {
    this.props.navigation.setOptions({
      headerStyle: { shadowColor: "transparent" },
      headerShown: true,
      headerTitle: null,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            this.signOut();
          }}
          style={{
            backgroundColor: "transparent",
            paddingRight: 15
          }}
        >
          <Text style={styles.logOutHeader}>Log Out</Text>
        </TouchableOpacity>
      )
    });
  };

  setHeaderSty = () => {
    this.props.navigation.setOptions({
      headerStyle: { shadowColor: "transparent" }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  signOut = async () => {
    this.props.navigation.navigate(Routes.ROOT, {});
    await firebase.auth().signOut();
  };

  render() {
    const userProfile = this.props.route.params.userProfile;
    const user = userProfile.user;
    const profile = this.state.profile;
    const friendUserProfiles = this.props.route.params.friendUserProfiles;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <MyProfile
            user={user}
            profile={profile}
            navigation={this.props.navigation}
          />
          <Friends
            user={user}
            navigation={this.props.navigation}
            friendUserProfiles={friendUserProfiles}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  logOutHeader: {
    fontSize: 17,
    fontWeight: "600",
    color: "#5468FF"
  }
});
