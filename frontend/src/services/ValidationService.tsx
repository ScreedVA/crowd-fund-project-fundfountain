import { ObjectUtils } from "primeng/utils";
import {
  CreateCFProjectModel,
  UpdateCFProjectModel,
} from "../models/ProjectModel";
import { CreateUserModel, UpdateUserModel } from "../models/UserModel";

export function validateCreateCFProjectModel(
  formDataModel: CreateCFProjectModel
) {
  const errors: any = {};

  if (!formDataModel.name) errors.name = "Name is required";
  else if (formDataModel.name.length < 3)
    errors.name = "Name must be alteast 3 characters";
  if (!formDataModel.description) errors.description = "Description is requred";
  else if (formDataModel.description.length < 3)
    errors.description = "Description must be alteast 3 characters";
  if (!formDataModel.fundGoal) errors.fundGoal = "Fund Goal is required";
  if (!formDataModel.unitPrice) errors.unitPrice = "Unit Price is required";
  if (!formDataModel.startDate) errors.startDate = "Start Date is required";
  if (!formDataModel.lastDate) errors.lastDate = "Last Date is required";
  if (!formDataModel.status) errors.status = "Status is required";
  if (!formDataModel.fundingModel)
    errors.fundingModel = "Funding Model is required";

  if (formDataModel.fundGoal < 5000)
    errors.fundGoal = "Fund Goal must be atleast 5000";
  if (formDataModel.unitPrice < 1000)
    errors.unitPrice = "Unit Price must be atleast 1000";
  else if (formDataModel.fundGoal <= formDataModel.unitPrice) {
    errors.fundGoal = "Unit Price must not exceed Fund Goal";
    errors.unitPrice = "Unit Price must not exceed Fund Goal";
  }
  if (new Date(formDataModel.startDate) > new Date(formDataModel.lastDate)) {
    errors.startDate = "Start date must not exceed Last date";
    errors.lastDate = "Start date must not exceed Last date";
  }

  return errors;
}

export function validateUpdateCFProjectModel(
  formDataModel: UpdateCFProjectModel
) {
  const errors: any = {};

  if (!formDataModel.name) errors.name = "Name is required";
  else if (formDataModel.name.length < 3)
    errors.name = "Name must be alteast 3 characters";
  if (!formDataModel.description) errors.description = "Description is requred";
  else if (formDataModel.description.length < 3)
    errors.description = "Description must be alteast 3 characters";

  return errors;
}

export function validateCreateUserModel(formDataModel: CreateUserModel) {
  const errors: any = {};

  if (!formDataModel.username) errors.username = "Username is required";
  else if (formDataModel.username.length < 3) {
    errors.username = "Username must be atleast 3 characters";
  }

  if (!formDataModel.email) errors.email = "Email is required";

  if (!formDataModel.firstName) errors.firstName = "First name is required";
  else if (formDataModel.firstName.length < 3) {
    errors.firstName = "First name must be atleast 3 characters";
  }

  if (!formDataModel.lastName) errors.lastName = "Last name is required";
  else if (formDataModel.lastName.length < 3) {
    errors.lastName = "Last name must be atleast 3 characters";
  }

  if (!formDataModel.dateOfBirth) errors.dateOfBirth = "Date of birth required";

  if (!formDataModel.password) errors.password = "Password is required";

  return errors;
}

export function validateUpdateUserModel(formDataModel: UpdateUserModel) {
  const errors: any = {};

  if (!formDataModel.username) errors.username = "Username is required";
  else if (formDataModel.username.length < 3) {
    errors.username = "Username must be atleast 3 characters";
  }
  if (!formDataModel.email) errors.email = "Email is required";

  if (!formDataModel.firstName) errors.firstName = "First name is required";
  else if (formDataModel.firstName.length < 3) {
    errors.firstName = "First name must be atleast 3 characters";
  }
  if (!formDataModel.lastName) errors.lastName = "Last name is required";
  else if (formDataModel.lastName.length < 3) {
    errors.lastName = "Last name must be atleast 3 characters";
  }
  if (!formDataModel.dateOfBirth) errors.dateOfBirth = "Date of birth required";

  return errors;
}
