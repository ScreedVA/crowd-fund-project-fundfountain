export const API_BASE_DOMAIN: string = "http://127.0.0.1:8000";

export function isObjectAnyFieldNotEmpty(object: Object): boolean {
  return Object.values(object).some((value) => value !== "");
}
