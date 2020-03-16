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
import IRequestKit from "../../Models/RequestKit";
import { Profile } from "../../Models/Profile";
import { UserProfile } from "../../Models/UserProfile";

interface ISummarySendKitProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<SUMMARYSENDKITNavigatorParams, Routes.SUMMARY_SEND_KIT>;
}

type SUMMARYSENDKITNavigatorParams = {
  [Routes.SUMMARY_SEND_KIT]: {
    friendUserProfiles: UserProfile[];
    time: number;
    user: User;
    requestsFromMe: IRequestKit[];
  };
};

interface ISummarySendKitState {}

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
    const friendUserProfiles = this.props.route.params.friendUserProfiles;
    const time = this.props.route.params.time;
    const user = this.props.route.params.user;
    const requestsFromMe = this.props.route.params.requestsFromMe;
    const requests = Array<IRequestKit>();
    const now = new Date();
    for (const friendUserProfile of friendUserProfiles) {
      const availableUntil = new Date(now);
      availableUntil.setMinutes(now.getMinutes() + time);
      const requestObject: IRequestKit = {
        senderUuid: user.userUuid,
        receiverUuid: friendUserProfile.user.userUuid,
        availableUntil: availableUntil.toISOString(),
        available: true
      };
      requests.push(requestObject);
    }
    for (const request of requests) {
      const requestAlreadyMade =
        requestsFromMe.filter(requestFromMe => {
          return requestFromMe.senderUuid === request.senderUuid;
        }).length > 0;
      if (requestAlreadyMade) {
        const requestFromMe = await db
          .collection(Collections.REQUESTS)
          .where("senderUuid", "==", request.senderUuid)
          .where("receiverUuid", "==", request.receiverUuid)
          .get();
        if (requestFromMe.docs.length > 0) {
          const myRequestIdToUpdate = requestFromMe.docs[0];
          myRequestIdToUpdate.ref.update({ ...request });
        }
      } else {
        await db.collection(Collections.REQUESTS).add(request);
      }
    }
  };

  onPress = async () => {
    await this.sendRequest();
    this.props.navigation.navigate(Routes.ROOT, {});
  };

  render() {
    const friendUserProfiles = this.props.route.params.friendUserProfiles;
    const time = this.props.route.params.time;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.availability}>
          I am available for {time} minutes.
        </Text>
        <FlatList
          data={friendUserProfiles}
          renderItem={({ item }) => <FriendListItem user={item.user} profile={item.profile} />}
          keyExtractor={item => item.user.userUuid}
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
