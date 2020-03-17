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

interface IRequestsKitProps {
  user: User;
}

interface IRequestsKitState {
  requestUsers: IRequestUser[];
}

export default class RequestsKit extends React.Component<
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
    this.unsubscribe = await db
      .collection(Collections.REQUESTS)
      .where("receiverUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        const requests = Array<IRequestKit>();
        for (const doc of documents.docs) {
          const data = doc.data();
          const request: IRequestKit = {
            senderUuid: data.senderUuid,
            receiverUuid: data.receiverUuid,
            availableUntil: data.availableUntil,
            isAvailable: data.isAvailable,
            duration: data.duration
          };
          requests.push(request);
        }
        const requestUsers = Array<IRequestUser>();
        for (const request of requests) {
          const user = await NetworkManager.getUserByUuid(request.senderUuid);
          const profile = await NetworkManager.getProfileByUuid(request.senderUuid);
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.availability}>
          Friends available
        </Text>
        <FlatList
          data={this.state.requestUsers}
          renderItem={({ item }) => (
            <RequestListItem key={item.userProfile.user.userUuid} requestUser={item}/>
          )}
          keyExtractor={request => request.userProfile.user.userUuid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
