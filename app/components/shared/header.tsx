"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOut } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/records"
              className="text-xl font-semibold text-gray-800 hover:text-purple-600 transition-colors"
            >
              Fin Plan
            </Link>

            <nav className="flex items-center space-x-8">
              <Link
                href="/dashboard"
                className={`hover:text-purple-600 transition-colors ${
                  isActiveRoute("/dashboard")
                    ? "text-purple-600 font-bold"
                    : "text-gray-700 font-medium"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/records"
                className={`hover:text-purple-600 transition-colors ${
                  isActiveRoute("/records")
                    ? "text-purple-600 font-bold"
                    : "text-gray-700 font-medium"
                }`}
              >
                Records
              </Link>
            </nav>
          </div>

          <div className="flex items-center ml-auto">
            <form
              action={async () => {
                await logOut();
              }}
            >
              <Button
                title="Log out"
                variant="secondary"
                size="icon"
                className="size-8 cursor-pointer"
                type="submit"
              >
                <LogOut />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
