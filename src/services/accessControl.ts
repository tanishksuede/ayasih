/**
 * accessControl.ts
 *
 * Client-side access control and feature gating helpers for AYA+ and Freemium monetization.
 *
 * NOTE: Server-side API endpoints (/api/check-access and /api/recommend-stories) remain
 * the authoritative source of truth for subscription access.
 *
 * Phase 5: Freemium + AYA+ + Premium Report + Production Hardening
 */

import type { UserProfile } from '../types/gameTypes';

export function isAyaPlusUser(_profile?: UserProfile | null): boolean {
    return true;
}

export function canAccessStory(_profile: UserProfile | null, _isStoryPremium: boolean): boolean {
    return true;
}
