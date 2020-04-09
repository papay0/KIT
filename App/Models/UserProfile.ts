import { User } from "./User";
import { Profile } from "./Profile";

interface IUserProfile {
  user: User;
  profile: Profile;
}

export class UserProfile implements IUserProfile {
  user: User;
  profile: Profile;
  constructor(user: User, profile: Profile) {
    this.user = user;
    this.profile = profile;
  }
}
