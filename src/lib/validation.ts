/* Shared validation primitives. Client (form UIs, lib/submissions) and server
   (API route handlers) both import from here so the email rule can't drift
   between where it's checked in the browser and where it's re-checked on the
   server. No runtime deps — safe on either side. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}
