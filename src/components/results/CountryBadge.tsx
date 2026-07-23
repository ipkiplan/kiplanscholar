import React from "react";

export const COUNTRY_FLAGS: Record<string, string> = {
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "Germany": "🇩🇪",
  "Australia": "🇦🇺",
  "Europe": "🇪🇺",
  "Japan": "🇯🇵",
  "South Korea": "🇰🇷",
  "China": "🇨🇳",
  "India": "🇮🇳",
  "Any": "🌐",
  "Global": "🌐",
  "Canada": "🇨🇦",
  "Italy": "🇮🇹",
  "Switzerland": "🇨🇭",
  "Netherlands": "🇳🇱",
  "Belgium": "🇧🇪",
  "France": "🇫🇷",
  "Singapore": "🇸🇬",
  "Hong Kong": "🇭🇰",
  "New Zealand": "🇳🇿",
  "Turkey": "🇹🇷",
  "European Union": "🇪🇺",
  "Norway": "🇳🇴",
  "Sweden": "🇸🇪",
  "Finland": "🇫🇮"
};

interface CountryBadgeProps {
  country: string;
}

export default function CountryBadge({ country }: CountryBadgeProps) {
  const flag = COUNTRY_FLAGS[country] || "🌐";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded font-mono border border-slate-200/40 dark:border-slate-700/50"
      id={`country-badge-${country.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <span className="text-xs" role="img" aria-label={country}>
        {flag}
      </span>
      <span>{country}</span>
    </span>
  );
}
