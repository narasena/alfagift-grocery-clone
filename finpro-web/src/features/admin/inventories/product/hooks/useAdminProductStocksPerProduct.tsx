import { ITableColumn } from "@/features/admin/products/list/components/AdminListTable";
import { useGetProductStocksPerProduct } from "./useGetProductStocksPerProduct";
import { IProductStock } from "@/types/inventories/product.stock.type";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataLink from "@/features/admin/components/AdminProductTableCellDataLink";

export const useAdminProductStocksPerProduct = () => {
    const { productStocks } = useGetProductStocksPerProduct();
    const productStocksListTitle = [
      { key: "image", title: "Image" },
    //   { key: "name", title: "Product Name" },
      { key: "store", title: "Store" },
      { key: "sku", title: "SKU" },
      { key: "stock", title: "Stock" },
      { key: "price", title: "Price" },
      { key: "actions", title: "Actions" },
    ];
    const productStocksListColumnTitles: ITableColumn[] = productStocksListTitle.map(({ key, title }) => ({ key, label: title }));
    const getProductStocksCellValue = (productStock: IProductStock, key: string) => {
        switch (key) {
            case "image":
                return (
                    <AdminProductTableCellDataImage
                        imageLink={productStock.product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? "#"}
                        imageAlt={productStock.product.name}
                    />
                );
            case "store":
                    return (
                    <AdminProductTableCellDataLink
                        hrefLink={`/inventories/store/${productStock.store.id}`}
                        hrefLabel={productStock.store.name}
                    />
                );
            case "actions":
                return <AdminProductTableCellDataLink hrefLink="#" hrefLabel="Edit" />;
            case "sku":
                return productStock.product.sku || "—";
            case 'price':
                return productStock.product.price || "—";
            default:
                return (productStock[key as keyof typeof productStock] as string | number) || "—";
        }
    }
        
    return {
        productStocks,
        productStocksListColumnTitles,
        getProductStocksCellValue
    };
};