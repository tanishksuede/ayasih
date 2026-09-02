import type { PersonalityTraits } from '../types/gameTypes';
import { generateLevels } from './levelGenerator';

// ─── Life Traits ─────────────────────────────────────────────────────────────
export interface LifeTraits {
    resilience: number;
    discipline: number;
    courage: number;
    creativity: number;
    emotional_control: number;
    leadership: number;
    risk_intelligence: number;
    consistency: number;
}

// ─── Archetype Definition ────────────────────────────────────────────────────
export interface FutureArchetype {
    name: string;
    emoji: string;
    description: string;
    realMatch: string;
    realMatchAvatar: string;
    traits: Partial<LifeTraits>;
    percentile: string;
    color: string;        // primary neon hex
    colorSecondary: string;
}

export interface FutureMatch {
    archetype: FutureArchetype;
    score: number;        // 0-100, match quality
    lifeTraits: LifeTraits;
}

// ─── Archetypes ──────────────────────────────────────────────────────────────
export const FUTURE_ARCHETYPES: Record<string, FutureArchetype> = {
    'Elite Founder': {
        name: 'Elite Founder',
        emoji: '⚡',
        description: 'You make bold moves, think independently and build things from nothing.',
        realMatch: 'Ritesh Agarwal',
        realMatchAvatar: '/assets/avatar_ritesh.jpg',
        traits: { courage: 80, risk_intelligence: 75, creativity: 70, leadership: 75 },
        percentile: 'Top 3%',
        color: '#f59e0b',
        colorSecondary: '#fbbf24',
    },
    'Creative Visionary': {
        name: 'Creative Visionary',
        emoji: '🎨',
        description: 'You see the world differently and express what others cannot articulate.',
        realMatch: 'A.R. Rahman',
        realMatchAvatar: '/assets/avatar_rahman.jpg',
        traits: { creativity: 85, emotional_control: 75, resilience: 70 },
        percentile: 'Top 5%',
        color: '#d575ff',
        colorSecondary: '#a855f7',
    },
    'Strategic Leader': {
        name: 'Strategic Leader',
        emoji: '🧠',
        description: 'You think 10 steps ahead and build systems that outlast you.',
        realMatch: 'Sundar Pichai',
        realMatchAvatar: '/assets/avatar_sundar.jpg',
        traits: { discipline: 80, leadership: 80, risk_intelligence: 75 },
        percentile: 'Top 4%',
        color: '#00f2ff',
        colorSecondary: '#22d3ee',
    },
    'World Changer': {
        name: 'World Changer',
        emoji: '🌍',
        description: 'You are driven by purpose bigger than yourself and inspire others to follow.',
        realMatch: 'Malala Yousafzai',
        realMatchAvatar: '/assets/avatar_malala.jpg',
        traits: { courage: 85, resilience: 80, leadership: 75 },
        percentile: 'Top 2%',
        color: '#00ff9d',
        colorSecondary: '#34d399',
    },
    'Elite Performer': {
        name: 'Elite Performer',
        emoji: '🏆',
        description: 'You outwork everyone through obsessive discipline and consistency.',
        realMatch: 'Kobe Bryant',
        realMatchAvatar: '/assets/avatar_kobe.png',
        traits: { discipline: 90, consistency: 85, resilience: 80 },
        percentile: 'Top 1%',
        color: '#ff51fa',
        colorSecondary: '#ec4899',
    },
    'Quiet Genius': {
        name: 'Quiet Genius',
        emoji: '💡',
        description: 'You solve problems others cannot see and think in systems and patterns.',
        realMatch: 'Nikola Tesla',
        realMatchAvatar: '/assets/avatar_tesla.jpg',
        traits: { risk_intelligence: 85, creativity: 80, discipline: 75 },
        percentile: 'Top 5%',
        color: '#99f7ff',
        colorSecondary: '#67e8f9',
    },
};

// ─── Consistency Score from Streak ───────────────────────────────────────────
export function getConsistencyScore(streak: number): number {
    if (streak === 0) return 20;
    if (streak <= 3) return 40;
    if (streak <= 7) return 60;
    if (streak <= 14) return 75;
    if (streak <= 30) return 90;
    return 100;
}

