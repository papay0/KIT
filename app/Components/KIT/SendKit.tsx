import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  SafeAreaView,
  TouchableOpacityBase
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import * as firebase from "firebase";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import Collections from "../Collections/Collections";
import SelectFriendsListItem from "../Friends/SelectFriendsListItem";
import FloatingButton from "../FloatingButton/FloatingButton";
import TimeKit from "./TimeKit";
import IRequestKit from "../../Models/RequestKit";

interface ISendKitProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<SENDKITNavigatorParams, Routes.SEND_KIT>;
}

type SENDKITNavigatorParams = {
  [Routes.SEND_KIT]: {
    user: User;
  };
};

interface ISendKitState {
  friends: User[];
  selectedFriends: User[];
  time: number | undefined;
  requestsFromMe: IRequestKit[];
}

export default class SendKit extends React.Component<
  ISendKitProps,
  ISendKitState
> {
  constructor(props) {
    super(props);
    this.state = { friends: [], selectedFriends: [], time: undefined, requestsFromMe: []};
  }

  componentDidMount = async () => {
    await this.getRequestsFromMe();
    await this.getCurrentFriends(this.props.route.params.user.userUuid);
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  getRequestsFromMe = async () => {
    const db = firebase.firestore();
    const user = this.props.route.params.user;
    const documents = await db
      .collection(Collections.REQUESTS)
      .where("senderUuid", "==", user.userUuid)
      .get();
    const requestsFromMe = Array<IRequestKit>();
    for (const doc of documents.docs) {
      const data = doc.data();
      const request: IRequestKit = {
        senderUuid: data.senderUuid,
        receiverUuid: data.receiverUuid,
        availableUntil: data.availableUntil,
        available: data.available
      };
      requestsFromMe.push(request);
    }
    this.setState({requestsFromMe});
  };

  getUserByUuid = async (userUuid: string): Promise<User | undefined> => {
    const db = firebase.firestore();
    const document = await db
      .collection(Collections.USERS)
      .doc(userUuid)
      .get();
    if (document.exists) {
      const data = document.data();
      const user = new User(
        data.displayName,
        data.photoUrl,
        data.userUuid,
        data.firstname,
        data.lastname,
        data.timezone,
        data.email
      );
      return user;
    }
    return undefined;
  };

  unsubscribe = () => {};

  getCurrentFriends = async (userUuid: string) => {
    const db = firebase.firestore();
    this.unsubscribe = await db
      .collection(Collections.FRIENDS)
      .doc(userUuid)
      .onSnapshot(async document => {
        const friends = Array<User>();
        if (document.exists) {
          const data = document.data();
          for (const userUuid of data.friendsUuid) {
            const friend = await this.getUserByUuid(userUuid);
            friends.push(friend);
          }
        }
        this.setState({ friends });
      });
  };

  routeToSummarySendKit = () => {
    this.props.navigation.navigate(Routes.SUMMARY_SEND_KIT, {
      friends: this.state.selectedFriends,
      time: this.state.time,
      user: this.props.route.params.user,
      requestsFromMe: this.state.requestsFromMe
    });
  };

  onSelectFriend = (user: User, selected: boolean) => {
    let selectedFriends = this.state.selectedFriends;
    if (selected) {
      selectedFriends.push(user);
    } else {
      selectedFriends = selectedFriends.filter(
        friend => friend.userUuid !== user.userUuid
      );
    }
    this.setState({ selectedFriends });
  };

  onSelectTime = (time: number | undefined) => {
    this.setState({ time });
  };

  render() {
    const friendsNumber = this.state.selectedFriends.length;
    const friendsString = friendsNumber > 1 ? " friends " : " friend ";
    const timeString = this.state.time + " min";
    const title =
      "Continue - " + friendsNumber + friendsString + " - " + timeString;
    const isContinueButtonHidden =
      this.state.selectedFriends.length === 0 || this.state.time === undefined;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.timeKit}>
          <TimeKit onSelectTime={this.onSelectTime} />
        </View>
        <FlatList
          data={this.state.friends}
          renderItem={({ item }) => (
            <SelectFriendsListItem user={item} onSelect={this.onSelectFriend} />
          )}
          keyExtractor={user => user.userUuid}
        />
        <FloatingButton
          title={title}
          onPress={this.routeToSummarySendKit}
          isHidden={isContinueButtonHidden}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  timeKit: {
    margin: 10
  },
  header: {
    fontSize: 25
  }
});
