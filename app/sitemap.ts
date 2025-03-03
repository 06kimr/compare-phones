import { createClient } from "@/utils/supabase/client";
import { MetadataRoute } from "next";

const BASE_URL = "https:gachirok.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const { data } = await supabase.from("phones").select("*");
  if (!data) throw new Error("No data found");

  const routes: MetadataRoute.Sitemap = data.flatMap((primaryPhone) =>
    data.map((secondaryPhone) => ({
      url: `${BASE_URL}?primary=${primaryPhone.name}amp;secondary=${secondaryPhone.name}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.7,
    }))
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...routes,
  ];
}
