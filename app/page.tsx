import type { Metadata } from "next";
import { LandingPage } from "@/components/public/landing-page";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      canonical: content.seo.canonicalUrl
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      title: content.seo.title,
      description: content.seo.description,
      url: content.seo.canonicalUrl,
      siteName: content.site.brandName,
      images: [
        {
          url: content.seo.ogImageUrl,
          alt: content.seo.ogImageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [content.seo.ogImageUrl]
    }
  };
}

export default async function HomePage() {
  const content = await getSiteContent();
  return <LandingPage content={content} />;
}
