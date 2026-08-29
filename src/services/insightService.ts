/**
 * insightService.ts
 *
 * Dedicated service for longitudinal identity insights, behavioral dissonance,
 * and chapter evolution.
 *
 * Phase 3: Personalized User Experience + DNA Insights
 */

import { CURRENT_CHAPTERS, RECOMMENDATION_CONFIG } from '../config/recommendationConfig';
import type { DnaTrait, SurpriseInsight, CurrentChapter, EmergingYouInsight } from '../types/ayaTypes';
import type { PersonalityTraits, PsychometricScores } from '../types/gameTypes';

const TRAIT_DISPLAY_NAMES: Record<DnaTrait, string> = {
    risk: 'Risk Tolerance',
    creativity: 'Creative Instinct',
    vision: 'Vision & Systems Thinking',
    empathy: 'Empathy & Social Attunement',
    leadership: 'Decisive Leadership'
};

/**
 * Compare user's baseline self-view (onboarding) vs active gameplay decisions.
 * Returns a surprise insight if any trait has deviated significantly (>= 12 pts).
 * Language is always curiosity-driven and never shaming.
 */
export function generateSurprisedInsight(
    onboardingScores?: PsychometricScores | Record<string, number>,
    gameplayScores?: PsychometricScores | PersonalityTraits | Record<string, number>
): SurpriseInsight | null {
    if (!onboardingScores || !gameplayScores) return null;

    const traits: DnaTrait[] = ['risk', 'creativity', 'vision', 'empathy', 'leadership'];
    let maxDelta = 0;
    let selectedTrait: DnaTrait | null = null;
    let direction: 'higher' | 'lower' = 'higher';

    for (const t of traits) {
        const selfView = (onboardingScores as any)[t] ?? 50;
        const actualAction = (gameplayScores as any)[t] ?? 50;
        const delta = actualAction - selfView;

        if (Math.abs(delta) >= RECOMMENDATION_CONFIG.surprise_insight_min_delta && Math.abs(delta) > maxDelta) {
            maxDelta = Math.abs(delta);
            selectedTrait = t;
            direction = delta > 0 ? 'higher' : 'lower';
        }
    }

    if (!selectedTrait || maxDelta < RECOMMENDATION_CONFIG.surprise_insight_min_delta) {
        return null;
    }

    const traitName = TRAIT_DISPLAY_NAMES[selectedTrait];

    let headline = '';
    let detail = '';

    if (direction === 'higher') {
        headline = `You showed more ${traitName.toLowerCase()} than you initially gave yourself credit for.`;
        detail = `In your initial self-view, you rated your ${traitName} lower, but when facing real high-stakes scenario decisions, your choices consistently leaned into action.`;
    } else {
        headline = `You were more strategic and measured than your baseline suggested.`;
        detail = `While you initially viewed yourself as bolder in ${traitName.toLowerCase()}, your gameplay decisions favored calibration and careful thought when outcomes mattered.`;
    }

    return {
        showed: true,
        trait: selectedTrait,
        delta: Math.round(maxDelta),
        direction,
        headline,
        detail
    };
}

/**
 * Determine dynamic "Current Chapter" based on dominant traits and situation.
 */
export function generateCurrentChapter(
    traits: PersonalityTraits | PsychometricScores | Record<string, number>,
    situationTag?: string
): CurrentChapter {
    const risk = (traits as any).risk ?? 50;
    const creativity = (traits as any).creativity ?? 50;
    const vision = (traits as any).vision ?? 50;
    const empathy = (traits as any).empathy ?? 50;
    const leadership = (traits as any).leadership ?? 50;

    if (situationTag === 'starting_something' || (leadership > 70 && risk > 60)) {
        return CURRENT_CHAPTERS.Builder;
    }
    if (situationTag === 'failure_setback' || situationTag === 'feeling_stuck') {
        return CURRENT_CHAPTERS.Resilient;
    }
    if (creativity > 70 && vision > 65) {
        return CURRENT_CHAPTERS.Creator;
    }
    if (vision > 75) {
        return CURRENT_CHAPTERS.Visionary;
    }
    if (leadership > 75) {
        return CURRENT_CHAPTERS.Leader;
    }
    if (risk > 70) {
        return CURRENT_CHAPTERS.Challenger;
    }
    if (empathy > 70) {
        return CURRENT_CHAPTERS.Seeker;
    }

    return CURRENT_CHAPTERS.Explorer;
}

/**
 * Generate emerging trajectory trends for DNA traits.
 */
export function generateEmergingYou(
    onboardingScores?: PsychometricScores | Record<string, number>,
    gameplayScores?: PsychometricScores | PersonalityTraits | Record<string, number>
): EmergingYouInsight[] {
    if (!onboardingScores || !gameplayScores) return [];

    const traits: DnaTrait[] = ['risk', 'creativity', 'vision', 'empathy', 'leadership'];
    const insights: EmergingYouInsight[] = [];

    for (const t of traits) {
        const base = (onboardingScores as any)[t] ?? 50;
        const current = (gameplayScores as any)[t] ?? 50;
        const delta = current - base;

        let direction: 'rising' | 'falling' | 'stable' = 'stable';
        if (delta >= 4) direction = 'rising';
        else if (delta <= -4) direction = 'falling';

        insights.push({
            trait: t,
            direction,
            delta: Math.round(delta),
            sessions_analyzed: 5
        });
    }

    return insights;
}

/**
 * Generate career exploration recommendations (soft, non-deterministic language).
 */
export function getPotentiallyAlignedDirections(traits: PersonalityTraits | Record<string, number>): string[] {
    const risk = (traits as any).risk ?? 50;
    const creativity = (traits as any).creativity ?? 50;
    const vision = (traits as any).vision ?? 50;
    const empathy = (traits as any).empathy ?? 50;
    const leadership = (traits as any).leadership ?? 50;

    const directions: string[] = [];

    if (creativity > 65 && vision > 60) {
        directions.push('Product Architecture & Creative Technology');
        directions.push('Brand Strategy & Conceptual Direction');
    }
    if (leadership > 65 && risk > 60) {
        directions.push('Venture Incubation & Early-Stage Leadership');
        directions.push('Operational Strategy in High-Pace Environments');
    }
    if (empathy > 65 && leadership > 55) {
        directions.push('People & Organizational Culture Leadership');
        directions.push('Community Ecosystem Strategy');
    }
    if (vision > 65 && risk < 55) {
        directions.push('Systems Research, Quantitative Policy & Strategic Foresight');
        directions.push('Intelligence Analysis & Complex Modeling');
    }
    if (directions.length === 0) {
        directions.push('Interdisciplinary Creative Strategy');
        directions.push('Emerging Technologies & Product Management');
    }

    return directions.slice(0, 3);
}
