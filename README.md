# JRH Estates

A mobile-first Next.js App Router site for residential plots in Jodhpur. TypeScript, Tailwind CSS 4, GSAP / ScrollTrigger, Lucide icons, Next Image and Next Font.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build && npm start`.
Validation: `npm run lint`, `npm run typecheck`, `node scripts/verify-webhook.mjs`, `npm run test:e2e` (install Chromium using `npx playwright install chromium` first).

## Configure before launch

Copy `.env.example` to `.env.local` and supply:

- `NEXT_PUBLIC_PHONE`: real business number including country prefix.
- `NEXT_PUBLIC_WHATSAPP`: real WhatsApp number including country code.
  The enquiry form validates input and redirects to WhatsApp with all entered details in a readable draft. The visitor must tap **Send** in WhatsApp; opening a chat does not mean a message was delivered. No webhook is needed for this form. If the business WhatsApp number is missing or invalid, the form displays a clear error and keeps the entered details. A 10-digit Indian business number is automatically prefixed with 91; international numbers should include their country code.

The optional `/api/enquiry` webhook route remains available for future integrations; it is not called by the WhatsApp form. `LEAD_WEBHOOK_URL` and `LEAD_WEBHOOK_SECRET` configure that separate route only.

Before contact numbers are configured, contact actions point to the enquiry section and contact text explains that details are coming soon. Set public values before building.

Edit brand, navigation, project details, plot examples and images in `src/data/site.ts`. Verify project name, precise location, approved layout, inventory, approvals and development status before replacing the explicit placeholders. Google Maps currently links to Jodhpur city, never an invented site pin. No prices, approvals or completion claims are included.

## Visuals

Original AI-generated architectural concepts are saved locally as compressed WebP images in `public/images`. They illustrate possibilities, not actual constructed infrastructure. Hero compositions are independently generated for desktop, mobile and tablet. Supporting assets depict empty ground-level plots, golden-hour land, plotted land, roads, park, sandstone home, jali detail, Jodhpur and an aspirational family neighbourhood. The plot grid is a code-native illustrative diagram, not an approved master plan. Research references: Rajasthan Tourism Jodhpur (https://www.tourism.rajasthan.gov.in/jodhpur.html), Umaid Heritage architecture (https://umaidheritage.com/architecture/).

The mobile navigation traps focus, closes on Escape/outside click, locks body scrolling and restores focus. Motion respects reduced-motion preferences. Metadata, JSON-LD, sitemap, robots and privacy page are included. Font files are fetched by Next Font during the first build; subsequent delivery is self-hosted.

The development-only Next ESLint glob dependency currently has an upstream braces advisory; `npm audit --omit=dev` reports no runtime vulnerabilities. Avoid processing untrusted glob patterns in development tooling.

## Google Analytics 4

Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in `.env.local` (or your hosting environment), then restart development or rebuild production. Use your GA4 web stream measurement ID, not an API secret. No Google scripts load when the value is missing or malformed.

The Google tag loads after hydration, records its initial page view, and can track client-side page navigation through GA4 Enhanced Measurement (enable browser-history page views in your web stream). Anchor scrolling does not represent a new page. Custom events: `whatsapp_enquiry_start` when the completed form opens a WhatsApp draft (not confirmed delivery); `contact_click` for configured phone and WhatsApp links. No form names, numbers or messages are sent. Google signals and advertising personalisation are disabled. Run `node scripts/verify-analytics.mjs` to verify script loading and the WhatsApp handoff event with a stubbed Google library. Verify your real ID in GA4 Realtime or Tag Assistant after deployment. Implementation follows https://developers.google.com/tag-platform/gtagjs.

## WhatsApp form validation

The form accepts 10-digit Indian mobile numbers with spaces or hyphens, optional +91 / 91 / 0091 country prefixes, or a leading 0. It normalises the visitor number for the message, shows field-specific errors, and preserves input while errors are corrected. There is no hidden website field in this client-only WhatsApp flow, so browser autofill cannot accidentally block an enquiry. The floating mobile contact bar hides while the contact section is visible. A fallback draft link is shown if the browser does not hand off to WhatsApp. Analytics failures cannot prevent submission.
