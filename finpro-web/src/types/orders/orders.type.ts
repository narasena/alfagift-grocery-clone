export type OrderCardProps = {
  orderId: string;
  createdAt: string;
  latestStatus: string;
  firstName: string;
  lastName: string;
  numberOfProducts: number;
  finalTotalAmount: number;
  onDetailClick?: () => void; // optional, or you can handle inside
};
