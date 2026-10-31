// The refusal error and the small typed readers the line-set reader is built from.
import { tagErrorText } from "@/external/error-text";

export type LineSetRefusalKind = "unreadable" | "missing" | "wrongCount" | "outOfRange";

export class LineSetRefusal extends Error {
  readonly kind: LineSetRefusalKind;
  readonly what: string;

  constructor(kind: LineSetRefusalKind, what: string) {
    super(`${kind}: ${what}`);
    this.name = "LineSetRefusal";
    this.kind = kind;
    this.what = what;
  }
}

export type JsonObject = Record<string, unknown>;
export type Reader<T> = (value: unknown, where: string) => T;

export function refuse(kind: LineSetRefusalKind, what: string): never {
  throw tagErrorText(new LineSetRefusal(kind, what), kind, "literal");
}

export function unreadable(what: string): never {
  return refuse("unreadable", what);
}

/** Own-property lookup, so keys like "constructor" never reach the prototype. */
export function ownValue<T>(object: Readonly<Record<string, T>>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(object, key) ? object[key] : undefined;
}

export function readObject(value: unknown, where: string): JsonObject {
  return typeof value !== "object" || !value || Array.isArray(value)
    ? unreadable(`${where} is not an object`)
    : (value as JsonObject);
}

export function readRequired(object: JsonObject, key: string, where: string): unknown {
  return ownValue(object, key) ?? unreadable(`${where} lacks ${key}`);
}

export function readOptional(object: JsonObject, key: string): unknown {
  return ownValue(object, key) ?? null;
}

export function readNullable<T>(value: unknown, where: string, read: Reader<T>): T | null {
  return value === null ? null : read(value, where);
}

export function readNumber(value: unknown, where: string): number {
  return typeof value !== "number" || !Number.isFinite(value)
    ? unreadable(`${where} is not a number`)
    : value;
}

const WHOLE_NUMBER_LIMIT = 2 ** 63;

export function readWholeNumber(value: unknown, where: string): number {
  const number = readNumber(value, where);
  return !Number.isInteger(number) || number < -WHOLE_NUMBER_LIMIT || number >= WHOLE_NUMBER_LIMIT
    ? unreadable(`${where} is not a whole number`)
    : number;
}

export function readBoolean(value: unknown, where: string): boolean {
  return typeof value === "boolean" ? value : unreadable(`${where} is not true or false`);
}

export function readText(value: unknown, where: string): string {
  return typeof value === "string" ? value : unreadable(`${where} is not text`);
}

export function readWord<W extends string>(value: unknown, where: string, words: readonly W[]): W {
  const text = readText(value, where);
  return (
    words.find((word) => word === text) ?? unreadable(`${where} is a word the set does not know`)
  );
}

export function readList<T>(value: unknown, where: string, read: Reader<T>): T[] {
  return Array.isArray(value)
    ? value.map((item: unknown, index) => read(item, `${where}[${index}]`))
    : unreadable(`${where} is not a list`);
}

export function readRecord<T>(value: unknown, where: string, read: Reader<T>): Record<string, T> {
  const object = readObject(value, where);
  const record: Record<string, T> = Object.create(null);
  for (const key of Object.keys(object)) record[key] = read(object[key], `${where}.${key}`);
  return record;
}

/** Treats a list as a fixed-length tuple; the count is checked once the whole set is read. */
export function asCounted<T extends readonly unknown[]>(list: readonly unknown[]): T {
  return list as unknown as T;
}

/** Length as a plain number, for checking tuples whose types only claim a count. */
export function countOf(list: readonly unknown[]): number {
  return list.length;
}

export const readNumbers: Reader<number[]> = (value, where) => readList(value, where, readNumber);

export function readNumberField(object: JsonObject, key: string, where: string): number {
  return readNumber(readRequired(object, key, where), `${where}.${key}`);
}
