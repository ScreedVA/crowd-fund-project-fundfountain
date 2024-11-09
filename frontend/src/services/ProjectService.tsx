import {
  CFProjectSummary,
  CreateCFProjectModel,
  UpdateCFProjectModel,
  ReadCFProjectModel,
  cfpFilterModel,
} from "../models/ProjectModel";
import { handle401Exception } from "./AuthService";
import { getAccessToken } from "./StorageService";
import { API_BASE_DOMAIN } from "./CommonService";
const API_BASE_URL: string = `${API_BASE_DOMAIN}/crowd_fund_project`;

export async function fetchAllProjects(
  filter: cfpFilterModel
): Promise<Response> {
  let accessToken = getAccessToken();

  const params = new URLSearchParams();
  if (filter) {
    if (filter.name) {
      params.append("name", filter.name);
    }
    if (filter.status) {
      params.append("status", filter.status);
    }
    if (filter.fundingModel) {
      params.append("fundingModel", filter.fundingModel); // Maps to `funding_model` via alias in FastAPI
    }
  }

  const url: string = `${API_BASE_DOMAIN}/crowd_fund_project?${params.toString()}`;

  let response: Response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(url, "GET");
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }
  return response;
}

export async function fetchProjectByIdHttpRequest(projectId: number) {
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

  const resData: ReadCFProjectModel = await response.json();
  return resData;
}

export async function fetchProjectListByCurrentUser() {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/current/owner/list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(
        `${API_BASE_URL}/current/owner/list`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  const resData: CFProjectSummary[] = await response.json();
  return resData;
}

export async function fetchInvestorProjectListHttpRequest() {
  let accessToken = getAccessToken();
  let response: Response = await fetch(
    `${API_BASE_URL}/current/investor/list`,
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
        `${API_BASE_URL}/current/investor/list`,
        "GET"
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function createCFProjectHttpRequest(
  requestBody: CreateCFProjectModel
) {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(
        `${API_BASE_URL}`,
        "POST",
        requestBody
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}

export async function updateCFProjectHttpRequest(
  projectId: number,
  requestBody: UpdateCFProjectModel
) {
  let accessToken = getAccessToken();
  let response: Response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    if (response.status == 401) {
      response = await handle401Exception(
        `${API_BASE_URL}/${projectId}`,
        "PUT",
        requestBody
      );
    } else {
      console.error(`Error: (${response.status} ${response.statusText})`);
    }
  }

  return response;
}
