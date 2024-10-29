import {
  CrowdFundProjectSummary,
  ReadCrowdFundProjectRequest,
} from "../models/ProjectModel";
import { handle401Exception } from "./AuthService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = "http://127.0.0.1:8000/crowd_fund_project";

export async function fetchAllProjects() {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(`${API_BASE_URL}`, "GET");
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  const resData: CrowdFundProjectSummary[] = await response.json();
  return resData;
}

export async function fetchProjectById(projectId: number) {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(`${API_BASE_URL}`, "GET");
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  const resData: ReadCrowdFundProjectRequest = await response.json();
  return resData;
}

export async function fetchProjectListByCurrentUser() {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/list/byCurrentUser`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(
        `${API_BASE_URL}/list/byCurrentUser`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  const resData: CrowdFundProjectSummary[] = await response.json();
  return resData;
}
