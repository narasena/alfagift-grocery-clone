import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StoreLocationPicker from "@/components/StoreLocationPicker";
import * as React from "react";
import AppsInfoComponent from "./(slug page)/(product)/p/[slug]/components/AppsInformation";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <StoreLocationPicker />
      {children}
      <Footer />
      <AppsInfoComponent />
    </div>
  );
}
