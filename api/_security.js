const allowedOrigins = new Set([
  'https://aya-phi-liard.vercel.app',
  'https://atyourage.com',
  'https://www.atyourage.com',
]);

const limits = {
  'send-notifications': { maxRequests: 5, windowMs: 60 * 60 * 1000 },
  'delete-account': { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  'subscribe-push': { maxRequests: 10, windowMs: 60 * 1000 },
};
const rateLimitMap = new Map();

export function applyCors(req, res, methods) {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.has(origin) || (process.env.NODE_ENV === 'development' && origin.includes('localhost')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function checkRateLimit(req, res, endpoint) {
  const limit = limits[endpoint];
  const ip = String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown').split(',')[0].trim();
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const current = rateLimitMap.get(key);
  if (!current || now > current.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + limit.windowMs });
    return false;
  }
  if (current.count >= limit.maxRequests) {
    res.setHeader('Retry-After', String(Math.ceil((current.resetAt - now) / 1000)));
    res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
    return true;
  }
  current.count += 1;
  return false;
}

export function hasValidJsonBody(req, res, maxBytes = 10000) {
  if (req.method === 'POST' && !String(req.headers['content-type'] || '').includes('application/json')) {
    res.status(400).json({ success: false, error: 'Content-Type must be application/json' });
    return false;
  }
  if (JSON.stringify(req.body || {}).length > maxBytes) {
    res.status(413).json({ success: false, error: 'Request body too large' });
    return false;
  }
  return true;
}
