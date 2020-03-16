import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import IRequestUser from "../../Models/RequestUser";

interface IRequestListItemProps {
  requestUser: IRequestUser;
}

interface IRequestListItemState {}

export default class RequestListItem extends React.Component<
  IRequestListItemProps,
  IRequestListItemState
> {
  constructor(props: IRequestListItemProps) {
    super(props);
    this.state = {};
  }

  render() {
    const request = this.props.requestUser.request;
    const user = this.props.requestUser.user;
    return (
      <View style={{...styles.container, backgroundColor: user.profile.color}}>
        <View style={styles.containerProfilePicture}>
          <Image style={styles.image} source={{ uri: user.photoUrl }} />
        </View>
        <View style={styles.containerInfoProfile}>
          <Text style={styles.names}>{user.displayName}</Text>
          <Text style={styles.availability}>Available for 20 minutes</Text>
          <View style={styles.containerAcceptCall}>
            <TouchableOpacity >
              <Text style={styles.names}>Accept call ☎️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
