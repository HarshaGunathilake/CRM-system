"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

function titleCase(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
      <Link href="/dashboard" className="flex items-center hover:text-foreground">
        <Home className="size-3.5" />
      </Link>
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <Fragment key={href}>
            <ChevronRight className="size-3.5 opacity-50" />
            {isLast ? (
              <span className="font-medium text-foreground">{titleCase(seg)}</span>
            ) : (
              <Link href={href} className="hover:text-foreground">
                {titleCase(seg)}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
