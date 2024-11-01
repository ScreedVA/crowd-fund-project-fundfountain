export const API_BASE_DOMAIN: string = "http://127.0.0.1:8000";

export function isObjectAnyFieldNotEmpty(object: Object): boolean {
  return Object.values(object).some((value) => value !== "");
}

export function isLocationField(field: any) {
  const isLocationField = [
    "street",
    "plz",
    "city",
    "country",
    "houseNumber",
  ].includes(field);
  return isLocationField;
}
