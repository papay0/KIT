import * as firebase from "firebase";
import { User } from "../Models/User";
import Callables from "../Models/Callables";
import _ from "lodash";

export default class CallableManager {
  static createUser = async (user: User) => {
    const createUser = firebase
      .functions()
      .httpsCallable(Callables.CREATE_USER);
    await createUser({ user: _.toPlainObject(user) });
  };
}
