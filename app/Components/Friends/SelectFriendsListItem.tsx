import React from "react";
import { StyleSheet, Text, View, Image, Button, CheckBox } from "react-native";

import { User } from "../../Models/User";

interface ISelectFriendsListItemProps {
  user: User;
}

interface ISelectFriendsListItemState {
  title: string;
  selected: boolean;
}

export default class SelectFriendsListItem extends React.Component<
  ISelectFriendsListItemProps,
  ISelectFriendsListItemState
> {
  constructor(props: ISelectFriendsListItemProps) {
    super(props);
    this.state = {title: "☑️", selected: false}
  }

  onPressButton = () => {
    this.setState({
      title: this.state.selected ? "☑️" : "✅",
      selected: !this.state.selected
    });
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

        <View style={styles.selectCheckbox}>
            <Button
              title = {this.state.title}
              onPress={() => this.onPressButton()}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  selectCheckbox: {
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
