import * as firebase from "firebase";
import { User } from "../Models/User";
import Collections from "../Components/Collections/Collections";
import { Profile } from "../Models/Profile";

export default class NetworkManager {
  constructor() {}

  // Profile

  static getProfileByUuid = async (
    userUuid: string
  ): Promise<Profile | undefined> => {
    const db = firebase.firestore();
    const document = await db
      .collection(Collections.PROFILES)
      .doc(userUuid)
      .get();
    if (document.exists) {
      const data = document.data();
      const profile = new Profile(userUuid, data.color);
      return profile;
    }
    return undefined;
  };

  static createProfile = async (userUuid: string) => {
    const db = firebase.firestore();
    const profile = new Profile(userUuid);
    console.log("I create a profile");
    await db
      .collection(Collections.PROFILES)
      .doc(userUuid)
      .set(JSON.parse(JSON.stringify(profile)));
  }

  // User

  static updateUser = async (user: User) => {
    const db = firebase.firestore();
    await db
      .collection(Collections.USERS)
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
