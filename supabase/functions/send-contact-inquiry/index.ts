// Supabase Edge Function: send-contact-inquiry
//
// Receives a Contact page inquiry submission and delivers it via the
// Resend API to kiplanscholar@gmail.com. This function is the only place
// RESEND_API_KEY is ever read — it is a Supabase secret, never exposed to
// the frontend bundle. The frontend only ever calls this function by name
// via supabase.functions.invoke(); it never talks to Resend directly.
//
// Required Supabase secret (set via `supabase secrets set`, not committed
// anywhere in this repo):
//   RESEND_API_KEY
//
// Deploy with: supabase functions deploy send-contact-inquiry

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const DESTINATION_EMAIL = "kiplanscholar@gmail.com";
const RESEND_API_URL = "https://api.resend.com/emails";

// Resend's shared testing/onboarding sender. This works without owning or
// verifying a custom sending domain, but Resend restricts it to sending
// TO the email address that owns the Resend account. Practically: sign
// up for Resend using kiplanscholar@gmail.com, and this sender can
// deliver to that same address immediately, with no DNS/domain setup.
// If a custom domain is verified in Resend later, swap this for a
// branded address (e.g. "KIPLANScholar <noreply@kiplanscholar.com>") --
// no other code changes would be required.
const FROM_ADDRESS = "KIPLANScholar Contact Form <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const subject = (payload.subject ?? "General Inquiry").trim();
  const message = (payload.message ?? "").trim();

  // Server-side validation — the real gate, independent of whatever the
  // frontend already checked, since this is the step that actually
  // triggers an external send.
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Name, email, and message are all required." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: "Please provide a valid email address." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    // Fails loudly and safely rather than silently pretending to succeed.
    console.error("RESEND_API_KEY is not configured for send-contact-inquiry.");
    return new Response(
      JSON.stringify({ error: "Email delivery is not configured. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const htmlBody = `
    <h2>New KIPLANScholar Contact Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [DESTINATION_EMAIL],
        reply_to: email,
        subject: `[KIPLANScholar Contact] ${subject}`,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorDetail = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, errorDetail);
      return new Response(
        JSON.stringify({ error: "We could not send your message right now. Please try again shortly." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-inquiry unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});