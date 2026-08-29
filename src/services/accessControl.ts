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

import { PRICING_CONFIG } from '../config/recommendationConfig';
import type { UserProfile } from '../types/gameTypes';

export function isAyaPlusUser(profile?: UserProfile | null): boolean {
    if (!profile) return false;
    const accessType = profile.access_type || 'free';
    return ['aya_plus', 'jee15', 'neet15', 'upsc'].includes(accessType);
}

export function canAccessStory(profile: UserProfile | null, isStoryPremium: boolean): boolean {
    if (!isStoryPremium) return true;
    return isAyaPlusUser(profile);
}

export function getSubscriptionPlanDetails() {
    return {
        monthly: {
            id: 'aya_plus_monthly',
            name: 'AYA+ Monthly',
            amount: PRICING_CONFIG.monthly_price_inr,
            interval: 'month',
            currency: PRICING_CONFIG.currency_symbol
        },
        annual: {
            id: 'aya_plus_annual',
            name: 'AYA+ Annual',
            amount: PRICING_CONFIG.annual_price_inr,
            interval: 'year',
            currency: PRICING_CONFIG.currency_symbol,
            savingsLabel: 'Save over 58%'
        },
        dnaReport: {
            id: 'aya_dna_career_report',
            name: 'Full AYA DNA + Aligned Directions Report',
            amount: PRICING_CONFIG.report_price_min_inr,
            currency: PRICING_CONFIG.currency_symbol,
            type: 'one_time'
        }
    };
}
