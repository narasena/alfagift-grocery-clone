import { IProductDetails } from '@/types/products/product.type';
import { CldImage } from 'next-cloudinary';
import * as React from 'react';

interface IAdminProductTableCellDataImageProps {
  imageLink: string
  imageAlt?: string
}

export default function AdminProductTableCellDataImage (props: IAdminProductTableCellDataImageProps) {
  return (
    <div>
      <CldImage
        // src={product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? ""}
        src={props.imageLink}
        width={60}
        height={60}
        alt={props.imageAlt ?? "Product Image"}
      />
    </div>
  );
}
