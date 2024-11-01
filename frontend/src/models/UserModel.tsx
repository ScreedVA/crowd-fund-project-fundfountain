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
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  isAdmin: boolean;
  back_account_balance?: number;
}

export interface CreateUserRequest extends UserBaseModel {
  password: string;
  location?: CreateLocationRequest;
}

export interface ReadUserRequest extends UserBaseModel {
  id: number;
  location?: ReadLocationRequest;
}

export interface UpdateUserRequest extends UserBaseModel {
  location?: UpdateLocationRequest;
}

export interface LoginUserRequest {
  username: string;
  password: string;
}
