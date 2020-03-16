import ProfileColorManager, { ProfileColor } from "./ProfileColor";

interface IProfile {
  color: ProfileColor;
  userUuid: string;
}

export class Profile implements IProfile {
  color: ProfileColor;
  userUuid: string;
  constructor(userUuid: string, color: ProfileColor = ProfileColor.NONE) {
    if (color === ProfileColor.NONE) {
      this.color = ProfileColorManager.getRandomColor();
    } else {
      this.color = color
    }
    this.userUuid = userUuid;
  }
}
