interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Order {
  orderProducts: OrderItem[];
  paymentStatus: string;
  orderID: number;
  deliveryStatus: string;
  fullOrderId: string;
}
