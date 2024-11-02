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
}

export interface CreateUserModel extends UserBaseModel {
  password: string;
  location?: CreateLocationRequest;
}

export interface ReadUserModel extends UserBaseModel {
  id: number;
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
