"use client";
import apiInstance from "@/utils//api/apiInstance";
import { IProductDetails } from "@/types/products/product.type";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import * as React from "react";
import { FaShippingFast } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import AppsInfoComponent from "./components/AppsInformation";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { HiOutlineMinusSm, HiOutlinePlusSm } from "react-icons/hi";
import { useProductDetails } from "@/features/(user)/p/hooks/useProductDetails";
import { useProductQuantity } from "@/features/(user)/p/hooks/useProductQuantity";
import { useProductBreadcrumbs } from "@/features/(user)/p/hooks/useProductBreadcrumbs";

import { HiOutlineShoppingCart } from "react-icons/hi";

import useCart from "@/features/(user)/p/hooks/useCart";
// import useGetProductDetails from "@/features/(user)/p/hooks/useGetProductDetails";

export default function ProductSlugPage() {
  const { product, imageShowing, handleImageClick } = useProductDetails();
  const { quantity, setQuantity, handleQuantityChange } = useProductQuantity();
  const { breadcrumbLinks } = useProductBreadcrumbs();

  const { cart, handleAddToCart } = useCart(); // to add items to cart
  const testDescription = {
    list: [
      "Tabung gas mini isi ulang dari HI-COOK",
      "Ramah lingkungan & tahan lama",
      "Aman & mudah digunakan",
      "Tersedia dalam kemasan kaleng isi 230 gr",
    ],
    product: "HI-COOK Tabung Gas Mini",
    short:
      "Kegiatan masak-memasak menjadi lancar sesuai harapan karena kompor selalu mendapat suplai gas yang mencukupi berkat HI-COOK Tabung Gas Mini",
    long: "merupakan tabung gas ukuran mini yang diciptakan khusus untuk memenuhi kebutuhan anda. Dapat untuk diaplikasikan pada kompor gas tipe mini atau alat-alat lainnya. Cocok untuk digunakan sebagai peralatan bekal memasak ketika aktivitas berkemah atau aktivitas di luar rumah lainnya. Mempunyai desain mini sehingga sangat praktis dibawa atau ditaruh dimanapun. HI-COOK Tabung Gas Mini sangat memenuhi kebutuhan anda.",
  };

  return (
    <div className="lg:px-2 py-4 bg-white text-gray-600 max-w-[500px] lg:max-w-[1200px] mx-auto flex flex-col max-lg:overflow-x-hidden relative">
      <div className="text-black">
        <button
          onClick={() => document.getElementById("cart").showModal()}
          className="fixed bottom-20 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <HiOutlineShoppingCart className="text-xl" />
          <span className="text-sm font-medium">{cart.length}</span>
        </button>
      </div>
      <dialog id="cart" className="modal">
        <div className="modal-box bg-white">
          <h2 className="text-lg font-bold mb-4">Keranjang</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Keranjang masih kosong.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="border-b pb-2 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x{" "}
                      {item.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  <div className="text-right font-semibold text-gray-800">
                    {(item.price * item.quantity).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </div>
                </div>
              ))}

              {/* Total Price */}
              <div className="pt-2 mt-2 border-t flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {cart
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                </span>
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* Breadcrumb */}
      <div className="hidden lg:flex lg:border lg:border-gray-100 items-center px-6 py-4 rounded-full w-full shadow-md my-2">
        {breadcrumbLinks.map((link, index) => (
          <React.Fragment key={index}>
            <Link href={link.href} className="text-xs text-gray-500 hover:text-red-700">
              {link.label}
            </Link>
            {index !== breadcrumbLinks.length - 1 && (
              <span className="mx-2 text-red-500">
                <IoIosArrowDroprightCircle />
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-[auto_1fr_auto] lg:w-full lg:my-10 lg:px-4 lg:[&>*]:px-2">
        {/* Product Images */}
        <div className="flex lg:flex-col justify-center mx-auto h-fit">
          {imageShowing && "imageUrl" in imageShowing ? (
            <CldImage width={400} height={400} src={imageShowing.imageUrl} alt={product?.name || "Product image"} />
          ) : (
            <div className="size-[400px] bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="hidden lg:flex gap-2 justify-left items-center">
            {product?.productImage.map((image, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(image)}
                className={
                  imageShowing && "id" in imageShowing && imageShowing.id === image.id
                    ? "border-2 border-red-700 rounded-md overflow-hidden"
                    : ""
                }
              >
                <CldImage width={60} height={60} src={image.imageUrl} alt={product?.name ?? ""} />
              </div>
            ))}
          </div>
        </div>
        {/* Product Information */}
        <div className="lg:flex lg:flex-col lg:gap-2 lg:max-w-[450px]">
          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="p-2 text-xl lg:text-2xl lg:font-bold text-black">{product?.name}</h1>
            <div className="flex flex-col gap-2 mx-4 p-2 rounded-md shadow-md">
              <div className="flex items-center gap-2">
                <IoStorefrontOutline className="text-2xl" />
                <p>{`Brand :`}</p>
                <Link href={"#"}>{`BRAND >`}</Link>
              </div>
              <div className="flex items-center gap-2">
                <FaShippingFast className="text-2xl" />
                <p>Pengiriman Instan</p>
              </div>
            </div>
          </div>
          {/* Product Price */}
          <div className="px-3">
            <h1 className="text-2xl text-red-700 font-bold py-2">
              {product?.price.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
            </h1>
          </div>
          {/* Product Discount */}
          <div className="px-3 flex items-center gap-2">
            <div className="px-2 py-1 size-max rounded-md bg-amber-600 font-medium text-sm text-white">{`6 %`}</div>
            <div className="text-xs text-gray-600 line-through">
              {Number(28200).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
            </div>
          </div>
          {/* Line Divider */}
          <div className="px-3 my-6 border border-gray-200 w-full"></div>

          {/* Product Description */}
          <div>
            <h1 className="font-semibold text-base my-3">Deskripsi</h1>
            <div className="px-3 flex flex-col gap-2 text-gray-700 text-[15px]">
              <ul>
                {testDescription.list.map((item, index) => (
                  <li key={index} className="list-disc list-inside">
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-base">{testDescription.product}</h3>
              <p>{testDescription.short}</p>
              <span>
                <p className="font-semibold inline mr-2">{testDescription.product}</p>
                {testDescription.long}
              </span>
            </div>
          </div>
        </div>
        <div className="lg:px-3">
          <div className="lg:flex lg:flex-col lg:px-6 lg:py-6 lg:gap-2 lg:rounded-lg lg:bg-gray-50 lg:shadow-md lg:size-max w-full">
            {/* Product Add to Cart */}
            <div className="flex max-lg:justify-between max-lg:items-center gap-4 lg:flex-col max-lg:fixed max-lg:bottom-0 max-lg:px-4 max-lg:py-2 max-lg:w-[500px] max-lg:shadow-[0_-.1rem_1rem_rgba(0,0,0,.15)] max-lg:bg-white">
              <div className="flex max-lg:flex-col max-lg:gap-2 items-center justify-between">
                <h3 className="font-normal text-gray-400 text-sm">Jumlah Pembelian</h3>
                <div className="flex items-center gap-1">
                  <div
                    className={`p-1 border border-gray-300 cursor-pointer rounded-lg active:ring-2 active:ring-gray-300 active:bg-gray-400 group ${
                      quantity === 1 && "pointer-events-none bg-gray-300"
                    }`}
                    onClick={() => handleQuantityChange("minus")}
                  >
                    <HiOutlineMinusSm
                      className={`text-blue-700 hover:text-gray-500 group-active:text-gray-500 ${
                        quantity === 1 && "text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="w-12 border-b border-gray-400">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1) {
                          setQuantity(value);
                        }
                      }}
                      min={1}
                    />
                  </div>
                  <div
                    className="p-1 border border-gray-300 cursor-pointer rounded-lg active:ring-2 active:ring-gray-300 active:bg-gray-400 group "
                    onClick={() => handleQuantityChange("plus")}
                  >
                    <HiOutlinePlusSm className="text-blue-700 hover:text-gray-600 group-active:text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <button
                  onClick={() => handleAddToCart(product!, quantity)}
                  className="w-full text-white font-medium text-lg py-2 rounded-md flex items-center justify-center bg-red-700 cursor-pointer active:ring-4 active:ring-blue-300"
                >
                  {`+ Keranjang`}
                </button>
              </div>
            </div>
            {/* Divider */}
            <div className="my-2 border-b border-gray-200 w-full"></div>

            {/* Product Delivery */}
            <div className="flex flex-col">
              <h1 className="font-semibold text-base mb-3">Pengiriman</h1>
              <div className="flex flex-col gap-2 max-lg:mx-4 max-lg:p-2 max-lg:rounded-md max-lg:shadow-md lg:text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MdDeliveryDining className="text-2xl text-gray-400" />
                  <p>{`Dikirim oleh `}</p>
                  <Link className="font-semibold" href={"#"}>{`SAPA Instant Delivery`}</Link>
                </div>
                <div className="flex items-center gap-2">
                  <RiMoneyDollarCircleFill className="text-2xl text-gray-400" />
                  <p>
                    Biaya Pengiriman <b>Gratis</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Apps Information */}
      <AppsInfoComponent />
    </div>
  );
}
