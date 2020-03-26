import React from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import { UserProfile } from "../../Models/UserProfile";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import Routes from "../Routes/Routes";
import AddFriendListItem from "./AddFriendsListItem";
import NetworkManager from "../../Network/NetworkManager";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import IFriendRequest, {
  IFriendRequestUserProfile
} from "../../Models/FriendRequest";
import FriendRequestsListItem from "./FriendRequestsListItem";

interface IFriendRequestsProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<FriendRequestsNavigatorParams, Routes.FRIEND_REQUESTS>;
}

type FriendRequestsNavigatorParams = {
  [Routes.FRIEND_REQUESTS]: {
    friendRequestUserProfiles: IFriendRequestUserProfile[];
  };
};

interface IFriendRequestsState {}

export default class FriendRequests extends React.Component<
  IFriendRequestsProps,
  IFriendRequestsState
> {
  constructor(props: IFriendRequestsProps) {
    super(props);
    this.state = { friendRequestUserProfiles: [] };
  }

  onAck = async (
    accepted: boolean,
    friendRequestUserProfile: IFriendRequestUserProfile
  ) => {
    if (accepted) {
      await NetworkManager.acceptFriendRequest(
        friendRequestUserProfile.friendRequest
      );
    } else {
      await NetworkManager.declineFriendRequest(
        friendRequestUserProfile.friendRequest
      );
    }
  };

  render() {
    const friendRequestUserProfiles = this.props.route.params
      .friendRequestUserProfiles;
    return (
      <View style={styles.container}>
        <FlatList
          data={friendRequestUserProfiles}
          renderItem={({ item }) => (
            <FriendRequestsListItem
              friendRequestUserProfile={item.userProfile}
              onAck={accepted => {
                this.onAck(accepted, item);
              }}
            />
          )}
          keyExtractor={item => item.userProfile.user.userUuid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
