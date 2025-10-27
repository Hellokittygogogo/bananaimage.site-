import { cookies, headers } from "next/headers";
import type { Locale } from "./config";

export function detectLocale(): Locale {
  try {
    const c = cookies();
    const cookie = (c.get("NEXT_LOCALE")?.value || "").toLowerCase();
    if (cookie === "zh" || cookie === "en") return cookie as Locale;
    const h = headers();
    const al = (h.get("accept-language") || "").toLowerCase();
    if (al.includes("zh")) return "zh" as Locale;
    return "en";
  } catch {
    return "en";
  }
}

export async function getMessages(locale: Locale) {
  try {
    if (locale === "zh") {
      const mod = await import("./messages.zh.json");
      return mod.default as Record<string, string>;
    }
  } catch {}
  const mod = await import("./messages.en.json");
  return mod.default as Record<string, string>;
}
