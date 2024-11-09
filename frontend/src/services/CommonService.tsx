import { RevenueEntriesModel } from "../models/RevenueModel";

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

export function getDateRangeAndData(revenueEntries: RevenueEntriesModel[]) {
  // Flatten all dates from all projects into one array

  const allDates = revenueEntries.map((project) => project.dateList).flat();

  // Convert all dates to timestamps and find min and max
  const minDate = new Date(
    Math.min(...allDates.map((date) => new Date(date).getTime()))
  );
  console.log(`minDate: ${minDate}`);
  const maxDate = new Date(
    Math.max(...allDates.map((date) => new Date(date).getTime()))
  );
  console.log(`maxDate: ${maxDate}`);

  // Create an array of dates from minDate to maxDate
  const dateArray: string[] = [];
  let currentDate = minDate;
  while (currentDate <= maxDate) {
    dateArray.push(new Date(currentDate).toISOString().split("T")[0]); // Format as YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1); // Move to next day
  }

  return { dateArray, minDate, maxDate };
}
