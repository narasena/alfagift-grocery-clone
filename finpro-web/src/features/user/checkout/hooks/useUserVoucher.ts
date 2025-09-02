
import { IVoucher } from "@/types/vouchers/voucher.type";
import apiInstance from "@/utils/api/apiInstance";
import useAuthStore from "@/zustand/authStore";
import { AxiosError } from "axios";
import * as React from "react";
import { toast } from "react-toastify";

export default function useUserVoucher() {
  const [vouchers, setVouchers] = React.useState<IVoucher[]>([]);
  const token = useAuthStore((state) => state.token);

  const handleGetUserVouchers = async () => {
    try {
      const response = await apiInstance.get("/vouchers/user", { headers: { Authorization: `Bearer ${token}` } });
      setVouchers(response.data.vouchers);
    } catch (error) {
      const errResponse = error as AxiosError<{ message: string }>;
      toast.error(errResponse.response?.data.message);
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (token) {
      handleGetUserVouchers();
    }
  }, [token]);

  return { vouchers };
}
