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
    user: User;
  };
};

interface IFriendRequestsState {
  friendRequestUserProfiles: IFriendRequestUserProfile[];
}

export default class FriendRequests extends React.Component<
  IFriendRequestsProps,
  IFriendRequestsState
> {
  constructor(props: IFriendRequestsProps) {
    super(props);
    this.state = { friendRequestUserProfiles: [] };
  }
  unsubscribe = () => {};
  componentDidMount = async () => {
    const db = firebase.firestore();
    this.unsubscribe = db
      .collection(Collections.FRIEND_REQUESTS)
      .where("receiverUuid", "==", this.props.route.params.user.userUuid)
      .onSnapshot(async documents => {
        const friendRequestUserProfiles = Array<IFriendRequestUserProfile>();
        for (const document of documents.docs) {
          if (document.exists) {
            const data = document.data();
            const friendRequest = FirebaseModelUtils.getFriendRequestFromFirebaseFriendRequest(
              data
            );
            const userProfile = await NetworkManager.getUserProfileByUuid(
              friendRequest.senderUuid
            );
            const friendRequestUserProfile: IFriendRequestUserProfile = {
              friendRequest: friendRequest,
              userProfile: userProfile
            };
            friendRequestUserProfiles.push(friendRequestUserProfile);
          }
        }
        this.setState({ friendRequestUserProfiles: friendRequestUserProfiles });
      });
  };
  componentWillUnmount = () => {
    this.unsubscribe();
  };

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
    const friendRequestUserProfiles = this.state.friendRequestUserProfiles;
    return (
      <View style={styles.container}>
        {friendRequestUserProfiles.length > 0 ? (
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
        ) : (
          <Text>Here will be an image to say no friend request</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
