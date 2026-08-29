import type { VercelRequest, VercelResponse } from '@vercel/node';

function translateTag(tag: string): string {
    const map: Record<string, string> = {
        'exam_pressure': "the pressure you're feeling around exams",
        'career_uncertainty': "feeling unsure about your future career path",
        'heartbreak': "what you're going through after a difficult breakup",
        'loneliness': "feeling a bit lonely right now",
        'anxiety': "the anxiety you've been dealing with",
        'relationship_issues': "the relationship challenges you're facing",
        'confusion': "feeling confused about things",
        'frustration': "the frustration you've been feeling",
        'career_transition': "the career transition you're going through",
        'high_pressure_burnout': "the high pressure and burnout you've been experiencing",
        'risk_vs_safety': "weighing taking a risk versus playing it safe",
        'creative_block': "feeling creatively blocked",
        'imposter_syndrome': "dealing with imposter syndrome",
        'social_anxiety': "feeling anxious in social situations",
        'loss_of_motivation': "losing your motivation recently",
        'anxious': "feeling anxious",
        'frustrated': "feeling frustrated",
        'lost': "feeling a bit lost",
        'unmotivated': "feeling unmotivated",
        'overwhelmed': "feeling overwhelmed"
    };
    if (map[tag]) return map[tag];
    return tag.replace(/_/g, ' ');
}

function buildDynamicInsight(character: string, storyTitle: string, userChoice: string, consequence: string, translatedTags: string): string[] {
    const cleanCharacter = character && character !== 'Default' ? character : 'this legend';
    const tagText = translatedTags || 'a challenging situation';

    const part1 = `When facing ${tagText}, finding your way takes patience. In ${storyTitle || 'this story'}, ${cleanCharacter} went through moments just like this where things felt uncertain.`;
    const choiceText = userChoice ? `"${userChoice}"` : 'to take action';
    const consequenceText = consequence && consequence !== 'Completed the phase.' ? ` ${consequence}` : '';
    const part2 = `Your decision ${choiceText} shows how you naturally respond under pressure.${consequenceText}`;
    const part3 = `Navigating these moments is all about learning what works for you. Trust your instincts, take it one step at a time, and keep your head up.`;

    return [part1, part2, part3];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://atyourage.app';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const {
        tags,
        storyTitle,
        character,
        userChoice,
        userChoiceConsequence,
        userAge,
        userTraits
    } = req.body || {};

    const translatedTags = (tags || []).map((t: string) => translateTag(t)).join(' and ') || 'a challenging situation';
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
        // Return dynamic bespoke insight immediately if key is not configured
        const parts = buildDynamicInsight(character, storyTitle, userChoice, userChoiceConsequence, translatedTags);
        return res.status(200).json({ parts });
    }

    try {
        const prompt = `You are a thoughtful, caring friend speaking directly to a young person after they complete an interactive life scenario.
Your job is not to produce a psychological report.

Understand the situation they selected, understand the story and character, understand the exact choice they made, and respond like a friend who genuinely wants to help.
Connect the story to their real situation. Explain their choice honestly but gently. Give practical, age appropriate advice.
Use simple natural conversational language.
Return exactly three short parts.
Do not use markdown, bullet points, dashes, asterisks, emojis, headings, labels, technical terms, raw database tags, or internal variable names.

DATA TO ANALYZE:
User is currently dealing with: ${translatedTags}
Story Character: ${character}
Story Title: ${storyTitle}
User's EXACT Choice: "${userChoice}"
Consequence of their choice: "${userChoiceConsequence}"
User's Age: ${userAge || 'unknown'}

Generate exactly 3 short conversational parts.
PART 1: Connect their situation (${translatedTags}) with how ${character} handled a similar phase in ${storyTitle}.
PART 2: Talk specifically about their exact choice ("${userChoice}"). Explain why someone might make that choice, and gently explain if it's helpful or unhelpful for their situation.
PART 3: Give short, friendly, practical guidance. Reassure them.

Output MUST be a valid JSON object with exactly one key "parts", containing an array of 3 strings. Each part should be 1-3 short sentences (25-45 words maximum each).`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'You are a supportive, insightful friend. Respond ONLY in valid JSON. No markdown, no emojis.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 300,
            })
        });

        if (!response.ok) {
            console.warn('Groq API Error, returning smart dynamic fallback');
            const parts = buildDynamicInsight(character, storyTitle, userChoice, userChoiceConsequence, translatedTags);
            return res.status(200).json({ parts });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);

        if (!parsed.parts || !Array.isArray(parsed.parts) || parsed.parts.length !== 3) {
            const parts = buildDynamicInsight(character, storyTitle, userChoice, userChoiceConsequence, translatedTags);
            return res.status(200).json({ parts });
        }

        // Clean any leftover markdown or unwanted characters
        parsed.parts = parsed.parts.map((p: string) => p.replace(/[*_#\-~]/g, '').trim());

        return res.status(200).json(parsed);
    } catch (error) {
        console.warn('Analysis generation error, returning smart dynamic fallback:', error);
        const parts = buildDynamicInsight(character, storyTitle, userChoice, userChoiceConsequence, translatedTags);
        return res.status(200).json({ parts });
    }
}
