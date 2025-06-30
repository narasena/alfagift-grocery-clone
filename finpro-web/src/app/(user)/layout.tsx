import Navbar from "@/components/Navbar";
import * as React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
