"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { layoutDictionary } from "@/lib/dictionaries/layout";
import type { Locale } from "@/lib/i18n";
import { buildWhatsappUrl } from "@/lib/brief-message";
import {
  buildLeadMessage,
  digitsOf,
  formatPhone,
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
} from "@/lib/lead-message";
import "./lead-modal.css";

/**
 * Короткая заявка- имя и телефон, больше ничего.
 * Это низкопороговая альтернатива полному брифу (/[locale]/estimate),
 * а не его замена: бриф остаётся на месте и живёт своей жизнью.
 *
 * Как и бриф, форма ничего не отправляет на сервер: собирает текст по
 * шаблону из словаря и открывает wa.me (см. lib/brief-message.ts).
 *
 * Диалог- нативный <dialog> + showModal(). Ловушка фокуса, ESC и
 * ::backdrop приходят от браузера, поэтому руками остаётся только
 * блокировка прокрутки фона и возврат фокуса на триггер (страховка:
 * сам <dialog> тоже возвращает фокус, но не всегда, если триггер
 * успел размонтироваться).
 */

type FieldKey = "name" | "phone";
type ErrorMap = Partial<Record<FieldKey, string>>;

function IconClose() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
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

export function LeadModal({
  locale,
  isOpen,
  onClose,
}: {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = layoutDictionary[locale].leadModal;
  const uid = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<ErrorMap>({});
  const [blockedUrl, setBlockedUrl] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  /* Заявка ушла- поля чистим не сразу, а при следующем открытии,
     иначе панель пустеет прямо во время анимации закрытия. */
  const sentRef = useRef(false);

  /* ---------- Открытие / закрытие ---------- */

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        if (sentRef.current) {
          sentRef.current = false;
          setName("");
          setPhone("");
        }
        setErrors({});
        setBlockedUrl("");
        dialog.showModal();
        nameRef.current?.focus();
      }
      return;
    }

    if (dialog.open) dialog.close();
  }, [isOpen]);

  /*
   * Блокировка прокрутки фона. Замок вешаем на <html>, а не на <body>:
   * в globals.css у html задан свой overflow, поэтому overflow тела до
   * вьюпорта уже не «пробрасывается» и фон продолжал бы скроллиться.
   *
   * Класс (см. lead-modal.css) добавляет scrollbar-gutter: stable, чтобы
   * полоса прокрутки не исчезала вместе со скроллом и страница не дёргалась.
   * Ширину проверяем по факту: если браузер полосу всё-таки убрал
   * (нет поддержки scrollbar-gutter), компенсируем её padding'ом.
   */
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previousPadding = root.style.paddingRight;

    const widthBefore = root.clientWidth;
    root.classList.add("lead-scroll-lock");
    const gap = root.clientWidth - widthBefore;
    if (gap > 0) root.style.paddingRight = `${gap}px`;

    return () => {
      root.classList.remove("lead-scroll-lock");
      root.style.paddingRight = previousPadding;
    };
  }, [isOpen]);

  /* ESC и клик по подложке приводят сюда же, что и кнопка «закрыть»:
     событие close у <dialog> одно на все способы. */
  const handleDialogClose = useCallback(() => {
    onClose();
    const trigger = triggerRef.current;
    triggerRef.current = null;
    // Страховка: если браузер оставил фокус на <body>, возвращаем его сами.
    if (trigger?.isConnected && document.activeElement === document.body) trigger.focus();
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    // У <dialog> нет внутренних отступов, вся разметка лежит в .lead-panel,
    // поэтому target === сам диалог означает клик именно по подложке.
    if (event.target === dialogRef.current) onClose();
  }

  /* ---------- Валидация ---------- */

  function validate(nextName: string, nextPhone: string): ErrorMap {
    const found: ErrorMap = {};
    if (nextName.trim().length < 2) found.name = t.errors.nameRequired;

    const length = digitsOf(nextPhone).length;
    if (length === 0) found.phone = t.errors.phoneRequired;
    else if (length < PHONE_MIN_DIGITS || length > PHONE_MAX_DIGITS) {
      found.phone = t.errors.phoneInvalid;
    }
    return found;
  }

  function clearErrorIfFixed(key: FieldKey, nextName: string, nextPhone: string) {
    setErrors((current) => {
      if (!current[key]) return current;
      if (validate(nextName, nextPhone)[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBlockedUrl("");

    // Нормализуем номер перед проверкой: «701…» без кода страны- валидный ввод.
    const nextPhone = formatPhone(phone, true);
    if (nextPhone !== phone) setPhone(nextPhone);

    const found = validate(name, nextPhone);
    if (found.name || found.phone) {
      setErrors(found);
      (found.name ? nameRef : phoneRef).current?.focus();
      return;
    }

    setErrors({});
    const url = buildWhatsappUrl(buildLeadMessage(t.whatsappMessage, name, nextPhone));
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      // Всплывающее окно заблокировано- оставляем модалку открытой со ссылкой.
      setBlockedUrl(url);
      return;
    }

    sentRef.current = true;
    onClose();
  }

  const titleId = `${uid}-title`;
  const leadId = `${uid}-lead`;
  const nameId = `${uid}-name`;
  const phoneId = `${uid}-phone`;

  return (
    <dialog
      ref={dialogRef}
      className="lead-dialog"
      aria-labelledby={titleId}
      aria-describedby={leadId}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
    >
      <div className="lead-panel">
        <button type="button" className="lead-close" aria-label={t.closeAria} onClick={onClose}>
          <IconClose />
        </button>

        <p className="lead-eyebrow">{t.eyebrow}</p>
        <h2 className="lead-title" id={titleId}>
          {t.title}
        </h2>
        <p className="lead-lead" id={leadId}>
          {t.lead}
        </p>

        <form className="lead-form" onSubmit={handleSubmit} noValidate>
          <div className={`lead-field${errors.name ? " has-error" : ""}`}>
            <label className="lead-label" htmlFor={nameId}>
              {t.nameLabel}
              <span className="lead-label-required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              ref={nameRef}
              className="lead-input"
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              placeholder={t.namePlaceholder}
              value={name}
              required
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              onChange={(event) => {
                setName(event.target.value);
                clearErrorIfFixed("name", event.target.value, phone);
              }}
              onBlur={() => {
                const found = validate(name, phone);
                setErrors((current) => ({ ...current, name: found.name }));
              }}
            />
            {errors.name && (
              <p className="lead-error" id={`${nameId}-error`} role="alert">
                <IconAlert />
                {errors.name}
              </p>
            )}
          </div>

          <div className={`lead-field${errors.phone ? " has-error" : ""}`}>
            <label className="lead-label" htmlFor={phoneId}>
              {t.phoneLabel}
              <span className="lead-label-required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              ref={phoneRef}
              className="lead-input"
              id={phoneId}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.phonePlaceholder}
              value={phone}
              required
              aria-required="true"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
              onChange={(event) => {
                const element = event.target;
                // Маску применяем только когда курсор в конце строки-
                // иначе правка в середине номера прыгала бы.
                const atEnd = element.selectionStart === element.value.length;
                const next = atEnd ? formatPhone(element.value) : element.value;
                setPhone(next);
                clearErrorIfFixed("phone", name, next);
              }}
              onBlur={() => {
                const next = formatPhone(phone, true);
                setPhone(next);
                const found = validate(name, next);
                setErrors((current) => ({ ...current, phone: found.phone }));
              }}
            />
            {errors.phone && (
              <p className="lead-error" id={`${phoneId}-error`} role="alert">
                <IconAlert />
                {errors.phone}
              </p>
            )}
          </div>

          <button className="lead-submit" type="submit">
            <span className="lead-submit-icon" aria-hidden="true">
              <IconWhatsapp />
            </span>
            {t.submit}
          </button>

          {blockedUrl ? (
            <p className="lead-fallback" role="alert">
              <a href={blockedUrl} target="_blank" rel="noreferrer">
                {t.submit}
              </a>
            </p>
          ) : (
            <p className="lead-note">{t.note}</p>
          )}
        </form>
      </div>
    </dialog>
  );
}
