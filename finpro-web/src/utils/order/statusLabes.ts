export const statusLabels: Record<string, string> = {
  WAITING_FOR_PAYMENT: "Menunggu Pembayaran",
  WAITING_FOR_CONFIRMATION: "Menunggu Konfirmasi",
  PROCESSING: "Sedang Diproses",
  DELIVERING: "Dikirim",
  CONFIRMED: "Selesai",
  CANCELED: "Batal",
};

export const getStatusLabel = (status: string) => statusLabels[status] || status;
