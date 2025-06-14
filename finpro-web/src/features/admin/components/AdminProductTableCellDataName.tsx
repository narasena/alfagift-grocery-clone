import { IProductDetails } from '@/types/products/product.type';
import Link from 'next/link';
import * as React from 'react';


export default function AdminProductTableCellDataName (product: IProductDetails) {
  return (
    <div>
      <Link href={`/p/${product.slug}`} className="text-blue-600 hover:underline hover:font-medium">
        {product.name || "—"}
      </Link>
    </div>
  );
}
