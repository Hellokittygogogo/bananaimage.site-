import { headers } from "next/headers";
import { brands, type Brand } from "@/brands";

export function getBrandByHost(host?: string | null): Brand {
  const h = (host || "").toLowerCase();
  const b = brands.find((x) => x.domains.some((d) => d.toLowerCase() === h));
  return b || brands[0];
}

export function currentBrand(): Brand {
  const h = headers().get("host");
  return getBrandByHost(h);
}
