import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

/** A static export has no server, so the file has to be written at build time. */
export const dynamic = "force-static";

/**
 * /login and /vocabulary are deliberately not disallowed here: they carry a
 * `noindex` tag, and a crawler that is barred from fetching a page never gets
 * to read it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
