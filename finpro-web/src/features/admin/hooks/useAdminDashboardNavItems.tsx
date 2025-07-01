import { HiHome } from "react-icons/hi";
import { BiSolidReport } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import { GrUserAdmin } from "react-icons/gr";
import { RiDiscountPercentFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { FaUsersCog } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaStore } from "react-icons/fa";

export const useAdminDashboardNavItems = () => {
  const bottomNav = [
    { name: "Home", href: "/dashboard", icon: <HiHome /> },
    { name: "Reports", href: "/reports", icon: <BiSolidReport /> },
    { name: "Products", href: "/products", icon: <AiFillProduct /> },
    { name: "Promo", href: "/promos", icon: <RiDiscountPercentFill /> },
    { name: "Admin", href: "/admin", icon: <GrUserAdmin /> },
    { name: "Store", href: "/store", icon: <FaStore /> }
   
  ];
  const sideNav = [
    ...bottomNav,
    { name: "Users", href: "/users", icon: <FaUsersCog /> },
    { name: "Settings", href: "/settings", icon: <IoSettings /> },
  ];
    const pathName = usePathname();
    
    return { bottomNav, sideNav, pathName };
};
