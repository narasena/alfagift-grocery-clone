"use client";
import { IoTrashOutline } from "react-icons/io5";
import { BsStopwatch } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import useCartItems from "@/features/user/cart/hooks/useCartItems";
import * as React from "react";
import Link from "next/link";
import { HiOutlineMinusSm, HiOutlinePlusSm } from "react-icons/hi";
import { EDiscountType } from "@/types/discounts/discount.type";

// refactoring:
// kalo component global, dipake di semua page
// features buat hooks, schemas

// mobile tambahin Kirim ke: Alamat
// di atas line paling atas, di atas clear all button

// display cart items
// delete item
// delete all items
// update quantity

export default function CartPage() {
  const {
    cartItems,
    mainAddress,
    loading,
    isSummaryOpen,
    setIsSummaryOpen,
    isDeleting,
    setIsDeleting,
    itemToDelete,
    handleDeleteAllCartItems,
    handleDeleteCartItem,
    openClearAllModal,
    closeClearAllModal,
    openClearItemModal,
    closeClearItemModal,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    subTotal,
    discountInPrice,
    finalPrice,
  } = useCartItems();
  console.log(cartItems);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between py-8">
      {/* Modal */}
      <dialog id="clear_all" className="modal">
        <div className="modal-box bg-white text-black rounded-lg w-fit">
          <p className="text-center">Produk pada keranjang Anda akan dihapus semua</p>
          <div className="modal-action flex justify-center gap-x-4">
            <form method="dialog">
              {/* Cancel button closes the modal */}
              <button
                className="btn w-28 border-red-600 bg-white text-red-600 shadow-none rounded-lg text-lg"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </form>
            {/* clear all ok and then close */}
            <button
              className="btn w-28 shadow-none rounded-lg text-lg bg-red-600 border-red-600 text-white"
              onClick={async () => {
                setIsDeleting(true);
                await handleDeleteAllCartItems();
                setIsDeleting(false);
                closeClearAllModal();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "OK"}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="clear_item" className="modal">
        <div className="modal-box bg-white text-black rounded-lg w-fit">
          <p className="text-center">Hapus produk ini dari keranjang?</p>
          <div className="modal-action flex justify-center gap-x-4">
            <form method="dialog">
              {/* Cancel button closes the modal */}
              <button className="btn w-28 border-red-600 bg-white text-red-600 shadow-none rounded-lg text-lg">
                Cancel
              </button>
            </form>
            {/* clear item button */}
            <button
              className="btn w-28 shadow-none rounded-lg text-lg bg-red-600 border-red-600 text-white"
              onClick={async () => {
                if (!itemToDelete) return;
                setIsDeleting(true);
                await handleDeleteCartItem(itemToDelete);
                setIsDeleting(false);
                closeClearItemModal();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </dialog>
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
            {/* Hide "Cart" heading on mobile */}
            <h1 className="hidden md:block text-2xl font-semibold text-gray-700 mb-5">Keranjang</h1>
            <div className="hidden md:block w-full h-1 bg-gray-100" />
            {/* Shipping Address (Mobile only) */}
            <div className="md:hidden mb-4 pb-4 border-b text-black flex items-center gap-2">
              <FaLocationDot />
              {/* <h3 className="font-semibold text-gray-700 text-sm">Kirim ke:</h3>
              <p className="text-sm text-gray-600">Jl. Contoh No. 123, Jakarta</p> */}
              <div>
                <h3 className="font-semibold text-gray-700 text-sm">Kirim ke:</h3>
                {mainAddress ? (
                  <div className="text-sm text-gray-600">
                    <p>{mainAddress.address}</p>
                    <p>
                      {mainAddress.subDistrict}, {mainAddress.district}
                    </p>
                    <p>
                      {mainAddress.city}, {mainAddress.province} {mainAddress.postalCode}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada alamat utama</p>
                )}
              </div>
            </div>
            {cartItems && cartItems.length > 0 ? (
              <>
                {/* Hapus Semua Button */}
                <button
                  className="px-4 my-6 flex justify-between items-center bg-white text-blue-600 py-2 rounded-lg transition border-2"
                  onClick={openClearAllModal}
                >
                  <div className="pr-2">
                    <IoTrashOutline />
                  </div>
                  Hapus Semua
                </button>

                {/* Pengiriman Instan */}
                <div className="text-black flex items-center gap-2 mb-2">
                  <BsStopwatch className="text-black" />
                  <span>Pengiriman Instan</span>
                </div>

                {/* List of Items */}
                <ul className="space-y-4">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex flex-col md:flex-row md:justify-between gap-4 border rounded p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                        {/* Product Name + Price */}
                        <div className="flex-1">
                          <p className="text-black font-semibold">{item.product.name}</p>
                          <div className="h-5 flex items-center px-">
                            {item.product.productDiscountHistories.length > 0 &&
                              (item.product.productDiscountHistories[0]?.discount.discountType ===
                              EDiscountType.BUY1_GET1 ? (
                                <span className="text-white bg-lime-500 py-0.5 px-1 rounded-md font-bold text-sm h-max">
                                  Beli 1 Gratis 1
                                </span>
                              ) : (
                                <span className="text-xs h-max line-through text-[#999999]">
                                  {item.product.price.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  })}
                                </span>
                              ))}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.product.productDiscountHistories.length > 0 &&
                            item.product.productDiscountHistories[0]?.discount.discountType ===
                              EDiscountType.PERCENTAGE ? (
                              <span className="py-0.5 px-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold">
                                {`${item.product.productDiscountHistories[0]?.discountValue}%`}
                              </span>
                            ) : (
                              item.product?.productDiscountHistories[0]?.discount.discountType ===
                                EDiscountType.FIXED_AMOUNT && (
                                <span className="py-0.5 px-1.5 bg-orange-500 text-white rounded-md text-xs italic font-semibold">{`- Rp ${item.product.productDiscountHistories[0]?.discountValue}`}</span>
                              )
                            )}
                            <p className="text-gray-700 text-base mb-2">
                              {item.product?.productDiscountHistories.length > 0 &&
                              item.product.productDiscountHistories[0]?.discount.discountType !==
                                EDiscountType.BUY1_GET1
                                ? (item.product.productDiscountHistories[0]?.discount.discountType ===
                                  EDiscountType.FIXED_AMOUNT
                                    ? item.product.price - item.product.productDiscountHistories[0]?.discountValue
                                    : item.product.price *
                                      (1 - item.product.productDiscountHistories[0]?.discountValue / 100)
                                  ).toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  })
                                : item.product?.price.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  })}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 md:gap-2">
                          <div
                            className={`p-1 border border-gray-300 cursor-pointer rounded-lg active:ring-2 active:ring-gray-300 active:bg-gray-400 group ${
                              item.quantity === 1 && "pointer-events-none bg-gray-300"
                            }`}
                            onClick={() => decrementQuantity(item.id)}
                          >
                            <HiOutlineMinusSm
                              className={`text-blue-700 hover:text-gray-500 group-active:text-gray-500 ${
                                item.quantity === 1 && "text-gray-500"
                              }`}
                            />
                          </div>
                          <div className="w-12 border-b border-gray-400">
                            <input
                              type="number"
                              className="w-full text-center outline-none"
                              value={item.quantity}
                              onChange={async (e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value >= 1) {
                                  try {
                                    await updateQuantity(item.id, value, item.productId, item.storeId);
                                  } catch (error) {
                                    console.error(error);
                                    e.target.value = item.quantity.toString();
                                  }
                                }
                              }}
                              min={1}
                            />
                          </div>
                          <div
                            className="p-1 border border-gray-300 cursor-pointer rounded-lg active:ring-2 active:ring-gray-300 active:bg-gray-400 group"
                            onClick={() => incrementQuantity(item.id)}
                          >
                            <HiOutlinePlusSm className="text-blue-700 hover:text-gray-600 group-active:text-gray-500" />
                          </div>
                        </div>

                        {/* Price + Delete Button */}
                        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 min-w-[140px]">
                          <div className="text-red-700 font-bold text-md text-right">
                            Rp {item.finalPrice.toLocaleString("id-ID")}
                          </div>
                          <button
                            className="flex justify-between items-center bg-white text-blue-600 transition"
                            onClick={() => openClearItemModal(item.id)}
                          >
                            <IoTrashOutline className="text-2xl" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg font-semibold">Keranjang kamu kosong</p>
                <p className="text-sm mt-2">Yuk, tambahkan produk ke keranjang dulu!</p>
              </div>
            )}
          </div>

          {/* Order Summary - Hidden on mobile */}
          <div className="hidden md:block bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-7">Ringkasan Pesanan</h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subTotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>Rp {discountInPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
            {/* Line */}
            <div className="w-full h-[2px] bg-gray-200 my-5" />
            {/* Total */}
            <div className="text-black font-bold">
              <div className="flex justify-between">
                <span>Total Belanja</span>
                <span>Rp {finalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <Link href="/checkout">
              <button className="w-full mt-6 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition text-lg">
                Checkout
              </button>
            </Link>
          </div>

          {/* Mobile Checkout Section */}
          <div className="md:hidden">
            {/* Order Summary Dropdown (appears above when open) */}
            {isSummaryOpen && (
              <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-6 max-h-[60vh] overflow-y-auto shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-7">Ringkasan Pesanan</h2>
                <div className="space-y-4 text-black">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {subTotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diskon</span>
                    <span>Rp {discountInPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                {/* Line */}
                <div className="w-full h-[2px] bg-gray-200 my-5" />
                {/* Total */}
                <div className="text-black font-bold">
                  <div className="flex justify-between">
                    <span>Total Belanja</span>
                    <span>Rp {finalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fixed Checkout Bar (always at bottom) */}
            <div className="bg-white border-t fixed bottom-0 left-0 right-0 p-4 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1" onClick={() => setIsSummaryOpen(!isSummaryOpen)}>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isSummaryOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <div className="flex flex-col">
                      <div className="text-black font-semibold">Total Belanja</div>
                      <div className="font-bold text-black">Rp {subTotal.toLocaleString("id-ID")}</div>
                    </div>
                  </div>
                </div>
                <Link href="/checkout">
                  <button className="bg-red-700 text-white text-lg p-2 px-8 rounded-lg hover:bg-red-800 transition">
                    Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
