import { handle401Exception } from "./AuthService";
import { API_BASE_DOMAIN } from "./CommonService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = `${API_BASE_DOMAIN}/revenue`;

export async function fetchRevenueEntriesList(): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(
    `${API_BASE_URL}/current/weekly/entries`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(
        `${API_BASE_URL}/current/weekly/entries`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}
