/**
 * Centralised env-gate config for ZUKKA storefront.
 *
 * All NEXT_PUBLIC_* reads live here. Components consume these helpers so
 * they never call process.env directly and never ship hard-coded placeholders.
 */

/** WhatsApp phone number (E.164 without +), e.g. "5491112345678". Null when unset. */
export const whatsappNumber: string | null =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || null;

/**
 * Cuotas count for installments micro-copy.
 * Canonical env var: NEXT_PUBLIC_CUOTAS_COUNT (spec wins over design doc).
 * Null when unset or not a positive integer.
 */
export const installmentsCount: number | null = (() => {
  const raw = process.env.NEXT_PUBLIC_CUOTAS_COUNT?.trim();
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
})();

/**
 * Returns the wa.me href for a given optional message.
 * Returns null when NEXT_PUBLIC_WHATSAPP_NUMBER is unset — callers must
 * render a non-interactive state rather than a dead link.
 */
export function getWhatsAppHref(message?: string): string | null {
  if (!whatsappNumber) return null;
  const base = `https://wa.me/${whatsappNumber}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

/**
 * Truthful payment micro-copy:
 * - When cuotas count is configured: "Hasta {N} cuotas — pago en el checkout de Tienda Nube."
 * - Otherwise: "Pagás como quieras en el checkout de Tienda Nube."
 */
export function resolvePaymentCopy(): string {
  if (installmentsCount) {
    return `Hasta ${installmentsCount} cuotas — pago en el checkout de Tienda Nube.`;
  }
  return "Pagás como quieras en el checkout de Tienda Nube.";
}
