import * as firebase from "firebase";
import { User } from "../Models/User";
import Callables from "../Models/Callables";
import _ from "lodash";
import { Profile } from "../Models/Profile";
import IRequestKit from "../Models/RequestKit";

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
    console.log("CREATE_PROFILE");
    const createUser = firebase
      .functions()
      .httpsCallable(Callables.CREATE_PROFILE);
    await createUser({ profile: _.toPlainObject(profile) });
  };

  static updateProfile = async (profile: Profile) => {
    console.log("UPDATE_PROFILE");
    const updateUser = firebase
      .functions()
      .httpsCallable(Callables.UPDATE_PROFILE);
    await updateUser({ profile: _.toPlainObject(profile) });
  };

  // Request

  static createRequest = async (request: IRequestKit) => {
    console.log("createRequest 2");
    const createRequest = firebase
      .functions()
      .httpsCallable(Callables.CREATE_REQUEST);
    console.log(_.toPlainObject(request));
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
}
