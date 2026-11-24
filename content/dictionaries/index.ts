import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { it, type Dictionary } from "./it";

const dictionaries: Record<Locale, Dictionary> = { it, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
