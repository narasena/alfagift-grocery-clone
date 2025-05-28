"use client";

import { useState } from "react";

export default function UploadPaymentPage() {
  // Bisa diperbaiki
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file.");

    const formData = new FormData();
    formData.append("receipt", file);

    // Replace with actual backend endpoint
    const res = await fetch("/api/upload-receipt", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Receipt uploaded successfully!");
    } else {
      alert("Failed to upload receipt.");
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Upload Payment Receipt
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-red-50 file:text-red-700
                     hover:file:bg-red-100"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Receipt Preview"
              className="mt-4 rounded-md max-h-64 object-contain"
            />
          )}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Submit Receipt
          </button>
        </form>
      </div>
    </main>
  );
}
