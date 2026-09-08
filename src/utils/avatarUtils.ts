import { IDOL_MINDSETS } from '../data/idolMindsets';

export const PERSONALITY_AVATAR_MAP: Record<string, string> = {
    'Rabindranath Tagore': '/assets/portrait-rabindranath-tagore.png',
    'Elon Musk': '/assets/avatar_elon_musk.png',
    'Ratan Tata': '/assets/avatar_ratan_tata.jpg',
    'Virat Kohli': '/assets/avatar_virat_kohli.jpg',
    'Michael Jackson': '/assets/portrait-michael-jackson.png',
    'Rani Lakshmibai': '/assets/portrait-rani-lakshmibai.png',
    'Bhagat Singh': '/assets/portrait-bhagat-singh.png',
    'Cristiano Ronaldo': '/assets/portrait-cristiano-ronaldo.png',
    'Narendra Modi': '/assets/avatar_Narendra Modi.jpg',
    'Shahrukh Khan': '/assets/avatar_Shah_Rukh_Khan.jpg',
    'Michael Jordan': '/assets/portrait-michael-jackson.png',
    'Dr. A.P.J. Abdul Kalam': '/assets/avatar_apj_kalam.jpg',
    'Sachin Tendulkar': '/assets/avatar_sachin.jpg',
    'Sundar Pichai': '/assets/avatar_sundar.jpg',
    'P.V. Sindhu': '/assets/avatar_sindhu.jpg',
    'A.R. Rahman': '/assets/avatar_rahman.jpg',
    'Neeraj Chopra': '/assets/avatar_neeraj.jpg',
    'Indra Nooyi': '/assets/avatar_nooyi.jpg',
    'Tina Dabi': '/assets/avatar_tina_dabi.png',
    'Nitin Vijay (NV Sir)': '/assets/avatar_nv_sir.jpg',
};

export const resolvePersonalityAvatar = (name: string): string => {
    const clean = (name || '').trim();
    if (PERSONALITY_AVATAR_MAP[clean]) return PERSONALITY_AVATAR_MAP[clean];
    const mindset = IDOL_MINDSETS[clean];
    if (mindset?.avatarUrl && mindset.avatarUrl !== '/assets/avatar_business.png') return mindset.avatarUrl;
    return PERSONALITY_AVATAR_MAP[clean] || mindset?.avatarUrl || '/assets/avatar_business.png';
};
