interface LocationBaseModel {
  street?: string;
  plz?: string;
  city?: string;
  country?: string;
  houseNumber?: string;
}

export interface CreateLocationRequest extends LocationBaseModel {}

export interface ReadLocationRequest extends LocationBaseModel {}

export interface UpdateLocationRequest extends LocationBaseModel {}
