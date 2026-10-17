import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    if (origin && new URL(origin).host !== request.headers.get("host"))
      return NextResponse.json(
        { error: "Request not permitted." },
        { status: 403 },
      );
  } catch {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") || 0) > 10000)
    return NextResponse.json(
      { error: "Your message is too long." },
      { status: 413 },
    );
  let data;
  try {
    const body = await request.text();
    if (body.length > 10000)
      return NextResponse.json(
        { error: "Your message is too long." },
        { status: 413 },
      );
    data = JSON.parse(body);
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error("Invalid payload");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    typeof data.name !== "string" ||
    data.name.trim().length < 2 ||
    data.name.length > 100 ||
    typeof data.phone !== "string" ||
    !/^(?:\+91[ -]?)?[6-9]\d{9}$/.test(data.phone.replace(/[\s()-]/g, "")) ||
    !["nh125", "unsure"].includes(data.project) ||
    !["unsure", "100", "150", "200"].includes(data.plot) ||
    typeof data.message !== "string" ||
    data.message.length > 2000
  )
    return NextResponse.json(
      {
        error:
          "Please check your name, Indian mobile number and selected preferences.",
      },
      { status: 400 },
    );
  if (data.website)
    return NextResponse.json(
      { error: "Unable to submit this request." },
      { status: 400 },
    );
  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint)
    return NextResponse.json(
      {
        error:
          "Online enquiries are not connected yet. Your enquiry has not been sent. Please use the configured phone or WhatsApp contact, or try again later.",
      },
      { status: 503 },
    );
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify({
        name: data.name.trim(),
        phone: data.phone,
        project: data.project,
        plot: data.plot,
        message: data.message,
        source: "jrhestates.com",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Delivery failed");
    return NextResponse.json({
      message:
        "Your enquiry has been sent. JRH Estates will be in touch to discuss your next step.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not deliver your enquiry. Please try again or use the contact options.",
      },
      { status: 502 },
    );
  }
}
