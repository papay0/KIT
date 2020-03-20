import * as firebase from "firebase";
import { User } from "../Models/User";
import Collections from "../Components/Collections/Collections";
import { Profile } from "../Models/Profile";
import IRequestKit from "../Models/RequestKit";
import FirebaseModelUtils from "../Components/Utils/FirebaseModelUtils";
import { ProfileColor } from "../Models/ProfileColor";

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
      const profile = FirebaseModelUtils.getProfileFromFirebaseUser(data);
      return profile;
    }
    return undefined;
  };

  static updateProfile = async (profile: Profile) => {
    const db = firebase.firestore();
    await db
      .collection(Collections.PROFILES)
      .doc(profile.userUuid)
      .set(JSON.parse(JSON.stringify(profile)), { merge: true });
  };

  static createProfile = async (userUuid: string, photoUrl: string, timezone: string) => {
    const db = firebase.firestore();
    const profile = new Profile(userUuid, photoUrl, timezone, ProfileColor.NONE);
    await db
      .collection(Collections.PROFILES)
      .doc(userUuid)
      .set(JSON.parse(JSON.stringify(profile)));
  };

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
      return FirebaseModelUtils.getUserFromFirebaseUser(data);
    }
    return undefined;
  };

  static getUsers = async (): Promise<User[]> => {
    const db = firebase.firestore();
    const documents = await db.collection(Collections.USERS).get();
    const users = Array<User>();
    for (const doc of documents.docs) {
      const data = doc.data();
      const user = FirebaseModelUtils.getUserFromFirebaseUser(data);
      users.push(user);
    }
    return users;
  };

  // Requests

  static updateRequest = async (request: IRequestKit) => {
    const db = firebase.firestore();
    const requestDocument = await db
      .collection(Collections.REQUESTS)
      .where("senderUuid", "==", request.senderUuid)
      .where("receiverUuid", "==", request.receiverUuid)
      .where("availableUntil", "==", request.availableUntil)
      .get();
    if (requestDocument.docs.length > 0) {
      const myRequestIdToUpdate = requestDocument.docs[0];
      await myRequestIdToUpdate.ref.update({ ...request });
    }
  };
}
