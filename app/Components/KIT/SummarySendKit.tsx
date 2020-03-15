import React from "react";
import { StyleSheet, View, Text, SafeAreaView, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import * as firebase from "firebase";
import FloatingButton from "../FloatingButton/FloatingButton";
import FriendListItem from "../Friends/FriendsListItem";
import Collections from "../Collections/Collections";

interface ISummarySendKitProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<SUMMARYSENDKITNavigatorParams, Routes.SEND_KIT>;
}

type SUMMARYSENDKITNavigatorParams = {
  [Routes.SEND_KIT]: {
    friends: User[];
    time: number;
    user: User;
  };
};

interface ISummarySendKitState {}

interface IRequestKit {
  senderUuid: string;
  receiverUuid: string;
  availableUntil: string;
  available: boolean;
}

export default class SummarySendKit extends React.Component<
  ISummarySendKitProps,
  ISummarySendKitState
> {
  constructor(props: ISummarySendKitProps) {
    super(props);
    this.state = {};
  }

  sendRequest = async () => {
    const db = firebase.firestore();
    const friends = this.props.route.params.friends;
    const time = this.props.route.params.time;
    const user = this.props.route.params.user;
    const requests = Array<IRequestKit>();
    const now = new Date();
    for (const friend of friends) {
      const availableUntil = new Date(now);
      availableUntil.setMinutes(now.getMinutes() + time);
      const requestObject: IRequestKit = {
        senderUuid: user.userUuid,
        receiverUuid: friend.userUuid,
        availableUntil: availableUntil.toISOString(),
        available: true
      };
      requests.push(requestObject);
    }
    for (const request of requests) {
      await db.collection(Collections.REQUESTS).add(request);
    }
  };

  onPress = async () => {
    await this.sendRequest();
    this.props.navigation.navigate(Routes.ROOT, {});
  };

  render() {
    const friends = this.props.route.params.friends;
    const time = this.props.route.params.time;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.availability}>
          I am available for {time} minutes.
        </Text>
        <FlatList
          data={friends}
          renderItem={({ item }) => <FriendListItem user={item} />}
          keyExtractor={user => user.userUuid}
        />
        <FloatingButton title="Send" onPress={this.onPress} isHidden={false} />
      </SafeAreaView>
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
