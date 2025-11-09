import { AnySelectMenu, FileUpload, Label, TextInput } from "@buape/carbon";

type SupportedComponent = TextInput | AnySelectMenu | FileUpload;

type LabelSettings = {
  label: string;
  description?: string;
};

// deno-lint-ignore ban-types
type Constructor<T> = Function & { prototype: T };

export const withLabel = <TComponent extends SupportedComponent>(
  settings: LabelSettings,
  ComponentConstructor: Constructor<TComponent>,
  componentSettings: Partial<TComponent>,
) => {
  const component = Reflect.construct(ComponentConstructor, []);
  Object.assign(component, componentSettings);

  return new class extends Label {
    label = settings.label;
    description = settings.description;
    component = component;
  }();
};
