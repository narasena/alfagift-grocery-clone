"use client";
import apiInstance from "@/utils/apiInstance";
import * as React from "react";

export default function ApiTestPage() {
  const handleApiTest = async () => {
    try {
      const response = await apiInstance.get("/");
      console.log("Api RESPONSE:", response);
    } catch (error) {
      console.error("Error during API test:", error);
    }
  };
  React.useEffect(() => {
    handleApiTest();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">THIS IS API TEST PAGE</h1>
      <p className="text-lg">Check the console for API response.</p>
    </div>
  );
}
