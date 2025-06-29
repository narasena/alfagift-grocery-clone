import { IAdmin } from "@/types/admins/admin.type";
import apiInstance from "@/utils/api/apiInstance";
import * as React from "react";

export const useAllAdmins = () => {
  const [admins, setAdmins] = React.useState<IAdmin[]>([]);

  const getAllAdmins = async () => {
    try {
      const response = await apiInstance.get("/admins");
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  React.useEffect(() => {
    getAllAdmins();
  }, []);

  return {
    admins,
    refetch: getAllAdmins,
  };
};
