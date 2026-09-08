import type { VercelRequest, VercelResponse } from '@vercel/node';

const _d = (s: string) => Buffer.from(s, 'base64').toString('utf8');

export const GOOGLE_AUTH_CONFIG = {
    clientId: _d('NTU1MDI2MjMzMTIxLW00aGxtY3ZhamY0OTl1ZTNub2t2bzU3Nzd1aWVhMWJ0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t'),
    clientSecret: _d('R09DU1BYLWZ0dklRaW95a3dJVFhmZnMxRTFvU0FYT0dzRg=='),
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const origin = (req.headers.origin as string) || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    return res.status(200).json({
        clientId: GOOGLE_AUTH_CONFIG.clientId,
        status: 'configured',
    });
}
