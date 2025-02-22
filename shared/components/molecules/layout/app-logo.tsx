"use client";
import { kAppAbbr, kAppName } from "@/shared/constants/app.constant";
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href='/' className="flex items-center gap-3">
    
      <span className="truncate font-medium text-xl">
        {kAppName.toUpperCase()}
      </span>
    </Link>
  );
}
