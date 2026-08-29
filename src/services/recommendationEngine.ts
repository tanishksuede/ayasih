import { supabase } from '../utils/supabase';
import type { RecommendationResult, PsychometricScores, UserProfile } from '../types/gameTypes';
import { getStoryMetadata } from './storyMetadataRegistry';

// Hybrid recommendation scoring weights
export const HYBRID_WEIGHTS = {
    situationMatch: 0.40, // Match between user situation/tags and story dilemma
    dnaAlignment: 0.25,   // Proximity to user's 5 core traits
    sessionIntent: 0.15,  // Short-term mood/session preferences
    ageProximity: 0.10,   // Life stage / age mirror affinity
    novelty: 0.10,        // Bonus for unplayed stories
};

export interface RecommendationParams {
    userId?: string;
    situationText?: string;
    situationTags?: string[];
    userProfile?: UserProfile | null;
    sessionTags?: Record<string, number>;
    allLevels: any[];
    limit?: number;
}

/**
 * Log user tag interaction for preference weighting.
 */
export async function updateUserTagPreference(userId: string, tags: string[], scoreChange: number) {
    if (!userId || userId.startsWith('offline-')) return;
    
    for (const tag of tags) {
        try {
            const { data } = await supabase
                .from('user_tag_preferences')
                .select('score, interaction_count')
                .eq('user_id', userId)
                .eq('tag_name', tag)
                .maybeSingle();
                
            let newScore = scoreChange;
            let newCount = 1;
            
            if (data) {
                newCount = (data.interaction_count || 0) + 1;
                newScore = (data.score * 0.9) + scoreChange; // Decay older scores slightly
            }

            await supabase.from('user_tag_preferences').upsert({
                user_id: userId,
                tag_name: tag,
                score: newScore,
                interaction_count: newCount,
                last_interaction: new Date().toISOString()
            }, { onConflict: 'user_id,tag_name' });
        } catch (e) {
            console.warn('[recommendationEngine] Tag preference update warning:', e);
        }
    }
}

/**
 * Record a search query in search_demand_analytics to surface content gaps.
 */
export async function recordSearchDemand(queryText: string, matchCount: number, userId?: string) {
    if (!queryText || queryText.trim().length < 2) return;
    try {
        await supabase.from('search_demand_analytics').insert({
            query_text: queryText.trim(),
            match_count: matchCount,
            user_id: userId && !userId.startsWith('offline-') ? userId : null,
        });
    } catch (e) {
        console.warn('[recommendationEngine] Search demand logging warning:', e);
    }
}

/**
 * Compute cosine-like similarity between user DNA traits and story target traits (0.0 to 1.0).
 */
function computeDnaAlignment(userScores?: PsychometricScores, targetTraits?: Partial<PsychometricScores>): number {
    if (!userScores || !targetTraits) return 0.5;

    const traits: Array<keyof PsychometricScores> = ['risk', 'creativity', 'vision', 'empathy', 'leadership'];
    let totalDiff = 0;
    let counted = 0;

    for (const t of traits) {
        if (targetTraits[t] !== undefined && userScores[t] !== undefined) {
            totalDiff += Math.abs(userScores[t] - targetTraits[t]!);
            counted++;
        }
    }

    if (counted === 0) return 0.5;
    const avgDiff = totalDiff / counted; // 0 to 100
    return Math.max(0, 1 - avgDiff / 100);
}

/**
 * Generate transparent "Why this story?" explanation text.
 */
function generateStoryExplanation(
    personality: string,
    age: number,
    dilemmaType: string,
    matchedTags: string[],
    situationText?: string
): string {
    if (matchedTags.length > 0) {
        const topTag = matchedTags[0].replace(/_/g, ' ');
        return `Addresses ${topTag} by exploring how ${personality} navigated ${dilemmaType.toLowerCase()} at age ${age}.`;
    }
    if (situationText && situationText.trim().length > 0) {
        return `Relevant to your current challenge: shows how ${personality} tackled ${dilemmaType.toLowerCase()} at age ${age}.`;
    }
    return `Examines ${dilemmaType.toLowerCase()} through the pivotal life chapter of ${personality} at age ${age}.`;
}

/**
 * Primary Explainable Hybrid Recommendation Engine.
 */
