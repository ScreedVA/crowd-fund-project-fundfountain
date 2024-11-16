import { UpdateUserModel } from "../models/UserModel";
import { handle401Exception } from "./AuthService";
import { API_BASE_DOMAIN } from "./CommonService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = `${API_BASE_DOMAIN}/user`;

export async function fetchCurrentUserHttpRequest(): Promise<Response> {
  let accessToken: string | null = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/readCurrentUser`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(`${API_BASE_URL}/readCurrentUser`, "GET");
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function updateCurrentUser(requestBody: UpdateUserModel, userId: number): Promise<Response> {
  let accessToken: string | null = getAccessToken();

  let response: Response = await fetch(`${API_BASE_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(`${API_BASE_URL}/${userId}`, "PUT", requestBody);
    }
  }
  return response;
}
