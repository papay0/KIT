import React from "react";
import { StyleSheet, View, FlatList, Text, Image, ScrollView } from "react-native";
import * as firebase from "firebase";
import IRequestKit from "../../Models/RequestKit";
import Collections from "../Collections/Collections";
import { User } from "../../Models/User";
import NetworkManager from "../../Network/NetworkManager";
import RequestListItem from "./RequestListItem";
import IRequestUser from "../../Models/RequestUser";
import { UserProfile } from "../../Models/UserProfile";
import FirebaseModelUtils from "../Utils/FirebaseModelUtils";
import UserListItem, { TralingType } from "../PlatformUI/UserListItem";
import { addOpcacityToRGB, getDateNow } from "../Utils/Utils";
import moment from "moment";

interface IKitsSentProps {
  user: User;
  kitsSent: IRequestUser[];
}

interface IKitsSentState {
}

export default class KitsSent extends React.Component<
  IKitsSentProps,
  IKitsSentState
> {
  constructor(props: IKitsSentProps) {
    super(props);
    this.state = { kitsSent: [] };
  }

  getBackgroundColorAcceptDecline = (
    requestUser: IRequestUser
  ): string | undefined => {
    const receiverUuid = requestUser.request.receiverUuid;
    const receiverDeclined = requestUser.request.receiverDeclined;
    if (
      requestUser.request.inCallWith !== null &&
      requestUser.request.inCallWith === requestUser.userProfile.user.userUuid
    ) {
      return "#4CD964";
    } else if (
      receiverDeclined &&
      receiverUuid === requestUser.userProfile.user.userUuid
    ) {
      return "#ec4d3d";
    } else {
      return undefined;
    }
  };

  getSubtitle = (requestUser: IRequestUser): string => {
    const receiverUuid = requestUser.request.receiverUuid;
    const receiverDeclined = requestUser.request.receiverDeclined;
    if (
      requestUser.request.inCallWith !== null &&
      requestUser.request.inCallWith === requestUser.userProfile.user.userUuid
    ) {
      return "is calling you on " + requestUser.request.inCallVia;
    } else if (
      receiverDeclined &&
      receiverUuid === requestUser.userProfile.user.userUuid
    ) {
      return "can't talk right now";
    } else {
      const minutes = this.getDuration(requestUser.request);
      return "You can talk for " + minutes + " min";
    }
  };

  getDuration = (request: IRequestKit): number => {
    const now = moment(getDateNow());
    const duration = moment.duration(moment(request.availableUntil).diff(now));
    return Math.floor(duration.asMinutes());
  };

  filterKitsSent = (kitsSent: IRequestUser[]): IRequestUser[] => {
    return kitsSent.filter(kitSent => {
      const duration = this.getDuration(kitSent.request);
      return duration > 0;
    });
  }

  render() {
    const kitsSent = this.filterKitsSent(this.props.kitsSent);
    return kitsSent.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          data={kitsSent}
          renderItem={({ item }) => (
            <UserListItem
              title={item.userProfile.user.displayName}
              subtitle={this.getSubtitle(item)}
              backgroundColorBorderPhoto={addOpcacityToRGB(
                item.userProfile.profile.color,
                0.8
              )}
              tralingType={TralingType.NONE}
              photoUrl={item.userProfile.profile.photoUrl}
              onPress={() => {}}
              disabled={true}
              backgroundColorBorderListItem={this.getBackgroundColorAcceptDecline(
                item
              )}
              subtitleTextColor={this.getBackgroundColorAcceptDecline(
                item
              )}
            />
          )}
          keyExtractor={item =>
            item.userProfile.user.userUuid + item.request.receiverUuid
          }
        />
      </View>
    ) : (
      <ScrollView>
        <View style={styles.emptyRequestStyleContainer}>
          <Image
            source={require("../../../assets/illustration-mail-box.png")}
            style={styles.emptyRequestStyle}
          />
        </View>
        <Text style={styles.titleText}>There is no one here right now...</Text>
        <Text style={styles.subtitleText}>Why not say Coucou to a friend?</Text>
      </ScrollView>
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
