export enum ProfileColor {
  BLUE = "rgb(97,79,255)",
  ORANGE = "rgb(255,102,76)",
  BLUE2 = "rgb(90,200,250)",
  YELLOW = "rgb(250,233,101)",
  GREEN = "rgb(76,217,100)",
  PINK = "rgb(120, 208, 255)",
  RED = "	rgb(255,20,20)",
  NONE = ""
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
