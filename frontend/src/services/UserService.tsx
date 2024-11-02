import { ReadUserModel, UpdateUserModel } from "../models/UserModel";
import { handle401Exception } from "./AuthService";
import { API_BASE_DOMAIN } from "./CommonService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = `${API_BASE_DOMAIN}/user`;

export async function getCurrentUser(): Promise<ReadUserModel | undefined> {
  try {
    let accessToken: string | null = getAccessToken();
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
        // console.error(`Error: (${response.status} ${response.statusText})`);
        return;
      }
    }

    if (response.ok) {
      const resData: ReadUserModel = await response.json();
      return resData;
    } else {
      // console.error(`Error: (${response.status} ${response.statusText})`);
      return;
    }
  } catch (error) {
    // console.error("Network error or fetch error:", error);
    return;
  }
}

export async function updateCurrentUser(
  requestBody: UpdateUserModel,
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
