export interface IOrderCards {
  orderId: string;
  createdAt: string;
  latestStatus: string;
  firstName: string;
  lastName: string;
  numberOfProducts: number;
  finalTotalAmount: number;
  onDetailClick?: () => void; // optional, or you can handle inside
}

export interface IOrder {
  id: string;
  userId: string;
  storeId: string;
  shippingAddressId: string;
  totalAmount: number;
  discountedTotalAmount: number;
  finalTotalAmount: number;
  shippingCost: number;
  discountedshippingCost: number;
  finalshippingCost: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IOrderDetails extends IOrder {
  orderHistories: IOrderHistory[];
}

export interface IOrderItemDetails {
  id: string;
  orderId: string;
  productId: string;
  discountId?: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IOrderHistory {
  id: string;
  orderId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum EOrderStatus {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_FOR_CONFIRMATION = "WAITING_FOR_CONFIRMATION",
  PROCESSING = "PROCESSING",
  DELIVERING = "DELIVERING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
}
