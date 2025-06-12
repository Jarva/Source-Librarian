export interface ExportedGlyph {
  typeName: Component;
  typeIndex: number;
  classes: string[];
  spellSchools: SpellSchool[];
  defaults: Defaults;
  name: string;
  texture: string;
  animated: boolean;
  registryName: string;
  localizationKey: string;
}

export interface Component {
  translate: string;
}

export interface SpellSchool {
  id: string;
  subschools: string[];
}

export interface Defaults {
  starter: boolean;
  perSpellLimit: number;
  augments: Augments;
  invalidCombinations: string[];
  tier: number;
  cost: number;
  enabled: boolean;
}

export interface Augments {
  compatible: string[];
  descriptions: Record<string, Component>;
  costs: { [id: string]: number };
  limits: { [id: string]: number };
}
