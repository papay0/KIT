import { Profile } from "./Profile";

interface IUser {
  displayName: string;
  photoUrl: string;
  userUuid: string;
  firstname: string;
  lastname: string;
  timezone: string;
  email: string;
}

export class User implements IUser {
  displayName: string;
  photoUrl: string;
  userUuid: string;
  firstname: string;
  lastname: string;
  timezone: string;
  email: string;
  profile: Profile;
  constructor(
    displayName: string,
    photoUrl: string,
    userUuid: string,
    firtname: string,
    lastname: string,
    timezone: string,
    email: string,
    profile: Profile
  ) {
    this.displayName = displayName;
    this.photoUrl = photoUrl;
    this.userUuid = userUuid;
    this.firstname = firtname;
    this.lastname = lastname;
    this.timezone = timezone;
    this.email = email;
    this.profile = profile;
  }
}
