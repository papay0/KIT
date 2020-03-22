import * as firebase from "firebase";
import { User } from "../Models/User";
import Collections from "../Components/Collections/Collections";
import { Profile } from "../Models/Profile";
import IRequestKit from "../Models/RequestKit";
import FirebaseModelUtils from "../Components/Utils/FirebaseModelUtils";
import { ProfileColor } from "../Models/ProfileColor";
import { UserProfile } from "../Models/UserProfile";
import IFriendRequest from "../Models/FriendRequest";
import { getDateNow } from "../Components/Utils/Utils";
import CallableManager from "./CallableManager";

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
    await CallableManager.updateProfile(profile);
  };

  static createProfile = async (profile: Profile) => {
    await CallableManager.createProfile(profile);
  }

  static profileExists = async (profile: Profile): Promise<boolean> => {
    const profileFromBackend = await NetworkManager.getProfileByUuid(profile.userUuid);
    return profileFromBackend !== undefined;
  }

  // User

  static createOrUpdateUser = async (user: User) => {
    if (await NetworkManager.userExists(user)) {
      await NetworkManager.updateUser(user);
    } else {
      await NetworkManager.createUser(user);
    }
  }

  static updateUser = async (user: User) => {
    await CallableManager.updateUser(user);
  };

  static createUser = async (user: User) => {
    await CallableManager.createUser(user);
  }

  static userExists = async (user: User): Promise<boolean> => {
    const userFromBackend = await NetworkManager.getUserByUuid(user.userUuid);
    return userFromBackend !== undefined;
  }

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

  static getUserProfileByUuid = async (
    userUuid: string
  ): Promise<UserProfile> => {
    const user = await NetworkManager.getUserByUuid(userUuid);
    const profile = await NetworkManager.getProfileByUuid(userUuid);
    return new UserProfile(user, profile);
  };

  // Requests

  static createRequest = async (request: IRequestKit) => {
    console.log("createRequest 1");
    await CallableManager.createRequest(request);
  }

  static updateRequest = async (request: IRequestKit) => {
    await CallableManager.updateRequest(request);
  };

  static acceptRequest = async (request: IRequestKit, inCallVia: string, inCallWith: string) => {
    await CallableManager.acceptRequest(request, inCallVia, inCallWith);
  }

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
      await friendRequestIdToUpdate.ref.update({ ...friendRequest });
    }
  };
}
