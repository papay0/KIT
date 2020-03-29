import { UserProfile } from "./UserProfile";

export default interface IReminder {
  senderUuid: string;
  receiverUuid: string;
  frequency: string;
  lastCallDate?: string;
  createdAt: string;
  updatedAt: string;
}

// export interface IUserProfileReminder {
//     userProfile: UserProfile;
//     reminder: IReminder;
// }

// export class UserProfileReminder implements IUserProfileReminder {
//     userProfile: UserProfile;
//     reminder: IReminder;
//     constructor(userProfile: UserProfile, reminder: IReminder) {
//       this.userProfile = userProfile;
//       this.reminder = reminder;
//     }
//   }