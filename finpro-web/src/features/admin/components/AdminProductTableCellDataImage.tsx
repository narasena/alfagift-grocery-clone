import { IProductDetails } from '@/types/products/product.type';
import { CldImage } from 'next-cloudinary';
import * as React from 'react';

export default function AdminProductTableCellDataImage (product: IProductDetails) {
  return (
    <div>
      <CldImage
        src={product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? ""}
        width={60}
        height={60}
        alt={product.name}
      />
    </div>
  );
}
