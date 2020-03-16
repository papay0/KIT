import { ProfileColor } from "./ProfileColor";

interface IProfile {
  color: ProfileColor;
}

export class Profile implements IProfile {
  color: ProfileColor;
  constructor(color: ProfileColor = ProfileColor.NONE) {
    if (color === ProfileColor.NONE) {
      this.color = this.getRandomColor();
      console.log("randon = " + this.getRandomColor());
    } else {
      this.color = color
    }
    console.log("color = " + this.color);
  }

  getRandomColor = (): ProfileColor => {
    const orange = ProfileColor.ORANGE;
    const blue = ProfileColor.BLUE;
    const colors = [orange, blue];
    return colors[Math.floor(Math.random() * colors.length)]
  }
}
