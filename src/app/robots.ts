import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private surfaces — nothing here should ever be crawled or indexed.
      disallow: ["/admin", "/account", "/api"],
    },
    sitemap: "https://angrytiger.in/sitemap.xml",
  };
}
