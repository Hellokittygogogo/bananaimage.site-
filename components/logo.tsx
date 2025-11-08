"use client";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "./i18n-provider";

export function Logo() {
  const { } = useI18n() as any;
  return (
    <Link
      href={"/"}
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      <div className="flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Banana image Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Banana image
      </span>
    </Link>
  );
}
