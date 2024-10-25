import { ReadUserRequest, UpdateUserRequest } from "../models/UserModel";
import { handle401Exception } from "./AuthService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = "http://127.0.0.1:8000/user";

export async function getCurrentUser(): Promise<
  ReadUserRequest | null | undefined
> {
  let accessToken: string | null = getAccessToken();

  try {
    let response = await fetch(`${API_BASE_URL}/readCurrentUser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status == 401) {
        response = await handle401Exception(
          `${API_BASE_URL}/readCurrentUser`,
          "GET"
        );
      } else {
        console.error(`Error: (${response.status} ${response.statusText})`);
      }
    }

    if (response.ok) {
      const resData: ReadUserRequest = await response.json();
      return resData;
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
      return null;
    }
  } catch (error) {
    console.error("Network error or fetch error:", error);
  }
}

export async function updateCurrentUser(
  requestBody: UpdateUserRequest,
  userId: number
): Promise<any> {
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
      response = await handle401Exception(
        `${API_BASE_URL}/${userId}`,
        "PUT",
        requestBody
      );
    }
  }

  if (response.ok) {
    const resData = response.json();
    return resData;
  } else {
    console.error(`Error: ${response.status}, ${response.statusText}`);
  }
}
