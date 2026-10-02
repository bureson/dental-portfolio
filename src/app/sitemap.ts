import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

/** A static export has no server, so the file has to be written at build time. */
export const dynamic = "force-static";

/** Only the home page — /login and /vocabulary are kept out of search results. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date() }];
}
