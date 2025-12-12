export function createEnumGuard<T extends readonly string[]> (list: T) {
return (value: unknown): value is T[number] => {
  return list.includes(value as T[number])
}
}

//it's a factory function which accepts one this -- a tuple of string (list) and return a type-narrowing validator function