"use client";
import { IoTrashOutline } from "react-icons/io5";
import { BsStopwatch } from "react-icons/bs";

// mobile tambahin Kirim ke: Alamat
// di atas line paling atas, di atas clear all button

export default function CartPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between py-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
            {/* Hide "Cart" heading on mobile */}
            <h1 className="hidden md:block text-2xl font-semibold text-gray-700 mb-5">
              Cart
            </h1>
            <div className="hidden md:block w-full h-1 bg-gray-100" />

            {/* Button clear all */}
            <button className="px-4 my-6 flex justify-between items-center bg-white text-blue-600 py-2 rounded-lg transition border-2">
              <div className="pr-2">
                <IoTrashOutline />
              </div>
              Clear All
            </button>
            <div className="text-black flex items-center gap-2 mb-2">
              <div className="">
                <BsStopwatch className="text-black" />
              </div>
              Instant Delivery
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border rounded p-4">
                {/* Left: Item details */}
                <div className="flex flex-col">
                  <span className="text-black font-semibold">Item 1</span>
                  <span className="text-gray-500 text-sm mb-2">Rp 10,000</span>
                </div>

                {/* Right: Subtotal + Quantity controls */}
                <div className="flex items-center justify-end md:justify-start space-x-2 md:space-x-4">
                  {/* Quantity Controls - Now stays in line with price on mobile */}
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 border rounded text-lg text-gray-600 hover:bg-gray-100">
                      -
                    </button>
                    <span className="w-6 text-center text-black">2</span>
                    <button className="w-8 h-8 border rounded text-lg text-gray-600 hover:bg-gray-100">
                      +
                    </button>
                  </div>

                  {/* Subtotal and Remove Button - Now in same line on mobile */}
                  <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Subtotal */}
                    <div className="text-black font-medium min-w-[80px] text-right">
                      Rp {10000 * 2}
                    </div>

                    {/* Remove Button */}
                    <button className="flex justify-between items-center bg-white text-blue-600 transition">
                      <IoTrashOutline className="text-2xl" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Order Summary - Hidden on mobile */}
          <div className="hidden md:block bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-7">
              Order Summary
            </h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>Rp 0</span>
              </div>
            </div>
            {/* Line */}
            <div className="w-full h-[2px] bg-gray-200 my-5" />
            {/* Total */}
            <div className="text-black font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>Rp 0</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition">
              Checkout
            </button>
          </div>

          {/* Mobile Checkout Button - Only shows on mobile */}
          <div className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 p-4 shadow-lg">
            <div className="flex space-y-4 justify-between items-center">
              <div className="flex justify-between items-center mb-2 text-black">
                <span className="font-semibold">Total</span>
                <span className="font-bold">Rp {10000 * 2}</span>
              </div>
              <button className=" bg-red-700 text-white p-3 px-8 rounded-lg hover:bg-red-800 transition">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
