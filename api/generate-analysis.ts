import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    } = req.body;

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
        return res.status(500).json({ error: 'Missing GROQ_API_KEY environment variable' });
    }

    try {
        const prompt = `You are a mentor in a self-discovery app. 
The user recently said they are feeling/dealing with: ${(tags || []).join(', ')}.
They just played a story about ${character} (${storyTitle}).
In the story, they made this choice: "${userChoice}".
Consequence: "${userChoiceConsequence}".
User's age: ${userAge || 'unknown'}.
User's traits (1-100 scale): ${JSON.stringify(userTraits || {})}.

Analyze what this choice means for their current situation in exactly 3 short parts.
Part 1: Connect their situation (${(tags || []).join(', ')}) with how ${character} handled a similar phase.
Part 2: Analyze what their choice ("${userChoice}") indicates about how they are handling their situation. Be constructive.
Part 3: Give short, practical, age-appropriate guidance.

Output MUST be a valid JSON object with exactly one key "parts", containing an array of 3 strings.
NO markdown. NO emojis. NO asterisks. NO dashes. Short sentences. Conversational tone.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'You are an insightful, friendly, and practical mentor. Respond ONLY in valid JSON. No markdown, no emojis.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 300,
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('Groq API Error:', response.status, errBody);
            return res.status(500).json({ error: 'Groq API request failed' });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);

        if (!parsed.parts || !Array.isArray(parsed.parts) || parsed.parts.length !== 3) {
            return res.status(500).json({ error: 'Invalid response format from Groq' });
        }

        parsed.parts = parsed.parts.map((p: string) => p.replace(/[*_#\-~]/g, '').trim());

        return res.status(200).json(parsed);
    } catch (error) {
        console.error('Analysis generation error:', error);
        return res.status(500).json({ error: 'Failed to generate analysis' });
    }
}
