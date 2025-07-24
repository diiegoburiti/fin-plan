import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/components/shared/font";
import { Toaster } from "sonner";
import Header from "./components/shared/header";

export const metadata: Metadata = {
  title: "Fin plan",
  description: "Take control of your finances with FinPlan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <div className="min-h-screen bg-gray-50 ">
          <Header />

          <div className=" p-8">
            <div className="">{children}</div>
          </div>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
