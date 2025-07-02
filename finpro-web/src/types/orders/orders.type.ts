import { IAddress } from "../address/address.type";

export interface IOrderCards {
  orderId: string;
  createdAt: string;
  latestStatus: string;
  firstName: string;
  lastName: string;
  numberOfProducts: number;
  finalTotalAmount: number;
  onDetailClick?: (orderId: string) => void; // optional, or you can handle inside
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

export interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: IOrderDetailsResponse; // ideally type this properly!
}


export interface IOrderDetailsResponse {
  orderId: string;
  createdAt: Date;
  orderItems: IOrderItemsDetailsResponse[];
  store: {
    name: string;
    phoneNumber: string;
  };
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  shippingAddress: IAddress; // Type for shippingAddressFull would need to be defined
  totalAmount: number;
  totalDiscount: number;
  totalShippingCost: number;
  totalToBePaid: number;
}

export interface IOrderItemsDetailsResponse {
  id: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  finalPrice: number;
  productName: string;
}