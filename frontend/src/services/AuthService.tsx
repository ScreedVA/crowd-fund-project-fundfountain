import React, { createContext, useState, useEffect, ReactNode } from "react";
import { CreateUserModel, tokenModel } from "../models/UserModel";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./StorageService";
import { API_BASE_DOMAIN } from "./CommonService";

const API_BASE_URL: string = `${API_BASE_DOMAIN}/auth`;

async function refreshAccessToken(): Promise<string> {
  const responseToken: string | null = getRefreshToken();

  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: responseToken }),
  });

  if (!response.ok) {
    throw new Error(
      `Refresh token expired or invalid, Status: ${response.status}`
    );
  }

  const data = await response.json();

  setAccessToken(data.access_token);

  return data.access_token;
}

export async function handle401Exception(
  retryEndpoint: string,
  methodType: string,
  body?: any
): Promise<any> {
  const refreshSuccess = await refreshAccessToken();

  if (refreshSuccess) {
    let accessToken = getAccessToken();
    let options: any = {
      method: methodType,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    if (methodType == "PUT" || methodType == "POST") {
      options.body = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
    }

    let response: Response = await fetch(retryEndpoint, options);
    return response;
  } else {
    console.log("Failed to refresh token. Redirect to login");
    return null;
  }
}

export async function RegisterForToken(
  createUserRequest: CreateUserModel
): Promise<tokenModel> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createUserRequest),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData || "Registration failed");
  }

  const resData: tokenModel = await response.json();
  return resData;
}

export async function LoginForToken(
  loginUserRequst: URLSearchParams
): Promise<tokenModel> {
  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: loginUserRequst.toString(),
  });

  if (!response.ok) {
    throw new Error("Response not okay");
  }

  const resData: tokenModel = await response.json();
  return resData;
}

interface AuthContextType {
  signedIn: boolean;
  login: (access_token: string, refresh_token: string) => void;
  logout: () => void;
}

const defaultContextValue: AuthContextType = {
  signedIn: false,
  login: () => {},
  logout: () => {},
};

interface AuthProviderProps {
  children: ReactNode;
}

// Create a context
export const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider: React.FC<AuthProviderProps> = function ({
  children,
}) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setSignedIn(!!token);
  }, []);

  const login = (access_token: string, refresh_token: string) => {
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setSignedIn(true);
  };

  const logout = () => {
    removeAccessToken();
    removeRefreshToken();
    setSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ signedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
