import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import * as firebase from "firebase";
import IRequestKit from "../../Models/RequestKit";
import Collections from "../Collections/Collections";
import { User } from "../../Models/User";

interface IRequestsKitProps {
  user: User;
}

interface IRequestsKitState {
  requests: IRequestKit[];
}

export default class RequestsKit extends React.Component<
  IRequestsKitProps,
  IRequestsKitState
> {
  constructor(props: IRequestsKitProps) {
    super(props);
    this.state = { requests: [] };
  }

  componentDidMount() {
    this.getRequests();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe = () => {}

  getRequests = async () => {
    const db = firebase.firestore();
    const requests = Array<IRequestKit>();
    this.unsubscribe = await db
      .collection(Collections.REQUESTS)
      .where("receiverUuid", "==", this.props.user.userUuid)
      .onSnapshot(async documents => {
        for (const doc of documents.docs) {
          const data = doc.data();
          const request: IRequestKit = {
            senderUuid: data.senderUuid,
            receiverUuid: data.receiverUuid,
            availableUntil: data.availableUntil,
            available: data.available
          };
          requests.push(request);
        }
        this.setState({ requests });
      });
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.requests}
          renderItem={({ item }) => <Text key={item.senderUuid}>{item.availableUntil}</Text>}
          keyExtractor={request => request.senderUuid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  availability: {
    fontSize: 25,
    padding: 10
  },
  header: {
    fontSize: 25
  }
});
