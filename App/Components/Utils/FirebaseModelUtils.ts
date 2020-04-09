import { User } from "../../Models/User";
import { Profile } from "../../Models/Profile";
import IFriendRequest from "../../Models/FriendRequest";
import IRequestKit from "../../Models/RequestKit";
import { getDateNow } from "./Utils";
import IReminder from "../../Models/Reminder";

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
      data.pushNotificationToken,
      data.createdAt,
      data.updatedAt,
      data.locale
    );
    return user;
  };

  static getProfileFromFirebaseUser = (
    data: firebase.firestore.DocumentData
  ): Profile => {
    return new Profile(
      data.userUuid,
      data.photoUrl,
      data.timezone,
      data.color,
      data.createdAt,
      data.updatedAt
    );
  };

  static getRequestFromFirebaseRequest = (
    data: firebase.firestore.DocumentData
  ): IRequestKit => {
    return {
      senderUuid: data.senderUuid,
      receiverUuid: data.receiverUuid,
      availableUntil: data.availableUntil,
      isAvailable: data.isAvailable,
      duration: data.duration,
      inCallWith: data.inCallWith,
      inCallVia: data.inCallVia,
      requestUuid: data.requestUuid,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      receiverDeclined: data.receiverDeclined
    };
  };

  static getReminderFromFirebaseReminder = (
    documentData: firebase.firestore.DocumentData
  ): IReminder => {
    const reminder: IReminder = {
      senderUuid: documentData.senderUuid,
      receiverUuid: documentData.receiverUuid,
      frequency: documentData.frequency,
      lastCallDate: documentData.lastCallDate,
      createdAt: documentData.createdAt,
      updatedAt: documentData.updatedAt
    };
    return reminder;
  };

  static getFriendRequestFromFirebaseFriendRequest = (
    data: firebase.firestore.DocumentData
  ): IFriendRequest => {
    return {
      senderUuid: data.senderUuid,
      receiverUuid: data.receiverUuid,
      accepted: data.accepted,
      ack: data.ack,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  };
}
