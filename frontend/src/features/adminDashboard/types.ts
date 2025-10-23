
export interface User {
  Name: string;
  Number: string;
  Email: string;
}

export interface OrderStatus {
  status: string;
  total: number;
}

export interface PaymentMethods {
  COD: number;
  Razorpay: number;
}

export interface DashboardData {
  userCount: number;
  orderCount: number;
  productCount: number;
  totalRevenue: number;
  paymentMethods: PaymentMethods;
  orderStatus: OrderStatus[];
  userList: User[];
}
