"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { EstimateFormDictionary } from "@/lib/dictionaries/estimate";
import type { Locale } from "@/lib/i18n";
import {
  buildBriefMessage,
  buildWhatsappUrl,
  formatBriefTimestamp,
  type BriefValues,
} from "@/lib/brief-message";
import "./brief-form.css";

/**
 * Бриф в четыре шага. Как и в оригинале, ничего не уходит на сервер-
 * форма собирает текст и открывает wa.me (см. MIGRATION-NEXTJS16-TAILWIND.md §10).
 *
 * Отличия от первой версии:
 * - пошаговый мастер с прогрессом вместо «простыни» из девяти полей;
 * - <select> заменены на карточки-радио (нативные input, поэтому стрелки
 *   и screen reader работают без ARIA-костылей);
 * - валидация на blur, ошибка- под своим полем, фокус уходит в первое
 *   невалидное поле;
 * - черновик переживает перезагрузку страницы (localStorage);
 * - перед отправкой показывается ровно тот текст, что уйдёт в WhatsApp.
 */

type FieldKey = keyof BriefValues;

const EMPTY_VALUES: BriefValues = {
  name: "",
  phone: "",
  city: "",
  objectType: "",
  stage: "",
  service: "",
  installation: "",
  deadline: "",
  description: "",
};

const DRAFT_KEY = "artstil:brief:v1";
const DESCRIPTION_MAX = 700;

const STEP_FIELDS: FieldKey[][] = [
  ["name", "phone", "city"],
  ["objectType", "stage"],
  ["service", "installation", "deadline"],
  ["description"],
];

const REQUIRED_FIELDS: FieldKey[] = [
  "name",
  "phone",
  "city",
  "objectType",
  "stage",
  "service",
  "installation",
  "deadline",
];

const TOTAL_STEPS = STEP_FIELDS.length;

type ErrorMap = Partial<Record<FieldKey | "consent", string>>;

function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

function withoutKey(errors: ErrorMap, key: FieldKey | "consent"): ErrorMap {
  if (!errors[key]) return errors;
  const next = { ...errors };
  delete next[key];
  return next;
}

/**
 * Мягкая маска: казахстанские номера приводим к +7 (7XX) XXX XX XX,
 * остальные просто группируем по три цифры и не мешаем вводить.
 *
 * `national` включается только на blur. Пока человек печатает, первая
 * семёрка- это код страны. Но если он закончил ввод на десяти цифрах,
 * начинающихся с 7 (то есть набрал «701…» без кода страны), дополняем
 * номер сами: полный казахстанский номер- всегда одиннадцать цифр.
 */
function formatPhone(raw: string, national = false): string {
  let d = digitsOf(raw);
  if (!d) return "";
  if (d[0] === "8") d = `7${d.slice(1)}`;
  if (national && d.length === 10 && d[0] === "7") d = `7${d}`;

  if (d[0] === "7") {
    d = d.slice(0, 11);
    let out = "+7";
    if (d.length > 1) out += ` (${d.slice(1, 4)}`;
    if (d.length >= 4) out += ")";
    if (d.length > 4) out += ` ${d.slice(4, 7)}`;
    if (d.length > 7) out += ` ${d.slice(7, 9)}`;
    if (d.length > 9) out += ` ${d.slice(9, 11)}`;
    return out;
  }

  return `+${d.slice(0, 15).replace(/(\d{3})(?=\d)/g, "$1 ")}`.trim();
}

function IconCheck() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 8.5 6.2 12 13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

function IconArrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <g transform={back ? "rotate(180 8 8)" : undefined}>
        <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      </g>
    </svg>
  );
}

function IconAlert() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.6v4.2M8 11.2v.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.481-8.465" />
    </svg>
  );
}

