// title: string
// subtitle: string
// leading profile picture: boolean
// trailing buttons: boolean
// trailing button style: one / two

import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export enum TralingType {
  NONE,
  ICON,
  TEXT
}

interface IUserListItemProps {
  title: string;
  subtitle?: string;
  secondSubtitle?: string;
  photoUrl: string | undefined;
  backgroundColorBorderPhoto: string | undefined;
  backgroundColorBorderListItem?: string;
  subtitleTextColor?: string;
  tralingType: TralingType;
  backgroundTrailingIcon?: string;
  backgroundTrailingText?: string;
  trailingIcon?: any;
  trailingText?: string;
  onPress: () => void;
  disabled: boolean;
}

interface IUserListItemState {}

export default class UserListItem extends React.Component<
  IUserListItemProps,
  IUserListItemState
> {
  constructor(props: IUserListItemProps) {
    super(props);
    this.state = {};
  }

  render() {
    const title = this.props.title;
    const subtitle = this.props.subtitle;
    const secondSubtitle = this.props.secondSubtitle;
    const photoUrl = this.props.photoUrl;
    const backgroundColorBorderPhoto = this.props.backgroundColorBorderPhoto;
    const backgroundTrailingIcon = this.props.backgroundTrailingIcon;
    const disabled = this.props.disabled;
    const backgroundColorBorderListItem = this.props
      .backgroundColorBorderListItem;
    const borderWidthListItem =
      this.props.backgroundColorBorderListItem === undefined ? 0 : 2;
    const subtitleTextColor =
      this.props.subtitleTextColor === undefined
        ? "grey"
        : this.props.subtitleTextColor;
    return (
      <TouchableOpacity
        style={{
          ...styles.container,
          borderColor: backgroundColorBorderListItem,
          borderWidth: borderWidthListItem
        }}
        onPress={this.props.onPress}
        disabled={disabled}
      >
        {photoUrl && (
          <View>
            <Image
              source={{ uri: photoUrl }}
              style={{
                ...styles.image,
                borderColor: backgroundColorBorderPhoto
              }}
            />
          </View>
        )}
        <View style={styles.container_content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={{ ...styles.subtitle, color: subtitleTextColor }}>
              {subtitle}
            </Text>
          )}
          {secondSubtitle && (
            <Text style={{ ...styles.subtitle, color: subtitleTextColor }}>
              {secondSubtitle}
            </Text>
          )}
        </View>
        {this.props.tralingType == TralingType.ICON && (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 70
            }}
          >
            <View
              style={{
                ...styles.trailingIconStyle,
                backgroundColor: backgroundTrailingIcon
              }}
            >
              <Image
                source={this.props.trailingIcon}
                style={styles.styleTrailingIcon}
              />
            </View>
          </View>
        )}
        {this.props.tralingType == TralingType.TEXT && (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              marginRight: 20
            }}
          >
            <View
              style={{
                ...styles.containerAcceptDeclineFriendRequest,
                backgroundColor: this.props.backgroundTrailingText
              }}
            >
              <Text style={styles.acceptDeclineFriendRequestText}>
                {this.props.trailingText}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: "#F7F7F7"
  },
  containerAcceptDeclineFriendRequest: {
    borderRadius: 16,
    width: 100,
    height: 50,
    flexDirection: "column",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  acceptDeclineFriendRequestText: {
    fontSize: 17,
    color: "white",
    fontWeight: "600"
  },
  selectCheckbox: {
    justifyContent: "center"
  },
  trailingIconStyle: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 20
  },
  image: {
    width: 70,
    height: 70,
    borderWidth: 3,
    borderRadius: 150,
    marginLeft: 18,
    marginTop: 18,
    marginBottom: 18,
    marginRight: 18
  },
  title: {
    fontSize: 17,
    color: "#000",
    justifyContent: "flex-start",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 17,
    color: "grey"
  },
  container_content: {
    flex: 1,
    flexDirection: "column",
    // marginLeft: 12,
    justifyContent: "center"
  },
  description: {
    fontSize: 11,
    fontStyle: "italic"
  },
  photo: {
    height: 50,
    width: 50
  },
  styleTrailingIcon: {
    height: 20,
    width: 20
  }
});
