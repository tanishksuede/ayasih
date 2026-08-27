import { supabase } from '../utils/supabase';

// Hybrid recommendation scoring weights (for future expansion)
export const WEIGHTS = {
    vectorSimilarity: 0.3,
    tagAffinity: 0.3,
    sessionIntent: 0.2,
    personalityFit: 0.1,
    completionBonus: 0.1
};

export async function updateUserTagPreference(userId: string, tags: string[], scoreChange: number) {
    if (!userId || userId.startsWith('offline-')) return;
    
    for (const tag of tags) {
        // Simple increment logic for Supabase RPC or upsert
        const { data } = await supabase
            .from('user_tag_preferences')
            .select('score, interaction_count')
            .eq('user_id', userId)
            .eq('tag_name', tag)
            .single();
            
        let newScore = scoreChange;
        let newCount = 1;
        
        if (data) {
            newCount = (data.interaction_count || 0) + 1;
            // Decay older scores slightly and add new weight
            newScore = (data.score * 0.9) + scoreChange; 
        }

        await supabase.from('user_tag_preferences').upsert({
            user_id: userId,
            tag_name: tag,
            score: newScore,
            interaction_count: newCount,
            last_interaction: new Date().toISOString()
        }, { onConflict: 'user_id,tag_name' });
    }
}

export async function getRecommendations(userId: string, sessionTags: Record<string, number> = {}, limit: number = 5) {
    // 1. Fetch user tag preferences
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

    // Merge session tags (short-term intent overrules long-term)
    const combinedPrefs = { ...userPrefMap };
    for (const [tag, score] of Object.entries(sessionTags)) {
        combinedPrefs[tag] = (combinedPrefs[tag] || 0) + (score * 1.5);
    }

    // 2. Fetch candidate stories based on tags
    const topTags = Object.keys(combinedPrefs).slice(0, 5);
    
    let candidateStoryIds = new Set<string>();
    
    if (topTags.length > 0) {
        const { data: tagMatches } = await supabase
            .from('story_tags')
            .select('story_id')
            .in('tag_name', topTags);
            
        if (tagMatches) {
            tagMatches.forEach((m: any) => candidateStoryIds.add(m.story_id));
        }
    }

    // 3. (If Vector DB enabled) we would call `match_stories` RPC here
    // For now we simulate hybrid ranking locally with candidate pool
    const candidates = Array.from(candidateStoryIds);
    if (candidates.length === 0) return []; // Fallback to broad/popular will happen in UI

    return candidates.slice(0, limit);
}
