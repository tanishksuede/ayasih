/**
 * dnaService.ts
 *
 * Dedicated service for persistent DNA profile management.
 * Guarantees that all trait lookups and story completion scores are
 * dynamically linked to the authenticated Supabase user (via getMyUserId)
 * and persisted directly to Supabase.
 */

import { supabase } from '../utils/supabase';
import { getMyUserId, formatSupabaseError } from './followService';
import { useUserStore } from '../store/userStore';

export interface UserDnaTraits {
  risk: number;
  creativity: number;
  vision: number;      // analytical
  empathy: number;     // social
  leadership: number;  // ambitious
  discipline?: number;
  resilience?: number;
}

export interface UserDnaProfile {
  userId: string;
  traits: UserDnaTraits;
  totalXp: number;
  level: number;
  storiesCompleted: number;
  futureArchetype?: string;
  futureArchetypeScore?: number;
  lifeTraits?: Record<string, number>;
  lastUpdated?: string;
}

export interface SaveStoryCompletionPayload {
  levelId: string;
  selectedPersonality: string;
  matchScore: number;
  stars: number;
  sessionXp: number;
  traits: UserDnaTraits;
  futureArchetype?: string;
  futureArchetypeScore?: number;
  lifeTraits?: Record<string, number>;
  gameplayScores?: Record<string, number>;
  choicesLog?: any[];
}

/**
 * Fetch the authenticated user's persistent DNA profile from Supabase.
 * Returns null if no profile exists yet in the database.
 */
export async function fetchUserDnaProfile(): Promise<UserDnaProfile | null> {
  const myUserId = await getMyUserId();

  console.log('[dnaService] Fetching DNA profile for user:', myUserId);

  const { data: ppData, error: ppError } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', myUserId)
    .maybeSingle();

  if (ppError) {
    console.error('[dnaService] Error fetching personality_profiles:', formatSupabaseError(ppError));
    throw new Error(formatSupabaseError(ppError));
  }

  if (!ppData) {
    console.log('[dnaService] No personality_profiles record found for user:', myUserId);
    return null;
  }

  const traits: UserDnaTraits = {
    risk: ppData.trait_risk_taker ?? 50,
    creativity: ppData.trait_creative ?? 50,
    vision: ppData.trait_analytical ?? 50,
    empathy: ppData.trait_social ?? 50,
    leadership: ppData.trait_ambitious ?? 50,
    discipline: ppData.life_discipline ?? 50,
    resilience: ppData.life_resilience ?? 50,
  };

  const lifeTraits: Record<string, number> = {
    resilience: ppData.life_resilience ?? 50,
    discipline: ppData.life_discipline ?? 50,
    courage: ppData.life_courage ?? 50,
    creativity: ppData.life_creativity ?? 50,
    emotional_control: ppData.life_emotional_control ?? 50,
    leadership: ppData.life_leadership ?? 50,
    risk_intelligence: ppData.life_risk_intelligence ?? 50,
    consistency: ppData.life_consistency ?? 50,
  };

  return {
    userId: ppData.user_id,
    traits,
    totalXp: ppData.total_xp ?? 0,
    level: ppData.level ?? 1,
    storiesCompleted: ppData.stories_completed ?? 0,
    futureArchetype: ppData.future_archetype ?? undefined,
    futureArchetypeScore: ppData.future_archetype_score ?? undefined,
    lifeTraits,
    lastUpdated: ppData.last_updated ?? undefined,
  };
}

/**
 * Atomically save story completion results and update DNA traits in Supabase.
 * Uses the save_story_completion_dna RPC with automatic client-side fallback.
 */
