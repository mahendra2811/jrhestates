export interface WhatsAppEnquiry {
  name: string;
  phone: string;
  project: string;
  plot: string;
  message: string;
}

/** Accept the common ways Indian visitors type their mobile number. */
export function normalizeIndianMobile(value: string): string | null {
  if (!/^[+\d\s().-]+$/.test(value.trim())) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.length === 14 && digits.startsWith("0091"))
    digits = digits.slice(4);
  else if (digits.length === 12 && digits.startsWith("91"))
    digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0"))
    digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function normalizeWhatsAppRecipient(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10) digits = `91${digits}`;
  return /^[1-9]\d{10,14}$/.test(digits) ? digits : null;
}

/** Build a click-to-chat draft. The visitor still chooses Send in WhatsApp. */
export function buildWhatsAppEnquiry(
  number: string,
  enquiry: WhatsAppEnquiry,
): string | null {
  const recipient = normalizeWhatsAppRecipient(number);
  if (!recipient) return null;
  const message = [
    "Hello JRH Estates, I would like to enquire about residential plots and book a site visit.",
    "",
    `Full name: ${enquiry.name.trim()}`,
    `Mobile number: ${enquiry.phone.trim()}`,
    `Interested project: ${enquiry.project}`,
    `Preferred plot size: ${enquiry.plot}`,
    ...(enquiry.message.trim()
      ? ["", `Message: ${enquiry.message.trim()}`]
      : []),
  ].join("\n");
  return `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
}
