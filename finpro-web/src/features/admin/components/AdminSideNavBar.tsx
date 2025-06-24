import * as React from 'react';
import { useAdminDashboardNavItems } from '../hooks/useAdminDashboardNavItems';
import Link from 'next/link';


export default function AdminSideNavBar() {
    const {sideNav, pathName } = useAdminDashboardNavItems()
  return (
    <div className="hidden px-4 lg:flex lg:flex-col bg-red-700 text-white">
      <div className="uppercase text-white font-bold text-2xl py-4">admin dashboard</div>
      <div>
        <div className="text-xl font-medium">Main Menu</div>
        <div>
          {sideNav.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={
                "flex items-center gap-2 px-4 py-3 text-white hover:bg-red-500 " +
                (pathName.includes(item.href) || pathName === item.href ? "bg-red-300 !text-red-600 font-semibold" : "")
              }
            >
              <div className="text-2xl">{item.icon}</div>
              <div>{item.name}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}
