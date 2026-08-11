"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LeadModal } from "./LeadModal";

/**
 * Одна модалка на всё приложение: провайдер монтируется единожды в
 * app/[locale]/layout.tsx и оборачивает содержимое страницы. Любая кнопка
 * на сайте открывает её через useLeadModal() (см. LeadTriggerButton).
 *
 * Провайдер- клиентский компонент, поэтому layout остаётся серверным:
 * граница "use client" проходит здесь, а children приезжают из RSC как
 * готовое дерево и клиентскими не становятся.
 */

type LeadModalContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<LeadModalContextValue>(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <LeadModal locale={locale} isOpen={isOpen} onClose={close} />
    </LeadModalContext.Provider>
  );
}

export function useLeadModal(): LeadModalContextValue {
  const context = useContext(LeadModalContext);
  if (!context) {
    throw new Error("useLeadModal() требует <LeadModalProvider> выше по дереву.");
  }
  return context;
}
