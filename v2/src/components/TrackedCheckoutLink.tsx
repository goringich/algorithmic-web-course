"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

export function TrackedCheckoutLink({
  href,
  offer,
  className,
  children,
}: {
  href: string;
  offer: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      onClick={() => track("checkout_click", { offer })}
    >
      {children}
    </a>
  );
}
