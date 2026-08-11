/**
 * Хелперы для короткой заявки (components/lead/LeadModal.tsx).
 *
 * Модалка- низкопороговая альтернатива полному брифу: только имя и телефон.
 * На сервер, как и бриф, ничего не уходит- собираем текст и открываем wa.me
 * через buildWhatsappUrl() из lib/brief-message.ts.
 */

export function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Та же мягкая маска, что в брифе (components/estimate/ProjectEstimateForm.tsx):
 * казахстанские номера приводим к +7 (7XX) XXX XX XX, остальные просто
 * группируем по три цифры и не мешаем вводить.
 *
 * `national` включается только на blur. Пока человек печатает, первая
 * семёрка- это код страны. Но если он закончил ввод на десяти цифрах,
 * начинающихся с 7 (то есть набрал «701…» без кода страны), дополняем
 * номер сами: полный казахстанский номер- всегда одиннадцать цифр.
 */
export function formatPhone(raw: string, national = false): string {
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

/** Минимум цифр в номере: 10 (без кода страны) …15 (E.164). */
export const PHONE_MIN_DIGITS = 10;
export const PHONE_MAX_DIGITS = 15;

export function isPlausiblePhone(value: string): boolean {
  const length = digitsOf(value).length;
  return length >= PHONE_MIN_DIGITS && length <= PHONE_MAX_DIGITS;
}

/**
 * Подставляет значения в шаблон из словаря (leadModal.whatsappMessage).
 * Замена через функцию, а не строку: иначе `$&` в имени сломал бы результат.
 */
export function buildLeadMessage(template: string, name: string, phone: string): string {
  return template.replace("{name}", () => name.trim()).replace("{phone}", () => phone.trim());
}
