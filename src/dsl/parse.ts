import {
  Color,
  Digits,
  Letter,
  module,
  Module,
  Navestidlo,
  navestidlo,
  Part,
  part,
  Question,
  State,
  state,
  StateEmpty
} from './types';


type StatePartsingOptions = {
  unknown?: boolean
  empty?: boolean
  line?: boolean
  number?: boolean
  letter?: boolean
  icon?: boolean
  full?: boolean
  noEmptyShapeString?: boolean
}




export function parse(input: string): Navestidlo | null {

  const sanitized = input
    .replaceAll(/\s/g, '')
    .replaceAll(/(^[;|]*)|([;|]*$)/g, '') // FOR BACKWARD COMPATIBILITY
    .replaceAll(/;\|;/g, '|') // FOR BACKWARD COMPATIBILITY
    // .replaceAll(/;*\|[;|]*/g, '|')
    // .replaceAll(/;+/g, ';')

  return parseNavestidlo(sanitized);

}


function parseNavestidlo(input: string) : Navestidlo | null {
  const parts = nullOrArray( input.split(/\|(?![^\[]*])/).map(parsePart) );
  if (parts === null) return null;
  return navestidlo(...parts as Part[]);
}

function parsePart(input: string): Part | null {
  const raw = input.split(/;(?![^\[]*])/)
    .map(parseModule)
    .flatMap(a => Array.isArray(a) ? a : [ a ]);

  const modules = nullOrArray(raw);

  if (modules === null) return null
  return part(...modules as Module[]);
}


const BULB_OPTIONS: StatePartsingOptions = { empty: true, full: true, unknown: true, number: true, letter: true };
const LINE_OPTIONS: StatePartsingOptions = { empty: true, full: true };
const MATRIX_OPTIONS: StatePartsingOptions = { unknown: true, line: true, number: true, letter: true, icon: true, noEmptyShapeString: true };

const BACKWARD_COMPATIBILITY: Record<string, string> = {
  "Ymatrix": "matrixY",
  "Wmatrix": "matrixW",
  "-": "_"
}

function parseModule(input: string): Module | Module[] | null {

  if (input in BACKWARD_COMPATIBILITY)
    input = BACKWARD_COMPATIBILITY[input];

  if (input === "")
    return null;

  if (/^[1-9]$/.test(input)) {
    return new Array(parseInt(input)).fill(module.bulb());
  }

  const types = [
    ["line", LINE_OPTIONS, module.line],
    ["l", LINE_OPTIONS, module.line],
    ["matrix", MATRIX_OPTIONS, module.matrix],
    ["m", MATRIX_OPTIONS, module.matrix],
    ["bulb", BULB_OPTIONS, module.bulb],
    ["b", BULB_OPTIONS, module.bulb],
    ["", BULB_OPTIONS, module.bulb],
  ] as const;

  for (const [prefix, options, creator] of types) {
    if ( input.length < prefix.length || !input.startsWith(prefix) )
      continue;

    const states = parseStates(input.substring(prefix.length), options);
    if (states === null) return null;
    return creator(...states as any);
  }

  return null;
}



function parseStates(input: string, options: StatePartsingOptions): State[] | null {

  if (input === "" || input === "?")
    return [ ];

  if (input[0] == "[" && input[input.length - 1] == "]") {
    const states = input
      .substring(1, input.length - 1)
      .split(";")
      .map(state => parseState(state, options))

    return nullOrArray(states);
  }

  const color = parseColor(input[0]);
  if (color && input[1] == "[" && input[input.length - 1] == "]") {
    const states = input
      .substring(2, input.length - 1)
      .split(";")
      .map(shape => parseShape(color, shape, {...options, noEmptyShapeString: true}));

    return nullOrArray(states);
  }

  return nullOrArray([ parseState(input, {...options, noEmptyShapeString: false }) ]);
}


function parseState(input: string, options: StatePartsingOptions): State | null {

  if (options.empty && input === "_")
    return state.empty();

  const color = parseColor(input[0]);
  if (color === null)
    return null;

  return parseShape(color, input.substring(1), options);

}

function parseColor(input: string): Color|Question | null {

  if (/^[?YGRWB]$/.test(input))
    return input as Color|Question;

  return null;

}

function parseShape(color: Color|Question, input: string, options: StatePartsingOptions): Exclude<State, StateEmpty> | null {

  if (options.noEmptyShapeString && input === "")
    return null;

  if (options.full && input === "")
    return state.full(color);

  if (options.line && (input === "line" || input === "l"))
    return state.line(color);

  if (options.number && /^[1-9]?[0-9]$/.test(input))
    return state.number(color, input as Digits);

  if (options.letter && /^[A-Z]$/.test(input))
    return state.letter(color, input as Letter);

  if (options.icon)
    switch (input) {
      case "cross":
      case "x":
        return state.icon(color, "cross");

      case "humping":
      case "^":
        return state.icon(color, "humping");
    }

  if (options.unknown && (input === "" || input === "?"))
    return state.unknown(color);

  return null;

}

function nullOrArray<T>(array: (T|null)[]): T[]|null {
  if (array.some(item => item === null))
    return null;
  return array as T[];
}

(window as any).parse = parse;
