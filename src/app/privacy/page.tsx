import Link from "next/link";
export const metadata = { title: "Privacy | JRH Estates" };
export default function Privacy() {
  return (
    <main className="privacy wrap">
      <Link href="/" className="eyebrow">
        ← JRH Estates
      </Link>
      <h1>Your privacy matters.</h1>
      <p>
        When you submit an enquiry, we use your name, phone number, project
        preferences and message to respond to your request and help arrange a
        site visit. Please do not include financial or identity documents.
      </p>
      <h2>How enquiries are handled</h2>
      <p>
        The enquiry form opens WhatsApp with your name, mobile number, project
        and plot preferences, and optional message prefilled. Your enquiry is
        sent to the configured JRH Estates business number only when you tap
        Send in WhatsApp. The form does not submit your details to this
        website’s backend. If WhatsApp is unavailable, no message is sent.
        WhatsApp processes the information you choose to send under its own
        privacy policy.
      </p>
      <h2>Website analytics</h2>
      <p>
        When configured, we use Google Analytics to understand visits and how
        people use this website. Google may use analytics cookies and process
        device, browser and usage information. We do not send your name, mobile
        number or enquiry message to Google Analytics. Advertising
        personalisation and Google signals are disabled in our tag
        configuration. Your browser settings can restrict cookies and tracking.
        See{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google’s privacy policy
        </a>{" "}
        for information about its processing.
      </p>
      <h2>Your choices</h2>
      <p>
        You may ask JRH Estates to correct or delete your enquiry information
        using the contact options on our homepage. WhatsApp and Google Maps
        links open external services governed by their respective privacy
        policies.
      </p>
      <Link href="/#contact" className="button dark">
        Contact JRH Estates ↗
      </Link>
    </main>
  );
}
