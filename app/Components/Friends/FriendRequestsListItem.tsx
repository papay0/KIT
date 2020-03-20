import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity
} from "react-native";
import moment from "moment-timezone";

import { User } from "../../Models/User";
import { Profile } from "../../Models/Profile";
import IFriendRequest from "../../Models/FriendRequest";
import { UserProfile } from "../../Models/UserProfile";

interface IFriendRequestListItemProps {
  friendRequestUserProfile: UserProfile;
  onAck: (accepted: boolean) => void
}

interface IFriendRequestListItemState {
  ack: boolean;
  accepted: boolean;
}

export default class FriendRequestsListItem extends React.Component<
  IFriendRequestListItemProps,
  IFriendRequestListItemState
> {
  constructor(props: IFriendRequestListItemProps) {
    super(props);
    this.state = { ack: false, accepted: false };
  }

  onAccept = () => {
    this.setState({ ack: true, accepted: true });
    this.props.onAck(true);
  };

  onDecline = () => {
    this.setState({ ack: true, accepted: false });
    this.props.onAck(false);
  };

  render() {
    const friendRequestUserProfile = this.props.friendRequestUserProfile;
    const localTime = moment
      .tz(new Date(), friendRequestUserProfile.profile.timezone)
      .format("HH:mm");
    return (
      <TouchableOpacity
        style={{
          ...styles.containerFriendList,
          backgroundColor: friendRequestUserProfile.profile.color
        }}
      >
        <Image
          source={{ uri: friendRequestUserProfile.profile.photoUrl }}
          style={styles.image}
        />
        <View style={styles.container_content}>
          <Text style={styles.title}>
            {friendRequestUserProfile.user.displayName}
          </Text>
          <Text style={styles.localTime}>Local time: {localTime}</Text>
        </View>
        {this.state.ack ? (
          this.state.accepted ? (
            <View>
              <Text>✅</Text>
            </View>
          ) : (
            <View>
              <Text>❌</Text>
            </View>
          )
        ) : (
          <View style={styles.addButton}>
            <Button title="Accept" onPress={this.onAccept} />
            <Button title="Decline" onPress={this.onDecline} />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  addButton: {
    justifyContent: "center"
  },
  image: {
    width: 50,
    height: 50,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
  containerFriendList: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "#FFF"
    // elevation: 2
  },
  title: {
    fontSize: 16,
    color: "#000",
    justifyContent: "flex-start",
    fontWeight: "bold"
  },
  localTime: {
    fontSize: 14
  },
  container_content: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    justifyContent: "center"
  },
  description: {
    fontSize: 11,
    fontStyle: "italic"
  },
  photo: {
    height: 50,
    width: 50
  }
});
