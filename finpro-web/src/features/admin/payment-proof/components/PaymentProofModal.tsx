"use client";

import * as React from "react";

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentProofs: { id: string; imageUrl: string; status: string }[]; // this matches your fetched `paymentImage`
}

export default function PaymentProofModal({ isOpen, onClose, paymentProofs }: PaymentProofModalProps) {
  React.useEffect(() => {
    const modal = document.getElementById(`payment-proof-modal`) as HTMLDialogElement | null;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }, [isOpen]);

  if (!paymentProofs || paymentProofs.length === 0) {
    return null; // nothing to show
  }

  return (
    <dialog id="payment-proof-modal" className="modal">
      <div className="modal-box bg-white rounded-lg p-6 text-black relative max-w-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="font-bold text-lg mb-4">Bukti Pembayaran</h3>

        <div className="space-y-4">
          {paymentProofs.map((proof) => (
            <div key={proof.id} className="w-full">
              <img src={proof.imageUrl} alt={`Payment Proof ${proof.id}`} className="w-full rounded shadow border" />
              <p className="mt-2 text-sm text-gray-600">
                Status: <span className="font-semibold">{proof.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}
