import * as React from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';
import { HiSquares2X2 } from 'react-icons/hi2';
import { HiMiniSquaresPlus } from 'react-icons/hi2';
import { HiMiniPencilSquare } from 'react-icons/hi2';
import Link from 'next/link';

export default function AdminProductPage() {
  const adminProductMenus = [
    {
      title: 'Products',
      icon: <HiSquares2X2 />,
      subMenus: [
        { title: 'Add Product', href: '/products/add', icon: <HiMiniSquaresPlus /> },
        { title: 'Edit Product', href: '', icon: <HiMiniPencilSquare /> },
      ],
    },
    {
      title: 'Categories',
      icon: <HiSquares2X2 />,
      subMenus: [
        { title: 'Add Category', href: '', icon: <HiMiniSquaresPlus /> },
        { title: 'Edit Category', href: '', icon: <HiMiniPencilSquare /> },
      ],
    },
    {
      title: 'Brands',
      icon: <HiSquares2X2 />,
      subMenus: [
        { title: 'Add Brand', href: '', icon: <HiMiniSquaresPlus /> },
        { title: 'Edit Brand', href: '', icon: <HiMiniPencilSquare /> },
      ],
    },
    {
      title: 'Inventories',
      icon: <HiSquares2X2 />,
      subMenus: [
        { title: 'Add Product Stock', href: '', icon: <HiMiniSquaresPlus /> },
        { title: 'Edit Inventory', href: '', icon: <HiMiniPencilSquare /> },
      ],
    },
  ];
  return (
    <div className='my-4'>
      {adminProductMenus.map((menu, index) => (
        <>
          <div
            key={index}
            className='flex items-center justify-between max-w-full h-max text-white bg-red-600 px-4 py-2 mx-1 rounded-sm mb-2'>
            <div>{menu.title}</div>
            <div>
              <TiArrowSortedDown />
            </div>
          </div>
          <div className='px-6 py-2 grid max-sm:grid-cols-2 gap-4'>
            {menu.subMenus.map((subMenu, subIndex) => (
              <Link key={subIndex} href={subMenu.href} className='flex items-center gap-4 text-red-900 bg-red-300 border-2 border-red-700 px-4 py-2 rounded-md'>
                <div className='text-2xl'>{subMenu.icon}</div>
                <div>{subMenu.title}</div>
              </Link>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}
