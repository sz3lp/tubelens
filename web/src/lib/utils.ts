import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en", { notation: n >= 10000 ? "compact" : "standard" }).format(n);
}
