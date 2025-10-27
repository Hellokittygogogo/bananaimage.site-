"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

function setCookie(name: string, value: string) {
  // 1 year
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export default function LocaleSwitcher() {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    const m = document.cookie.match(/(?:^|\s*)NEXT_LOCALE=([^;]+)/);
    setLocale(m?.[1] || "en");
  }, []);
  const toggle = () => {
    const next = locale === "en" ? "zh" : "en";
    setCookie("NEXT_LOCALE", next);
    location.reload();
  };
  return (
    <Button size="sm" variant="ghost" onClick={toggle}>
      {locale === "en" ? "中文" : "EN"}
    </Button>
  );
}
