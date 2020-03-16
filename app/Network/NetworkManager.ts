import * as firebase from "firebase";
import { User } from "../Models/User";
import Collections from "../Components/Collections/Collections";

export default class NetworkManager {
  constructor() {}

  static updateUser = async (user: User) => {
    const db = firebase.firestore();
    await db.collection("users")
      .doc(user.userUuid)
      .set(JSON.parse(JSON.stringify(user)), { merge: true });
  };

  static getUserByUuid = async (
    userUuid: string
  ): Promise<User | undefined> => {
    const db = firebase.firestore();
    const document = await db
      .collection(Collections.USERS)
      .doc(userUuid)
      .get();
    if (document.exists) {
      const data = document.data();
      const user = new User(
        data.displayName,
        data.photoUrl,
        data.userUuid,
        data.firstname,
        data.lastname,
        data.timezone,
        data.email
      );
      return user;
    }
    return undefined;
  };
}
