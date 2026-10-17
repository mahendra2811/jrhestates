import Website from "@/components/Website";
import { site } from "@/data/site";
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: site.name,
            url: site.url,
            description:
              "Residential plots and planned residential communities in Jodhpur, Rajasthan.",
            areaServed: { "@type": "City", name: "Jodhpur" },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Jodhpur",
              addressRegion: "Rajasthan",
              addressCountry: "IN",
            },
            ...(site.phone ? { telephone: site.phone } : {}),
          }),
        }}
      />
      <Website />
    </>
  );
}
