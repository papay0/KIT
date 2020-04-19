export enum ProfileColor {
  BLUE = "rgb(84,104,255)",
  ORANGE = "rgb(255,102,76)",
  BLUE2 = "rgb(114,221,247)",
  YELLOW = "rgb(255,211,90)",
  GREEN = "rgb(61,220,151)",
  PINK = "rgb(247,174,248)",
  RED = "rgb(255,73,92)",
  NONE = "",
}

export default class ProfileColorManager {
  static getAllColors = (): ProfileColor[] => {
    const orange = ProfileColor.ORANGE;
    const blue = ProfileColor.BLUE;
    const blue2 = ProfileColor.BLUE2;
    const yellow = ProfileColor.YELLOW;
    const green = ProfileColor.GREEN;
    const pink = ProfileColor.PINK;
    const red = ProfileColor.RED;
    const colors = [orange, blue, blue2, yellow, green, pink, red];
    return colors;
  };

  static getRandomColor = (): ProfileColor => {
    const colors = ProfileColorManager.getAllColors();
    return colors[Math.floor(Math.random() * colors.length)];
  };
}
