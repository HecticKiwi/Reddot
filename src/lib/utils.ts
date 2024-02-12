import { type ClassValue, clsx } from "clsx";
import { varchar } from "drizzle-orm/pg-core";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
