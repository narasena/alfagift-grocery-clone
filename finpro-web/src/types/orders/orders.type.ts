export type OrderCardProps = {
  orderId: string;
  createdAt: string;
  latestStatus: string;
  firstName: string;
  numberOfProducts: number;
  finalTotalAmount: number;
  onDetailClick?: () => void; // optional, or you can handle inside
};

export interface IOrderDetails {
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