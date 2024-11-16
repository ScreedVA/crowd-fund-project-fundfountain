import { ContentDispositionFilterModel } from "../models/FileModel";
import { handle401Exception } from "./AuthService";
import { API_BASE_DOMAIN } from "./CommonService";
import { getAccessToken } from "./StorageService";

const API_BASE_URL: string = `${API_BASE_DOMAIN}/file`;

export async function fetchFileDownloadHttpRequest(file_id: number, filter: ContentDispositionFilterModel) {
  let accessToken = getAccessToken();

  const params = new URLSearchParams();
  if (filter) {
    if (filter.content_disposition) {
      params.append("content_disposition", filter.content_disposition);
    }
  }

  const url: string = `${API_BASE_URL}/download/${file_id}?${params.toString()}`;

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

  // Parse response for download
  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition");
  const filename = contentDisposition
    ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") // Extract filename
    : `download_${file_id}`; // Fallback filename

  // Trigger download
  const urlBlob = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename || "downloaded_file";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(urlBlob);
}
