import * as firebase from "firebase";
import { User } from "../Models/User";
import Callables from "../Models/Callables";
import _ from "lodash";

export default class CallableManager {
  static createUser = async (user: User) => {
    console.log("CREATE_USER");
    const createUser = firebase
      .functions()
      .httpsCallable(Callables.CREATE_USER);
    await createUser({ user: _.toPlainObject(user) });
  };

  static updateUser = async (user: User) => {
    console.log("UPDATE_USER");
    const updateUser = firebase
      .functions()
      .httpsCallable(Callables.UPDATE_USER);
    await updateUser({ user: _.toPlainObject(user) });
  };
}
