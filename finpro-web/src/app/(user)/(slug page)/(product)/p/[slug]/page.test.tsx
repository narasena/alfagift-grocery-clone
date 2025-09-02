import { render, screen, fireEvent } from "@testing-library/react";
import ProductSlugPage from "./page";
import { useProductDetails } from "@/features/admin/products/hooks/useProductDetails";
import { useProductQuantity } from "@/features/admin/products/hooks/useProductQuantity";
import { useProductBreadcrumbs } from "@/features/admin/products/hooks/useProductBreadcrumbs";
import useCart from "@/features/user/p/hooks/useCart";
import usePickStoreId from "@/hooks/stores/usePickStoreId";
import { IProductDetails } from "@/types/products/product.type";
import { IProductStock } from "@/types/inventories/product.stock.type";
import Image from "next/image";

// Mock the custom hooks
jest.mock("@/features/admin/products/hooks/useProductDetails");
jest.mock("@/features/admin/products/hooks/useProductQuantity");
jest.mock("@/features/admin/products/hooks/useProductBreadcrumbs");
jest.mock("@/features/(user)/p/hooks/useCart");
jest.mock("@/hooks/stores/usePickStoreId");

// Mock next/link and next-cloudinary
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});
jest.mock("next-cloudinary", () => ({
  CldImage: (props: { src: string; alt: string }) => <Image src={props.src} alt={props.alt} />,
}));

const mockProduct: IProductDetails = {
  id: "prod-123",
  name: "HI-COOK Tabung Gas Mini",
  productSubCategoryId: 10,
  price: 25000,
  description: "A handy gas canister.",
  productImage: [
    {
      id: "img-1",
      imageUrl: "image_url_1.jpg",
      productId: "prod-123",
      isMainImage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  productStock: [{ stock: 10, storeId: "store-1", productId: "prod-123" }] as IProductStock[],
  productDiscountHistories: [],
  slug: "hi-cook-tabung-gas-mini",
  productBrand: { id: "brand1", name: "Brand 1", slug: "brand-1", createdAt: new Date(), updatedAt: new Date() },
  productSubCategory: {
    id: 10,
    name: "Sub Category 1",
    slug: "sub-category-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    productCategoryId: 5,
    productCategory: {
      id: 5,
      productCategoryId: 5,
      name: "Category 1",
      slug: "category-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("<ProductSlugPage />", () => {
  const mockHandleAddToCart = jest.fn();
  const mockHandleQuantityChange = jest.fn();
  const mockSetQuantity = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Provide mock return values for the hooks
    (useProductDetails as jest.Mock).mockReturnValue({
      product: mockProduct,
      imageShowing: mockProduct.productImage[0],
      handleImageClick: jest.fn(),
    });

    (useProductQuantity as jest.Mock).mockReturnValue({
      quantity: 1,
      setQuantity: mockSetQuantity,
      handleQuantityChange: mockHandleQuantityChange,
    });

    (useProductBreadcrumbs as jest.Mock).mockReturnValue({
      breadcrumbLinks: [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
      ],
    });

    (useCart as jest.Mock).mockReturnValue({
      cart: [],
      handleAddToCart: mockHandleAddToCart,
      openModal: jest.fn(),
    });

    (usePickStoreId as jest.Mock).mockReturnValue({
      storeId: "store-1",
    });
  });

  it("should render product details correctly", () => {
    render(<ProductSlugPage />);

    // Check if product name, price, and stock are displayed
    expect(screen.getByRole("heading", { name: /HI-COOK Tabung Gas Mini/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Rp\s*25.000/)).toBeInTheDocument();
    expect(screen.getByText(/Stok di toko:/)).toHaveTextContent("Stok di toko: 10");
  });

  it("should call handleQuantityChange when plus/minus buttons are clicked", () => {
    render(<ProductSlugPage />);

    const plusButton = screen.getByTestId("plus-button");
    const minusButton = screen.getByTestId("minus-button");

    fireEvent.click(plusButton);
    expect(mockHandleQuantityChange).toHaveBeenCalledWith("plus");

    fireEvent.click(minusButton);
    expect(mockHandleQuantityChange).toHaveBeenCalledWith("minus");
  });

  it("should call handleAddToCart when the add to cart button is clicked", () => {
    render(<ProductSlugPage />);

    const addToCartButton = screen.getByRole("button", { name: "+ Keranjang" });
    fireEvent.click(addToCartButton);

    expect(mockHandleAddToCart).toHaveBeenCalledTimes(1);
    expect(mockHandleAddToCart).toHaveBeenCalledWith(1, "prod-123", "store-1", mockProduct);
  });

  it("should show 'Stok Habis' and disable the button when stock is zero", () => {
    // Override the mock for this specific test
    (useProductDetails as jest.Mock).mockReturnValue({
      product: { ...mockProduct, productStock: [{ stock: 0, storeId: "store-1", productId: "prod-123" }] },
      imageShowing: mockProduct.productImage[0],
      handleImageClick: jest.fn(),
    });

    render(<ProductSlugPage />);

    const addToCartButton = screen.getByRole("button", { name: "Stok Habis" });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toHaveClass("pointer-events-none", "bg-gray-400");
  });
});
