"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

const BUDGET_RANGES = [
  "Under £5,000",
  "£5,000 – £15,000",
  "£15,000 – £50,000",
  "£50,000+",
  "Prefer not to say",
];

const fieldClass =
  "w-full border-0 border-b border-mist bg-transparent py-2 font-sans text-sm font-light text-ink focus:border-ink focus:outline-none";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    medium: "",
    artist: "",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.budget && `Budget range: ${form.budget}`,
      form.medium && `Medium preference: ${form.medium}`,
      form.artist && `Artist interest: ${form.artist}`,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const params = new URLSearchParams({
      subject: "Collector enquiry",
      body,
    });

    window.location.href = `mailto:${siteConfig.email}?${params.toString()}`;
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="eyebrow">Name</span>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="eyebrow">Email</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="eyebrow">Phone</span>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="eyebrow">Budget range</span>
        <select
          value={form.budget}
          onChange={(e) => update("budget", e.target.value)}
          className={fieldClass}
        >
          <option value="">Select a range</option>
          {BUDGET_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="eyebrow">Medium preference</span>
        <input
          type="text"
          placeholder="e.g. Painting, Sculpture"
          value={form.medium}
          onChange={(e) => update("medium", e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 sm:col-span-1">
        <span className="eyebrow">Artist interest</span>
        <input
          type="text"
          value={form.artist}
          onChange={(e) => update("artist", e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 sm:col-span-2">
        <span className="eyebrow">Message</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center bg-ink px-6 py-3 font-sans text-xs font-light uppercase tracking-widest text-cream transition-colors duration-400 hover:bg-ink/80"
        >
          Send Enquiry
        </button>
      </div>
    </form>
  );
}
