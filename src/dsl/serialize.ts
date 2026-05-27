import {
  Color,
  Digits,
  HasColor,
  HasKind,
  HasShape,
  Letter, module,
  Module,
  Navestidlo,
  Part,
  Question,
  state,
  State
} from './types';


export type SerializationOptions = {
  useSpaces?: boolean;
  useShortPrefix?: boolean;
  alwaysAddModulePrefix?: boolean;
  useShortIconName?: boolean;
  statesAlwaysInsideBracket?: boolean;
  colorAlwaysInsideBracket?: boolean;
  neverNumberShortening?: boolean;
  neverUnknownShapeOmit?: boolean;
}

export function serialize(navestidlo: Navestidlo, options?: SerializationOptions): string {
  return serializeNavestidlo(navestidlo, options ?? {});
}

function serializeNavestidlo(navestidlo: Navestidlo, options: SerializationOptions): string {
  return navestidlo.content
    .map(part => serializePart(part, options))
    .join(options.useSpaces ? " | " : "|");
}

function serializePart(part: Part, options: SerializationOptions): string {
  const serialized = part.content.map(module => serializeModule(module, options));

  let stringArray: string[];
  if (options.neverNumberShortening) {
    stringArray = serialized.map(m => m[0]);

  } else {
    stringArray = [...serialized, [ null, false ] as const ]
      .reduce(([parts, basicCount, textForOne], [value, isBasic]): [string[], number, string] => {
        if (value !== null && isBasic)
          return [parts, basicCount + 1, value];

        if (basicCount === 1)
          parts.push(textForOne);
        else if (basicCount > 1)
          parts.push(`${basicCount}`);

        if (value !== null)
          parts.push(value);

        return [parts, 0, textForOne];
      }, [[], 0, ""])[0];
  }

  return stringArray.join(options.useSpaces ? " ; " : ";");

}

function serializeModule(module: Module, options: SerializationOptions): [string,boolean] {

  let prefix: string = ({
    "module-bulb": "bulb",
    "module-line": "line",
    "module-matrix": "matrix",
  } as const) [module.kind];

  if (options.useShortPrefix)
    prefix = prefix[0];

  if (!options.alwaysAddModulePrefix && module.kind === "module-bulb")
    prefix = "";

  if (
    module.content.length === 0 ||
    module.content.length === 1 && module.content[0].kind === "state-full" && module.content[0].color === "?"
  )
    return [ prefix || "?", module.kind == "module-bulb" ];

  return [ prefix + serializeStates(module.content,{ neverUnknownShapeOmit: module.kind !== "module-matrix", ...options}), false ];
}

function serializeStates(states: State[], options: SerializationOptions): string {

  if (states.length > 1 || options.statesAlwaysInsideBracket) {
    options = { neverUnknownShapeOmit: true, ...options };

    if (!options.colorAlwaysInsideBracket) {
      const oneColorPossible = states.every(
        (s, _, a) =>
          s.kind !== "state-empty" &&
          s.kind !== "state-full" &&
          s.color === (a[0] as any).color
      );

      if (oneColorPossible)
        return (states[0] as any).color
          + (options.useSpaces ? "[ " : "[")
          + states
            .map(s => serializeShape(s, options))
            .join(options.useSpaces ? " ; " : ";")
          + (options.useSpaces ? " ]" : "]");
    }

    return (options.useSpaces ? "[ " : "[")
      + states
        .map(s => serializeState(s, options))
        .join(options.useSpaces ? " ; " : ";")
      + (options.useSpaces ? " ]" : "]");

  }

  return serializeState(states[0], options);
}

function serializeState(state: State, options: SerializationOptions): string {
  if (state.kind === "state-empty")
    return "_";

  return state.color + serializeShape(state, options);
}

function serializeShape(state: State, options: SerializationOptions): string {
  switch (state.kind) {
    default:
    case "state-empty":
    case "state-full":
      return "";

    case "state-unknown":
      return options.neverUnknownShapeOmit ? "?" : "";

    case "state-number":
    case "state-letter":
      return state.shape;

    case "state-line":
      return options.useShortIconName ? "l" : "line";

    case "state-icon":
      break;
  }

  switch (state.shape) {
    case "humping":
      return options.useShortIconName ? "^" : "humping";
    case "cross":
      return options.useShortIconName ? "x" : "cross";
    default:
      return "?";
  }
}

(window as any).serialize = serialize;
