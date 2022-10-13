interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Order {
  orderItems: OrderItem[];
  paymentStatus: string;
  orderID: number;
  deliveryStatus: string;
}
