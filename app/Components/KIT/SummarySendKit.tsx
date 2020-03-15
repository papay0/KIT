import React from "react";
import { StyleSheet, View, Text, SafeAreaView, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import PillButton from "../PlatformUI/PillButton";
import FloatingButton from "../FloatingButton/FloatingButton";
import FriendListItem from "../Friends/FriendsListItem";

interface ISummarySendKitProps {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<SUMMARYSENDKITNavigatorParams, Routes.SEND_KIT>;
}

type SUMMARYSENDKITNavigatorParams = {
  [Routes.SEND_KIT]: {
    friends: User[];
    time: number;
  };
};

interface ISummarySendKitState {}

export default class SummarySendKit extends React.Component<
  ISummarySendKitProps,
  ISummarySendKitState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const friends = this.props.route.params.friends;
    const time = this.props.route.params.time;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.availability}>I am available for {time} minutes.</Text>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <FriendListItem user={item} />
          )}
          keyExtractor={user => user.userUuid}
        />
        <FloatingButton title="Send" onPress={() => {}} isHidden={false} />
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
