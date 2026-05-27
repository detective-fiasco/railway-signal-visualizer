import {Module, Navestidlo, Part} from '../../../dsl/types';

export function generateId() {
  return Math.random().toString(36).substring(2)
}



export type WithIds<T> = T extends object
  ? { id: string } & {
  [K in keyof T]: K extends "content"
    ? T[K] extends Array<infer U>
      ? Array<WithIds<U>>
      : T[K]
    : T[K];
}
  : T;

export function addIds<T>(o: T): WithIds<T> {
  if (typeof o !== 'object' || o === null)
    return o as WithIds<T>;

  const id = "id" in o && typeof o.id === "string" ? o.id : generateId();

  if ("content" in o && Array.isArray(o.content))
    return {
      ...o,
      id,
      content: (o.content as any[]).map(addIds)
    } as WithIds<T>;

  return { ...o, id } as WithIds<T>;
}


export type EdNavestidlo = {
  id: string;
  kind: Navestidlo["kind"]
  content: EdPart[]
}

export type EdPart = {
  id: string;
  kind: Part["kind"]
  content: EdModule[]
}

export type EdModule = WithIds<Module|PlaceholderModule>;

export type PlaceholderModule = {
  kind: "module-placeholder",
}
