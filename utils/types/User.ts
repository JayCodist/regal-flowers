export interface Recipient {
  name: string;
  address: string;
  phone: string;
  phoneAlt: string;
  residenceType: string;
  message: string;
  method: string;
  state: string;
  despatchLocation: string;
  adminNotes: string;
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
