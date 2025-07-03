import clsx from "clsx";
import React from "react";

type CardProps = {
  children: React.ReactNode;
  animation?: boolean;
};
export default function Card({ children, animation }: CardProps) {
  return (
    <div
      className={clsx(
        "block max-w p-4 bg-white border border-gray-200 rounded-lg shadow-sm",
        "dark:bg-gray-800 dark:border-gray-700 mb-3",
        animation && [
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          "transform transition-transform duration-300 ease-in-out",
          "hover:-translate-y-0.5 hover:shadow-md",
        ]
      )}
    >
      {children}
    </div>
  );
}
