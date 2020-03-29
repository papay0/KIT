import * as firebase from "firebase";
import { User } from "../Models/User";
import Callables from "../Models/Callables";
import _ from "lodash";
import { Profile } from "../Models/Profile";
import IRequestKit from "../Models/RequestKit";
import IFriendRequest from "../Models/FriendRequest";
import IReminder from "../Models/Reminder";

export default class CallableManager {
  // User

  static createUser = async (user: User) => {
    const createUser = firebase
      .functions()
      .httpsCallable(Callables.CREATE_USER);
    await createUser({ user: _.toPlainObject(user) });
  };

  static updateUser = async (user: User) => {
    const updateUser = firebase
      .functions()
      .httpsCallable(Callables.UPDATE_USER);
    await updateUser({ user: _.toPlainObject(user) });
  };

  // Profile

  static createProfile = async (profile: Profile) => {
    const createUser = firebase
      .functions()
      .httpsCallable(Callables.CREATE_PROFILE);
    await createUser({ profile: _.toPlainObject(profile) });
  };

  static updateProfile = async (profile: Profile) => {
    const updateUser = firebase
      .functions()
      .httpsCallable(Callables.UPDATE_PROFILE);
    await updateUser({ profile: _.toPlainObject(profile) });
  };

  // Request

  static createRequest = async (request: IRequestKit) => {
    const createRequest = firebase
      .functions()
      .httpsCallable(Callables.CREATE_REQUEST);
    await createRequest({ request: _.toPlainObject(request) });
  };

  static updateRequest = async (request: IRequestKit) => {
    const updateRequest = firebase
      .functions()
      .httpsCallable(Callables.UPDATE_REQUEST);
    await updateRequest({ request: _.toPlainObject(request) });
  };

  static acceptRequest = async (
    request: IRequestKit,
    inCallVia: string,
    inCallWith: string
  ) => {
    const acceptRequest = firebase
      .functions()
      .httpsCallable(Callables.ACCEPT_REQUEST);
    await acceptRequest({
      request: _.toPlainObject(request),
      inCallVia: inCallVia,
      inCallWith: inCallWith
    });
  };

  static declineRequest = async (
    request: IRequestKit
  ) => {
    const declineRequest = firebase
      .functions()
      .httpsCallable(Callables.DECLINE_REQUEST);
    await declineRequest({
      request: _.toPlainObject(request)
    });
  };

  // FriendRequest

  static createFriendRequest = async (friendRequest: IFriendRequest) => {
    const createFriendRequest = firebase
      .functions()
      .httpsCallable(Callables.CREATE_FRIEND_REQUEST);
    await createFriendRequest({
      friendRequest: _.toPlainObject(friendRequest)
    });
  };

  static acceptFriendRequest = async (friendRequest: IFriendRequest) => {
    const createFriendRequest = firebase
      .functions()
      .httpsCallable(Callables.ACCEPT_FRIEND_REQUEST);
    await createFriendRequest({
      friendRequest: _.toPlainObject(friendRequest)
    });
  };

  static declineFriendRequest = async (friendRequest: IFriendRequest) => {
    const createFriendRequest = firebase
      .functions()
      .httpsCallable(Callables.DECLINE_FRIEND_REQUEST);
    await createFriendRequest({
      friendRequest: _.toPlainObject(friendRequest)
    });
  };

  static updateReminder = async (reminder: IReminder) => {
    const updateReminder = firebase
      .functions()
      .httpsCallable(Callables.UPDATE_REMINDER);
    await updateReminder({
      reminder: _.toPlainObject(reminder)
    });
  }
}