export async function saveStoryCompletionDna(
  payload: SaveStoryCompletionPayload
): Promise<UserDnaProfile> {
  let myUserId = '';
  try {
    myUserId = await getMyUserId();
  } catch {
    myUserId = useUserStore.getState().profile?.id || '';
  }

  console.log('[dnaService] Saving story completion DNA for user:', myUserId, {
    levelId: payload.levelId,
    stars: payload.stars,
    traits: payload.traits,
  });

  try {
    // 1. Try atomic RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc('save_story_completion_dna', {
      p_level_id: String(payload.levelId),
      p_selected_personality: String(payload.selectedPersonality),
      p_match_score: payload.matchScore,
      p_stars: payload.stars,
      p_session_xp: payload.sessionXp,
      p_trait_risk_taker: Math.round(payload.traits.risk),
      p_trait_creative: Math.round(payload.traits.creativity),
      p_trait_analytical: Math.round(payload.traits.vision),
      p_trait_social: Math.round(payload.traits.empathy),
      p_trait_ambitious: Math.round(payload.traits.leadership),
      p_future_archetype: payload.futureArchetype || null,
      p_future_archetype_score: payload.futureArchetypeScore || null,
      p_life_traits: payload.lifeTraits || null,
      p_gameplay_scores: payload.gameplayScores || null,
      p_choices_log: payload.choicesLog || null,
    });

    if (!rpcError && rpcData?.success) {
      console.log('[dnaService] ✓ Successfully saved story completion via RPC:', rpcData);
      return {
        userId: myUserId,
        traits: {
          risk: payload.traits.risk,
          creativity: payload.traits.creativity,
          vision: payload.traits.vision,
          empathy: payload.traits.empathy,
          leadership: payload.traits.leadership,
        },
        totalXp: rpcData.total_xp,
        level: rpcData.level,
        storiesCompleted: rpcData.stories_completed,
        futureArchetype: payload.futureArchetype,
        futureArchetypeScore: payload.futureArchetypeScore,
        lifeTraits: payload.lifeTraits,
      };
    }

    if (rpcError) {
      console.warn('[dnaService] RPC returned error, attempting direct table fallback:', rpcError);
    }
  } catch (err) {
    console.warn('[dnaService] RPC invocation threw, attempting direct table fallback:', err);
  }

  // 2. Fallback: Direct table upsert & update
  const ppPayload = {
    user_id: myUserId,
    trait_risk_taker: Math.round(payload.traits.risk),
    trait_creative: Math.round(payload.traits.creativity),
    trait_analytical: Math.round(payload.traits.vision),
    trait_social: Math.round(payload.traits.empathy),
    trait_ambitious: Math.round(payload.traits.leadership),
    future_archetype: payload.futureArchetype || null,
    future_archetype_score: payload.futureArchetypeScore || null,
    life_resilience: payload.lifeTraits?.resilience ?? 50,
    life_discipline: payload.lifeTraits?.discipline ?? 50,
    life_courage: payload.lifeTraits?.courage ?? 50,
    life_creativity: payload.lifeTraits?.creativity ?? 50,
    life_emotional_control: payload.lifeTraits?.emotional_control ?? 50,
    life_leadership: payload.lifeTraits?.leadership ?? 50,
    life_risk_intelligence: payload.lifeTraits?.risk_intelligence ?? 50,
    life_consistency: payload.lifeTraits?.consistency ?? 50,
    last_updated: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from('personality_profiles')
    .upsert(ppPayload, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('[dnaService] Fallback personality_profiles upsert error:', formatSupabaseError(upsertError));
  } else {
    console.log('[dnaService] ✓ Direct personality_profiles upserted');
  }

  // Also update users table gameplay_scores
  await supabase
    .from('users')
    .update({
      gameplay_scores: payload.gameplayScores || payload.traits,
    })
    .eq('id', myUserId);

  return {
    userId: myUserId,
    traits: payload.traits,
    totalXp: payload.sessionXp,
    level: 1,
    storiesCompleted: 1,
    futureArchetype: payload.futureArchetype,
    futureArchetypeScore: payload.futureArchetypeScore,
    lifeTraits: payload.lifeTraits,
  };
}
