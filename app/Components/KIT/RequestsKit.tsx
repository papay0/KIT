import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import * as firebase from "firebase";
import IRequestKit from "../../Models/RequestKit";
import Collections from "../Collections/Collections";
import { User } from "../../Models/User";
import NetworkManager from "../../Network/NetworkManager";
import RequestListItem from "./RequestListItem";
import IRequestUser from "../../Models/RequestUser";
import { UserProfile } from "../../Models/UserProfile";
import AppLink from "react-native-app-link";
import {
  ActionSheetOptions,
  connectActionSheet
} from "@expo/react-native-action-sheet";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";

interface IRequestsKitProps {
  user: User;
  // showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i: number) => void) => void;
}

interface IRequestsKitState {
  requestUsers: IRequestUser[];
}

class RequestsKit extends React.Component<
  IRequestsKitProps,
  IRequestsKitState
> {
  constructor(props: IRequestsKitProps) {
    super(props);
    this.state = { requestUsers: [] };
  }

  componentDidMount() {
    this.getRequests();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe = () => {};

  getRequests = async () => {
    const db = firebase.firestore();
    this.unsubscribe = db
      .collection(Collections.REQUESTS)
      .where("receiverUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        const requests = Array<IRequestKit>();
        for (const doc of documents.docs) {
          const data = doc.data();
          const request = FirebaseModelUtils.getRequestFromFirebaseRequest(
            data
          );
          requests.push(request);
        }
        const requestUsers = Array<IRequestUser>();
        for (const request of requests) {
          const user = await NetworkManager.getUserByUuid(request.senderUuid);
          const profile = await NetworkManager.getProfileByUuid(
            request.senderUuid
          );
          const userProfile = new UserProfile(user, profile);
          const requestUser: IRequestUser = {
            userProfile: userProfile,
            request: request
          };
          requestUsers.push(requestUser);
        }
        this.setState({ requestUsers: requestUsers });
      });
  };

  acceptCall = async (messagingPlatform: string, kitSent: IRequestUser) => {
    const request = kitSent.request;
    await NetworkManager.acceptRequest(
      request,
      messagingPlatform,
      this.props.user.userUuid
    );
  };

  callBackSelectMessaging = (index: number, kitSent: IRequestUser) => {
    if (index === 0) {
      const url = "fb-messenger://";
      AppLink.maybeOpenURL("fb-messenger://", {
        appName: "messenger",
        appStoreId: 454638411,
        appStoreLocale: "us",
        playStoreId: "com.facebook.orca"
      })
        .then(() => {
          // do something
        })
        .catch(err => {
          // log
          console.log("error = " + err);
        });
      this.acceptCall("Messenger", kitSent);
    } else if (index === 1) {
      AppLink.maybeOpenURL("whatsapp://", {
        appName: "whatsapp-messenger",
        appStoreId: 310633997,
        appStoreLocale: "us",
        playStoreId: "com.whatsapp"
      })
        .then(() => {
          // do something
        })
        .catch(err => {
          // log
          console.log("error = " + err);
        });
      this.acceptCall("WhatsApp", kitSent);
    } else if (index === 2) {
      this.acceptCall("Other solution", kitSent);
    }
  };

  openMessagingActionSheet = (
    onChooseAction: (buttonIndex: number) => void
  ) => {
    const options = ["Messenger", "WhatsApp", "Other solution", "Cancel"];
    const cancelButtonIndex = 3;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        onChooseAction(buttonIndex);
      }
    );
  };

  onCall = (kitSent: IRequestUser) => {
    this.openMessagingActionSheet(index => {
      this.callBackSelectMessaging(index, kitSent);
    });
  };

  render() {
    return this.state.requestUsers.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          data={this.state.requestUsers}
          renderItem={({ item }) => (
            <RequestListItem
              key={item.userProfile.user.userUuid}
              user={this.props.user}
              onCall={() => {
                this.onCall(item);
              }}
              requestUser={item}
            />
          )}
          keyExtractor={request => request.userProfile.user.userUuid}
        />
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  container: {marginTop: 30},
  availability: {
    fontSize: 17,
    paddingTop: 20,
    paddingLeft: 20,
    fontWeight: "bold"
  },
  header: {
    fontSize: 25
  }
});

export default connectActionSheet(RequestsKit);
