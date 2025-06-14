import { IProductDetails } from '@/types/products/product.type';
import Link from 'next/link';
import * as React from 'react';


export default function AdminProductTableCellDataEdit (product: IProductDetails) {
  return (
    <div>
      <Link href={`/products/edit/${product.slug}`} className="font-medium text-blue-600 hover:underline">
        Edit
      </Link>
    </div>
  );
}
