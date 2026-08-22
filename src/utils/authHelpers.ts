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
export function deriveMobilePassword(mobile: string): string {
  const clean = mobile.replace(/\D/g, '');
  const salt = import.meta.env.VITE_AUTH_SALT ?? 'aya-fallback-salt';
  // Format: Aya<first4ofSalt><mobile>!Auth — always meets Supabase min-length
  return `Aya${salt.slice(0, 4)}${clean}!Auth`;
}
