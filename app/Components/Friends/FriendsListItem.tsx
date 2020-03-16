import React from "react";
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native";
import moment from "moment-timezone";

import { User } from "../../Models/User";
import { Profile } from "../../Models/Profile";

interface IFriendsListItemProps {
  user: User;
  profile: Profile
}

interface IFriendsListItemState {
}

export default class FriendsListItem extends React.Component<
  IFriendsListItemProps,
  IFriendsListItemState
> {
  constructor(props: IFriendsListItemProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    const user = this.props.user;
    const profile = this.props.profile;
    const localTime = moment.tz(new Date(), user.timezone).format("HH:mm");
    return (
      <View style={{...styles.containerFriendList, backgroundColor: profile.color}}>
        <Image source={{ uri: user.photoUrl }} style={styles.image} />
        <View style={styles.container_content}>
          <Text style={styles.title}>{user.displayName}</Text>
          <Text style={styles.localTime}>Local time: {localTime}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    borderRadius: 5
  },
  title: {
    fontSize: 16,
    color: "#000",
    justifyContent: "flex-start",
    fontWeight: 'bold'
  },
  localTime: {
    fontSize: 14,
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
