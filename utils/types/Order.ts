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
  deliveryDate: string;
}

export interface CreateOrder {
  orderProducts: OrderItem[];
  paymentStatus: string;
  cost: number;
  deliveryDate?: string;
}

export interface UpdateOrder {
  senderName: string;
  senderEmail: string;
  senderPhoneNumber: string;
  senderPassword: string;
  freeAccount: boolean;
  coupon: string;
  deliveryMethod: string;
  deliveryState: string;
  pickUpLocation: string;
  recipientName: string;
  deliveryDate: Dayjs | null;
  recipientPhoneNumber: string;
  recipientPhoneNumberAlt: string;
  residenceType: string;
  recipientHomeAddress: string;
  additionalInfo: string;
  message: string;
  purpose: string;
  cardName: string;
  cardExpiry: string;
  cardNumber: string;
  cardCVV: string;
  recipientCountryCode: string;
  senderCountryCode: string;
  recipientAltCountryCode: string;
  recipientEmail: string;
  pickUpState: string;
}
