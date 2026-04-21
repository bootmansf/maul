"use client";

import { useState } from "react";

function getFormspreeUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  // bare form id
  return `https://formspree.io/f/${raw}`;
}

export function ContactForm({
  heading = "Send us a message",
  copy = "Please fill out the form below with any questions regarding our organization, membership, collaborations and any other business. We look forward to hearing from you!",
}: {
  heading?: string;
  copy?: string;
}) {
  const endpoint = getFormspreeUrl(
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT
  );
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(
          Array.isArray(body.errors)
            ? body.errors.map((e: { message: string }) => e.message).join(", ")
            : "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "Network error. Please check your connection and try again."
      );
    }
  }

  return (
    <>
      <div className="margin-bottom margin-medium">
        <div className="contact9_heading-wrapper">
          <div className="margin-bottom margin-small">
            <h2 className="heading-style-h3 text-color-blue">{heading}</h2>
          </div>
          <p className="text-size-medium">{copy}</p>
        </div>
      </div>

      <div className="contact9_form-block w-form">
        {status === "success" ? (
          <div className="form_message-success-wrapper-2 w-form-done">
            <div className="form_message-success">
              <div className="success-text">
                Thank you! Your submission has been received.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact9_form">
            <div className="form_field-wrapper">
              <label htmlFor="contact-name" className="form_field-label-2">
                Name
              </label>
              <input
                className="form_input-2 w-input"
                maxLength={256}
                name="name"
                type="text"
                id="contact-name"
                required
              />
            </div>
            <div className="form_field-wrapper">
              <label htmlFor="contact-email" className="form_field-label-2">
                Email
              </label>
              <input
                className="form_input-2 w-input"
                maxLength={256}
                name="email"
                type="email"
                id="contact-email"
                required
              />
            </div>
            <div className="form_field-wrapper">
              <label htmlFor="contact-message" className="form_field-label-2">
                Message
              </label>
              <textarea
                placeholder="Type your message..."
                maxLength={5000}
                id="contact-message"
                name="message"
                required
                className="form_input-2 is-text-area w-input"
              />
            </div>
            {/* Honeypot for spam protection */}
            <input
              type="text"
              name="_gotcha"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="submit"
              className="button w-button"
              value={status === "sending" ? "Sending…" : "Submit"}
              disabled={status === "sending" || !endpoint}
            />
            {!endpoint && (
              <p
                className="text-size-small"
                style={{ marginTop: "0.75rem", opacity: 0.7 }}
              >
                Form not yet configured. Set{" "}
                <code>NEXT_PUBLIC_FORMSPREE_ENDPOINT</code> to activate.
              </p>
            )}
            {status === "error" && (
              <div
                className="form_message-error-wrapper"
                style={{ marginTop: "0.75rem" }}
              >
                <div className="form_message-error">
                  <div className="error-text">
                    {errorMsg || "Oops! Something went wrong."}
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
}
