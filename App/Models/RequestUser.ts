import IRequestKit from "./RequestKit";
import { UserProfile } from "./UserProfile";

export default interface IRequestUser {
  userProfile: UserProfile;
  request: IRequestKit;
}
