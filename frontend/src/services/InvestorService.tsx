import { InvestRequestModel } from "../models/ProjectModel";
import { handle401Exception } from "./AuthService";
import { API_BASE_DOMAIN } from "./CommonService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = `${API_BASE_DOMAIN}/investor`;

export async function fetchCurrentInvestorShareList(): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/current/shareList`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(
        `${API_BASE_URL}/current/shareList`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}
export async function fetchCurrentInvestorBalanceDistribution(): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(
    `${API_BASE_URL}/current/list/investorToProjectsBalanceDistribution`,
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
        `${API_BASE_URL}/current/list/investorToProjectsBalanceDistribution`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function fetchProjectShareDistribution(
  cfp_id: number
): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(
    `${API_BASE_URL}/list/projectInvestorShareDistribution/byProject/${cfp_id}`,
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
        `${API_BASE_URL}/list/projectInvestorShareDistribution/byProject/${cfp_id}`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function fetchInvestorListHttpRequest(
  cfp_id: number
): Promise<Response> {
  let accessToken = getAccessToken();
  let response: Response = await fetch(
    `${API_BASE_URL}/list/investor/byProject/${cfp_id}`,
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
        `${API_BASE_URL}/list/investor/byProject/${cfp_id}`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function investHttpRequest(
  investRequest: InvestRequestModel,
  projectId: number
) {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/invest/${projectId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(investRequest),
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(
        `${API_BASE_URL}/invest/${projectId}`,
        "PUT",
        investRequest
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}
