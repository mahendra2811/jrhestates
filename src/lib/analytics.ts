export const gaMeasurementId = /^G-[A-Z0-9]+$/.test(
  process.env.NEXT_PUBLIC_GA_ID || "",
)
  ? process.env.NEXT_PUBLIC_GA_ID
  : undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event",
      name: string,
      parameters?: Record<string, string | number>,
    ) => void;
  }
}

/** Never send names, phone numbers or free-form enquiry text to analytics. */
export function trackEvent(
  name: string,
  parameters?: Record<string, string | number>,
) {
  if (gaMeasurementId && typeof window !== "undefined") {
    window.gtag?.("event", name, parameters);
  }
}
