import React from "react";
import { StyleSheet, View, FlatList, Text, Image } from "react-native";
import * as firebase from "firebase";
import IRequestKit from "../../Models/RequestKit";
import Collections from "../Collections/Collections";
import { User } from "../../Models/User";
import NetworkManager from "../../Network/NetworkManager";
import RequestListItem from "./RequestListItem";
import IRequestUser from "../../Models/RequestUser";
import AppLink from "react-native-app-link";
import {
  ActionSheetOptions,
  connectActionSheet
} from "@expo/react-native-action-sheet";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import { getDateNow } from "../Utils/Utils";
import moment from "moment";

interface IRequestsKitProps {
  user: User;
  requestUsers: IRequestUser[];
  // showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i: number) => void) => void;
}

interface IRequestsKitState {
}

class RequestsKit extends React.Component<
  IRequestsKitProps,
  IRequestsKitState
> {
  constructor(props: IRequestsKitProps) {
    super(props);
    this.state = { requestUsers: [] };
  }

  acceptCall = async (messagingPlatform: string, kitSent: IRequestUser) => {
    const request = kitSent.request;
    await NetworkManager.acceptRequest(
      request,
      messagingPlatform,
      this.props.user.userUuid
    );
  };

  declineCall = async (kitSent: IRequestUser) => {
    const request = kitSent.request;
    await NetworkManager.declineRequest(request);
  };

  callBackSelectMessaging = async (index: number, kitSent: IRequestUser) => {
    if (index === 0) {
      this.acceptCall("Messenger", kitSent);
      AppLink.maybeOpenURL("fb-messenger://", {
        appName: "messenger",
        appStoreId: 454638411,
        appStoreLocale: "us",
        playStoreId: "com.facebook.orca"
      });
    } else if (index === 1) {
      this.acceptCall("WhatsApp", kitSent);
      AppLink.maybeOpenURL("whatsapp://", {
        appName: "whatsapp-messenger",
        appStoreId: 310633997,
        appStoreLocale: "us",
        playStoreId: "com.whatsapp"
      });
    } else if (index === 2) {
      this.acceptCall("Other solution", kitSent);
    } else if (index === 3) {
      this.declineCall(kitSent);
    }
  };

  openMessagingActionSheet = async (
    onChooseAction: (buttonIndex: number) => void
  ) => {
    const options = [
      "Messenger",
      "WhatsApp",
      "Other solution",
      "Decline",
      "Cancel"
    ];
    const destructiveButtonIndex = 3;
    const cancelButtonIndex = 4;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        onChooseAction(buttonIndex);
      }
    );
  };

  onCall = (kitSent: IRequestUser) => {
    this.openMessagingActionSheet(async index => {
      await this.callBackSelectMessaging(index, kitSent);
    });
  };

  filterActionableRequests = (requestUsers: IRequestUser[]): IRequestUser[] => {
    return requestUsers.filter(requestUser => {
      const request = requestUser.request;
      const now = getDateNow();
      return moment(now).isBefore(request.availableUntil);
    })
  };

  render() {
    const requestUsers = this.filterActionableRequests(this.props.requestUsers);
    return requestUsers.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          data={requestUsers}
          renderItem={({ item }) => (
            <RequestListItem
              key={
                item.userProfile.user.userUuid + "-" + item.request.requestUuid
              }
              user={this.props.user}
              onCall={() => {
                this.onCall(item);
              }}
              requestUser={item}
            />
          )}
          keyExtractor={request =>
            request.userProfile.user.userUuid +
            "-" +
            request.request.requestUuid
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
        <Text style={styles.titleText}>There is no one here right now...</Text>
        <Text style={styles.subtitleText}>Why not say Coucou to a friend?</Text>
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
  header: {
    fontSize: 25
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

export default connectActionSheet(RequestsKit);
