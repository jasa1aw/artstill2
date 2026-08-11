"use client";

import { useLeadModal } from "./LeadModalProvider";

/**
 * Кнопка, открывающая короткую заявку. Именно <button>, а не <a>/<Link>:
 * никуда не ведёт, а открывает диалог на месте, и <dialog> вернёт на неё
 * фокус при закрытии.
 *
 * className приходит снаружи- это существующие классы сайта,
 * например "button button-primary".
 */
export function LeadTriggerButton({ label, className }: { label: string; className?: string }) {
  const { open } = useLeadModal();

  return (
    <button type="button" className={className} onClick={open}>
      {label}
    </button>
  );
}
