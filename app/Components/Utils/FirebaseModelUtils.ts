import { User } from "../../Models/User";
import { Profile } from "../../Models/Profile";
import IFriendRequest from "../../Models/FriendRequest";

export default class FirebaseModelUtils {
  static getUserFromFirebaseUser = (
    data: firebase.firestore.DocumentData
  ): User => {
    const user = new User(
      data.displayName,
      data.userUuid,
      data.firstname,
      data.lastname,
      data.email,
      data.pushNotificationToken
    );
    return user;
  };

  static getProfileFromFirebaseUser = (
    data: firebase.firestore.DocumentData
  ): Profile => {
    return new Profile(data.userUuid, data.photoUrl, data.timezone, data.color);
  };

  static getFriendRequestFromFirebaseFriendRequest = (
    data: firebase.firestore.DocumentData
  ): IFriendRequest => {
    return {
      senderUuid: data.senderUuid,
      receiverUuid: data.receiverUuid,
      accepted: data.accepted,
      ack: data.ack
    };
  };
}
