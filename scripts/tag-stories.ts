import { pipeline } from '@xenova/transformers';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Setup Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Heuristic keyword mapper for tags (Extendable based on actual stories)
const keywordTaxonomy: Record<string, string[]> = {
    'sports': ['athlete', 'olympics', 'sport', 'javelin', 'football', 'cricket', 'game', 'play'],
    'technology': ['ai', 'computer', 'software', 'robotics', 'programming', 'code', 'tech', 'digital'],
    'business': ['startup', 'founder', 'company', 'entrepreneur', 'business', 'market', 'sell'],
    'education': ['jee', 'neet', 'exam', 'study', 'school', 'college', 'learn', 'student'],
    'science': ['physics', 'chemistry', 'biology', 'space', 'science', 'research', 'lab'],
    'history': ['war', 'empire', 'ancient', 'historical', 'king', 'queen', 'revolution'],
    'art': ['paint', 'music', 'dance', 'film', 'create', 'artist', 'song', 'draw'],
    'motivation': ['inspire', 'dream', 'goal', 'achieve', 'success', 'never give up', 'believe'],
    'resilience': ['fail', 'hard', 'tough', 'bounce back', 'overcome', 'struggle', 'survive'],
    'leadership': ['lead', 'team', 'guide', 'manage', 'vision', 'captain', 'boss']
};

async function getExtractor() {
    console.log("Loading embedding model...");
    // all-MiniLM-L6-v2 is small, fast, and good for semantic search
    return await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}

async function run() {
    console.log("Starting tagging and embedding pipeline...");
    
    // We import dynamically to avoid TS compilation issues in script run
    const { STORY_DATABASE } = await import('../src/data/scenarios.ts').catch(() => ({ STORY_DATABASE: {} }));
    const { jeeStories } = await import('../src/data/jeeStories.ts').catch(() => ({ jeeStories: [] }));
    const { neetStories } = await import('../src/data/neetStories.ts').catch(() => ({ neetStories: [] }));

    const extractor = await getExtractor();

    let processedCount = 0;
    
    // Helper to process a single story
    async function processStory(storyId: string, textContent: string, existingTags: string[]) {
        if (!textContent || textContent.includes("Coming Soon")) return;
        
        console.log(`Processing story: ${storyId}`);
        const tags = new Set<string>(existingTags.map(t => t.toLowerCase()));
        
        // Keyword extraction
        const lowerText = textContent.toLowerCase();
        for (const [topic, keywords] of Object.entries(keywordTaxonomy)) {
            for (const kw of keywords) {
                if (lowerText.includes(kw)) {
                    tags.add(topic);
                    break;
                }
            }
        }
        
        const finalTags = Array.from(tags);
        
        // Generate embedding
        const output = await extractor(textContent, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);
        
        // Insert into Supabase
        const { error: embedError } = await supabase.from('story_embeddings').upsert({
            story_id: storyId,
            embedding: embedding,
            metadata: { generated_at: new Date().toISOString(), tags: finalTags }
        });
        
        if (embedError) {
            console.error(`Error saving embedding for ${storyId}:`, embedError);
            return;
        }

        // Insert tags
        for (const tag of finalTags) {
            await supabase.from('story_tags').upsert({
                story_id: storyId,
                tag_name: tag.replace(/\s+/g, '-'),
                weight: 1.0 // Base weight, could be dynamic
            }, { onConflict: 'story_id,tag_name' });
        }
        
        processedCount++;
    }

    // Parse Scenarios
    for (const [id, scenario] of Object.entries(STORY_DATABASE)) {
        const textContent = (scenario as any).frames?.map((f: any) => f.text).join(' ') || '';
        await processStory(id, textContent, []);
    }

    console.log(`Pipeline complete. Processed ${processedCount} stories.`);
    process.exit(0);
}

run().catch(console.error);
