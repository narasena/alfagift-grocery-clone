import * as React from "react";
import { useProductDetails } from "./useProductDetails";

export const useProductBreadcrumbs = () => {
    const {product} = useProductDetails()
    const breadcrumbLinks = React.useMemo(() => {
        return [
          { label: "Home", href: "/" },
          {
            label: product?.productSubCategory.productCategory.name,
            href: `/c/${product?.productSubCategory.productCategory.slug}`,
          },
          {
            label: product?.productSubCategory.name,
            href: `/c/${product?.productSubCategory.slug}`,
          },
          { label: product?.name, href: `#` },
        ];
      }, [product]);
    return {
        breadcrumbLinks,
    }
}