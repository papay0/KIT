import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import IRequestUser from "../../Models/RequestUser";
import moment from "moment";
import { User } from "../../Models/User";

interface IRequestListItemProps {
  requestUser: IRequestUser;
  user: User;
  onCall: () => void;
}

interface IRequestListItemState {}

export default class RequestListItem extends React.Component<
  IRequestListItemProps,
  IRequestListItemState
> {
  interval: NodeJS.Timeout;
  constructor(props: IRequestListItemProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      10000
    );
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  remainingTime = (availableUntil: string): number | undefined => {
    const availableUntilDate = moment(availableUntil);
    const now = moment(new Date());
    const duration = moment.duration(availableUntilDate.diff(now));
    const minutes = duration.asMinutes();
    return minutes > 0 ? Math.floor(minutes) : undefined;
  };

  render() {
    const request = this.props.requestUser.request;
    const user = this.props.requestUser.userProfile.user;
    const profile = this.props.requestUser.userProfile.profile;
    const remainingTime = this.remainingTime(request.availableUntil);
    const isAvailable = this.props.requestUser.request.isAvailable;
    const inCallWith = this.props.requestUser.request.inCallWith;
    const inCallVia = this.props.requestUser.request.inCallVia;
    const isOnCallWithMe = inCallWith == this.props.user.userUuid;
    return remainingTime ? (
      <View style={{ ...styles.container, backgroundColor: profile.color }}>
        <View style={styles.containerProfilePicture}>
          <Image style={styles.image} source={{ uri: profile.photoUrl }} />
        </View>
        <View style={styles.containerInfoProfile}>
          <Text style={styles.firstname}>{user.firstname}</Text>
          {isAvailable ? (
            <Text style={styles.availability}>
              can to talk for {remainingTime} min
            </Text>
          ) : isOnCallWithMe ? (
            <Text style={styles.availability}>
              You should be calling {user.firstname} using {inCallVia}
            </Text>
          ) : (
            <Text style={styles.availability}>Not available anymore</Text>
          )}
          {isAvailable && (
            <View style={styles.containerAcceptCall}>
              <TouchableOpacity onPress={this.props.onCall} style={{ flex: 1 }}>
                <Text style={styles.answerCallText}>Answer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    borderRadius: 24
  },
  containerProfilePicture: {
    marginTop: 22,
    marginBottom: 32,
    marginLeft: 22,
    marginRight: 16
  },
  containerAcceptCall: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    marginTop: 10,
    padding: 12,
    flexDirection: "row"
  },
  answerCallText: {
    textAlign: "center",
    fontSize: 17,
    color: "white",
    fontWeight: "600"
  },
  containerInfoProfile: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 20
  },
  firstname: {
    fontSize: 20,
    color: "rgba(255,255,255,1)",
    fontWeight: "bold"
  },
  availability: {
    fontSize: 17,
    color: "rgba(255,255,255,0.92)",
  },
  image: {
    width: 100,
    height: 100,
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});
