"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLeadModal } from "@/components/lead/LeadModalProvider";
import type { NavItem } from "@/lib/dictionaries/layout/types";

/**
 * Мобильное меню шапки главной страницы. Разметка остаётся на нативном
 * `<details>/<summary>` (доступность "из коробки", без ручного
 * aria-expanded), но добавляет немного клиентской логики поверх:
 * закрытие по клику на пункт меню, по Escape и по клику вне меню.
 * Анимация иконки/панели полностью на CSS (`.mobile-menu[open] ...`).
 */
export function MobileMenu({
  navItems,
  menuAria,
  cta,
}: {
  navItems: NavItem[];
  menuAria: string;
  cta: NavItem;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const { open: openLeadModal } = useLeadModal();

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const closeMenu = () => {
      if (details.open) details.open = false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (details.open && !details.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const closeMenu = () => {
    const details = detailsRef.current;
    if (details?.open) details.open = false;
  };

  return (
    <details className="mobile-menu" ref={detailsRef}>
      <summary aria-label={menuAria}>
        <span></span>
        <span></span>
        <span></span>
      </summary>
      <nav>
        {navItems.map((item) =>
          item.href.startsWith("#") ? (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ),
        )}
        <div className="mobile-menu-divider" aria-hidden="true" />
        {/*
         * Не ссылка на бриф, а короткая заявка: закрываем панель и сразу
         * открываем модалку, чтобы <dialog> корректно забрал фокус.
         */}
        <button
          type="button"
          className="button button-primary mobile-menu-cta"
          onClick={() => {
            closeMenu();
            openLeadModal();
          }}
        >
          {cta.label}
        </button>
      </nav>
    </details>
  );
}
