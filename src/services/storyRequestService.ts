/**
 * storyRequestService.ts
 *
 * Manages user demand signals when no story matches a selected situation.
 * Saves notification requests and provides aggregate demand data for Admins.
 */

import { supabase } from '../utils/supabase';

export interface StoryRequestEntry {
    id?: string;
    user_id?: string;
    requested_tag: string;
    requested_problem?: string;
    status?: 'active' | 'notified' | 'dismissed';
    created_at?: string;
    notified_at?: string;
}

export interface StoryRequestSummary {
    requested_tag: string;
    count: number;
    most_recent: string;
    status: string;
}

/**
 * Log a user's request to be notified when content for a situation becomes available.
 */
export async function logStoryRequest(
    userId: string | undefined,
    requestedTag: string,
    requestedProblem?: string
): Promise<{ success: boolean; id?: string }> {
    // 1. Save to LocalStorage immediately (Always succeeds & offline-first)
    try {
        const stored = JSON.parse(localStorage.getItem('aya_user_story_requests') || '[]');
        if (!stored.some((r: any) => r.tag === requestedTag)) {
            stored.push({
                tag: requestedTag,
                problem: requestedProblem || requestedTag,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('aya_user_story_requests', JSON.stringify(stored));
        }
    } catch {}

    try {
        const cleanUserId = userId && !userId.startsWith('offline-') ? userId : null;
        
        let { data, error } = await supabase
            .from('story_requests')
            .insert({
                user_id: cleanUserId,
                requested_tag: requestedTag,
                requested_problem: requestedProblem || requestedTag,
                status: 'active',
            })
            .select('id')
            .maybeSingle();

        // If foreign key constraint failed on user_id, retry with user_id: null
        if (error && (error.code === '23503' || error.message?.includes('foreign key') || error.message?.includes('violates'))) {
            const retry = await supabase
                .from('story_requests')
                .insert({
                    user_id: null,
                    requested_tag: requestedTag,
                    requested_problem: requestedProblem || requestedTag,
                    status: 'active',
                })
                .select('id')
                .maybeSingle();
            data = retry.data;
            error = retry.error;
        }

        if (error) {
            console.warn('[storyRequestService] Supabase insert note (stored locally):', error.message);
            return { success: true };
        }

        return { success: true, id: data?.id };
    } catch (err) {
        console.warn('[storyRequestService] Stored locally:', err);
        return { success: true };
    }
}

/**
 * Fetch aggregated story request demand for the Admin dashboard.
 */
export async function getStoryRequestsSummary(): Promise<StoryRequestSummary[]> {
    try {
        const { data, error } = await supabase
            .from('story_requests')
            .select('requested_tag, created_at, status')
            .order('created_at', { ascending: false });

        if (error || !data) return [];

        // Aggregate by tag
        const summaryMap: Record<string, { count: number; most_recent: string; status: string }> = {};

        data.forEach((row: { requested_tag: string; created_at: string; status: string | null }) => {
            const tag = row.requested_tag;
            if (!summaryMap[tag]) {
                summaryMap[tag] = {
                    count: 0,
                    most_recent: row.created_at,
                    status: row.status || 'active',
                };
            }
            summaryMap[tag].count += 1;
            if (new Date(row.created_at) > new Date(summaryMap[tag].most_recent)) {
                summaryMap[tag].most_recent = row.created_at;
            }
        });

        return Object.entries(summaryMap).map(([requested_tag, info]) => ({
            requested_tag,
            count: info.count,
            most_recent: info.most_recent,
            status: info.status,
        })).sort((a, b) => b.count - a.count);

    } catch (err) {
        console.error('[storyRequestService] Error fetching request summary:', err);
        return [];
    }
}
