export type OrderCardProps = {
  orderId: string;
  createdAt: string;
  latestStatus: string;
  firstName: string;
  lastName: string;
  numberOfProducts: number;
  finalTotalAmount: number;
  onDetailClick?: (orderId: string) => void; // optional, or you can handle inside
};

export interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: any; // ideally type this properly!
}
