import React from "react";
import { StyleSheet, View, FlatList, Platform, Share } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import * as firebase from "firebase";
import Collections from "../Collections/Collections";
import { UserProfile } from "../../Models/UserProfile";
import NetworkManager from "../../Network/NetworkManager";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import Button, { ButtonStyle } from "../Button/Button";
import UserListItem, { TralingType } from "../PlatformUI/UserListItem";
import {
  getLocalTime,
  addOpcacityToRGB,
  sortUserProfilesAlphabetically
} from "../Utils/Utils";
import IFriendRequest, {
  IFriendRequestUserProfile
} from "../../Models/FriendRequest";
import {
  connectActionSheet
} from "@expo/react-native-action-sheet";
import IReminder from "../../Models/Reminder";

interface IFriendsProps {
  user: User;
  navigation: StackNavigationProp<ParamListBase>;
  friendUserProfiles: UserProfile[];
}

interface IFriendsState {
  friendUserProfiles: UserProfile[];
  userFriendRequestsSent: IFriendRequest[];
  friendRequestUserProfiles: IFriendRequestUserProfile[];
  friendRequestsNumber: number;
  reminders: IReminder[];
}

class Friends extends React.Component<IFriendsProps, IFriendsState> {
  constructor(props: IFriendsProps) {
    super(props);
    this.state = {
      friendUserProfiles: props.friendUserProfiles,
      userFriendRequestsSent: [],
      friendRequestUserProfiles: [],
      friendRequestsNumber: 0,
      reminders: []
    };
  }

  componentDidMount = async () => {
    this.listenerToFriendRequests();
    this.getCurrentFriends(this.props.user.userUuid);
    this.getUserFriendRequestsSent(this.props.user.userUuid);
    this.listenToReminders();
  };

  componentWillUnmount() {
    this.unsubscribeFriends();
    this.unsubscribeFriendRequests();
  }

  unsubscribeFriendRequests = () => {};
  unsubscribeFriends = () => {};

