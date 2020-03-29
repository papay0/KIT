import React from "react";
import { StyleSheet, View, FlatList, Text, Image } from "react-native";
import * as firebase from "firebase";
import IRequestKit from "../../Models/RequestKit";
import Collections from "../Collections/Collections";
import { User } from "../../Models/User";
import NetworkManager from "../../Network/NetworkManager";
import RequestListItem from "./RequestListItem";
import IRequestUser from "../../Models/RequestUser";
import { UserProfile } from "../../Models/UserProfile";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import UserListItem, { TralingType } from "../PlatformUI/UserListItem";
import { addOpcacityToRGB, getDateNow, getLocalTime } from "../Utils/Utils";
import moment from "moment";
import IReminder, { UserProfileReminder } from "../../Models/Reminder";
import {
    connectActionSheet
  } from "@expo/react-native-action-sheet";

interface IReminderProps {
  userProfileReminders: UserProfileReminder[];
  sendCoucou: () => void;
}

interface IReminderState {}

class Reminders extends React.Component<
  IReminderProps,
  IReminderState
> {
  constructor(props: IReminderProps) {
    super(props);
    this.state = {};
  }

  updateReminderLocally = (userProfileReminders: UserProfileReminder) => {

  }

  onChooseAction = async (index: number, userProfileReminder: UserProfileReminder) => {
    this.updateReminderLocally(userProfileReminder);
    if (index === 0) {
      this.props.sendCoucou();
    } else if (index === 1) {
      const reminderToUpdate = userProfileReminder.reminder;
      reminderToUpdate.lastCallDate = getDateNow();
      await NetworkManager.updateReminder(reminderToUpdate);
    }
  };

  onPressMoreOptions = (userProfileReminders: UserProfileReminder) => {
    const options = [
        "Send Coucou now",
        "Mark as already called",
        "Cancel"
      ];
      const cancelButtonIndex = 2;
  
      this.props.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex
        },
        buttonIndex => {
          this.onChooseAction(buttonIndex, userProfileReminders);
        }
      );
  }

  render() {
    const userProfileReminders = this.props.userProfileReminders;
    return userProfileReminders.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          data={userProfileReminders}
          renderItem={({ item }) => (
            <UserListItem
              title={item.userProfile.user.firstname}
              subtitle={getLocalTime(item.userProfile.profile)}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.userProfile.profile.color,
                0.8
              )}
              tralingType={TralingType.ICON}
              trailingIcon={require("../../../assets/3-dots.png")}
              photoUrl={item.userProfile.profile.photoUrl}
              onPress={() => {this.onPressMoreOptions(item)}}
              disabled={false}
            />
          )}
          keyExtractor={item =>
            item.userProfile.user.userUuid + item.reminder.createdAt
          }
        />
      </View>
    ) : (
      <View>
        <View style={styles.emptyRequestStyleContainer}>
          <Image
            source={require("../../../assets/illustration-mail-box.png")}
            style={styles.emptyRequestStyle}
          />
        </View>
        <Text style={styles.titleText}>Feature coming soon</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { marginTop: 30, flex: 1 },
  availability: {
    fontSize: 17,
    paddingTop: 20,
    paddingLeft: 20,
    fontWeight: "bold"
  },
  emptyRequestStyleContainer: {
    paddingTop: 100,
    paddingBottom: 70,
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto"
  },
  emptyRequestStyle: {
    width: 240,
    height: 240
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center"
  },
  subtitleText: {
    fontSize: 17,
    color: "#8E8E93",
    textAlign: "center"
  }
});

export default connectActionSheet(Reminders);