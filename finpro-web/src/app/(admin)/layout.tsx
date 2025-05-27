'use client';
import Link from 'next/link';
import * as React from 'react';
import { HiHome } from 'react-icons/hi';
import { BiSolidReport } from 'react-icons/bi';
import { AiFillProduct } from 'react-icons/ai';
import { GrUserAdmin } from 'react-icons/gr';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const bottomNav = [
    { name: 'Home', href: '/dashboard', icon: <HiHome /> },
    { name: 'Reports', href: '/reports', icon: <BiSolidReport /> },
    { name: 'Products', href: '/products', icon: <AiFillProduct /> },
    { name: 'Discounts', href: '/discounts', icon: <RiDiscountPercentFill /> },
    { name: 'Admin', href: '/admin', icon: <GrUserAdmin />  },
  ];
  const pathName = usePathname();
  return (
    <div className='relative overflow-x-hidden w-full h-screen bg-white'>
      {children}
      <div className='w-full h-20 bg-red-700 sticky bottom-0 left-0 z-20 flex items-center justify-between'>
        {bottomNav.map((item, index) => (
          <div key={index} className={'w-1/5 h-full flex flex-col items-center justify-center '+ (pathName === item.href ? 'bg-red-500' : '')}>
            <Link href={item.href} className='text-white text-sm font-medium flex flex-col items-center justify-center'>
              <div className='text-3xl'>{item.icon}</div>
              <div>{item.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
