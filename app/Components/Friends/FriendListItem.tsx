import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";

import { User } from "../../Models/User";

interface IFriendListItemProps {
  user: User;
  currentFriendsUuid: string[];
  addFriend: (userUuid: string) => Promise<void> | undefined;
  shouldShowAddButton: boolean;
}

interface IFriendListItemState {
  title: string;
  disabled: boolean;
}

export default class FriendListItem extends React.Component<
  IFriendListItemProps,
  IFriendListItemState
> {
  constructor(props: IFriendListItemProps) {
    super(props);
    const alreadyFriend = props.currentFriendsUuid.includes(
      props.user.userUuid
    );
    this.state = {
      title: alreadyFriend ? "Added" : "Add",
      disabled: alreadyFriend
    };
  }

  onPressButton = () => {
    this.setState({
      title: "Added",
      disabled: true
    });
    this.props.addFriend(this.props.user.userUuid);
  };

  render() {
    const user = this.props.user;
    return (
      <View style={styles.containerFriendList}>
        <Image source={{ uri: user.photoUrl }} style={styles.image} />
        <View style={styles.container_content}>
          <Text style={styles.title}>{user.firstname}</Text>
          <Text style={styles.title}>{user.lastname}</Text>
        </View>
        {this.props.shouldShowAddButton && (
          <View style={styles.addButton}>
            <Button
              title={this.state.title}
              disabled={this.state.disabled}
              onPress={() => this.onPressButton()}
            />
          </View>
        )}
      </View>
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
    justifyContent: "flex-start"
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