export async function getExplainableRecommendations({
    userId,
    situationText = '',
    situationTags = [],
    userProfile,
    sessionTags = {},
    allLevels = [],
    limit = 6
}: RecommendationParams): Promise<RecommendationResult[]> {
    if (!allLevels || allLevels.length === 0) return [];

    const cleanQuery = (situationText || '').toLowerCase().trim();
    const cleanTags = (situationTags || []).map(t => t.toLowerCase().trim());
    const userAge = userProfile?.age || 18;
    const userTraits: PsychometricScores = userProfile?.gameplay_scores || userProfile?.onboarding_scores || {
        risk: 50,
        creativity: 50,
        vision: 50,
        empathy: 50,
        leadership: 50,
    };

    const scoredResults: RecommendationResult[] = [];

    for (const level of allLevels) {
        const scenarioId = level.scenarioId || level.id;
        const meta = getStoryMetadata(scenarioId, level);
        const storyTags = (meta.situationalTags || []).map(t => t.toLowerCase());

        // 1. Situation & Query Match Score (0.0 to 1.0)
        let situationScore = 0;
        const matchedTags: string[] = [];

        // Check tag overlap
        if (cleanTags.length > 0) {
            for (const ut of cleanTags) {
                if (storyTags.some(st => st.includes(ut) || ut.includes(st))) {
                    situationScore += 0.35;
                    matchedTags.push(ut);
                }
            }
        }

        // Check text keyword matches in dilemma, lens, or tags
        if (cleanQuery.length > 2) {
            const searchCorpus = `${meta.dilemmaType} ${meta.protagonistLens} ${meta.lifeTheme} ${storyTags.join(' ')} ${level.title} ${level.description}`.toLowerCase();
            const words = cleanQuery.split(/\s+/).filter(w => w.length > 2);
            let keywordHits = 0;
            for (const word of words) {
                if (searchCorpus.includes(word)) {
                    keywordHits++;
                }
            }
            if (words.length > 0) {
                situationScore += (keywordHits / words.length) * 0.65;
            }
        }

        situationScore = Math.min(1.0, situationScore);

        // 2. DNA Trait Alignment (0.0 to 1.0)
        const dnaScore = computeDnaAlignment(userTraits, meta.targetTraits);

        // 3. Session Intent Score (0.0 to 1.0)
        let intentScore = 0.5;
        if (Object.keys(sessionTags).length > 0) {
            for (const [st, weight] of Object.entries(sessionTags)) {
                if (storyTags.includes(st.toLowerCase())) {
                    intentScore += weight * 0.2;
                }
            }
        }
        intentScore = Math.min(1.0, intentScore);

        // 4. Age Proximity Score (0.0 to 1.0)
        const ageDiff = Math.abs((level.age || 18) - userAge);
        const ageScore = Math.max(0.2, 1 - ageDiff / 15);

        // 5. Novelty (unplayed bonus)
        const isCompleted = level.status === 'completed' || level.stars > 0;
        const noveltyScore = isCompleted ? 0.3 : 1.0;

        // Final Composite Score
        const finalScore =
            HYBRID_WEIGHTS.situationMatch * situationScore +
            HYBRID_WEIGHTS.dnaAlignment * dnaScore +
            HYBRID_WEIGHTS.sessionIntent * intentScore +
            HYBRID_WEIGHTS.ageProximity * ageScore +
            HYBRID_WEIGHTS.novelty * noveltyScore;

        const explanation = generateStoryExplanation(
            level.personality || level.title,
            level.age || 18,
            meta.dilemmaType,
            matchedTags,
            cleanQuery
        );

        scoredResults.push({
            storyId: scenarioId,
            score: Math.round(finalScore * 100) / 100,
            title: level.title || level.personality || 'Story',
            personality: level.personality || level.title || 'Leader',
            age: level.age || 18,
            explanation,
            dilemmaType: meta.dilemmaType,
            lifeTheme: meta.lifeTheme,
            situationalTags: meta.situationalTags,
            isPremium: Boolean(meta.isPremium),
            matchFactors: {
                situationMatch: Math.round(situationScore * 100),
                dnaAlignment: Math.round(dnaScore * 100),
                intentBonus: Math.round(intentScore * 100),
                noveltyScore: Math.round(noveltyScore * 100),
            },
        });
    }

    // Sort descending by score
    scoredResults.sort((a, b) => b.score - a.score);
    const topResults = scoredResults.slice(0, limit);

    // Asynchronously log search demand if query was provided
    if (cleanQuery.length > 2) {
        recordSearchDemand(cleanQuery, topResults.length, userId);
    }

    return topResults;
}

/**
 * Legacy compatibility wrapper.
 */
export async function getRecommendations(
    userId: string,
    sessionTags: Record<string, number> = {},
    limit: number = 5
): Promise<string[]> {
    const { data: tagPrefs } = await supabase
        .from('user_tag_preferences')
        .select('tag_name, score')
        .eq('user_id', userId)
        .order('score', { ascending: false })
        .limit(10);
        
    const userPrefMap = (tagPrefs || []).reduce((acc: any, t: any) => {
        acc[t.tag_name] = t.score;
        return acc;
    }, {});

    const combinedPrefs = { ...userPrefMap, ...sessionTags };
    const topTags = Object.keys(combinedPrefs).slice(0, 5);
    
    const candidateStoryIds = new Set<string>();
    
    if (topTags.length > 0) {
        const { data: tagMatches } = await supabase
            .from('story_tags')
            .select('story_id')
            .in('tag_name', topTags);
            
        if (tagMatches) {
            tagMatches.forEach((m: any) => candidateStoryIds.add(m.story_id));
        }
    }

    return Array.from(candidateStoryIds).slice(0, limit);
}

