import { IDOL_MINDSETS } from '../data/idolMindsets';

export const PERSONALITY_AVATAR_MAP: Record<string, string> = {
    'Elon Musk': '/assets/avatar_elon_musk.png',
    'Ratan Tata': '/assets/avatar_ratan_tata.jpg',
    'Virat Kohli': '/assets/avatar_virat_kohli.jpg',
    'Michael Jackson': '/assets/portrait-michael-jackson.png',
    'Rani Lakshmibai': '/assets/portrait-rani-lakshmibai.png',
    'Bhagat Singh': '/assets/portrait-bhagat-singh.png',
    'Cristiano Ronaldo': '/assets/portrait-cristiano-ronaldo.png',
    'Narendra Modi': '/assets/avatar_Narendra Modi.jpg',
    'Bhuvan Bam': '/assets/avatar_bhuvan bam.jpg',
    'Shahrukh Khan': '/assets/avatar_Shah_Rukh_Khan.jpg',
    'Michael Jordan': '/assets/portrait-michael-jackson.png',
    'Taylor Swift': '/assets/avatar_taylor_swift.png',
    'Billie Eilish': '/assets/portrait-billie-20.png',
    'Karan Aujla': '/assets/avatar_KaranAujla.jpg',
};

export const resolvePersonalityAvatar = (name: string): string => {
    const clean = (name || '').trim();
    if (PERSONALITY_AVATAR_MAP[clean]) return PERSONALITY_AVATAR_MAP[clean];
    const mindset = IDOL_MINDSETS[clean];
    if (mindset?.avatarUrl && mindset.avatarUrl !== '/assets/avatar_business.png') return mindset.avatarUrl;
    return PERSONALITY_AVATAR_MAP[clean] || mindset?.avatarUrl || '/assets/avatar_business.png';
};
