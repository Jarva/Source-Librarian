export const capitalize = (str: string) =>
  str
    .replaceAll(/[_\-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
