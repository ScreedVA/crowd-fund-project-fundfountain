import {
  CreateLocationRequest,
  ReadLocationRequest,
  UpdateLocationRequest,
} from "./LocationModel";

export interface tokenModel {
  access_token: string;
  refresh_token: string;
  bearer: string;
}

interface UserBaseModel {
  username: string;
  email: string;
  biography: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface ReadUserSummaryModel {
  id: number;
  username: string;
  isAdmin: boolean;
  biography: string;
}

export interface CreateUserModel extends UserBaseModel {
  password: string;
  location?: CreateLocationRequest;
}

export interface ReadUserModel extends UserBaseModel {
  id: number;
  isAdmin: boolean;
  back_account_balance?: number;
  location?: ReadLocationRequest;
}

export interface UpdateUserModel extends UserBaseModel {
  location?: UpdateLocationRequest;
}

export interface LoginUserRequest {
  username: string;
  password: string;
}
