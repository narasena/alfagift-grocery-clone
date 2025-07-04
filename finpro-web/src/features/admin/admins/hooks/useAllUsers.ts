import { IUser } from "@/types/users/user.type";
import apiInstance from "@/utils/api/apiInstance";
import * as React from "react";

export const useAllUsers = () => {
  const [users, setUsers] = React.useState<IUser[]>([]);

  const handleGetAllUsers = async () => {
    try {
      const response = await apiInstance.get("/user/all");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  React.useEffect(() => {
    handleGetAllUsers();
  }, []);
  return {
    users,
    refecthUsers: handleGetAllUsers,
  };
};
