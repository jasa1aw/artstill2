"use client"

import { useEffect, useRef, useState } from "react"

/** "100%" -> {target: 100, suffix: "%"}. Non-numeric values (e.g. "KZ") return null. */
function parseValue(raw: string): { target: number; suffix: string } | null {
  const match = raw.match(/^(\d+)(.*)$/)
  if (!match) return null
  return { target: Number(match[1]), suffix: match[2] }
}

const DURATION_MS = 1400

/**
 * Не часть оригинала- там анимаций не было вовсе (see MIGRATION doc).
 * Добавлено по запросу поверх переноса: цифра считает вверх от 0 при
 * входе в область видимости. Нечисловые значения (например "KZ")
 * просто показываются как есть, без анимации.
 */
export function AnimatedStat({ value }: { value: string }) {
  const parsed = parseValue(value)
  const [display, setDisplay] = useState(parsed ? `0${parsed.suffix}` : value)
  const ref = useRef<HTMLElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const parsedValue = parseValue(value)
    if (!parsedValue || !ref.current) return

    const node = ref.current
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    let frame = 0

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry.isIntersecting || startedRef.current) return
        startedRef.current = true
        observer.disconnect()

        if (reduceMotion) {
          setDisplay(value)
          return
        }

        // Разбираем ДО объявления tick: сужение типа parsedValue не
        // переносится внутрь вложенной функции, а target/suffix — обычные
        // number/string, поэтому null-проверка внутри tick не нужна.
        const { target, suffix } = parsedValue
        const start = performance.now()

        function tick(now: number) {
          const progress = Math.min((now - start) / DURATION_MS, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(`${Math.round(eased * target)}${suffix}`)
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return <strong ref={ref}>{display}</strong>
}
