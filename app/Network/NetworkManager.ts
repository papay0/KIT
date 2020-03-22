import * as firebase from "firebase";
import { User } from "../Models/User";
import Collections from "../Components/Collections/Collections";
import { Profile } from "../Models/Profile";
import IRequestKit from "../Models/RequestKit";
import FirebaseModelUtils from "../Components/Utils/FirebaseModelUtils";
import { ProfileColor } from "../Models/ProfileColor";
import { UserProfile } from "../Models/UserProfile";
import IFriendRequest from "../Models/FriendRequest";

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

  // UserProfile

  static getUserProfileByUuid = async (userUuid: string): Promise<UserProfile> => {
    const user = await NetworkManager.getUserByUuid(userUuid);
    const profile = await NetworkManager.getProfileByUuid(userUuid);
    return new UserProfile(user, profile);
  }

  // Requests

  static updateRequest = async (request: IRequestKit) => {
    const db = firebase.firestore();
    const requestDocuments = await db
      .collection(Collections.REQUESTS)
      .where("senderUuid", "==", request.senderUuid)
      .where("receiverUuid", "==", request.receiverUuid)
      .where("requestUuid", "==", request.requestUuid)
      .get();
    if (requestDocuments.docs.length > 0) {
      const myRequestIdToUpdate = requestDocuments.docs[0];
      await myRequestIdToUpdate.ref.update({ ...request });
    }
  };

  // FriendRequests

  static updateFriendRequest = async (friendRequest: IFriendRequest) => {
    const db = firebase.firestore();
    const friendRequestDocument = await db
      .collection(Collections.FRIEND_REQUESTS)
      .where("senderUuid", "==", friendRequest.senderUuid)
      .where("receiverUuid", "==", friendRequest.receiverUuid)
      .get();
      if (friendRequestDocument) {
        const friendRequestIdToUpdate = friendRequestDocument.docs[0];
        await friendRequestIdToUpdate.ref.update({...friendRequest});
      } 
  }
}
