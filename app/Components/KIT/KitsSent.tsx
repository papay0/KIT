import React from "react";
import { StyleSheet, View, FlatList, Text, Linking } from "react-native";
import * as firebase from "firebase";
import IRequestKit from "../../Models/RequestKit";
import Collections from "../Collections/Collections";
import { User } from "../../Models/User";
import NetworkManager from "../../Network/NetworkManager";
import RequestListItem from "./RequestListItem";
import IRequestUser from "../../Models/RequestUser";
import { UserProfile } from "../../Models/UserProfile";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";

interface IKitsSentProps {
    user: User;
}

interface IKitsSentState {
  kitsSent: IRequestUser[];
}

export default class KitsSent extends React.Component<
IKitsSentProps,
IKitsSentState
> {
  constructor(props: IKitsSentProps) {
    super(props);
    this.state = { kitsSent: [] };
  }

  componentDidMount() {
    this.getKitSent()
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe = () => {};

  getKitSent = async () => {
    const db = firebase.firestore();
    this.unsubscribe = await db
      .collection(Collections.REQUESTS)
      .where("senderUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        const requests = Array<IRequestKit>();
        for (const doc of documents.docs) {
          const data = doc.data();
          const request = FirebaseModelUtils.getRequestFromFirebaseRequest(data);
          requests.push(request);
        }
        const kitsSent = Array<IRequestUser>();
        for (const request of requests) {
          const user = await NetworkManager.getUserByUuid(request.receiverUuid);
          const profile = await NetworkManager.getProfileByUuid(request.receiverUuid);
          const userProfile = new UserProfile(user, profile);
          const kitSent: IRequestUser = {
            userProfile: userProfile,
            request: request
          };
          kitsSent.push(kitSent);
        }
        this.setState({ kitsSent: kitsSent });
      });
  };

  render() {
    return (
      this.state.kitsSent.length > 0 ? (
      <View style={styles.container}>
        <Text style={styles.availability}>
          Requests sent
        </Text>
        <FlatList
          data={this.state.kitsSent}
          renderItem={({ item }) => (
            <RequestListItem key={item.userProfile.user.userUuid} user={this.props.user} onCall={() => {}} requestUser={item}/>
          )}
          keyExtractor={request => request.userProfile.user.userUuid}
        />
      </View>) : <View/>
    );
  }
}

const styles = StyleSheet.create({
  container: { },
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