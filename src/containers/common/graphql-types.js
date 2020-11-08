export class CreateUpdateAddressDto {
  id: number;

  type: number;

  fullAddress: string;

  subArea: string;

  locality: string;

  city: string;

  state: string;

  country: string;

  landmark: string;

  postalCode: number;

  latitude: number;

  longitude: number;

  verified: boolean;
}
