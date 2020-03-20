export enum ProfileColor {
  BLUE = "rgb(97,79,255)",
  ORANGE = "rgb(255,102,76)",
  NONE = ""
}

export default class ProfileColorManager {

  static getAllColors = (): ProfileColor[] => {
    const orange = ProfileColor.ORANGE;
    const blue = ProfileColor.BLUE;
    const colors = [orange, blue];
    return colors;
  };

  static getRandomColor = (): ProfileColor => {
    const colors = ProfileColorManager.getAllColors();
    return colors[Math.floor(Math.random() * colors.length)];
  };
}
