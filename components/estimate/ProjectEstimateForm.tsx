"use client";

import { useState } from "react";
import type { EstimateFormDictionary } from "@/lib/dictionaries/estimate";
import { WHATSAPP_NUMBER } from "@/lib/site";

function fieldValue(data: FormData, key: string): string {
  return String(data.get(key) ?? "").trim();
}

/**
 * Форма ничего не отправляет на сервер- собирает текст сообщения и
 * открывает wa.me с готовым текстом (ровно как в оригинале, см.
 * MIGRATION-NEXTJS16-TAILWIND.md §10). noValidate + ручной
 * form.reportValidity()- намеренная комбинация, не native-тултипы.
 */
export function ProjectEstimateForm({
  privacyHref,
  t,
}: {
  privacyHref: string;
  t: EstimateFormDictionary;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const form = event.currentTarget;
    if (!form.reportValidity()) {
      setError(t.error);
      return;
    }

    const data = new FormData(form);
    const name = fieldValue(data, "name");
    const phone = fieldValue(data, "phone");
    const city = fieldValue(data, "city");
    const objectType = fieldValue(data, "objectType");
    const service = fieldValue(data, "service");
    const stage = fieldValue(data, "stage");
    const installation = fieldValue(data, "installation");
    const deadline = fieldValue(data, "deadline");
    const description = fieldValue(data, "description");

    if (phone.replace(/\D/g, "").length < 7) {
      setError(t.phoneError);
      return;
    }

    setSending(true);

    const message =
      `*${t.message.title}*\n\n` +
      `*${t.message.name}:* ${name}\n` +
      `*${t.message.phone}:* ${phone}\n` +
      `*${t.message.city}:* ${city}\n` +
      `*${t.message.objectType}:* ${objectType}\n` +
      `*${t.message.service}:* ${service}\n` +
      `*${t.message.stage}:* ${stage}\n` +
      `*${t.message.installation}:* ${installation}\n` +
      `*${t.message.deadline}:* ${deadline}\n` +
      `*${t.message.description}:* ${description || t.message.empty}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setSending(false);
    setSuccess(true);
  }

  return (
    <form className="estimate-form" onSubmit={handleSubmit} noValidate>
      <div className="estimate-form-grid">
        <label className="estimate-field">
          <span>
            {t.fields.name}
            <strong aria-hidden="true">*</strong>
          </span>
          <input type="text" name="name" placeholder={t.placeholders.name} autoComplete="name" required />
        </label>

        <label className="estimate-field">
          <span>
            {t.fields.phone}
            <strong aria-hidden="true">*</strong>
          </span>
          <input type="tel" name="phone" placeholder={t.placeholders.phone} autoComplete="tel" inputMode="tel" required />
        </label>

        <label className="estimate-field">
          <span>
            {t.fields.city}
            <strong aria-hidden="true">*</strong>
          </span>
          <input type="text" name="city" placeholder={t.placeholders.city} autoComplete="address-level2" required />
        </label>

        <label className="estimate-field">
          <span>
            {t.fields.objectType}
            <strong aria-hidden="true">*</strong>
          </span>
          <select name="objectType" defaultValue="" required>
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {t.options.objectTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="estimate-field">
          <span>
            {t.fields.service}
            <strong aria-hidden="true">*</strong>
          </span>
          <select name="service" defaultValue="" required>
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {t.options.services.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="estimate-field">
          <span>
            {t.fields.stage}
            <strong aria-hidden="true">*</strong>
          </span>
          <select name="stage" defaultValue="" required>
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {t.options.stages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="estimate-field">
          <span>
            {t.fields.installation}
            <strong aria-hidden="true">*</strong>
          </span>
          <select name="installation" defaultValue="" required>
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {t.options.installation.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="estimate-field">
          <span>
            {t.fields.deadline}
            <strong aria-hidden="true">*</strong>
          </span>
          <select name="deadline" defaultValue="" required>
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {t.options.deadlines.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="estimate-field estimate-field-wide">
          <span>{t.fields.description}</span>
          <textarea name="description" rows={6} placeholder={t.placeholders.description} />
        </label>
      </div>

      <label className="estimate-consent">
        <input type="checkbox" name="consent" required />
        <span>
          {t.consent}{" "}
          <a className="estimate-privacy-link" target="_blank" href={privacyHref}>
            {t.privacyLink}
          </a>
        </span>
      </label>

      {error && <p className="estimate-message estimate-error">{error}</p>}
      {success && <p className="estimate-message estimate-success">{t.success}</p>}

      <button className="button estimate-submit-button" type="submit" disabled={sending}>
        <span className="estimate-submit-icon">WA</span>
        {sending ? t.sending : t.submit}
      </button>
    </form>
  );
}
