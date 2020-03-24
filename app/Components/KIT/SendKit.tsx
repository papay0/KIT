import React from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import Collections from "../Collections/Collections";
import SelectFriendsListItem from "../Friends/SelectFriendsListItem";
import Button, { ButtonStyle } from "../Button/Button";
import TimeKit from "./TimeKit";
import IRequestKit from "../../Models/RequestKit";
import { UserProfile } from "../../Models/UserProfile";
import NetworkManager from "../../Network/NetworkManager";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import UserListItem from "../PlatformUI/UserListItem";
import { Profile } from "../../Models/Profile";
import moment from "moment-timezone";
import { addOpcacityToRGB, getLocalTime } from "../Utils/Utils";

interface ISendKitProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<SENDKITNavigatorParams, Routes.SEND_KIT>;
}

type SENDKITNavigatorParams = {
  [Routes.SEND_KIT]: {
    user: User;
    friendUserProfiles: UserProfile[];
  };
};

interface ISendKitState {
  selectedFriendUserProfiles: UserProfile[];
  time: number | undefined;
  requestsFromMe: IRequestKit[];
}

export default class SendKit extends React.Component<
  ISendKitProps,
  ISendKitState
> {
  constructor(props) {
    super(props);
    this.state = {
      selectedFriendUserProfiles: [],
      time: undefined,
      requestsFromMe: []
    };
  }

  componentDidMount = async () => {
    await this.getRequestsFromMe();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  getRequestsFromMe = async () => {
    const db = firebase.firestore();
    const user = this.props.route.params.user;
    const documents = await db
      .collection(Collections.REQUESTS)
      .where("senderUuid", "==", user.userUuid)
      .get();
    const requestsFromMe = Array<IRequestKit>();
    for (const doc of documents.docs) {
      const data = doc.data();
      const request = FirebaseModelUtils.getRequestFromFirebaseRequest(data);
      requestsFromMe.push(request);
    }
    this.setState({ requestsFromMe });
  };

  unsubscribe = () => {};

  routeToSummarySendKit = () => {
    this.props.navigation.navigate(Routes.SUMMARY_SEND_KIT, {
      friendUserProfiles: this.state.selectedFriendUserProfiles,
      time: this.state.time,
      user: this.props.route.params.user,
      requestsFromMe: this.state.requestsFromMe
    });
  };

  onSelectFriend = (userProfile: UserProfile, selected: boolean) => {
    let selectedFriendUserProfiles = this.state.selectedFriendUserProfiles;
    if (selected) {
      selectedFriendUserProfiles.push(userProfile);
    } else {
      selectedFriendUserProfiles = selectedFriendUserProfiles.filter(
        friendUserProfile =>
          friendUserProfile.user.userUuid !== userProfile.user.userUuid
      );
    }
    this.setState({ selectedFriendUserProfiles });
  };

  onSelectTime = (time: number | undefined) => {
    this.setState({ time });
  };

  onPressUserProfile = (userProfile: UserProfile) => {
    const shouldAdd = !this.state.selectedFriendUserProfiles.includes(
      userProfile
    );
    let updatedSelectedFriendUserProfiles = this.state
      .selectedFriendUserProfiles;
    if (shouldAdd) {
      updatedSelectedFriendUserProfiles.push(userProfile);
    } else {
      updatedSelectedFriendUserProfiles = this.state.selectedFriendUserProfiles.filter(
        selectedUserProfile =>
          selectedUserProfile.user.userUuid !== userProfile.user.userUuid
      );
    }
    this.setState({ selectedFriendUserProfiles: updatedSelectedFriendUserProfiles });
  };

  getTrailingIconBackgroungColor = (userProfile: UserProfile): string => {
    const isSelected = this.state.selectedFriendUserProfiles.includes(userProfile);
    return isSelected ? "#5468FF" : "white";
  }

  getTrailingIcon = (userProfile: UserProfile): string => {
    const isSelected = this.state.selectedFriendUserProfiles.includes(userProfile);
    return isSelected ? "✔" : "➕";
  }

  render() {
    const friendsNumber = this.state.selectedFriendUserProfiles.length;
    const friendsString = friendsNumber > 1 ? " FRIENDS " : " FRIEND ";
    const timeString = this.state.time + " MIN";
    const title = friendsNumber + friendsString + " - " + timeString;
    const isContinueButtonHidden =
      this.state.selectedFriendUserProfiles.length === 0 ||
      this.state.time === undefined;
    const friendUserProfiles = this.props.route.params.friendUserProfiles;
    return (
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.timeKit}> */}
          <TimeKit onSelectTime={this.onSelectTime} />
        {/* </View> */}
        <FlatList
          data={friendUserProfiles}
          renderItem={({ item }) => (
            <UserListItem
              title={item.user.firstname}
              subtitle={getLocalTime(item.profile)}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.profile.color,
                0.8
              )}
              containsTrailingIcon={true}
              photoUrl={item.profile.photoUrl}
              trailingIcon={this.getTrailingIcon(item)}
              backgroundTrailingIcon={this.getTrailingIconBackgroungColor(item)}
              onPress={() => {
                this.onPressUserProfile(item);
              }}
              disabled={false}
            />
          )}
          keyExtractor={item => item.user.userUuid}
        />
        <Button
          title={title}
          onPress={this.routeToSummarySendKit}
          isHidden={isContinueButtonHidden}
          trailingIcon="➡️"
          buttonStyle={ButtonStyle.SECONDARY}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  timeKit: {
    margin: 10
  },
  header: {
    fontSize: 25
  }
});
