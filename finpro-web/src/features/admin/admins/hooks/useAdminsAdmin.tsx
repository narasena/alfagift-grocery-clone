import { IAdmin } from "@/types/admins/admin.type";
import * as React from "react";
import { HiUserGroup } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";
import { useAllAdmins } from "./useAllAdmins";
import { useAllStores } from "@/hooks/stores/useAllStores";
import AdminTable from "../../components/AdminTable";
import { useAllUsers } from "./useAllUsers";
import { IUser } from "@/types/users/user.type";

export const useAdminsAdmin = () => {
  const tabHeaders = [
    {
      label: "Admins",
      key: "admins",
      icon: <RiAdminFill />,
    },
    {
      label: "Users",
      key: "users",
      icon: <HiUserGroup />,
    },
  ];
  const [activeTab, setActiveTab] = React.useState<(typeof tabHeaders)[number]["key"]>("admins");

  const { admins, refetch } = useAllAdmins();
  const { users, refecthUsers } = useAllUsers();
  const { stores } = useAllStores();

  const adminTableTitles = [
    { key: "index", label: "No" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "store", label: "In Store" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
    { key: "actions", label: "Actions" },
  ];

  const adminIdIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    admins.forEach((admin) => {
      if (!map.has(String(admin.id))) {
        map.set(String(admin.id), map.size + 1);
      }
    });
    return map;
  }, [admins]);

  const renderAdminsCell = (admin: IAdmin, key: string) => {
    switch (key) {
      case "index":
        return adminIdIndexMap.get(String(admin.id)) || "—";
      case "name":
        return (admin.firstName || "—") + " " + (admin.lastName || "") || "—";
      case "store":
        return stores.find((store) => store.id === admin.storeId)?.name || "—";
      case "createdAt":
        return (
          new Date(admin.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) || "—"
        );
      case "updatedAt":
        return (
          new Date(admin.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) || "—"
        );
      case "actions":
        return (
          <>
            <button className="btn btn-sm btn-primary">Edit</button>
            <button className="btn btn-sm btn-danger">Delete</button>
          </>
        );
      default:
        return String(admin[key as keyof typeof admin]) || "—";
    }
  };

  const userIdIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    users.forEach((user) => {
      if (!map.has(String(user.id))) {
        map.set(String(user.id), map.size + 1);
      }
    });
    return map;
  }, [users]);

  const userTableTitles = [
    { key: "index", label: "No" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "dateOfBirth", label: "Date Of Birth" },
    { key: "isEmailVerified", label: "Email Verified" },
    { key: "referralCode", label: "referralCode" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
    { key: "actions", label: "Actions" },
  ];

  const renderUsersCell = (user: IUser, key: string) => {
    switch (key) {
      case "index":
        return userIdIndexMap.get(String(user.id)) || "—";
      case "name":
        return (user.firstName || "—") + " " + (user.lastName || "") || "—";
      case "isEmailVerified":
        return user.isEmailVerified ? "Yes" : "No";
      case "createdAt":
        return (
          new Date(user.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) || "—"
        );
      case "updatedAt":
        return (
          new Date(user.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) || "—"
        );
      case "actions":
        return (
          <>
            <button className="btn btn-sm btn-primary">Edit</button>
            <button className="btn btn-sm btn-danger">Delete</button>
          </>
        );
      default:
        return String(user[key as keyof typeof user] || "—");
    }
  };

  return {
    admins,
    activeTab,
    setActiveTab,
    tabHeaders,
    adminTableTitles,
    renderAdminsCell,
    users,
    userTableTitles,
    renderUsersCell,
  };
};
