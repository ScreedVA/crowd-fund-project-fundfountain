export function isObjectAnyFieldNotEmpty(object: Object): boolean {
  return Object.values(object).some((value) => value !== "");
}
