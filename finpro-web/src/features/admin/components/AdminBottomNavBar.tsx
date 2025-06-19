import * as React from 'react';
import { useAdminDashboardNavItems } from '../hooks/useAdminDashboardNavItems';
import Link from 'next/link';

export default function AdminBottonNavBar() {
    const {bottomNav, pathName} = useAdminDashboardNavItems()
  return (
    <div className="lg:hidden w-full h-20 bg-red-700 fixed bottom-0 left-0 z-20 flex items-center justify-between">
      {bottomNav.map((item, index) => (
        <div
          key={index}
          className={
            "w-1/5 h-full flex flex-col items-center justify-center " + (pathName === item.href ? "bg-red-500" : "")
          }
        >
          <Link href={item.href} className="text-white text-sm font-medium flex flex-col items-center justify-center">
            <div className="text-3xl">{item.icon}</div>
            <div>{item.name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
