import apiInstance from "@/utils/api/apiInstance";

export const handlePaymentUpload = async (token: string, paymentId: string, imageUrl: string, cldPublicId: string) => {
  const response = await apiInstance.post(
    "/payment/create-image",
    {
      paymentId,
      imageUrl,
      cldPublicId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
