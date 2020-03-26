import React from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import { UserProfile } from "../../Models/UserProfile";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import Routes from "../Routes/Routes";
import NetworkManager from "../../Network/NetworkManager";
import AddFriendsListItem from "./AddFriendsListItem";
import IFriendRequest from "../../Models/FriendRequest";
import { getDateNow, addOpcacityToRGB, sortUserProfilesAlphabetically } from "../Utils/Utils";
import UserListItem, { TralingType } from "../PlatformUI/UserListItem";

interface IAddFriendsProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<AddFriendsNavigatorParams, Routes.ADD_FRIENDS>;
}

type AddFriendsNavigatorParams = {
  [Routes.ADD_FRIENDS]: {
    user: User;
    currentFriendsUuid: string[];
    userFriendRequestsSent: IFriendRequest[];
  };
};

interface IAddFriendsState {
  userProfiles: UserProfile[];
  userFriendRequestsSent: IFriendRequest[];
}

export default class AddFriends extends React.Component<
  IAddFriendsProps,
  IAddFriendsState
> {
  constructor(props: IAddFriendsProps) {
    super(props);
    this.state = {
      userProfiles: Array<UserProfile>(),
      userFriendRequestsSent: props.route.params.userFriendRequestsSent
    };
  }

  componentDidMount = async () => {
    this.getUsers();
  };

  getUsers = async () => {
    const users = await NetworkManager.getUsers();
    let userProfiles = Array<UserProfile>();
    for (const user of users) {
      const profile = await NetworkManager.getProfileByUuid(user.userUuid);
      const userProfile = new UserProfile(user, profile);
      userProfiles.push(userProfile);
    }
    userProfiles = this.removeMyCurrentFriends(userProfiles);
    userProfiles = sortUserProfilesAlphabetically(userProfiles);
    this.setState({ userProfiles: userProfiles });
  };

  removeMyCurrentFriends = (userProfiles: UserProfile[]): UserProfile[] => {
    return userProfiles.filter(userProfile => {
      return !this.props.route.params.currentFriendsUuid.includes(
        userProfile.user.userUuid
      ) && this.props.route.params.user.userUuid !== userProfile.user.userUuid;
    });
  };

  addFriend = async (friendUuid: string) => {
    const user = this.props.route.params.user;
    const friendRequest: IFriendRequest = {
      senderUuid: user.userUuid,
      receiverUuid: friendUuid,
      accepted: false,
      ack: false,
      createdAt: getDateNow(),
      updatedAt: getDateNow()
    };
    const localFriendRequestsSent = this.state.userFriendRequestsSent;
    localFriendRequestsSent.push(friendRequest)
    this.setState({userFriendRequestsSent: localFriendRequestsSent});
    NetworkManager.createFriendRequest(friendRequest);
  };

  getTrailingIcon = (userProfile: UserProfile): any => {
    const alreadySent = this.isFriendRequestAlreadySent(userProfile);
    if (alreadySent) {
      return require("../../../assets/plane-white.png");
    } else {
      return require("../../../assets/plus-gray.png");
    }
  }

  isFriendRequestAlreadySent = (userProfile: UserProfile): boolean => {
    const userFriendRequestsSent = this.props.route.params.userFriendRequestsSent;
    return userFriendRequestsSent.filter(friendRequest => {
      return friendRequest.receiverUuid == userProfile.user.userUuid;
    }).length > 0;
  }

  getBackgroundTrailingIcon = (userProfile: UserProfile): string => {
    const alreadySent = this.isFriendRequestAlreadySent(userProfile);
    if (alreadySent) {
      return "#5468FF";
    } else {
      return "white";
    }
  }

  getDisabledState = (userProfile: UserProfile): boolean => {
    return this.isFriendRequestAlreadySent(userProfile);
  }

  render() {
    const user = this.props.route.params.user;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.userProfiles}
          renderItem={({ item }) => (
            <UserListItem
              title={item.user.firstname}
              subtitle={item.user.lastname}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.profile.color,
                0.8
              )}
              tralingType={TralingType.ICON}
              photoUrl={item.profile.photoUrl}
              trailingIcon={this.getTrailingIcon(item)}
              backgroundTrailingIcon={this.getBackgroundTrailingIcon(item)}
              onPress={() => {
                this.addFriend(item.user.userUuid);
              }}
              disabled={this.getDisabledState(item)}
            />
          )}
          keyExtractor={item => item.user.userUuid}
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
