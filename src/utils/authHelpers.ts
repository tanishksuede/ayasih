/**
 * authHelpers.ts
 *
 * Helpers for bridging AYA's mobile/phone-based identity model
 * with Supabase Auth email/password sessions.
 *
 * Mobile users are registered in Supabase Auth using a
 * deterministic synthetic email derived from their phone number.
 * This gives every user a real Supabase Auth JWT so that
 * auth.uid() is populated for all users, enabling strict RLS.
 *
 * SECURITY NOTE:
 * - The email domain (@aya-game.com) is internal and never exposed as UX.
 * - The password is deterministically derived but salted with VITE_AUTH_SALT
 *   so that knowing only the mobile number is insufficient to derive credentials.
 * - These are not "real" passwords — they are auth tokens for the internal
 *   mobile-to-Supabase bridge. Users never see or type them.
 */

/**
 * Derive a deterministic synthetic email from a mobile number.
 * Strips all non-digit characters first.
 */
export function deriveMobileEmail(mobile: string): string {
  const clean = mobile.replace(/\D/g, '');
  return `mobile_${clean}@aya-game.com`;
}

/**
 * Derive a deterministic auth password from a mobile number + project salt.
 * The salt comes from VITE_AUTH_SALT in .env.local to prevent brute-force
 * derivation of any user's auth credentials from their phone number alone.
 */
async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function deriveMobilePassword(mobile: string): Promise<string> {
  const clean = mobile.replace(/\D/g, '');
  const salt = import.meta.env.VITE_AUTH_SALT;
  if (!salt) throw new Error('VITE_AUTH_SALT must be configured for mobile authentication.');
  const hmac = await hmacSha256(salt, clean);
  return `Aya${hmac}!A`;
}

/** Temporary compatibility bridge for accounts created before HMAC hardening. */
export function deriveLegacyMobilePassword(mobile: string): string {
  const salt = import.meta.env.VITE_AUTH_SALT;
  if (!salt) throw new Error('VITE_AUTH_SALT must be configured for mobile authentication.');
  return `Aya${salt.slice(0, 4)}${mobile.replace(/\D/g, '')}!Auth`;
}
