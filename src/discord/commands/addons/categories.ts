export const categories = [
  {
    name: "Essentials",
    value: "essential",
    description: "Virtually required to get the full Ars experience.",
  },
  {
    name: "Compatibility",
    value: "compat",
    description: "Focused on integrating with other mods.",
  },
  {
    name: "Power Fantasy",
    value: "power-fantasy",
    description: "Focused on increasing the players power level.",
  },
  {
    name: "Supplementary",
    value: "supplementary",
    description: "Focused on adding new content.",
  },
  {
    name: "Retextures",
    value: "retexture",
    description: "Focused on changing the appearance of Ars content.",
  },
  {
    name: "Inadvisable",
    value: "inadvisable",
    description: "Not recommended for use due to poor quality.",
  },
] as const;

export type Categories = (typeof categories[number])["value"];
