export enum EPaymentType {
  BANK_TRANSFER = "BANK_TRANSFER",
  PAYMENT_GATEWAY = "PAYMENT_GATEWAY",
}

export interface IPendingPayment {
  firstName: string | null;
  lastName: string | null;
  orderId: string;
  numberOfProducts: number;
  totalAmount: number;
}
