export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface DeliveryDetails {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = "placed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  _id: string;
  deliveryDetails: DeliveryDetails;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  status: OrderStatus;
}
