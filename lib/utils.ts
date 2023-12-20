import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSiPrefixedNumber = (number: number): string => {
  const SI_PREFIXES_CENTER_INDEX = 8;

  const siPrefixes: readonly string[] = [
    'y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'
  ];
  if (number === 0) return number.toString();
  const EXP_STEP_SIZE = 3;
  const base = Math.floor(Math.log10(Math.abs(number)));
  const siBase = (base < 0 ? Math.ceil : Math.floor)(base / EXP_STEP_SIZE);
  const prefix = siPrefixes[siBase + SI_PREFIXES_CENTER_INDEX];

  // return number as-is if no prefix is available
  if (siBase === 0) return number.toString();

  // We're left with a number which needs to be devided by the power of 10e[base]
  // This outcome is then rounded two decimals and parsed as float to make sure those
  // decimals only appear when they're actually requird (10.0 -> 10, 10.90 -> 19.9, 10.01 -> 10.01)
  const baseNumber = parseFloat((number / Math.pow(10, siBase * EXP_STEP_SIZE)).toFixed(2));
  return `${baseNumber}${prefix}`;
};

export const ipRangeStr = (r: IpRange) => `${r.label} - (${r.address}.${r.start} -> ${r.address}.${r.end})`;