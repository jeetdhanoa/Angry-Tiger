import type { MetadataRoute } from "next";

const BASE = "https://angrytiger.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/films", priority: 0.8 },
    { path: "/television", priority: 0.8 },
    { path: "/vertical", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/production", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
