"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import { site } from "@/data/site";
import { buildWhatsAppEnquiry, normalizeIndianMobile } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "phone", string>>;

export default function EnquiryForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [feedback, setFeedback] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  function clearError(event: FormEvent<HTMLFormElement>) {
    const input = event.target as HTMLInputElement;
    if (input.name === "name" || input.name === "phone") {
      setErrors((previous) => ({ ...previous, [input.name]: undefined }));
    }
    setFeedback("");
    setDraftUrl("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = normalizeIndianMobile(String(data.get("phone") || ""));
    const nextErrors: Errors = {};
    if (name.length < 2) nextErrors.name = "Please enter your full name.";
    if (!phone)
      nextErrors.phone =
        "Enter a valid 10-digit Indian mobile number. +91 and spaces are welcome.";
    setErrors(nextErrors);
    setFeedback("");
    setDraftUrl("");
    if (Object.keys(nextErrors).length) {
      const first = nextErrors.name ? "name" : "phone";
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const project = String(data.get("project") || "unsure");
    const size = String(data.get("plot") || "unsure");
    const url = buildWhatsAppEnquiry(site.whatsapp, {
      name,
      phone: phone!,
      project:
        project === site.project.id ? site.project.name : "Help me explore",
      plot:
        size === "unsure"
          ? "I would like your guidance"
          : `${size} sq. yd. (example preference; availability to be confirmed)`,
      message: String(data.get("message") || ""),
    });
    if (!url) {
      setFeedback(
        "WhatsApp enquiries are currently unavailable. Please contact us using the phone option.",
      );
      return;
    }
    setDraftUrl(url);
    // Tracking must never prevent an enquiry from opening.
    try {
      trackEvent("whatsapp_enquiry_start", { method: "site_visit_form" });
    } catch {
      /* Analytics may be blocked. */
    }
    window.location.assign(url);
  }

  return (
    <form
      className="enquiry-form enquiry-form-refined"
      onSubmit={submit}
      onChange={clearError}
      noValidate
      data-reveal
    >
      <div className="enquiry-form-heading">
        <span className="eyebrow">LET’S START A CONVERSATION</span>
        <h3>Plan your next chapter.</h3>
        <p>Share a few details. We’ll continue on WhatsApp.</p>
        <span className="whatsapp-tag">
          <MessageCircle size={14} aria-hidden="true" /> Direct WhatsApp enquiry
        </span>
      </div>
      <div className="form-row">
        <div className="enquiry-field">
          <label htmlFor="enquiry-name">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            maxLength={100}
            placeholder="Your full name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "enquiry-name-error" : undefined}
          />
          {errors.name && (
            <p id="enquiry-name-error" className="field-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div className="enquiry-field">
          <label htmlFor="enquiry-phone">
            Mobile number <span aria-hidden="true">*</span>
          </label>
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            placeholder="98765 43210"
            required
            aria-invalid={!!errors.phone}
            aria-describedby={`enquiry-phone-hint${errors.phone ? " enquiry-phone-error" : ""}`}
          />
          <p id="enquiry-phone-hint" className="field-hint">
            Indian mobile number · +91 is optional
          </p>
          {errors.phone && (
            <p id="enquiry-phone-error" className="field-error" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="enquiry-field">
          <label htmlFor="enquiry-project">Interested project</label>
          <select
            id="enquiry-project"
            name="project"
            defaultValue={site.project.id}
          >
            <option value={site.project.id}>{site.project.name}</option>
            <option value="unsure">Help me explore</option>
          </select>
        </div>
        <div className="enquiry-field">
          <label htmlFor="enquiry-plot">Preferred plot size</label>
          <select id="enquiry-plot" name="plot" defaultValue="unsure">
            <option value="unsure">I’d like your guidance</option>
            {site.plots.map((p) => (
              <option value={p.area} key={p.id}>
                {p.area} sq. yd. — example
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="enquiry-field">
        <label htmlFor="enquiry-message">
          Your plans <small>(optional)</small>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          maxLength={2000}
          rows={3}
          placeholder="Questions, preferences, or a good day for your site visit…"
        />
      </div>
      <button className="button dark" type="submit">
        <span>
          <MessageCircle size={18} aria-hidden="true" /> Continue on WhatsApp
        </span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>
      <p className="whatsapp-send-note">
        Your details open as a draft. Tap <strong>Send</strong> in WhatsApp to
        share your enquiry.
      </p>
      {feedback && (
        <p className="form-feedback error" role="alert">
          {feedback}
        </p>
      )}
      {draftUrl && (
        <div className="whatsapp-fallback" role="status">
          <p>Your message is ready. WhatsApp didn’t open?</p>
          <a href={draftUrl}>
            Open your WhatsApp draft <ArrowUpRight size={14} />
          </a>
        </div>
      )}
      <p className="privacy-note">
        <ShieldCheck size={14} aria-hidden="true" />
        <span>
          Your details are used to respond to your enquiry.{" "}
          <Link href="/privacy">Privacy policy</Link>
        </span>
      </p>
    </form>
  );
}