// ─── Calculate 8 Life Traits ─────────────────────────────────────────────────
export function calculateLifeTraits(
    traits: PersonalityTraits,
    streak: number
): LifeTraits {
    const consistency = getConsistencyScore(streak);

    // Map PersonalityTraits fields to the right keys defensively
    const risk = (traits as any).risk ?? (traits as any).trait_risk_taker ?? 50;
    const creativity = (traits as any).creativity ?? (traits as any).trait_creative ?? 50;
    const analytical = (traits as any).vision ?? (traits as any).trait_analytical ?? 50;
    const social = (traits as any).empathy ?? (traits as any).trait_social ?? 50;
    const ambitious = (traits as any).leadership ?? (traits as any).trait_ambitious ?? 50;

    const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

    return {
        resilience:         clamp(risk * 0.4 + ambitious * 0.6),
        discipline:         clamp(analytical * 0.5 + consistency * 0.5),
        courage:            clamp(risk * 0.6 + ambitious * 0.4),
        creativity:         clamp(creativity),
        emotional_control:  clamp(social * 0.5 + analytical * 0.5),
        leadership:         clamp(ambitious * 0.5 + social * 0.5),
        risk_intelligence:  clamp(risk * 0.5 + analytical * 0.5),
        consistency:        clamp(consistency),
    };
}

// 🌀 Match Archetype 🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀
export function matchFutureArchetype(lifeTraits: LifeTraits): FutureMatch {
    const levels = generateLevels(18); // Pass an arbitrary age to get all levels

    const uniquePersonalities = new Map<string, any>();
    levels.forEach((level: any) => {
        if (!uniquePersonalities.has(level.personality)) {
            uniquePersonalities.set(level.personality, level);
        }
    });

    let bestMatch: any = null;
    let bestDistance = Infinity;

    // Convert idolTraits to lifeTraits shape for comparison
    const mapIdolToLife = (idolTraits: any): Partial<LifeTraits> => {
        if (!idolTraits) return {};
        return {
            resilience: idolTraits.resilience ?? 50,
            discipline: idolTraits.discipline ?? 50,
            courage: idolTraits.risk ?? 50,
            creativity: idolTraits.creativity ?? 50,
            emotional_control: idolTraits.empathy ?? 50,
            leadership: idolTraits.leadership ?? 50,
            risk_intelligence: idolTraits.vision ?? 50,
            consistency: idolTraits.discipline ?? 50,
        };
    };

    uniquePersonalities.forEach((level) => {
        const archetypeTraits = mapIdolToLife(level.idolTraits);
        const traitKeys = Object.keys(archetypeTraits) as (keyof LifeTraits)[];
        if (traitKeys.length === 0) return;
        
        let sumSq = 0;
        for (const key of traitKeys) {
            const target = archetypeTraits[key] ?? 50;
            const actual = lifeTraits[key] ?? 50;
            sumSq += Math.pow(target - actual, 2);
        }
        const distance = Math.sqrt(sumSq / traitKeys.length);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = level;
        }
    });

    const score = Math.max(0, Math.round(100 - (bestDistance / 100) * 100));

    // Map themes/colors dynamically
    const colors = ['#f59e0b', '#d575ff', '#00f2ff', '#00ff9d', '#ff51fa', '#99f7ff'];
    const secColors = ['#fbbf24', '#a855f7', '#22d3ee', '#34d399', '#ec4899', '#67e8f9'];
    const cIndex = (bestMatch?.personality.length || 0) % colors.length;

    const generatedArchetype: FutureArchetype = bestMatch ? {
        name: bestMatch.archetype || 'Visionary',
        emoji: '⭐',
        description: bestMatch.bio || 'You make bold moves, think independently and build things from nothing.',
        realMatch: bestMatch.personality,
        realMatchAvatar: bestMatch.avatarUrl || '/assets/avatar_default.jpg',
        traits: mapIdolToLife(bestMatch.idolTraits),
        percentile: `Top ${Math.max(1, Math.min(10, Math.round(bestDistance / 2.5)))}%`,
        color: colors[cIndex],
        colorSecondary: secColors[cIndex],
    } : FUTURE_ARCHETYPES['Strategic Leader'];

    return {
        archetype: generatedArchetype,
        score,
        lifeTraits,
    };
}

// ─── Weakest Trait ────────────────────────────────────────────────────────────
export function getWeakestTrait(lifeTraits: LifeTraits): string {
    const labels: Record<keyof LifeTraits, string> = {
        resilience: 'Resilience',
        discipline: 'Discipline',
        courage: 'Courage',
        creativity: 'Creativity',
        emotional_control: 'Emotional Control',
        leadership: 'Leadership',
        risk_intelligence: 'Risk Intelligence',
        consistency: 'Consistency',
    };
    const sorted = (Object.keys(lifeTraits) as (keyof LifeTraits)[])
        .sort((a, b) => lifeTraits[a] - lifeTraits[b]);
    return labels[sorted[0]] ?? 'Consistency';
}
