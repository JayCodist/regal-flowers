import { Dayjs } from "dayjs";

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
}

export interface Order {
  orderProducts?: OrderItem[];
  paymentStatus?: string;
  orderID?: number;
  deliveryStatus?: string;
  fullOrderId?: string;
  id: string;
  cost: number;
}

export interface CreateOrder {
  orderProducts?: OrderItem[];
  paymentStatus?: string;
  cost?: number;
  client?: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };
  recipient?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    phoneAlt?: string;
  };
  deliveryState?: string;
  pickUpLocation?: string;
  deliveryDate?: Dayjs | string;
  purpose?: string;
  message?: string;
  additionalInfo?: string;
  pickUpState?: string;
}
