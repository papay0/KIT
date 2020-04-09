import ProfileColorManager, { ProfileColor } from "./ProfileColor";

interface IProfile {
  color: ProfileColor;
  userUuid: string;
  photoUrl: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export class Profile implements IProfile {
  color: ProfileColor;
  userUuid: string;
  photoUrl: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  constructor(
    userUuid: string,
    photoUrl: string,
    timezone: string,
    color: ProfileColor,
    createdAt: string,
    updatedAt: string
  ) {
    if (color === ProfileColor.NONE) {
      this.color = ProfileColorManager.getRandomColor();
    } else {
      this.color = color;
    }
    this.photoUrl = photoUrl;
    this.timezone = timezone;
    this.userUuid = userUuid;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
