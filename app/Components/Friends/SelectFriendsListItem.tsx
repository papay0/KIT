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
import { UserProfile } from "../../Models/UserProfile";
import { Profile } from "../../Models/Profile";

interface ISelectFriendsListItemProps {
  user: User;
  profile: Profile;
  onSelect: (userProfile: UserProfile, selected: boolean) => void;
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
    this.state = { title: "☑️", selected: false };
  }

  onPressButton = () => {
    const userProfile = new UserProfile(this.props.user, this.props.profile);
    this.props.onSelect(userProfile, !this.state.selected);
    this.setState({
      title: this.state.selected ? "☑️" : "✅",
      selected: !this.state.selected
    });
  };

  render() {
    const user = this.props.user;
    const profile = this.props.profile;
    const localTime = moment.tz(new Date(), profile.timezone).format("HH:mm");
    return (
      <TouchableOpacity style={{...styles.containerFriendList, backgroundColor: profile.color}} onPress={() => this.onPressButton()}>
        <Image source={{ uri: profile.photoUrl }} style={styles.image} />
        <View style={styles.container_content}>
          <Text style={styles.title}>{user.displayName}</Text>
          <Text style={styles.localTime}>Local time {localTime}</Text>
        </View>

        <View style={styles.selectCheckbox}>
          <Text>
            {this.state.title}
          </Text>
        </View>
      </TouchableOpacity>
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
