export type Color = "Y"|"G"|"R"|"W"|"B";
export type Question = "?";
export type Digits = `${''|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'}${'0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'}`
export type ColorOrQuestion = Color | Question;

export type Letter = "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z";
export type Icon = "humping" | "cross";



export type HasKind<T extends string> = { kind: T };
export type HasContent<T> = { content: T[] };
export type HasColor<T> = { color: T }
export type HasShape<T> = { shape: T };


export type Navestidlo = HasKind<'navestidlo'> & HasContent<Part>;
export type Part = HasKind<'part'> & HasContent<Module>;

export type Module = ModuleBulb | ModuleLine | ModuleMatrix;
export type ModuleBulb = HasKind<'module-bulb'> & HasContent<BulbState>;
export type ModuleLine = HasKind<'module-line'> & HasContent<LineState>;
export type ModuleMatrix = HasKind<'module-matrix'> & HasContent<MatrixState>;


export type BulbState = StateEmpty | StateFull | StateUnknown |  StateNumber | StateLetter;
export type LineState = StateEmpty | StateFull;
export type MatrixState = StateUnknown | StateNumber | StateLetter | StateLine | StateIcon;


export type State = StateUnknown | StateEmpty | StateFull | StateLine | StateNumber | StateLetter | StateIcon;
export type StateEmpty = HasKind<'state-empty'>;
export type StateFull = HasKind<'state-full'> & HasColor<Color|Question>;
export type StateUnknown = HasKind<'state-unknown'> & HasColor<Color|Question>;
export type StateNumber = HasKind<'state-number'> & HasColor<Color|Question> & HasShape<Digits>;
export type StateLetter = HasKind<'state-letter'> & HasColor<Color|Question> & HasShape<Letter>;
export type StateLine = HasKind<'state-line'> & HasColor<Color|Question>;
export type StateIcon = HasKind<'state-icon'> & HasColor<Color|Question> & HasShape<Icon>;




export const navestidlo = (...parts: Part[]): Navestidlo => ({ kind: 'navestidlo', content: parts });

export const part = (...modules: Module[]): Part => ({ kind: 'part', content: modules });

export const module = {
  bulb: (...states: BulbState[]): ModuleBulb => ({ kind: 'module-bulb', content: states }),
  line: (...states: LineState[]): ModuleLine => ({ kind: 'module-line', content: states }),
  matrix: (...states: MatrixState[]): ModuleMatrix => ({ kind: 'module-matrix', content: states }),
} as const;

export const state = {
  unknown: (color: Color|Question): StateUnknown => ({ kind: 'state-unknown', color: color }),
  empty: (): StateEmpty => ({ kind: 'state-empty' }),
  full: (color: Color|Question): StateFull => ({ kind: 'state-full', color: color }),
  line: (color: Color|Question): StateLine => ({ kind: 'state-line', color: color }),
  number: (color: Color|Question, number: Digits): StateNumber => ({ kind: 'state-number', color: color, shape: number }),
  letter: (color: Color|Question, letter: Letter): StateLetter => ({ kind: 'state-letter', color: color, shape: letter }),
  icon: (color: Color|Question, icon: Icon): StateIcon => ({ kind: 'state-icon', color: color, shape: icon }),
} as const;

