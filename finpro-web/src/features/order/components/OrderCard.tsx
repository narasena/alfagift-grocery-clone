"use client";

import { TbCalendarTime } from "react-icons/tb";
import { RiEBike2Line } from "react-icons/ri";
import { getStatusLabel } from "@/utils/order/statusLabes";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { IOrderCards } from "@/types/orders/orders.type";

export default function OrderCard({
  orderId,
  createdAt,
  latestStatus,
  firstName,
  lastName,
  numberOfProducts,
  finalTotalAmount,
  onDetailClick,
}: IOrderCards) {
  const openModal = () => {
    if (onDetailClick) {
      onDetailClick(orderId);
    }

    const modal = document.getElementById(`modal-${orderId}`) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const prettyStatus = getStatusLabel(latestStatus);

  let formattedCreatedAt = createdAt;
  try {
    formattedCreatedAt = format(parseISO(createdAt), "dd MMMM yyyy - HH:mm 'WIB'", {
      locale: idLocale,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    console.error("Invalid date:", createdAt);
  }

  return (
    <div className="rounded-lg border border-gray-200 p-5 text-black mb-4">
      {/* Date and status */}
      <div className="flex items-center space-x-2">
        <TbCalendarTime className="text-lg text-gray-400" />
        <span className="text-sm text-gray-400">{formattedCreatedAt}</span>
        <span className="badge bg-green-100 text-green-400 border-0 font-semibold px-4 py-2 rounded-xl">
          {prettyStatus}
        </span>
      </div>

      {/* Order details */}
      <div className="mt-7 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <RiEBike2Line className="text-4xl" />
          <div>
            <h1>
              {firstName} {lastName}
            </h1>

            <h1 className="text-sm text-gray-500">No. Ref: {orderId}</h1>
          </div>
        </div>

        {/* Right side: total */}
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Belanja</p>
          <p className="text-sm font-semibold">{numberOfProducts} Produk</p>
          <p className="text-lg font-bold text-red-600">Rp {finalTotalAmount.toLocaleString()}</p>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />

      <div className="text-right">
        <button
          className="bg-white text-red-600 border border-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-lg"
          onClick={openModal}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
