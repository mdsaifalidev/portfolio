/** Canonical site origin for metadata, sitemap, RSS and JSON-LD. Set NEXT_PUBLIC_SITE_URL once a domain exists. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mdsaifali.vercel.app").replace(/\/+$/, "");

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
