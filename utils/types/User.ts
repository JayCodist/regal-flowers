import { LocationName } from "./Regal";

export interface Recipient {
  name: string;
  address: string;
  phone: string;
  phoneAlt: string;
  residenceType: string;
  message: string;
  method: "delivery" | "pick-up";
  state: LocationName;
  despatchLocation: string;
  adminNotes: string;
  _id: string;
  altPhoneCountryCode: string;
  phoneCountryCode: string;
}

export default interface User {
  id: string;
  name: string;
  authToken: string;
  gender: string;
  city: string;
  email: string;
  phone: string;
  phoneAlt: string;
  state: string;
  dob: string;
  createdAt: string;
  recipients: Recipient[];
}
