"use client";

import clsx from "clsx";
import { HandCoins, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Budgets", href: "/budgets", icon: HandCoins },
  { name: "Settings", href: "/settings", icon: Settings },
];

type NavLinksProps = {
  isSidebarExpanded: boolean;
};

export default function NavLinks({ isSidebarExpanded }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            className={`flex items-center gap-3 py-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
              !isSidebarExpanded && "justify-center"
            }`}
            title={!isSidebarExpanded ? link.name : ""}
            href={link.href}
          >
            <LinkIcon className="text-gray-600" />
            {isSidebarExpanded && (
              <span
                className={clsx("text-gray-700", {
                  "font-bold": pathname === link.href,
                })}
              >
                {link.name}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}
