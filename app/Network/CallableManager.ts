import * as firebase from "firebase";
import { User } from "../Models/User";
import Callables from "../Models/Callables";
import _ from "lodash";
import { Profile } from "../Models/Profile";

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
}
