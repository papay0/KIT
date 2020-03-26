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
import UserListItem, { TralingType } from "../PlatformUI/UserListItem";
import { addOpcacityToRGB } from "../Utils/Utils";
import { connectActionSheet } from "@expo/react-native-action-sheet";

interface IFriendRequestsProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<FriendRequestsNavigatorParams, Routes.FRIEND_REQUESTS>;
}

type FriendRequestsNavigatorParams = {
  [Routes.FRIEND_REQUESTS]: {
    friendRequestUserProfiles: IFriendRequestUserProfile[];
  };
};

interface IFriendRequestsState {
  friendRequestUserProfilesAccepted: IFriendRequestUserProfile[];
  friendRequestUserProfilesDeclined: IFriendRequestUserProfile[];
}

class FriendRequests extends React.Component<
  IFriendRequestsProps,
  IFriendRequestsState
> {
  constructor(props: IFriendRequestsProps) {
    super(props);
    this.state = {
      friendRequestUserProfilesAccepted: [],
      friendRequestUserProfilesDeclined: []
    };
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

  getTrailingText = (friendRequestUserProfile: IFriendRequestUserProfile): string => {
    const isAccepted = this.isAccepted(friendRequestUserProfile);
    const isDeclined = this.isDeclined(friendRequestUserProfile);
    if (isAccepted) {
      return "Accepted";
    } else if (isDeclined) {
      return "Declined";
    } else {
      return "Answer";
    }
  };

  isAccepted = (friendRequestUserProfile: IFriendRequestUserProfile): boolean => {
    return this.state.friendRequestUserProfilesAccepted.filter(acceptedFriendRequestUserProfile => {
      return acceptedFriendRequestUserProfile.userProfile.user.userUuid === friendRequestUserProfile.userProfile.user.userUuid
    }).length > 0;
  }

  isDeclined = (friendRequestUserProfile: IFriendRequestUserProfile): boolean => {
    return this.state.friendRequestUserProfilesDeclined.filter(declinedFriendRequestUserProfile => {
      return declinedFriendRequestUserProfile.userProfile.user.userUuid === friendRequestUserProfile.userProfile.user.userUuid
    }).length > 0;
  }

  getBackgroundTrailingText = (friendRequestUserProfile: IFriendRequestUserProfile): string => {
    const isAccepted = this.isAccepted(friendRequestUserProfile);
    const isDeclined = this.isDeclined(friendRequestUserProfile);
    if (isAccepted) {
      return "rgb(101,195,102)";
    } else if (isDeclined) {
      return "rgb(236,77,61)";
    } else {
      return "rgba(84,104,255,0.8)";
    }
  };

  getDisabledState = (friendRequestUserProfile: IFriendRequestUserProfile): boolean => {
    const isAccepted = this.isAccepted(friendRequestUserProfile);
    const isDeclined = this.isDeclined(friendRequestUserProfile);
    if (isAccepted || isDeclined) {
      return true;
    } else {
      return false;
    }
  };

  onChooseAction = (
    buttonIndex: number,
    friendRequestUserProfile: IFriendRequestUserProfile
  ) => {
    if (buttonIndex === 0) {
      const updatedFriendRequestUserProfilesAccepted = this.state.friendRequestUserProfilesAccepted;
      updatedFriendRequestUserProfilesAccepted.push(friendRequestUserProfile);
      this.setState({friendRequestUserProfilesAccepted: updatedFriendRequestUserProfilesAccepted});
      this.onAck(true, friendRequestUserProfile);
    } else if (buttonIndex === 1) {
      const updatedFriendRequestUserProfilesDeclined = this.state.friendRequestUserProfilesDeclined;
      updatedFriendRequestUserProfilesDeclined.push(friendRequestUserProfile);
      this.setState({friendRequestUserProfilesDeclined: updatedFriendRequestUserProfilesDeclined});
      this.onAck(false, friendRequestUserProfile);
    }
  };

  onPressAnswer = (friendRequestUserProfile: IFriendRequestUserProfile) => {
    const options = ["Accept", "Decline", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        this.onChooseAction(buttonIndex, friendRequestUserProfile);
      }
    );
  };

  render() {
    const friendRequestUserProfiles = this.props.route.params
      .friendRequestUserProfiles;
    return (
      <View style={styles.container}>
        <FlatList
          data={friendRequestUserProfiles}
          renderItem={({ item }) => (
            <UserListItem
              title={item.userProfile.user.firstname}
              subtitle={item.userProfile.user.lastname}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.userProfile.profile.color,
                0.8
              )}
              tralingType={TralingType.TEXT}
              photoUrl={item.userProfile.profile.photoUrl}
              trailingIcon={undefined}
              trailingText = {this.getTrailingText(item)}
              backgroundTrailingIcon={undefined}
              backgroundTrailingText={this.getBackgroundTrailingText(item)}
              onPress={() => {
                this.onPressAnswer(item);
              }}
              disabled={this.getDisabledState(item)}
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

export default connectActionSheet(FriendRequests);
