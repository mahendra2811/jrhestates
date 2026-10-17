"use client";
import Script from "next/script";
import { gaMeasurementId } from "@/lib/analytics";

export default function GoogleAnalytics() {
  if (!gaMeasurementId) return null;
  return (
    <>
      <Script
        id="google-analytics-library"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(gaMeasurementId)}, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });`}
      </Script>
    </>
  );
}