export function ProjectEstimateForm({
  privacyHref,
  locale,
  t,
}: {
  privacyHref: string;
  locale: Locale;
  t: EstimateFormDictionary;
}) {
  const uid = useId();
  const [values, setValues] = useState<BriefValues>(EMPTY_VALUES);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [step, setStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [showMessageText, setShowMessageText] = useState(false);
  const [blockedUrl, setBlockedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  const panelTitleRef = useRef<HTMLLegendElement>(null);
  const fieldRefs = useRef<Partial<Record<FieldKey | "consent", HTMLElement | null>>>({});
  const skipDraftSave = useRef(true);
  const stepAtMount = useRef(true);

  const steps = useMemo(
    () => [t.steps.contacts, t.steps.object, t.steps.task, t.steps.details] as const,
    [t],
  );

  /* ---------- Черновик ---------- */

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<BriefValues>;
      const restored = { ...EMPTY_VALUES };
      let hasValue = false;
      for (const key of Object.keys(EMPTY_VALUES) as FieldKey[]) {
        if (typeof parsed[key] === "string" && parsed[key]) {
          restored[key] = parsed[key] as string;
          hasValue = true;
        }
      }
      if (hasValue) {
        // Читать localStorage можно только после гидратации, иначе SSR и
        // клиент отрисуют разное. Отсюда setState в эффекте- это как раз
        // «синхронизация с внешним хранилищем», а не каскад рендеров.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValues(restored);
        setDraftRestored(true);
      }
    } catch {
      /* приватный режим или повреждённый JSON- работаем без черновика */
    }
  }, []);

  useEffect(() => {
    if (skipDraftSave.current) {
      skipDraftSave.current = false;
      return;
    }
    try {
      const hasValue = Object.values(values).some((value) => value.trim() !== "");
      if (hasValue) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      else window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* игнорируем: черновик- необязательная роскошь */
    }
  }, [values]);

  /* ---------- Фокус при смене шага ---------- */

  useEffect(() => {
    if (stepAtMount.current) {
      stepAtMount.current = false;
      return;
    }
    panelTitleRef.current?.focus();
  }, [step]);

  /* ---------- Валидация ---------- */

  const validateField = useCallback(
    (key: FieldKey, source: BriefValues): string => {
      switch (key) {
        case "name":
          return source.name.trim().length >= 2 ? "" : t.fieldErrors.name;
        case "phone":
          return digitsOf(source.phone).length >= 7 ? "" : t.fieldErrors.phone;
        case "city":
          return source.city.trim() ? "" : t.fieldErrors.city;
        case "description":
          return "";
        default:
          return source[key] ? "" : t.fieldErrors.choice;
      }
    },
    [t],
  );

  const setValue = useCallback(
    (key: FieldKey, value: string) => {
      setValues((previous) => {
        const next = { ...previous, [key]: value };
        // Ошибку снимаем сразу, как только поле стало валидным-
        // но не показываем новую, пока пользователь печатает.
        setErrors((currentErrors) => {
          if (!currentErrors[key]) return currentErrors;
          if (validateField(key, next)) return currentErrors;
          return withoutKey(currentErrors, key);
        });
        return next;
      });
      setFormError("");
    },
    [validateField],
  );

  const handleBlur = useCallback(
    (key: FieldKey) => {
      setErrors((currentErrors) => {
        const message = validateField(key, values);
        if (!message) return withoutKey(currentErrors, key);
        return { ...currentErrors, [key]: message };
      });
    },
    [validateField, values],
  );

  const focusFirstInvalid = useCallback((keys: Array<FieldKey | "consent">) => {
    for (const key of keys) {
      const node = fieldRefs.current[key];
      if (node) {
        node.focus();
        node.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
    }
  }, []);

  const validateStep = useCallback(
    (index: number): boolean => {
      const found: ErrorMap = {};
      for (const key of STEP_FIELDS[index]) {
        const message = validateField(key, values);
        if (message) found[key] = message;
      }
      if (index === TOTAL_STEPS - 1 && !consent) found.consent = t.fieldErrors.consent;

      if (Object.keys(found).length === 0) {
        setErrors({});
        return true;
      }
      setErrors(found);
      setFormError(t.error);
      focusFirstInvalid(Object.keys(found) as Array<FieldKey | "consent">);
      return false;
    },
    [consent, focusFirstInvalid, t, validateField, values],
  );

  const goToStep = useCallback(
    (index: number) => {
      setFormError("");
      setSuccess(false);
      setStep(index);
      setMaxVisitedStep((previous) => Math.max(previous, index));
      // Время ставим здесь, а не в эффекте: на последнем шаге предпросмотр
      // должен показывать ту же метку, что уйдёт в WhatsApp.
      if (index === TOTAL_STEPS - 1) setTimestamp(formatBriefTimestamp(locale));
    },
    [locale],
  );

  const handleNext = useCallback(() => {
    if (!validateStep(step)) return;
    goToStep(Math.min(step + 1, TOTAL_STEPS - 1));
  }, [goToStep, step, validateStep]);

  /* ---------- Прогресс ---------- */

  const completedCount = useMemo(() => {
    let done = REQUIRED_FIELDS.filter((key) => !validateField(key, values)).length;
    if (consent) done += 1;
    return done;
  }, [consent, validateField, values]);

  const percent = Math.round((completedCount / (REQUIRED_FIELDS.length + 1)) * 100);

  /* ---------- Сообщение ---------- */

  const previewMessage = useMemo(
    () => buildBriefMessage(t, values, timestamp),
    [t, timestamp, values],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    setBlockedUrl("");

    // Проверяем всю форму, а не только последний шаг: до сюда можно
    // добраться по чипам прогресса, перепрыгнув незаполненный шаг.
    const found: ErrorMap = {};
    for (const key of REQUIRED_FIELDS) {
      const message = validateField(key, values);
      if (message) found[key] = message;
    }
    if (!consent) found.consent = t.fieldErrors.consent;

    if (Object.keys(found).length > 0) {
      setErrors(found);
      setFormError(t.error);
      const firstBrokenStep = STEP_FIELDS.findIndex((fields) =>
        fields.some((key) => found[key]),
      );
      if (firstBrokenStep !== -1 && firstBrokenStep !== step) {
        setStep(firstBrokenStep);
        return;
      }
      focusFirstInvalid(Object.keys(found) as Array<FieldKey | "consent">);
      return;
    }

    setErrors({});
    setFormError("");
    setSending(true);

    const message = buildBriefMessage(t, values, formatBriefTimestamp(locale));
    const url = buildWhatsappUrl(message);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) setBlockedUrl(url);

    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* не критично */
    }

    setSending(false);
    setSuccess(true);
    setDraftRestored(false);
  }

  function handleClearDraft() {
    setValues(EMPTY_VALUES);
    setConsent(false);
    setErrors({});
    setFormError("");
    setSuccess(false);
    setDraftRestored(false);
    setStep(0);
    setMaxVisitedStep(0);
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* не критично */
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(previewMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  /* ---------- Рендер-хелперы ---------- */

  function renderTextField(
    key: Extract<FieldKey, "name" | "phone" | "city">,
    options: { type: string; autoComplete: string; inputMode?: "text" | "tel"; hint?: string },
  ) {
    const id = `${uid}-${key}`;
    const error = errors[key];
    const hintId = options.hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className={`brief-field${error ? " has-error" : ""}`}>
        <label className="brief-label" htmlFor={id}>
          {t.fields[key]}
          <span className="brief-label-required" aria-hidden="true">
            *
          </span>
        </label>
        <input
          ref={(node) => {
            fieldRefs.current[key] = node;
          }}
          className="brief-input"
          id={id}
          name={key}
          type={options.type}
          inputMode={options.inputMode}
          autoComplete={options.autoComplete}
          placeholder={t.placeholders[key]}
          value={values[key]}
          required
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          onChange={(event) => {
            if (key !== "phone") {
              setValue(key, event.target.value);
              return;
            }
            const element = event.target;
            const atEnd = element.selectionStart === element.value.length;
            setValue("phone", atEnd ? formatPhone(element.value) : element.value);
          }}
          onBlur={() => {
            if (key === "phone") setValue("phone", formatPhone(values.phone, true));
            handleBlur(key);
          }}
        />
        {error ? (
          <p className="brief-field-error" id={errorId} role="alert">
            <IconAlert />
            {error}
          </p>
        ) : (
          options.hint && (
            <p className="brief-hint" id={hintId}>
              {options.hint}
            </p>
          )
        )}
      </div>
    );
  }

  function renderChoice(
    key: Extract<FieldKey, "objectType" | "stage" | "service" | "installation" | "deadline">,
    options: string[],
  ) {
    const error = errors[key];
    const errorId = `${uid}-${key}-error`;

    return (
      <fieldset
        className={`brief-choice${error ? " has-error" : ""}`}
        aria-describedby={error ? errorId : undefined}
      >
        <legend className="brief-choice-legend">
          {t.fields[key]}
          <span aria-hidden="true">*</span>
        </legend>
        <div className="brief-options">
          {options.map((option, index) => {
            const selected = values[key] === option;
            return (
              <label
                key={option}
                className={`brief-option${selected ? " is-selected" : ""}`}
              >
                <input
                  ref={
                    index === 0
                      ? (node) => {
                          fieldRefs.current[key] = node;
                        }
                      : undefined
                  }
                  type="radio"
                  name={`${uid}-${key}`}
                  value={option}
                  checked={selected}
                  onChange={() => setValue(key, option)}
                />
                <span className="brief-option-mark" aria-hidden="true">
                  <IconCheck />
                </span>
                <span className="brief-option-text">{option}</span>
              </label>
            );
          })}
        </div>
        {error && (
          <p className="brief-field-error" id={errorId} role="alert">
            <IconAlert />
            {error}
          </p>
        )}
      </fieldset>
    );
  }

  const reviewRows: Array<{ label: string; value: string; step: number }> = [
    { label: t.message.name, value: values.name, step: 0 },
    { label: t.message.phone, value: values.phone, step: 0 },
    { label: t.message.city, value: values.city, step: 0 },
    { label: t.message.objectType, value: values.objectType, step: 1 },
    { label: t.message.stage, value: values.stage, step: 1 },
    { label: t.message.service, value: values.service, step: 2 },
    { label: t.message.installation, value: values.installation, step: 2 },
    { label: t.message.deadline, value: values.deadline, step: 2 },
  ];

  const progressLabel = t.nav.progress
    .replace("{step}", String(step + 1))
    .replace("{total}", String(TOTAL_STEPS));

  const consentId = `${uid}-consent`;
  const descriptionId = `${uid}-description`;
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <form className="brief" onSubmit={handleSubmit} noValidate>
      {draftRestored && (
        <p className="brief-draft">
          <span>{t.draft.restored}</span>
          <button type="button" onClick={handleClearDraft}>
            {t.draft.clear}
          </button>
        </p>
      )}

      <div className="brief-progress">
        <div className="brief-progress-head">
          <span className="brief-progress-label">{progressLabel}</span>
          <span className="brief-progress-percent">{percent}%</span>
        </div>
        <div
          className="brief-progress-rail"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={progressLabel}
        >
          <div className="brief-progress-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="brief-progress-steps">
          {steps.map((item, index) => {
            const done = index < maxVisitedStep && STEP_FIELDS[index].every((key) => !validateField(key, values));
            const reachable = index <= maxVisitedStep;
            return (
              <button
                key={item.chip}
                type="button"
                className={[
                  "brief-step-chip",
                  index === step ? "is-active" : "",
                  done && index !== step ? "is-done" : "",
                  reachable ? "is-reachable" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                // Подпись скрыта на мобильных (display:none), поэтому имя
                // кнопки задаём явно, а не вычисляем из содержимого.
                aria-label={`${index + 1}. ${item.chip}`}
                aria-current={index === step ? "step" : undefined}
                disabled={!reachable}
                onClick={() => {
                  if (index > step && !validateStep(step)) return;
                  goToStep(index);
                }}
              >
                <span className="brief-step-chip-index" aria-hidden="true">
                  {done && index !== step ? <IconCheck /> : index + 1}
                </span>
                <span className="brief-step-chip-text">{item.chip}</span>
              </button>
            );
          })}
        </div>
      </div>

      <fieldset className="brief-panel" key={step}>
        <legend className="brief-panel-title" ref={panelTitleRef} tabIndex={-1}>
          {steps[step].title}
        </legend>
        <div className="brief-panel-head">
          <p className="brief-panel-hint">{steps[step].hint}</p>
        </div>

        {step === 0 && (
          <div className="brief-grid">
            {renderTextField("name", { type: "text", autoComplete: "name" })}
            {renderTextField("phone", {
              type: "tel",
              autoComplete: "tel",
              inputMode: "tel",
              hint: t.hints.phone,
            })}
            <div className="brief-field-wide">
              {renderTextField("city", { type: "text", autoComplete: "address-level2" })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="brief-grid">
            <div className="brief-field-wide">{renderChoice("objectType", t.options.objectTypes)}</div>
            <div className="brief-field-wide">{renderChoice("stage", t.options.stages)}</div>
          </div>
        )}

        {step === 2 && (
          <div className="brief-grid">
            <div className="brief-field-wide">{renderChoice("service", t.options.services)}</div>
            <div className="brief-field-wide">{renderChoice("installation", t.options.installation)}</div>
            <div className="brief-field-wide">{renderChoice("deadline", t.options.deadlines)}</div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="brief-field">
              <label className="brief-label" htmlFor={descriptionId}>
                {t.fields.description}
                <span className="brief-label-optional">{t.nav.optional}</span>
              </label>
              <textarea
                className="brief-textarea"
                id={descriptionId}
                name="description"
                rows={5}
                maxLength={DESCRIPTION_MAX}
                placeholder={t.placeholders.description}
                value={values.description}
                aria-describedby={`${descriptionId}-hint`}
                onChange={(event) => setValue("description", event.target.value)}
              />
              <div className="brief-hint-row" id={`${descriptionId}-hint`}>
                <p className="brief-hint">{t.hints.description}</p>
                <span className="brief-counter">
                  {values.description.length} / {DESCRIPTION_MAX}
                </span>
              </div>
            </div>

            <div className="brief-review">
              <div className="brief-review-head">
                <h3 className="brief-review-title">{t.review.title}</h3>
                <button
                  type="button"
                  className="brief-review-toggle"
                  aria-expanded={showMessageText}
                  onClick={() => setShowMessageText((previous) => !previous)}
                >
                  {showMessageText ? t.review.hideText : t.review.showText}
                </button>
              </div>

              {showMessageText ? (
                <pre className="brief-review-text">{previewMessage}</pre>
              ) : (
                <dl className="brief-review-list">
                  {reviewRows.map((row) => (
                    <div className="brief-review-row" key={row.label}>
                      <dt className="brief-review-key">{row.label}</dt>
                      <dd className="brief-review-value">{row.value || t.message.empty}</dd>
                      <button
                        type="button"
                        className="brief-review-edit"
                        onClick={() => goToStep(row.step)}
                      >
                        {t.nav.edit}
                      </button>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <p className="brief-review-note">{t.review.note}</p>

            <label className={`brief-consent${errors.consent ? " has-error" : ""}`} htmlFor={consentId}>
              <input
                ref={(node) => {
                  fieldRefs.current.consent = node;
                }}
                id={consentId}
                type="checkbox"
                name="consent"
                checked={consent}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? `${consentId}-error` : undefined}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  if (event.target.checked) {
                    setErrors((currentErrors) => withoutKey(currentErrors, "consent"));
                    setFormError("");
                  }
                }}
              />
              <span>
                {t.consent}{" "}
                <a className="brief-privacy-link" target="_blank" rel="noreferrer" href={privacyHref}>
                  {t.privacyLink}
                </a>
              </span>
            </label>
            {errors.consent && (
              <p className="brief-field-error" id={`${consentId}-error`} role="alert">
                <IconAlert />
                {errors.consent}
              </p>
            )}
          </>
        )}
      </fieldset>

      <p className="brief-sr" aria-live="polite">
        {progressLabel}. {steps[step].title}
      </p>

      {formError && (
        <p className="brief-alert brief-alert-error" role="alert">
          {formError}
        </p>
      )}

      {success && (
        <div className="brief-alert brief-alert-success" role="status">
          {t.success}
          <div className="brief-alert-actions">
            {blockedUrl ? (
              <>
                <span>{t.fallback.text}</span>
                <a href={blockedUrl} target="_blank" rel="noreferrer">
                  {t.fallback.open}
                </a>
              </>
            ) : null}
            <button type="button" onClick={handleCopy}>
              {copied ? t.fallback.copied : t.fallback.copy}
            </button>
          </div>
        </div>
      )}

      <div className="brief-actions">
        {step > 0 ? (
          <button type="button" className="brief-back" onClick={() => goToStep(step - 1)}>
            <IconArrow back />
            {t.nav.back}
          </button>
        ) : (
          <span />
        )}

        {isLastStep ? (
          <button className="brief-submit" type="submit" disabled={sending}>
            <span className="brief-submit-icon" aria-hidden="true">
              <IconWhatsapp />
            </span>
            {sending ? t.sending : t.submit}
          </button>
        ) : (
          <button type="button" className="brief-next" onClick={handleNext}>
            {t.nav.next}
            <IconArrow />
          </button>
        )}
      </div>
    </form>
  );
}
