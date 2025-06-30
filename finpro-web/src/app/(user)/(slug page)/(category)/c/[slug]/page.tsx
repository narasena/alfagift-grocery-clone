'use client'
import { useCategory } from '@/features/(user)/c/hooks/useCategory';
import * as React from 'react';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import Link from 'next/link';

export interface IAppProps {
}

export default function CategorySlugPage(props: IAppProps) {
    const { category, breadcrumbLinks } = useCategory();
    console.log(category);
    console.log(breadcrumbLinks);
  return (
    <div>
      {/* Breadcrumb */}
      <div className="hidden lg:flex lg:border lg:border-gray-100 items-center px-6 py-4 rounded-full w-full shadow-md my-2">
        {breadcrumbLinks.map((link, index) => (
          <React.Fragment key={index}>
            {link.href === '#' ? (
              <span className="text-xs text-gray-500">{link.label}</span>
            ) : (
              <Link href={link.href} className="text-xs text-gray-500 hover:text-red-700">
                {link.label}
              </Link>
            )}
            {index !== breadcrumbLinks.length - 1 && (
              <span className="mx-2 text-red-500">
                <IoIosArrowDroprightCircle />
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
