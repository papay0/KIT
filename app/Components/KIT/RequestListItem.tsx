import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import IRequestUser from "../../Models/RequestUser";
import moment from "moment";

interface IRequestListItemProps {
  requestUser: IRequestUser;
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
    return remainingTime ? (
      <View style={{ ...styles.container, backgroundColor: profile.color }}>
        <View style={styles.containerProfilePicture}>
          <Image style={styles.image} source={{ uri: user.photoUrl }} />
        </View>
        <View style={styles.containerInfoProfile}>
          <Text style={styles.names}>{user.displayName}</Text>
          {isAvailable ? (
            <Text style={styles.availability}>
              Available for {remainingTime}{" "}
              {remainingTime > 1 ? "minutes" : "minute"}
            </Text>
          ) : (
            <Text style={styles.availability}>Not available anymore</Text>
          )}
          {isAvailable && (
            <View style={styles.containerAcceptCall}>
              <TouchableOpacity onPress={this.props.onCall}>
                <Text style={styles.names}>Accept call ☎️</Text>
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
    borderRadius: 10
  },
  containerProfilePicture: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20
  },
  containerAcceptCall: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    // backgroundColor: "red",
    borderRadius: 10,
    padding: 6
    // backgroundColor: "green",
    // position: "absolute"
  },
  containerInfoProfile: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 10
    // backgroundColor: "yellow"
  },
  names: {
    fontSize: 20,
    color: "white"
  },
  availability: {
    fontSize: 15,
    color: "white"
  },
  image: {
    width: 100,
    height: 100,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});
