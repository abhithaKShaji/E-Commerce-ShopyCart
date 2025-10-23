export interface Address {
  id: string;
  name: string;
  number: string;
  street: string;
  town: string;
  city: string;
  pincode: string;
  state: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  Name: string;
  Email: string;
  Number: string;
}
