import { handle401Exception } from "./AuthService";
import { API_BASE_DOMAIN } from "./CommonService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = `${API_BASE_DOMAIN}/revenue`;

export async function fetchRevenueEntriesList(numberOfDays: number): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/entries/list/byInvestor/daily/${numberOfDays}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(`${API_BASE_URL}/current/daily/entries/${numberOfDays}`, "GET");
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function fetchRevenueSummary(cfp_id: number): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/summary/byProject/${cfp_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(`${API_BASE_URL}/summary/byProject/${cfp_id}`, "GET");
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function fetchRevenueEntries(cfp_id: number): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/entries/byProject/${cfp_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(`${API_BASE_URL}/entries/byProject/${cfp_id}`, "GET");
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}
