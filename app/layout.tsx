import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/components/shared/font";
import { Toaster } from "sonner";

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
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
