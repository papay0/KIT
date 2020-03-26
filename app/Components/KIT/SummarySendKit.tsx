import React from "react";
import { StyleSheet, View, Text, SafeAreaView, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import * as firebase from "firebase";
import Button, { ButtonStyle } from "../Button/Button";
import FriendListItem from "../Friends/FriendsListItem";
import Collections from "../Collections/Collections";
import IRequestKit from "../../Models/RequestKit";
import uuid from "react-native-uuid";
import { UserProfile } from "../../Models/UserProfile";
import { getDateNow, addOpcacityToRGB } from "../Utils/Utils";
import NetworkManager from "../../Network/NetworkManager";
import PillButton from "../PlatformUI/PillButton";
import UserListItem, { TralingType } from "../PlatformUI/UserListItem";
import { Profile } from "../../Models/Profile";
import moment from "moment-timezone";

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
    const requests = Array<IRequestKit>();
    const now = new Date();
    const requestUuid = uuid.v1();
    for (const friendUserProfile of friendUserProfiles) {
      const availableUntil = new Date(now);
      availableUntil.setMinutes(now.getMinutes() + time);
      const requestObject: IRequestKit = {
        senderUuid: user.userUuid,
        receiverUuid: friendUserProfile.user.userUuid,
        availableUntil: availableUntil.toISOString(),
        isAvailable: true,
        duration: time,
        inCallWith: null,
        inCallVia: null,
        requestUuid: requestUuid,
        createdAt: getDateNow(),
        updatedAt: getDateNow(),
        receiverDeclined: false
      };
      requests.push(requestObject);
    }
    // TODO: Here is a possible UX bug if I send a request to the same person again, it will send a new one.
    for (const request of requests) {
      try {
        await NetworkManager.createRequest(request);
      } catch (error) {
        console.error("create request error = " + error);
      }
    }
  };

  onPress = async () => {
    this.sendRequest();
    this.props.navigation.navigate(Routes.ROOT, {});
  };

  getLocalTime = (profile: Profile): string => {
    return moment.tz(new Date(), profile.timezone).format("HH:mm");
  };

  render() {
    const friendUserProfiles = this.props.route.params.friendUserProfiles;
    const time = this.props.route.params.time;
    const titleButton = time + " MIN";
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: 120,
            }}
          >
            <PillButton
              title={titleButton}
              selected={true}
              disabled={true}
              onPress={() => {}}
            />
          </View>
        </View>
        <FlatList
          data={friendUserProfiles}
          renderItem={({ item }) => (
            <UserListItem
              title={item.user.displayName}
              subtitle={this.getLocalTime(item.profile)}
              photoUrl={item.profile.photoUrl}
              disabled={true}
              trailingIcon={undefined}
              onPress={() => {}}
              backgroundTrailingIcon={undefined}
              tralingType={TralingType.NONE}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.profile.color,
                0.8
              )}
            />
          )}
          keyExtractor={item => item.user.userUuid}
        />
        <Button
          title="SEND COUCOU"
          onPress={this.onPress}
          isHidden={false}
          trailingIcon=""
          buttonStyle={ButtonStyle.PRIMARY}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column" },
  availability: {
    fontSize: 25,
    padding: 10
  },
  header: {
    fontSize: 25
  }
});
