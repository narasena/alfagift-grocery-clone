"use client";
import { Suspense } from "react";
import { BsStopwatch } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";
import useCartItems from "@/features/cart/hooks/useCartItems";
import useOrder from "@/features/order/hooks/useOrder";
import { useRouter } from "next/navigation";
import { EDiscountType } from "@/types/discounts/discount.type";
import { ICartItemResponse } from "@/types/carts/cartItem.type";
import { TbSquareCheckFilled, TbTicketOff } from "react-icons/tb";
import { IVoucher } from "@/types/vouchers/voucher.type";
import { HiMiniReceiptPercent } from "react-icons/hi2";

function CheckoutContent() {
  const {
    cartItems,
    loading,
    mainAddress,
    user,
    today,
    subTotal,
    discountInPrice,
    shippingCostOrder,
    voucherAmountOff,
    voucherShippingOff,
    finalPriceOrder,
    vouchers,
    appliedVoucher,
    handleApplyVoucher
  } = useCartItems();
  // console.log("Vouchers:", vouchers);
  console.log("Discount in Price:", discountInPrice)
  console.log("Voucher Amount Off:", voucherAmountOff)
  console.log("Voucher Shipping Off:", voucherShippingOff);
  const { handleCreateOrder, isSummaryOpen, setIsSummaryOpen } = useOrder();

  const router = useRouter();
  // to navigate to payment page after order creation

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between  mt-10">
      <div className="w-full max-w-6xl md:px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2 bg-white border rounded-lg p-6 shadow-sm self-start">
            <h1 className="text-2xl font-semibold text-gray-700 mb-5">Ringkasan Pesanan</h1>

            {/* Detail Penerima */}
            <div className="text-black">
              <h1 className="font-semibold">Detail Penerima</h1>
              <div className="w-full h-[2px] bg-gray-100 my-3" />

              {/* Recipient Info */}

              <div className="space-y-1">
                {mainAddress ? (
                  <>
                    <p>{mainAddress.address}</p>
                    <p>
                      {user?.firstName} - {user?.phoneNumber}
                    </p>
                    <p>
                      {mainAddress.subDistrict}, {mainAddress.district}, {mainAddress.city}, {mainAddress.province}{" "}
                      {mainAddress.postalCode}
                    </p>
                  </>
                ) : (
                  <p>
                    <span className="font-semibold">Alamat Utama: </span>
                    Tidak ada alamat utama
                  </p>
                )}
              </div>
            </div>

            {/* line */}
            <div className="w-full h-2 bg-gray-100 my-5" />

            {/* Delivery */}
            <div className="text-black">
              <h1 className="font-semibold">Pengiriman</h1>
              <div className="w-full h-[2px] bg-gray-100 my-3" />

              <div className="text-gray-500 space-y-1">
                <div className="flex items-center gap-2 w-max">
                  <CiCalendar className="text-lg" />
                  <h1 className="text-sm">{today}</h1>
                </div>
                {/* needs to be fixed */}
                <div className="flex items-center gap-2 w-full">
                  <CiClock1 className="text-lg shrink-0" />
                  <p className="text-sm flex-1 whitespace-normal">
                    Maks. 1 jam setelah pembayaran selama jam operasional (Maks. 1 jam setelah pembayaran selama jam
                    operasional (07:00 - 21:00))
                  </p>
                </div>
              </div>
            </div>
            {/* line */}
            <div className="w-full h-2 bg-gray-100 my-5" />
            <div className="text-black flex items-center gap-2 mb-2">
              <div className="">
                <BsStopwatch className="text-black" />
              </div>
              Pengiriman Instan
            </div>
            <ul className="space-y-4">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item: ICartItemResponse) => (
                  <li key={item.id} className="flex justify-between items-center border rounded p-4">
                    {/* Left: Item details */}
                    <div className="flex flex-col">
                      <span className="text-black font-semibold">{item.product.name}</span>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div>
                          <div className="h-5 flex items-center px-">
                            {item.product.productDiscountHistories.length > 0 &&
                              (item.product.productDiscountHistories[0].discount.discountType ===
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
                            item.product.productDiscountHistories[0].discount.discountType ===
                              EDiscountType.PERCENTAGE ? (
                              <span className="py-0.5 px-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold">
                                {`${item.product.productDiscountHistories[0].discountValue}%`}
                              </span>
                            ) : (
                              item.product?.productDiscountHistories[0].discount.discountType ===
                                EDiscountType.FIXED_AMOUNT && (
                                <span className="py-0.5 px-1.5 bg-orange-500 text-white rounded-md text-xs italic font-semibold">{`- Rp ${item.product.productDiscountHistories[0].discountValue}`}</span>
                              )
                            )}
                            <p className="text-gray-700 text-base mb-2">
                              {item.product?.productDiscountHistories.length > 0 &&
                              item.product.productDiscountHistories[0].discount.discountType !== EDiscountType.BUY1_GET1
                                ? (item.product.productDiscountHistories[0].discount.discountType ===
                                  EDiscountType.FIXED_AMOUNT
                                    ? item.product.price - item.product.productDiscountHistories[0].discountValue
                                    : item.product.price *
                                      (1 - item.product.productDiscountHistories[0].discountValue / 100)
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
                        <span>Jumlah beli: {item.quantity}</span>
                      </div>
                    </div>

                    {/* Right: Subtotal */}
                    <div className="flex items-center space-x-4">
                      <div className="text-red-600 font-bold min-w-[80px] text-right">
                        Rp {item.finalPrice.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Tidak ada item dalam pesanan.</li>
              )}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="hidden md:block bg-white border rounded-lg p-6 shadow-sm">
            {/* Vouchers */}
            <div>
              <h1 className="text-xl font-semibold text-gray-700 mb-3">Vouchers Available</h1>
              {vouchers && vouchers.length > 0 ? (
  vouchers.map((voucher: IVoucher, index: number) => (
    <div
      className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 rounded-lg bg-white border border-emerald-200 text-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer mb-3"
      key={index}
      onClick={() => handleApplyVoucher(voucher)}
    >
      <div className="flex items-center justify-center">
        <HiMiniReceiptPercent className="text-3xl text-emerald-600" />
      </div>
      <div className="flex flex-col space-y-1">
        <p className="font-semibold text-sm text-emerald-700">
          {`${voucher.discountValue}% OFF`}
        </p>
        <span className="font-medium text-sm text-gray-900">{voucher.name}</span>
        <p className="text-xs text-gray-500">
          {`Valid until ${new Date(voucher.expiredDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long", 
            year: "numeric"
          })}`}
        </p>
      </div>
      {appliedVoucher?.id === voucher.id && (
        <div className="flex items-center justify-center">
          <TbSquareCheckFilled className="text-2xl text-emerald-600" />
        </div>
      )}
    </div>
  ))
) : (
  <div className="text-gray-500 flex flex-col justify-center items-center gap-2">
    <TbTicketOff className="text-7xl text-gray-500" />
    <span>{`You don't have any voucher yet`}</span>
  </div>
)}            </div>
            {/* Line */}
            <div className="w-full h-[2px] bg-gray-200 my-5" />
            {/* Subtotal, Discount, Shipping, Total */}
            <h2 className="text-xl font-semibold text-gray-700 mb-7">Ringkasan Pesanan</h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subTotal.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>
                  Rp {(discountInPrice + voucherAmountOff).toLocaleString("id-ID", { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>Rp {shippingCostOrder.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon Ongkir</span>
                <span>Rp {voucherShippingOff.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
            {/* Line */}
            <div className="w-full h-[2px] bg-gray-200 my-5" />
            {/* Total */}
            <div className="text-black font-bold">
              <div className="flex justify-between">
                <span>Total Belanja</span>
                <span>Rp {finalPriceOrder.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
            <button
              onClick={async () => {
                const orderId = await handleCreateOrder(mainAddress?.id || "", cartItems[0]?.storeId || "");
                router.push(`/payment/${orderId}`);
              }}
              className="w-full mt-6 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition"
            >
              Pilih Pembayaran
            </button>
          </div>

          {/* Mobile Checkout Section */}
          <div className="md:hidden">
            {/* Order Summary Dropdown (appears above when open) */}
            {isSummaryOpen && (
              <div className=" bottom-16 left-0 right-0 bg-white border-t p-6 max-h-[60vh] overflow-y-auto shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-7">Ringkasan Pesanan</h2>
                <div className="space-y-4 text-black">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {subTotal.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diskon</span>
                    <span>
                      Rp {(discountInPrice + voucherAmountOff).toLocaleString("id-ID", { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingCostOrder.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>Rp {voucherShippingOff.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
                  </div>
                </div>
                {/* Line */}
                <div className="w-full h-[2px] bg-gray-200 my-5" />
                {/* Total */}
                <div className="text-black font-bold">
                  <div className="flex justify-between">
                    <span>Total Belanja</span>
                    <span>Rp {finalPriceOrder.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
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
                      <div className="text-black font-semibold">Total</div>
                      <div className="font-bold text-black">Rp {finalPriceOrder.toLocaleString("id-ID")}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const orderId = await handleCreateOrder(mainAddress?.id || "", cartItems[0]?.storeId || "");
                    router.push(`/payment/${orderId}`);
                  }}
                  className="bg-red-700 text-white text-lg p-2 rounded-lg hover:bg-red-800 transition"
                >
                  Pilih Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
