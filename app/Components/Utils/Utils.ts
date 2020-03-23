export const getDateNow = (): string => {
  return new Date().toISOString();
};

export const addOpcacityToRGB = (rgb: string, opacity: number): string => {
  const matchColors = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
  const match = matchColors.exec(rgb);
  if (match !== null) {
    const red = match[1];
    const green = match[2];
    const blue = match[3];
    return (
      "rgba(" + red + "," + green + "," + blue + "," + String(opacity) + ")"
    );
  }
  {
    return "rgba(255, 255, 255, 0.2)";
  }
};
