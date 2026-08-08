import en from "./en";
import hi from "./hi";
import bn from "./bn";
import mr from "./mr";
import ta from "./ta";
import te from "./te";
import kn from "./kn";
import ml from "./ml";
import pa from "./pa";
import gu from "./gu";
import ur from "./ur";

export type Translation = typeof en;

export interface Language {
  code: string;
  label: string;
  dir: "ltr" | "rtl";
  translations: Translation;
}

export const DEFAULT_LANGUAGE_CODE = "en";

export const languages: Language[] = [
  { code: "en", label: "English", dir: "ltr", translations: en },
  { code: "hi", label: "हिन्दी", dir: "ltr", translations: hi },
  { code: "bn", label: "বাংলা", dir: "ltr", translations: bn },
  { code: "mr", label: "मराठी", dir: "ltr", translations: mr },
  { code: "ta", label: "தமிழ்", dir: "ltr", translations: ta },
  { code: "te", label: "తెలుగు", dir: "ltr", translations: te },
  { code: "kn", label: "ಕನ್ನಡ", dir: "ltr", translations: kn },
  { code: "ml", label: "മലയാളം", dir: "ltr", translations: ml },
  { code: "pa", label: "ਪੰਜਾਬੀ", dir: "ltr", translations: pa },
  { code: "gu", label: "ગુજરાતી", dir: "ltr", translations: gu },
  { code: "ur", label: "اردو", dir: "rtl", translations: ur },
];

const byCode = new Map(languages.map(l => [l.code, l]));

export function getLanguage(code: string): Language {
  return byCode.get(code) ?? byCode.get(DEFAULT_LANGUAGE_CODE)!;
}

export function translate(
  translations: Translation,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = key.split(".").reduce<string | undefined>((acc, part) => {
    if (acc == null) return undefined;
    return (acc as unknown as Record<string, unknown>)[part] as string | undefined;
  }, translations as unknown as string);

  if (value == null) return key;

  if (!params) return value;

  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