  listenToReminders = async () => {
    const db = firebase.firestore();
    db.collection(Collections.REMINDERS)
      .where("senderUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        const reminders = Array<IReminder>();
        for (const document of documents.docs) {
          if (document.exists) {
            const data = document.data();
            const reminder = FirebaseModelUtils.getReminderFromFirebaseReminder(
              data
            );
            reminders.push(reminder);
          }
        }
        this.setState({ reminders });
      });
  };

  listenerToFriendRequests = async () => {
    const db = firebase.firestore();
    db.collection(Collections.FRIEND_REQUESTS)
      .where("receiverUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        this.setState({ friendRequestsNumber: documents.docs.length });
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

  getCurrentFriends = async (userUuid: string) => {
    const db = firebase.firestore();
    this.unsubscribeFriends = db
      .collection(Collections.FRIENDS)
      .doc(userUuid)
      .onSnapshot(async document => {
        let friendUserProfiles = Array<UserProfile>();
        if (document.exists) {
          const data = document.data();
          for (const userUuid of data.friendsUuid) {
            const friend = await NetworkManager.getUserByUuid(userUuid);
            const profile = await NetworkManager.getProfileByUuid(userUuid);
            const userProfile = new UserProfile(friend, profile);
            friendUserProfiles.push(userProfile);
          }
        }
        friendUserProfiles = sortUserProfilesAlphabetically(friendUserProfiles);
        this.setState({ friendUserProfiles });
      });
  };

  getUserFriendRequestsSent = async (userUuid: string) => {
    const db = firebase.firestore();
    this.unsubscribeFriendRequests = db
      .collection(Collections.FRIEND_REQUESTS)
      .where("senderUuid", "==", userUuid)
      .onSnapshot(async documents => {
        const userFriendRequestsSent = Array<IFriendRequest>();
        for (const doc of documents.docs) {
          const friendRequest = FirebaseModelUtils.getFriendRequestFromFirebaseFriendRequest(
            doc.data()
          );
          userFriendRequestsSent.push(friendRequest);
        }
        this.setState({ userFriendRequestsSent });
      });
  };

  onPressAddFriends = () => {
    this.props.navigation.navigate(Routes.ADD_FRIENDS, {
      user: this.props.user,
      currentFriendsUuid: this.state.friendUserProfiles.map(
        friendProfile => friendProfile.user.userUuid
      ),
      userFriendRequestsSent: this.state.userFriendRequestsSent
    });
  };

  onPressFriendRequests = () => {
    this.props.navigation.navigate(Routes.FRIEND_REQUESTS, {
      friendRequestUserProfiles: this.state.friendRequestUserProfiles
    });
  };

  getFriendRequestsTitle = (): string => {
    const friendRequestsNumber = this.state.friendRequestsNumber;
    const initialTitle = "FRIEND REQUEST";
    if (friendRequestsNumber == 0) {
      return initialTitle;
    } else if (friendRequestsNumber == 1) {
      return String(friendRequestsNumber) + " " + initialTitle;
    } else {
      return String(friendRequestsNumber) + " " + initialTitle + "S";
    }
  };

  onPressInviteFriends = async () => {
    if (Platform.OS === "ios") {
      await Share.share({
        url: "http://www.google.com",
        message: "Hey 👋 download & join me on Coucou 🥳"
      });
    } else {
      await Share.share(
        {
          title: "Hey 👋 download & join me on Coucou 🥳",
          message: "http://www.google.com"
        },
        {
          dialogTitle: "Invite a friend to use Coucou 🥳"
        }
      );
    }
  };

  onChooseAction = async (index: number, userProfile: UserProfile) => {
    let frequency = undefined;
    if (index === 0) {
      frequency = "6_months";
    } else if (index === 1) {
      frequency = "2_months";
    } else if (index === 2) {
      frequency = "1_month";
    } else if (index === 3) {
      frequency = "2_weeks";
    } else if (index === 4) {
      frequency = "1_week";
    } else if (index === 5) {
      // Remove friend
      return;
    }
    this.updateReminderFrequencyLocally(frequency, userProfile);
    const previousReminder = this.state.reminders.find(
      reminder => reminder.receiverUuid === userProfile.user.userUuid
    );
    const reminder: IReminder = {
      senderUuid: this.props.user.userUuid,
      receiverUuid: userProfile.user.userUuid,
      frequency: frequency,
      lastCallDate: previousReminder.lastCallDate,
      createdAt: previousReminder.createdAt,
      updatedAt: previousReminder.updatedAt
    };
    await NetworkManager.updateReminder(reminder);
  };

  updateReminderFrequencyLocally = (frequency: string, userProfile: UserProfile) => {
    const remindersToUpdate = this.state.reminders.map(reminder => {
      if (reminder.receiverUuid === userProfile.user.userUuid) {
        reminder.frequency = frequency;
      }
      return reminder;
    })
    this.setState({reminders: remindersToUpdate});
  }

  onPressFriendMoreOptions = (userProfile: UserProfile) => {
    const options = [
      "6 months",
      "2 months",
      "1 month",
      "2 weeks",
      "1 week",
      "Remove friend (coming soon)",
      "Cancel"
    ];
    const destructiveButtonIndex = 5;
    const cancelButtonIndex = 6;
    const title = "Set call reminders";
    const message =
      "Select the frequency of the reminder. You will receive a notification only if you haven't called this person.";

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title,
        message
      },
      buttonIndex => {
        this.onChooseAction(buttonIndex, userProfile);
      }
    );
  };

  getReminderCopy = (userProfile: UserProfile): string | undefined => {
    const reminder = this.state.reminders.find(
      reminder => reminder.receiverUuid === userProfile.user.userUuid
    );
    if (reminder === undefined) {
      return undefined;
    }
    if (reminder.frequency === "6_months") {
      return "Every 6 months";
    } else if (reminder.frequency === "2_months") {
      return "Every 2 months";
    } else if (reminder.frequency === "1_month") {
      return "Every month";
    } else if (reminder.frequency === "2_weeks") {
      return "Every 2 weeks";
    } else if (reminder.frequency === "1_week") {
      return "Every week";
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="INVITE FRIENDS TO USE COUCOU"
          onPress={this.onPressInviteFriends}
          isHidden={false}
          buttonStyle={ButtonStyle.PRIMARY}
        />
        <Button
          title="ADD FRIENDS"
          trailingIcon={require("../../../assets/plus-blue.png")}
          onPress={this.onPressAddFriends}
          isHidden={false}
          buttonStyle={ButtonStyle.PRIMARY}
        />
        {this.state.friendRequestUserProfiles.length > 0 && (
          <Button
            title={this.getFriendRequestsTitle()}
            trailingIcon={require("../../../assets/arrow-right-blue.png")}
            onPress={this.onPressFriendRequests}
            isHidden={false}
            buttonStyle={ButtonStyle.SECONDARY}
          />
        )}
        <FlatList
          data={this.state.friendUserProfiles}
          renderItem={({ item }) => (
            <UserListItem
              title={item.user.displayName}
              subtitle={getLocalTime(item.profile)}
              secondSubtitle={this.getReminderCopy(item)}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.profile.color,
                0.8
              )}
              tralingType={TralingType.ICON}
              photoUrl={item.profile.photoUrl}
              trailingIcon={require("../../../assets/3-dots.png")}
              backgroundTrailingIcon={undefined}
              onPress={() => {
                this.onPressFriendMoreOptions(item);
              }}
              disabled={false}
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

export default connectActionSheet(Friends);
