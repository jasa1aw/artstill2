"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLeadModal } from "@/components/lead/LeadModalProvider";
import type { LayoutDictionary } from "@/lib/dictionaries/layout/types";

type Props = {
  t: LayoutDictionary["internalHeader"];
  menuAria: string;
  section: string;
};

/**
 * Бургер-меню внутренних страниц. Обёрнуто в клиентский компонент только
 * ради интерактивности поверх нативного <details>/<summary>: закрытие по
 * клику на пункт меню, по Escape, по клику вне панели, и блокировка скролла
 * фона, пока панель открыта. Анимация открытия/закрытия и трансформация
 * иконки гамбургера в крестик реализованы чистым CSS через [open] и
 * @starting-style в globals.css (`.internal-mobile-menu` правила).
 */
export function InternalMobileMenu({ t, menuAria, section }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { open: openLeadModal } = useLeadModal();

  const close = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const handleToggle = () => setIsOpen(details.open);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.open) close();
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (details.open && !details.contains(event.target as Node)) close();
    };

    details.addEventListener("toggle", handleToggle);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);
    return () => {
      details.removeEventListener("toggle", handleToggle);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <details className="internal-mobile-menu" ref={detailsRef}>
      <summary aria-label={menuAria} aria-expanded={isOpen}>
        <span></span>
        <span></span>
        <span></span>
      </summary>
      <nav>
        <Link href={t.home.href} onClick={close}>
          {t.home.label}
        </Link>
        {t.nav.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={section === item.key ? "active" : undefined}
            onClick={close}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={t.estimate.href}
          className={section === t.estimate.key ? "active" : undefined}
          onClick={close}
        >
          {t.estimate.label}
        </Link>
        <a href={t.mobileContacts.href} onClick={close}>
          {t.mobileContacts.label}
        </a>
        {/*
         * Не ссылка на бриф, а короткая заявка: закрываем панель и сразу
         * открываем модалку, чтобы <dialog> корректно забрал фокус.
         */}
        <button
          type="button"
          className="internal-mobile-menu-cta"
          onClick={() => {
            close();
            openLeadModal();
          }}
        >
          {t.mobileCta.label}
        </button>
      </nav>
    </details>
  );
}
