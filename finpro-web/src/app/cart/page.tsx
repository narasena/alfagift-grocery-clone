"use client";
import { IoTrashOutline } from "react-icons/io5";
import { BsStopwatch } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import useCartItems from "@/features/cart/hooks/useCartItems";

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
  const { cartItems, loading } = useCartItems(); // to display cart items
  console.log("Cart items:", cartItems);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  if (loading) return <p>Loading cart items...</p>;

  const openClearAllModal = () => {
    const modal = document.getElementById("clear_all") as HTMLDialogElement | null;
    modal?.showModal();
  };

  const closeClearAllModal = () => {
    const modal = document.getElementById("clear_all") as HTMLDialogElement | null;
    modal?.close();
  };

  const openClearItemModal = () => {
    const modal = document.getElementById("clear_item") as HTMLDialogElement | null;
    modal?.showModal();
  };

  const closeClearItemModal = () => {
    const modal = document.getElementById("clear_item") as HTMLDialogElement | null;
    modal?.close();
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between py-8">
      {/* Modal */}
      <dialog id="clear_all" className="modal">
        <div className="modal-box bg-white text-black rounded-lg w-fit">
          <p className="text-center">Produk pada keranjang Anda akan dihapus semua</p>
          <div className="modal-action flex justify-center gap-x-4">
            <form method="dialog">
              {/* Cancel button closes the modal */}
              <button className="btn w-28 border-red-600 bg-white text-red-600 shadow-none rounded-lg text-lg">
                Cancel
              </button>
            </form>
            {/* clear all ok and then close */}
            <button
              className="btn w-28 shadow-none rounded-lg text-lg bg-red-600 border-red-600 text-white"
              onClick={closeClearAllModal}
            >
              OK
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
            {/* clear all item button */}
            <button
              className="btn w-28 shadow-none rounded-lg text-lg bg-red-600 border-red-600 text-white"
              onClick={closeClearItemModal}
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
              <h3 className="font-semibold text-gray-700 text-sm">Kirim ke:</h3>
              <p className="text-sm text-gray-600">Jl. Contoh No. 123, Jakarta</p>
            </div>
            {/* Button clear all */}
            <button
              className="px-4 my-6 flex justify-between items-center bg-white text-blue-600 py-2 rounded-lg transition border-2"
              onClick={openClearAllModal}
            >
              <div className="pr-2">
                <IoTrashOutline />
              </div>
              Hapus Semua
            </button>
            <div className="text-black flex items-center gap-2 mb-2">
              <div className="">
                <BsStopwatch className="text-black" />
              </div>
              Pengiriman Instan
            </div>
            <ul className="space-y-4">
              {cartItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center border rounded p-4">
                  {/* Left: Item details */}
                  <div className="flex flex-col">
                    <span className="text-black font-semibold">{item.productStock.product.name}</span>
                    <span className="text-gray-500 text-sm mb-2">
                      Rp {item.productStock.product.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {/* Right: Subtotal + Quantity controls */}
                  <div className="flex items-center justify-end md:justify-start space-x-2 md:space-x-4">
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 border rounded text-lg text-gray-600 hover:bg-gray-100">-</button>
                      <span className="w-6 text-center text-black">{item.quantity}</span>
                      <button className="w-8 h-8 border rounded text-lg text-gray-600 hover:bg-gray-100">+</button>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="text-black font-medium min-w-[80px] text-right">
                        Rp {(item.productStock.product.price * item.quantity)?.toLocaleString("id-ID")}
                      </div>
                      <button
                        className="flex justify-between items-center bg-white text-blue-600 transition"
                        onClick={() => openClearItemModal()} // Pass item.id for deletion
                      >
                        <IoTrashOutline className="text-2xl" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary - Hidden on mobile */}
          <div className="hidden md:block bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-7">Ringkasan Pesanan</h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>Rp 0</span>
              </div>
            </div>
            {/* Line */}
            <div className="w-full h-[2px] bg-gray-200 my-5" />
            {/* Total */}
            <div className="text-black font-bold">
              <div className="flex justify-between">
                <span>Total Belanja</span>
                <span>Rp 0</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition text-lg">
              Checkout
            </button>
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
                    <span>Rp 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diskon</span>
                    <span>Rp 0</span>
                  </div>
                </div>
                {/* Line */}
                <div className="w-full h-[2px] bg-gray-200 my-5" />
                {/* Total */}
                <div className="text-black font-bold">
                  <div className="flex justify-between">
                    <span>Total Belanja</span>
                    <span>Rp 0</span>
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
                      <div className="text-black font-semibold"> Belanja</div>
                      <div className="font-bold text-black">Rp {10000 * 2}</div>
                    </div>
                  </div>
                </div>
                <button className="bg-red-700 text-white text-lg p-2 px-8 rounded-lg hover:bg-red-800 transition">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
