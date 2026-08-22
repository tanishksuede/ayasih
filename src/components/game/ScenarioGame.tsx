import { useState, useEffect, useMemo, useRef } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioManager as audioSynth } from "../../utils/audioManager";
import { detectEmotion, EMOTION_THEMES } from '../../utils/storyEmotion';
import type { EmotionTheme } from '../../utils/storyEmotion';
import { bgmManager } from '../../utils/bgmManager';
import { CheckCircle, AlertCircle, ChevronRight, Volume2, VolumeX, Loader2, Palette, Star } from 'lucide-react';

import PostJourneyFeedback from '../feedback/PostJourneyFeedback';
import { useJourneyTracking } from '../../hooks/useJourneyTracking';
import type { Level, Lesson } from '../../types/gameTypes';
import clsx from 'clsx';
import { supabase } from '../../utils/supabase';
import { logJourneyEvent } from '../../utils/feedbackUtils';
import { STORY_DATABASE } from '../../data/scenarios';
import { IDOL_PROFILES } from '../../data/idolMindsets';
import { calculateLevelInfo } from '../../utils/levelSystem';
import { calculateLifeTraits, matchFutureArchetype } from '../../utils/futureSelfMatch';

// Floating Text Animation Interface
interface FloatText {
    id: number;
    text: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    type: 'positive' | 'negative' | 'neutral';
}

interface ScenarioGameProps {
    level: Level;
    onComplete: (stars: number) => void;
    onBack: () => void;
    onDailyChallengeComplete?: (streakData: { xpEarned: number, oldStreak: number, newStreak: number, isMilestone: boolean }) => void;
}

// Choice Interface
interface Choice {
    text: string;
    next: string;
    score: number; // 0-10
    feedbackTitle: string;
    feedback: string;
}

// Session Choice Tracker Data
interface SessionChoiceData {
    question: string;
    chosen_option: string;
    time_taken_seconds: number;
    trait_impacts: {
        risk_taker: number;
        creative: number;
        analytical: number;
        social: number;
        ambitious: number;
    };
}

export function ScenarioGame({ level, onComplete, onBack, onDailyChallengeComplete }: ScenarioGameProps) {
    // DEBUG: Confirms this component is the active one (check console on game load)
    console.log('[AYA DEBUG] ScenarioGame mounted for level:', level?.id, level?.personality);
    // BUILD MARKER: If this timestamp matches deployment time, the new code is live
    console.log('[AYA BUILD_MARKER] deployed 2026-04-04T15:50 IST — if you see this, prod is serving the latest code');

    const [currentFrameId, setCurrentFrameId] = useState('intro');

    // Typewriter State (Stateless Slice Logic)
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [score, setScore] = useState(0);

    const isNarrationMuted = useUserStore(state => state.isNarrationMuted);
    const toggleNarrationMute = useUserStore(state => state.toggleNarrationMute);
    const appLanguage = useUserStore(state => state.appLanguage);
    // Ref tracks session choices — avoids React stale closure when reading at COMPLETE time
    const sessionChoicesRef = useRef<SessionChoiceData[]>([]);
    const hasInsertedSession = useRef(false);
    const addChoiceToSession = (c: SessionChoiceData) => {
        sessionChoicesRef.current = [...sessionChoicesRef.current, c];
    };
    // Feedback State
    const [feedbackChoice, setFeedbackChoice] = useState<Choice | null>(null);

    // Background Loading State (prevents UI from showing until image is ready)
    const [isBgLoaded, setIsBgLoaded] = useState(false);

    // Floating Text State
    const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);

    // Emotion / Cinematic Theme State
    const initialEmotion = useMemo(() => {
        const targetId = level?.scenarioId || 'lvl_age_19';
        const local = STORY_DATABASE[targetId];
        const rawEmo = local?.frames?.[0]?.emotion || local?.emotion;
        if (rawEmo && EMOTION_THEMES[rawEmo as keyof typeof EMOTION_THEMES]) {
            return rawEmo as keyof typeof EMOTION_THEMES;
        }
        return 'wonder';
    }, [level?.scenarioId]);

    const [currentTheme, setCurrentTheme] = useState<EmotionTheme>(() => EMOTION_THEMES[initialEmotion] || EMOTION_THEMES['wonder']);

    const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
    const [typeSoundEnabled, setTypeSoundEnabled] = useState<boolean>(true);
    // Ref for text scroll container — allows auto-scroll-to-top on frame change
    const textContainerRef = useRef<HTMLDivElement>(null);

    // Theme State (Global)
    const isCandyMode = useUserStore((state) => state.isCandyMode);
    
    // Timing State for Source 3 Matching
    const [frameStartTime, setFrameStartTime] = useState<number>(Date.now());
    
    // Pause state for visibility changes
    const [isPaused, setIsPaused] = useState(false);
    const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);

    // Save status toast state
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // Post-journey feedback state
    const [showPostFeedback, setShowPostFeedback] = useState(false);
    const [pendingCompletionStars, setPendingCompletionStars] = useState<number>(0);

    useJourneyTracking(level.id);

    const toggleCandyMode = useUserStore((state) => state.toggleCandyMode);
    const collectLesson = useUserStore((state) => state.collectLesson);
    const updateTraits = useUserStore((state) => state.updateTraits);
    const addSessionProgression = useUserStore((state) => state.addSessionProgression);
    const updateXpLocally = useUserStore((state) => state.updateXpLocally);
    const completeDailyChallenge = useUserStore((state) => state.completeDailyChallenge);
    const levelScores = useUserStore((state) => state.levelScores);

    const handleLevelComplete = (stars: number) => {
        setPendingCompletionStars(stars);
        setShowPostFeedback(true);
    };

    const finalizeLevelComplete = () => {
        setShowPostFeedback(false);
        onComplete(pendingCompletionStars);
    };

    // Use the global mode (renamed variable mapping for easier refactor)
    // Use the global mode (renamed variable mapping for easier refactor)
    const isCandyTheme = isCandyMode;

    const triggerFloatText = (text: string, type: FloatText['type']) => {
        const id = Date.now();
        const startX = 40 + Math.random() * 20; // 40% - 60%
        const startY = 50 + Math.random() * 10; // 50% - 60%

        setFloatTexts(prev => [...prev, { id, text, x: startX, y: startY, type }]);

        // Cleanup after animation
        setTimeout(() => {
            setFloatTexts(prev => prev.filter(ft => ft.id !== id));
        }, 1500);
    };

    // Load preferences from localStorage on mount
    useEffect(() => {
        if (localStorage.getItem('aya_bgm') === 'false') {
            setBgmEnabled(false);
        }
        if (localStorage.getItem('aya_typewriter_sound') === 'false') {
            setTypeSoundEnabled(false);
        }
    }, []);


    // Handle tab visibility (Pause game timer and BGM)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsPaused(true);
                setPauseStartTime(Date.now());
                if (bgmEnabled) bgmManager.setVolume(0);
            } else {
                setIsPaused(false);
                if (pauseStartTime) {
                    const pausedDuration = Date.now() - pauseStartTime;
                    setFrameStartTime(prev => prev + pausedDuration);
                    setPauseStartTime(null);
                }
                if (bgmEnabled) bgmManager.setVolume(useUserStore.getState().musicVolume);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [pauseStartTime, bgmEnabled]);

    // Load Scenario dynamically from backend
    const [scenario, setScenario] = useState<any>(null);
    const [isLoadingScenario, setIsLoadingScenario] = useState(true);

    useEffect(() => {
        const fetchScenario = async () => {
            setIsLoadingScenario(true);
            const targetId = level?.scenarioId || 'lvl_age_19';
            
            try {
                const { data, error } = await supabase.from('scenarios').select('*').eq('id', targetId).maybeSingle();
                
                if (error || !data) {
                    throw new Error("Supabase fetch failed or returned null");
                }
                
                // Merge local audio & emotion fields into Supabase frames (Supabase may not have latest emotion/audio)
                const localData = STORY_DATABASE[targetId];
                const mergedFrames = data.frames.map((frame: any) => {
                    if (localData) {
                        const localFrame = localData.frames.find((lf: any) => lf.id === frame.id);
                        const updatedFrame = { ...frame };
                        if (localFrame?.emotion) {
                            updatedFrame.emotion = localFrame.emotion;
                        }
                        if (localFrame?.audio) {
                            updatedFrame.audio = localFrame.audio;
                        }
                        if (localFrame?.audio_hi) {
                            updatedFrame.audio_hi = localFrame.audio_hi;
                        }
                        return updatedFrame;
                    }
                    return frame;
                });
                
                setScenario({
                    id: data.id,
                    title: data.title,
                    source: data.source,
                    frames: mergedFrames
                });
                setIsLoadingScenario(false);
            } catch (err) {
                console.warn("[Scenario] Falling back to local story data due to Supabase error:", err);
                
                // Fallback to local data
                const localData = STORY_DATABASE[targetId];
                if (localData) {
                    setScenario({
                        id: targetId,
                        title: localData.title,
                        source: localData.source,
                        frames: localData.frames
                    });
                } else {
                    setScenario({ frames: [{ id: 'intro', text: 'Scenario coming soon.', choices: [] }] });
                }
                setIsLoadingScenario(false);
            }
        };
        fetchScenario();
    }, [level?.scenarioId]);

    const safeScenario = scenario || { frames: [{ id: 'intro', text: 'LOADING...', choices: [] }] };
    const frame = safeScenario.frames.find((f: any) => f.id === currentFrameId) || safeScenario.frames[0];
    const isLearningScreen = currentFrameId.startsWith('LEARNING');

    // Preload all images for this scenario
    useEffect(() => {
        if (!scenario || !scenario.frames) return;
        const imagesToPreload = scenario.frames.map((f: any) => f.bg).filter(Boolean);
        if (level.avatarUrl) imagesToPreload.push(level.avatarUrl);
        if (level.portrait) imagesToPreload.push(`/portraits/${level.portrait}`);
        if (level.background) imagesToPreload.push(`/portraits/${level.background}`);

        // Use a Set to avoid preloading duplicates
        [...new Set(imagesToPreload)].forEach(url => {
            const img = new window.Image();
            img.src = url as string;
        });
    }, [scenario, level.avatarUrl]);

    // Randomize Choices (Memoized so they don't reshuffle on every render)
    // We shuffle a COPY of the array to avoid mutating the original data
    const displayedChoices = useMemo(() => {
        if (!frame.choices) return [];
        return [...frame.choices].sort(() => Math.random() - 0.5);
    }, [currentFrameId, frame.choices]); // Re-shuffle when frame changes or data loads

    // Determine what text to show — on lesson screen show only the body (not the full LESSON: prefix)
    // lessonBody is computed near the return statement where lessonFrame is available.
    // On learning screens activeText is overridden just before typewriter useEffect via a ref trick,
    // but the simplest correct approach: compute a stable activeText from frame.text and let the
    // lesson card render lessonBody directly (not via displayedText).
    const activeText = feedbackChoice ? feedbackChoice.feedback : frame.text;
    const activeAudio = (appLanguage === 'hi' && frame?.audio_hi) ? frame.audio_hi : frame?.audio;

    // Reset bg loaded state when background changes
    useEffect(() => {
        const bgUrl = level.background ? `/portraits/${level.background}` : frame?.bg;
        if (!bgUrl) {
            setIsBgLoaded(true); // No image to load, so mark as loaded
        } else {
            setIsBgLoaded(false);
            // Fallback: if image onLoad fails to fire (e.g. from cache or network error), force load after 1.5s
            const timer = setTimeout(() => setIsBgLoaded(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [frame?.bg, level?.background]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const typingSpeedRef = useRef<number>(20);

    // Emotion detection + ambient music when frame changes or scenario finishes loading
    useEffect(() => {
        const targetId = level?.scenarioId || 'lvl_age_19';
        const localData = STORY_DATABASE[targetId];
        const localFrame = localData?.frames?.find((lf: any) => lf.id === currentFrameId);
        
        // Priority 1: frame.emotion from loaded scenario, Priority 2: localFrame.emotion
        const activeEmotion = frame?.emotion || localFrame?.emotion;

        const textToAnalyse = activeEmotion
            ? (activeEmotion as string)  // explicit override in story data: use emotion string directly
            : (frame?.text || '');
        
        const badgeLabel = feedbackChoice ? feedbackChoice.feedbackTitle : (frame?.id === 'intro' ? 'Narrator' : 'You');
        
        // If frame has an explicit emotion field matching a theme key, use it directly
        const emotion = (activeEmotion && EMOTION_THEMES[activeEmotion as keyof typeof EMOTION_THEMES])
            ? activeEmotion as keyof typeof EMOTION_THEMES
            : detectEmotion(textToAnalyse, badgeLabel);
        
        const theme = EMOTION_THEMES[emotion] || EMOTION_THEMES['calm'];
        setCurrentTheme(theme);

        // Play matching ambient music — unlock listener in bgmManager handles autoplay policy
        bgmManager.play(theme.emotion);

        // Scroll text container back to top on every new frame
        textContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

        return () => {
            // Don't fade out on every frame change — let crossfade handle it
        };
    }, [currentFrameId, feedbackChoice, frame?.id, frame?.emotion, frame?.text, scenario]);

    // Stop music when component unmounts (user exits story)
    useEffect(() => {
        return () => {
            bgmManager.stop(1.5);
        };
    }, []);

    // Reset typewriter when text changes
    useEffect(() => {
        // Do not start typing until the background image finishes loading
        if (!isBgLoaded) return;

        typingSpeedRef.current = 20;

        if (activeAudio && !feedbackChoice && !isNarrationMuted && audioRef.current) {
            audioRef.current.currentTime = 0;
            
            // Calculate dynamic typing speed based on audio duration
            const updateSpeed = () => {
                if (audioRef.current && activeText.length > 0) {
                    const durationMs = audioRef.current.duration * 1000;
                    typingSpeedRef.current = Math.max(20, (durationMs - 500) / activeText.length);
                }
            };

            if (audioRef.current.readyState >= 1) {
                updateSpeed();
            } else {
                audioRef.current.onloadedmetadata = updateSpeed;
            }

            audioRef.current.play().catch(e => {
                console.warn('Audio play failed (autoplay blocked). Please interact with document:', e);
            });
        }

        setDisplayedText("");
        setIsTyping(true);

        // If translating to Hindi, bypass React-state typewriter to prevent Google Translate DOM node crashes.
        if (appLanguage === 'hi') {
            setDisplayedText(activeText);
            setIsTyping(false);
            setFrameStartTime(Date.now());
            return;
        }

        let i = 0;
        let timer: ReturnType<typeof setInterval>;

        // Small delay
        const startDelay = setTimeout(() => {
            // We use a recursive timeout instead of setInterval so dynamicSpeed can update if metadata loads late
            const typeNextCharacter = () => {
                i++;
                if (i <= activeText.length) {
                    setDisplayedText(activeText.slice(0, i));
                    timer = setTimeout(typeNextCharacter, typingSpeedRef.current);
                } else {
                    setIsTyping(false);
                    setFrameStartTime(Date.now()); // Restart timer once question is readable
                }
            };
            timer = setTimeout(typeNextCharacter, typingSpeedRef.current);
        }, 100);

        return () => {
            clearTimeout(startDelay);
            if (timer) clearTimeout(timer);
            // Ensure audio stops completely when frame/effect unmounts
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [activeText, isBgLoaded, frame.audio, feedbackChoice, isNarrationMuted, appLanguage]);

    const handleTextClick = () => {
        if (isTyping) {
            setDisplayedText(activeText);
            setIsTyping(false);
            setFrameStartTime(Date.now()); // Question is readable, start timer now
        }
    };

    // Semantic Keyword Engine (Match Source 2)
    const NAVIGATION_CHOICES = ['next', 'back', 'next chapter', 'finish chapter', 'collect reward', 'complete level'];

    const calculateTraitImpacts = (text: string, baseScore: number) => {
        const impacts = { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 };
        const lowerText = text.toLowerCase();

        // Skip navigation-only choices entirely
        if (NAVIGATION_CHOICES.some(nav => lowerText === nav)) return impacts;
        
        // RISK_TAKER: bold action vs playing safe
        if (lowerText.match(/risk|bold|dare|attack|fearless|leap|jump|escape|rebel|defy|unconventional|break|secret|unauthorized|sneak|confront|charge|storm|aggressive|reckless|challenge|disobey|steal|fight|resist/)) impacts.risk_taker += 5;
        if (lowerText.match(/safe|defend|wait|hide|careful|cautious|protect|avoid|retreat|comply|obey|follow orders|stay quiet|keep your head down|play it safe/)) impacts.risk_taker -= 5;
        
        // CREATIVE: artistic expression vs routine
        if (lowerText.match(/creative|art|write|create|design|story|direct|imagine|build|invent|theatre|music|draw|film|paint|compose|dream|vision|original|unique|style|craft|sculpt|improvise|experiment|innovate/)) impacts.creative += 5;
        if (lowerText.match(/routine|normal|boring|copy|standard|conventional|mundane|repetitive|textbook/)) impacts.creative -= 5;
        
        // ANALYTICAL: thinking and strategy vs impulsive
        if (lowerText.match(/study|plan|research|logic|strategy|analyse|analyze|calculate|think|review|audit|observe|focus|read|data|methodical|systematic|examine|investigate|evaluate|assess|reason|evidence|proof|pattern|prepare/)) impacts.analytical += 5;
        if (lowerText.match(/impulse|rush|distraction|anger|panic|emotional|rash|hasty|gut feeling|wing it|blindly/)) impacts.analytical -= 5;
        
        // SOCIAL: connection vs isolation
        if (lowerText.match(/team|people|friend|connect|talk|listen|coach|mentor|network|collaborate|meet|help|support|community|share|together|unite|gather|recruit|ally|partner|trust|confide|ask|empathy|compassion|kindness/)) impacts.social += 5;
        if (lowerText.match(/alone|ignore|selfish|isolate|solo|abandon|betray|ghost|silent treatment|cold shoulder|dismiss/)) impacts.social -= 5;
        
        // AMBITIOUS: drive and ambition vs giving up
        if (lowerText.match(/name|director|goal|success|win|achieve|top|lead|claim|own|declare|door|office|contract|opportunity|power|dominate|climb|prove|demand|ambition|hustle|grind|first|best|conquer|pitch|negotiate|promote|champion|throne|empire/)) impacts.ambitious += 5;
        if (lowerText.match(/quit|give up|stop|fail|surrender|settle|accept defeat|step down|walk away|resign|mediocre/)) impacts.ambitious -= 5;

        // Apply intensity scaling based on choice baseline score
        if (Object.values(impacts).every(v => v === 0)) {
           if (baseScore > 0) impacts.ambitious += Math.min(baseScore, 5); 
        } else {
           const sign = baseScore >= 0 ? 1 : -1;
           const magnitude = Math.abs(baseScore);
           for (const key in impacts) {
               if (impacts[key as keyof typeof impacts] !== 0) {
                  impacts[key as keyof typeof impacts] += (sign * Math.floor(magnitude / 2));
               }
           }
        }
        return impacts;
    };

    const handleChoiceClick = async (choice: Choice) => {
        audioSynth.playClick();
        // Stop any playing narration immediately
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        // DEBUG: Fires immediately on EVERY choice tap — confirms new code is running
        console.log('[AYA DEBUG] handleChoiceClick fired! choice.text =', choice.text, '| choice.next =', choice.next);

        // Skip trait calculation for navigation-only choices
        const isNavChoice = NAVIGATION_CHOICES.some(nav => choice.text.toLowerCase() === nav);

        const timeTakenMs = Date.now() - frameStartTime;
        const timeTakenSeconds = Math.max(1, Math.round(timeTakenMs / 1000));
        
        // --- NEW: TELEMETRY LOGGING ---
        if (!isNavChoice && scenario?.id) {
            logJourneyEvent(useUserStore.getState().profile?.id || '', scenario.id, 'frame_completed', {
                frame_id: currentFrameId,
                choice_text: choice.text,
                time_taken_ms: timeTakenMs
            });
        }

        const rawImpacts = isNavChoice
            ? { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 }
            : calculateTraitImpacts(choice.text, choice.score);
        const adjustedImpacts = { ...rawImpacts };
        
        // Speed Adjustment Source 3 (20% Weight impact logic translated to point modifiers)
        if (!isNavChoice) {
            for (const key in adjustedImpacts) {
                if (adjustedImpacts[key as keyof typeof adjustedImpacts] > 0) {
                     if (timeTakenSeconds <= 5) adjustedImpacts[key as keyof typeof adjustedImpacts] += 2; // High Confidence
                     if (timeTakenSeconds >= 15) adjustedImpacts[key as keyof typeof adjustedImpacts] -= 2; // Uncertainty
                }
            }
        }
        
        const choiceData: SessionChoiceData = {
           question: displayedText,
           chosen_option: choice.text,
           time_taken_seconds: timeTakenSeconds,
           trait_impacts: adjustedImpacts
        };

        // DEBUG: Full payload for each choice
        console.log('[AYA DEBUG] choiceData built:', JSON.stringify(choiceData, null, 2));

        if (choice.next !== 'intro' && choice.next !== 'COMPLETE') {
             addChoiceToSession(choiceData);
        }

        // If "Try Again" or "Complete", generic handling
        if (choice.next === 'intro') {
            // RETRY LOGIC: Allow going back to intro without wiping score (preserves penalty)
            setCurrentFrameId(choice.next);
            return;
        }

        if (choice.next === 'COMPLETE') {
            // Use the ref to get the definitive up-to-date list (avoids React stale closure)
            const finalSessionChoices = [...sessionChoicesRef.current, choiceData];

            if (finalSessionChoices.length === 0) {
                console.warn(`Data issue: Personality journey ${level.scenarioId} has 0 questions. Skipping completion screen.`);
                onBack();
                return;
            }

            // Fetch Base Profile (Source 1 - 40%)
            const userProfile = useUserStore.getState().profile;
            const quizTraits = userProfile?.traits || { risk: 50, creativity: 50, vision: 50, empathy: 50, leadership: 50 };
            
            const idolName = level.personality || level.archetype || "Default";

            // --- BUG 5 FIX: Save and load cumulative choice history ---
            const historyStr = localStorage.getItem('aya_choice_history');
            let choiceHistory = historyStr ? JSON.parse(historyStr) : [];
            const newChoicesToSave = finalSessionChoices.map(c => ({
                personality: idolName,
                question: c.question,
                option: c.chosen_option,
                impacts: c.trait_impacts
            }));
            choiceHistory = [...choiceHistory, ...newChoicesToSave];
            localStorage.setItem('aya_choice_history', JSON.stringify(choiceHistory));

            // Aggregate from FULL history
            let fullAccumulator = { risk: 0, creativity: 0, analytical: 0, social: 0, ambitious: 0 };
            choiceHistory.forEach((c: any) => {
                fullAccumulator.risk += (c.impacts?.risk_taker || 0);
                fullAccumulator.creativity += (c.impacts?.creative || 0);
                fullAccumulator.analytical += (c.impacts?.analytical || 0);
                fullAccumulator.social += (c.impacts?.social || 0);
                fullAccumulator.ambitious += (c.impacts?.ambitious || 0);
            });

            const totalChoices = choiceHistory.length;
            // Assume an average scenario has 3 questions. 
            // So the cumulative "session equivalent" is (total accumulator / total choices) * 3
            const multiplier = totalChoices > 0 ? 3 / totalChoices : 0;
            
            // --- NEW PHASE 2 MATH LOGIC ---
            const safeClamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));
            
            // 1. Establish Current Scores & Fallbacks
            const oScores = userProfile?.onboarding_scores || quizTraits;
            const sCount = userProfile?.story_count || 0;

            // 2. Latest Story Score (normalized around 50 + full historical accumulation)
            const latestScore = {
                risk: safeClamp(50 + (fullAccumulator.risk * multiplier)),
                creativity: safeClamp(50 + (fullAccumulator.creativity * multiplier)),
                vision: safeClamp(50 + (fullAccumulator.analytical * multiplier)), // analytical = vision
                empathy: safeClamp(50 + (fullAccumulator.social * multiplier)),    // social = empathy
                leadership: safeClamp(50 + (fullAccumulator.ambitious * multiplier)) // ambitious = leadership
            };

            // Use latestScore as the definitive gameplay scores since it already represents the full history
            const newGameplayScores = { ...latestScore };

            // 3. Decay with Floor (Stabilize after 10 questions)
            const newStoryCount = sCount + 1;
            // Once they reach 10 questions, lock the weight to 20% max (0.20), otherwise decay it
            const currentSurveyWeight = totalChoices >= 10 ? 0.20 : Math.max(0.20, Math.pow(0.85, newStoryCount));
            const gameplayWeight = 1 - currentSurveyWeight;

            // 4. Synthesis
            const recalibratedTraits = {
                risk: safeClamp((oScores.risk * currentSurveyWeight) + (newGameplayScores.risk * gameplayWeight)),
                creativity: safeClamp((oScores.creativity * currentSurveyWeight) + (newGameplayScores.creativity * gameplayWeight)),
                vision: safeClamp((oScores.vision * currentSurveyWeight) + (newGameplayScores.vision * gameplayWeight)),
                empathy: safeClamp((oScores.empathy * currentSurveyWeight) + (newGameplayScores.empathy * gameplayWeight)),
                leadership: safeClamp((oScores.leadership * currentSurveyWeight) + (newGameplayScores.leadership * gameplayWeight))
            };

            // Calculate Match Result against IDOL_PROFILES
            const idolTraits = IDOL_PROFILES[idolName] || IDOL_PROFILES["Default"];
            
            const totalDiff = 
                Math.abs(recalibratedTraits.risk - idolTraits.risk) +
                Math.abs(recalibratedTraits.creativity - idolTraits.creativity) +
                Math.abs(recalibratedTraits.vision - idolTraits.analytical) +
                Math.abs(recalibratedTraits.empathy - idolTraits.social) +
                Math.abs(recalibratedTraits.leadership - idolTraits.ambitious);
                
            const matchPercent = Math.max(0, Math.round(100 - (totalDiff / 5)));

            // Identify dominant gap
            const userTraitMap: any = { risk: recalibratedTraits.risk, creative: recalibratedTraits.creativity, analytical: recalibratedTraits.vision, social: recalibratedTraits.empathy, ambitious: recalibratedTraits.leadership };
            const gapTrait = Object.keys(idolTraits).reduce((a, b) => {
                const gapA = idolTraits[a] - userTraitMap[a];
                const gapB = idolTraits[b] - userTraitMap[b];
                return gapA > gapB ? a : b;
            });

            const matchResult = {
                matchPercentage: matchPercent,
                gapAnalysis: `Growth Area: ${gapTrait}`,
                idolName: idolName
            };
            
            const starCount = score >= 20 ? 3 : score >= 10 ? 2 : 1;

            // Collect Lesson
            const lessonData: Lesson = {
                id: level.scenarioId,
                title: lessonKeyword,
                description: frame.text.replace(/^LESSON:\s*[A-Z]+\.\s*/, ''), // Strip "LESSON: KEYWORD. " prefix
                source: level.archetype, // e.g. "The Icon"
                age: level.age,
                date: new Date().toISOString(),
                matchResult: matchResult
            };
            collectLesson(lessonData);

            // Supabase Tracking
            // DEBUG: This fires even if user has no ID — confirms COMPLETE branch was reached
            console.log('[AYA DEBUG] COMPLETE branch reached. userProfile.id =', userProfile?.id, '| finalSessionChoices.length =', finalSessionChoices.length);

            // Calculate XP progression mathematically
            const isFirstTime = !levelScores[level.id];
            let sessionTotalXp = score; // Base accumulated from choices
            
            sessionTotalXp += 50; // Base node finish
            if (matchPercent > 80) sessionTotalXp += 20; // High alignment bonus
            if (isFirstTime) sessionTotalXp += 30; // First time run

            sessionTotalXp = Math.max(20, sessionTotalXp); // Safety Floor

            const currentTotalXp = userProfile?.total_xp || 0;
            const currentStories = userProfile?.stories_completed || 0;
            const newTotalXp = currentTotalXp + sessionTotalXp;
            const newLevelInfo = calculateLevelInfo(newTotalXp);

            // ── Future Self calculation ────────────────────────────────────
            const currentStreak = userProfile?.current_streak || 0;
            const futureLT = calculateLifeTraits(
                {
                    risk: recalibratedTraits.risk,
                    creativity: recalibratedTraits.creativity,
                    vision: recalibratedTraits.vision,
                    empathy: recalibratedTraits.empathy,
                    leadership: recalibratedTraits.leadership,
                    discipline: recalibratedTraits.vision, // proxy
                    resilience: recalibratedTraits.risk,   // proxy
                },
                currentStreak
            );
            const futureMatchResult = matchFutureArchetype(futureLT);

            // Patch local Zustand profile with future self data and new psychometric scores
            const setProfile = useUserStore.getState().setProfile;
            const latestProfile = useUserStore.getState().profile;
            if (latestProfile) {
                setProfile({
                    ...latestProfile,
                    futureArchetype: futureMatchResult.archetype.name,
                    futureArchetypeScore: futureMatchResult.score,
                    lifeTraits: futureLT,
                    gameplay_scores: newGameplayScores,
                    story_count: newStoryCount,
                    traits: {
                        ...latestProfile.traits,
                        risk: recalibratedTraits.risk,
                        creativity: recalibratedTraits.creativity,
                        vision: recalibratedTraits.vision,
                        empathy: recalibratedTraits.empathy,
                        leadership: recalibratedTraits.leadership
                    }
                });
            }

            if (userProfile?.id && !hasInsertedSession.current) {
                hasInsertedSession.current = true;

                // Build updated level_scores for direct save to users table
                const currentLevelScores = useUserStore.getState().levelScores || {};
                const updatedLevelScores = {
                    ...currentLevelScores,
                    [level.id]: Math.max(currentLevelScores[level.id] || 0, starCount)
                };

                // ── 1. Update users table: XP + stories + level_scores (most reliable backup) ──
                try {
                    const { error: usersErr } = await supabase.from('users').update({
                        total_xp: newTotalXp,
                        level: newLevelInfo.level,
                        stories_completed: currentStories + 1,
                        story_count: newStoryCount,
                        gameplay_scores: newGameplayScores,
                        level_scores: updatedLevelScores,   // Save stars directly here as primary backup
                    }).eq('id', userProfile.id);
                    if (usersErr) {
                        console.error('[AYA] users update error:', usersErr.message, usersErr.details);
                        setSaveStatus('error');
                    } else {
                        console.log('[AYA] ✓ users updated (XP + level_scores saved)');
                        setSaveStatus('saved');
                    }
                } catch (e) {
                    console.error('[AYA] users update threw:', e);
                    setSaveStatus('error');
                }

                // ── 2. Upsert personality_profiles ────────────────────────────────────────
                try {
                    const { error: ppErr } = await supabase.from('personality_profiles').upsert({
                        user_id: userProfile.id,
                        mobile: userProfile.mobile || null,
                        trait_risk_taker: recalibratedTraits.risk,
                        trait_creative: recalibratedTraits.creativity,
                        trait_analytical: recalibratedTraits.vision,
                        trait_social: recalibratedTraits.empathy,
                        trait_ambitious: recalibratedTraits.leadership,
                        total_xp: newTotalXp,
                        level: newLevelInfo.level,
                        stories_completed: currentStories + 1,
                        last_updated: new Date().toISOString(),
                        future_archetype: futureMatchResult.archetype.name,
                        future_archetype_score: futureMatchResult.score,
                        life_resilience: futureLT.resilience,
                        life_discipline: futureLT.discipline,
                        life_courage: futureLT.courage,
                        life_creativity: futureLT.creativity,
                        life_emotional_control: futureLT.emotional_control,
                        life_leadership: futureLT.leadership,
                        life_risk_intelligence: futureLT.risk_intelligence,
                        life_consistency: futureLT.consistency,
                    }, { onConflict: 'user_id' });
                    if (ppErr) console.error('[AYA] personality_profiles upsert error:', ppErr.message, ppErr.details);
                    else console.log('[AYA] ✓ personality_profiles upserted');
                } catch (e) { console.error('[AYA] personality_profiles upsert threw:', e); }

                // ── 3. Streak & Daily Challenge ────────────────────────────────────────────
                try {
                    const streakResult = completeDailyChallenge();
                    if (streakResult && streakResult.newStreak > streakResult.oldStreak) {
                        await supabase.from('users').update({
                            current_streak: streakResult.newStreak,
                            longest_streak: Math.max(userProfile.longest_streak || 0, streakResult.newStreak),
                            last_active_date: new Date().toISOString().split('T')[0],
                            daily_challenge_completed: true
                        }).eq('id', userProfile.id);
                        if (onDailyChallengeComplete) onDailyChallengeComplete(streakResult);
                    }
                } catch (e) { console.error('[AYA] streak update threw:', e); }

                // ── 4. Insert game_sessions (history log — no scenario_choices to avoid JSONB errors) ──
                try {
                    const insertData: any = {
                        user_id: userProfile.id,
                        level_id: String(level.id),
                        selected_personality: String(level.personality || level.archetype || ''),
                        match_score: matchPercent,
                        stars: starCount
                    };
                    const { data, error: insertError } = await supabase.from('game_sessions').insert(insertData).select();
                    
                    if (insertError) {
                        if (insertError.code === '23503') {
                            // Foreign key violation for guest user, retry without user_id
                            insertData.user_id = null;
                            const { data: retryData, error: retryError } = await supabase.from('game_sessions').insert(insertData).select();
                            if (!retryError) {
                                console.log('[AYA] ✓ game_sessions inserted (guest mode):', retryData);
                                return;
                            }
                        }
                        console.error('[AYA] game_sessions INSERT ERROR:', insertError.message, insertError.details, insertError.hint);
                        // Fallback: Try inserting without new columns if they haven't been created yet
                        const fallbackData: any = {
                             user_id: userProfile.id,
                             match_score: matchPercent,
                        };
                        const { error: fallbackError } = await supabase.from('game_sessions').insert(fallbackData);
                        if (fallbackError && fallbackError.code === '23503') {
                             fallbackData.user_id = null;
                             await supabase.from('game_sessions').insert(fallbackData);
                        }
                    } else {
                        console.log('[AYA] ✓ game_sessions inserted:', data);
                    }
                } catch (e) { console.error('[AYA] game_sessions insert threw:', e); }

            } else if (!userProfile?.id) {
                console.warn('[AYA] No userProfile.id — cannot save to Supabase. Profile:', userProfile);
            } else if (hasInsertedSession.current) {
                console.log('[AYA] Skipping duplicate game_sessions insert — already saved this session');
            }

            // Call completeLevel locally immediately so it syncs to backend right away before timeout!
            useUserStore.getState().completeLevel(String(level.id), starCount);

            // Push final XP + stories_completed to local Zustand store (triggers syncStoreToBackend as backup)
            addSessionProgression(sessionTotalXp);

            // UPDATE TRAITS globally
            updateTraits({
                risk: recalibratedTraits.risk - quizTraits.risk,
                creativity: recalibratedTraits.creativity - quizTraits.creativity,
                vision: recalibratedTraits.vision - quizTraits.vision,
                empathy: recalibratedTraits.empathy - quizTraits.empathy,
                leadership: recalibratedTraits.leadership - quizTraits.leadership
            });

            // Float the XP events visually before demounting the view!
            triggerFloatText(`+50 XP`, 'positive');
            
            let delayMs = 1200;
            if (matchPercent > 80) {
                setTimeout(() => triggerFloatText(`+20 XP (Outstanding)`, 'positive'), 800);
                delayMs += 800;
            }
            if (isFirstTime) {
                setTimeout(() => triggerFloatText(`+30 XP (First Run)`, 'positive'), 1600);
                delayMs += 800;
            }

            console.log('[AYA DEBUG] All done, calling handleLevelComplete with stars:', starCount, 'and session XP:', sessionTotalXp);
            
            // Queue transition out allowing particles to run
            setTimeout(() => {
                bgmManager.stop(1);
                handleLevelComplete(starCount);
            }, delayMs);
            return;
        }

        // Check if there is feedback to show
        if (choice.feedback) {
            const addedScore = choice.score || 0;
            // Updated to handle negative scores (simple addition works since choice.score can be -10)
            setScore(prev => prev + addedScore);
            updateXpLocally(addedScore); // Sync with global header in real-time
            setFeedbackChoice(choice);

            // Trigger Floating Text
            if (addedScore > 0) {
                triggerFloatText(`+${addedScore} XP`, 'positive');
            } else if (addedScore < 0) {
                triggerFloatText(`${addedScore} XP`, 'negative');
            }
        } else {
            const addedScore = choice.score || 0;
            // No feedback (e.g. navigation only), just go
            setScore(prev => prev + addedScore);
            updateXpLocally(addedScore); // Sync with global header in real-time
            setCurrentFrameId(choice.next);
        }
    };

    const handleFeedbackContinue = () => {
        if (feedbackChoice) {
            // Stop narration before moving to next frame
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setCurrentFrameId(feedbackChoice.next);
            setFeedbackChoice(null);
        }
    };

    // Extract Lesson Title and Body separately from the LESSON: field
    // Data format: "LESSON: KEYWORD. Body text here."
    const lessonFrame = isLearningScreen ? frame : safeScenario.frames.find((f: any) => f.id.startsWith('LEARNING') || f.id === 'lesson');
    const lessonRawText: string = lessonFrame?.text || '';
    // Title: the word(s) after "LESSON:" and before the first full stop
    const lessonKeyword = lessonRawText.match(/LESSON:\s*([^.]+)/i)?.[1]?.trim().toUpperCase() || 'LESSON';
    // Body: everything after "LESSON: KEYWORD." — strip the prefix
    const lessonBody = lessonRawText.replace(/^LESSON:\s*[^.]+\.\s*/i, '').trim() || lessonRawText;

    if (isLoadingScenario || !scenario) {
        return (
            <div className="w-full h-[100dvh] bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
                <p className="text-cyan-400 text-sm tracking-widest animate-pulse">LOADING SCENARIO...</p>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans cinematic-container"
            style={{
                backgroundColor: isCandyMode ? '#0f172a' : '#000',
            }}
        >
            {/* HTML5 Audio Element for Voice Narration */}
            <audio 
                ref={audioRef} 
                src={activeAudio && !feedbackChoice ? activeAudio : undefined} 
                preload="auto"
                className="hidden" 
                onPlay={(e) => {
                    e.currentTarget.volume = 1.0;
                    if (bgmEnabled) bgmManager.setVolume(useUserStore.getState().musicVolume * 0.25);
                    audioSynth.setSfxVolume(useUserStore.getState().sfxVolume * 0.25);
                }}
                onPause={() => {
                    if (bgmEnabled && !document.hidden) bgmManager.setVolume(useUserStore.getState().musicVolume);
                    if (!document.hidden) audioSynth.setSfxVolume(useUserStore.getState().sfxVolume);
                }}
                onEnded={() => {
                    if (bgmEnabled && !document.hidden) bgmManager.setVolume(useUserStore.getState().musicVolume);
                    if (!document.hidden) audioSynth.setSfxVolume(useUserStore.getState().sfxVolume);
                }}
            />
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    key={level.background ? `/portraits/${level.background}` : frame.bg}
                    src={level.background ? `/portraits/${level.background}` : frame.bg}
                    alt="Scenario Scene"
                    onLoad={() => setIsBgLoaded(true)}
                    onError={() => setIsBgLoaded(true)}
                    className={clsx(
                        "w-full h-full",
                        level.scenarioId === 'lvl_age_18_virat' ? "transition-opacity duration-200" : "transition-opacity duration-1000",
                        !isBgLoaded ? "opacity-0" : "opacity-100",
                        // Allow frames to specify object-contain to prevent avatar cropping, fallback to object-cover
                        level.scenarioId === 'lvl_age_18_virat' ? "object-contain" : (frame.bgSize || "object-cover"),
                        // Dynamic Object Position (defaults to center if not specified to prevent cropping subjects)
                        frame.bgPosition || "object-center",
                        isLearningScreen
                            ? "scale-110 blur-sm opacity-40 grayscale"
                            : level.scenarioId === 'lvl_age_18_virat'
                                ? "opacity-100" // No Ken Burns for this visual story so it stays fully visible
                                : isCandyTheme
                                    ? "animate-ken-burns saturate-125" // Brighter, saturated
                                    : "animate-ken-burns opacity-80"
                    )}
                />
                {level.scenarioId !== 'lvl_age_18_virat' && (
                    <div className={clsx(
                        "absolute inset-0 bg-gradient-to-t",
                        isCandyTheme
                            ? "from-pink-500/30 via-purple-500/10 to-transparent mix-blend-overlay" // Candy vibe
                            : "from-slate-950 via-slate-900/60 to-slate-900/30" // Original Dark vibe
                    )} />
                )}

                {/* Emotion vignette overlay */}
                {level.scenarioId !== 'lvl_age_18_virat' && (
                    <div
                        className="cinematic-vignette absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at center, transparent 40%, ${currentTheme.vignette} 100%)`,
                        }}
                    />
                )}
            </div>

            {!isBgLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                    <span className="text-yellow-500/80 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Loading Scene
                    </span>
                </div>
            )}

            {/* Paused Overlay */}
            {isPaused && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                    <h2 className="text-3xl font-black text-white tracking-widest uppercase animate-pulse">Paused</h2>
                    <p className="text-white/60 mt-2 font-mono text-sm">Resume to continue your story</p>
                </div>
            )}

            {/* Sound Controls — Right Edge below Top Bar */}
            <div className="fixed top-28 right-4 md:right-6 z-50 flex flex-col gap-2">
                {/* BGM toggle */}
                <button
                    onClick={() => {
                        bgmManager.toggle();
                        const nowEnabled = bgmManager.enabled;
                        setBgmEnabled(nowEnabled);
                        localStorage.setItem('aya_bgm', nowEnabled.toString());
                    }}
                    className="cinematic-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 text-base shadow-lg"
                    style={{ borderColor: `${currentTheme.badgeColor}80` }}
                    title="Background Music"
                >
                    {bgmEnabled ? '🎵' : '🔇'}
                </button>

                {/* Typewriter sound toggle */}
                <button
                    onClick={() => {
                        const next = !typeSoundEnabled;
                        setTypeSoundEnabled(next);
                        localStorage.setItem('aya_typewriter_sound', next.toString());
                    }}
                    className="cinematic-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 text-base shadow-lg"
                    style={{ borderColor: `${currentTheme.badgeColor}80` }}
                    title="Typewriter Sound"
                >
                    {typeSoundEnabled ? '⌨️' : '🔕'}
                </button>

                {/* Voice Narration toggle */}
                <button
                    onClick={() => {
                        toggleNarrationMute();
                        // If we are currently not muted, muting it should pause the audio
                        if (!isNarrationMuted && audioRef.current) {
                            audioRef.current.pause();
                        } else if (isNarrationMuted && audioRef.current && activeAudio) {
                            audioRef.current.play().catch(console.warn);
                        }
                    }}
                    className={`cinematic-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 transition-colors shadow-lg ${isNarrationMuted ? 'bg-red-500/10 text-red-400' : 'text-[#00f1fe] bg-[#00f1fe]/10'}`}
                    style={{ borderColor: `${currentTheme.badgeColor}80` }}
                    title="Voice Narration"
                >
                    {!isNarrationMuted ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
            </div>

            {/* Top Bar (Stats) */}
            <div className={clsx(
                "absolute top-0 left-0 w-full pt-8 px-6 pb-6 z-20 flex justify-between items-center text-white/80 transition-opacity duration-500",
                isBgLoaded ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        bgmManager.stop(1);
                        
                        // --- NEW: ABANDON LOGGING ---
                        const isComplete = currentFrameId === 'COMPLETE' || currentFrameId.startsWith('LEARNING');
                        if (!isComplete && scenario?.id) {
                            logJourneyEvent(useUserStore.getState().profile?.id || '', scenario.id, 'story_abandoned', {
                                frame_id: currentFrameId,
                                time_spent_on_frame_ms: Date.now() - frameStartTime
                            });
                        }
                        
                        onBack();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                >
                    <ChevronRight className="rotate-180 w-3 h-3" /> Exit
                </button>
                <div className="flex gap-4 items-center">
                    {/* Theme Toggle for Testing */}
                    <button
                        onClick={() => toggleCandyMode()}
                        className={clsx(
                            "p-2 rounded-full transition-all",
                            isCandyTheme ? "bg-pink-500 text-white shadow-lg" : "bg-black/40 text-white/50 hover:text-white"
                        )}
                        title="Toggle Candy Theme"
                    >
                        <Palette size={16} />
                    </button>

                    <div className={clsx(
                        "flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all shadow-xl",
                        isCandyTheme
                            ? "bg-white/90 border-yellow-400 text-yellow-900"
                            : "bg-slate-900/80 border-yellow-500/50 text-yellow-500"
                    )} style={{ borderColor: `${currentTheme.badgeColor}80`, color: currentTheme.badgeColor }}>
                        <Star className={clsx("w-6 h-6", isCandyTheme ? "text-yellow-500 fill-yellow-500" : "fill-current")} />
                        <span className="text-2xl font-black">{score} XP</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={clsx(
                "relative z-10 w-full h-[100dvh] flex flex-col pt-[80px] pb-6 items-center max-w-3xl px-6 transition-opacity duration-700",
                isBgLoaded ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"
            )}>

                {/* LEARNING SCREEN — decorative giant text removed, card handles everything */}

                {/* --- BOTTOM ALIGNED CONTENT --- */}
                <div className="w-full flex flex-col mt-auto items-center min-h-0 relative z-20">
                    {!activeText.trim() && !isLearningScreen ? (
                        <div className="w-full flex justify-between px-2 pb-6 max-w-4xl mx-auto z-50 relative pointer-events-auto items-end">
                            {displayedChoices.find(c => c.text.toLowerCase().includes('back')) ? (
                                <button
                                    onClick={() => handleChoiceClick(displayedChoices.find(c => c.text.toLowerCase().includes('back')) as Choice)}
                                    className="px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2 shadow-lg"
                                >
                                    <ChevronRight className="rotate-180 w-5 h-5" /> Back
                                </button>
                            ) : <div />}
                            
                            {displayedChoices.find(c => c.text.toLowerCase().includes('next')) ? (
                                <button
                                    onClick={() => handleChoiceClick(displayedChoices.find(c => c.text.toLowerCase().includes('next')) as Choice)}
                                    className="px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
                                    style={!isCandyMode ? {
                                        backgroundColor: currentTheme.badgeColor,
                                        color: '#fff',
                                        boxShadow: `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`,
                                        border: `1px solid ${currentTheme.cardBorder}`,
                                    } : { backgroundColor: '#f59e0b', color: '#fff' }}
                                >
                                    Next <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : <div />}
                        </div>
                    ) : (
                    <div
                        className={clsx(
                            "w-full rounded-2xl cinematic-card flex flex-col overflow-hidden",
                            isCandyTheme
                                ? "bg-white/95 border-b-8 border-pink-400 shadow-[0_20px_50px_rgba(236,72,153,0.3)] text-slate-800"
                                : "border"
                        )}
                        style={!isCandyMode ? {
                            background: 'rgba(10, 10, 20, 0.88)',
                            borderColor: currentTheme.cardBorder,
                            boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${currentTheme.badgeColor}22`,
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            maxHeight: window.innerWidth < 768 ? '85vh' : '80vh',
                            width: window.innerWidth < 768 ? '95%' : '90%',
                            maxWidth: '680px',
                            margin: '0 auto',
                        } : {
                            maxHeight: window.innerWidth < 768 ? '85vh' : '80vh',
                            width: window.innerWidth < 768 ? '95%' : '90%',
                            maxWidth: '680px',
                            margin: '0 auto',
                        }}
                        onClick={handleTextClick}
                    >
                        <div 
                            ref={textContainerRef}
                            className="p-5 overflow-y-auto custom-scrollbar flex flex-col flex-1 min-h-0"
                            style={{ 
                                scrollbarWidth: 'thin', 
                                scrollbarColor: `${currentTheme.badgeColor} transparent`,
                                gap: '16px'
                            }}
                        >
                        {/* Bug 2 — Lesson card: single clean layout, no decorative overlap */}
                        {isLearningScreen ? (
                            <>
                                {/* KEY TAKEAWAY label */}
                                <div className="text-center shrink-0" style={{ color: currentTheme.badgeColor, letterSpacing: '3px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Key Takeaway
                                </div>
                                {/* Lesson title */}
                                <h2 className="text-center font-black text-white shrink-0" style={{ fontSize: '1.4rem', lineHeight: 1.3, maxHeight: '3rem', overflow: 'hidden' }}>
                                    {lessonKeyword}
                                </h2>
                                {/* Lesson body text */}
                                <p 
                                    key={lessonBody}
                                    className={clsx(
                                    "leading-relaxed text-center",
                                    isCandyTheme
                                        ? "text-lg font-serif italic text-pink-900"
                                        : "text-sm text-white/80"
                                )}
                                style={{ fontSize: '0.95rem' }}>
                                    {lessonBody}
                                </p>


                                {/* Finish Chapter button — always visible on lesson screen */}
                                <div className="mt-4 shrink-0">
                                        {displayedChoices.map((choice, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleChoiceClick(choice as Choice)}
                                                className="cinematic-continue w-full py-4 rounded-full font-bold uppercase tracking-widest text-white transition-all active:scale-95"
                                                style={!isCandyMode ? {
                                                    backgroundColor: currentTheme.badgeColor,
                                                    boxShadow: `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`,
                                                    border: `1px solid ${currentTheme.cardBorder}`,
                                                } : { backgroundColor: '#f59e0b' }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.5), 0 0 30px ${currentTheme.badgeColor}cc`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`;
                                                }}
                                            >
                                                {choice.text}
                                            </button>
                                        ))}
                                    </div>
                            </>
                        ) : (
                        <>
                        {/* Speaker Label INSIDE the card */}
                        {!isLearningScreen && (
                            <div className="self-start shrink-0">
                                <div
                                    className={clsx(
                                        "cinematic-badge font-extrabold uppercase tracking-wider text-sm px-6 py-2 rounded-full border shadow-lg",
                                        feedbackChoice
                                            ? feedbackChoice.score > 0 ? "bg-green-400/20 border-green-400 text-green-400" : "bg-red-400/20 border-red-400 text-red-400"
                                            : isCandyMode ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" : "bg-transparent text-white"
                                    )}
                                    style={!isCandyMode && !feedbackChoice ? {
                                        borderColor: currentTheme.badgeColor,
                                        color: currentTheme.badgeColor,
                                        boxShadow: currentTheme.badgeGlow,
                                        backgroundColor: `${currentTheme.badgeColor}33`,
                                    } : {}}
                                >
                                    {feedbackChoice
                                        ? feedbackChoice.feedbackTitle
                                        : (frame.id === 'intro' ? 'Narrator' : 'You')}
                                </div>
                            </div>
                        )}
                        {/* Text Content */}
                        <div className="pb-2">
                            {level.age_mirror_text && (frame.id === 'intro') && !feedbackChoice && (
                                <p className="italic text-sm md:text-base mb-4 text-center" style={{ color: '#00f1fe' }}>
                                    At YOUR age ({useUserStore.getState().profile?.age || 18}), {level.personality} was {level.age_mirror_text}.
                                </p>
                            )}
                            <p 
                                key={activeText}
                                className={clsx(
                                "leading-relaxed",
                                isCandyTheme
                                    ? "text-[17px] md:text-2xl font-bold font-comic text-pink-900 drop-shadow-none"
                                    : "text-[17px] md:text-2xl font-comic text-white drop-shadow-md"
                            )}
                            >
                                {appLanguage === 'hi' ? activeText : displayedText}
                                {isTyping && <span className={clsx("inline-block w-2 h-6 ml-1 animate-cursor-blink align-middle", isCandyTheme ? "bg-pink-500" : "bg-yellow-400")} />}
                            </p>
                        </div>

                        {/* Choice buttons — flex-shrink-0 so they never get compressed */}
                        {!isTyping && !feedbackChoice && (
                            <div
                                className="mt-3 animate-fade-in"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: window.innerWidth < 768 ? '8px' : '12px',
                                        width: '100%',
                                        flexShrink: 0,
                                    }}
                            >
                                {displayedChoices.map((choice, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleChoiceClick(choice as Choice)}
                                        className={clsx(
                                            "cinematic-choice group w-full text-left border-2 transition-all flex items-center justify-between shadow-lg",
                                            isCandyTheme
                                                ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold border-b-4 border-teal-700 hover:translate-y-1 hover:border-b-0 active:scale-95 shadow-lg rounded-full"
                                                : "border-white/10 rounded-2xl"
                                        )}
                                        style={{
                                            minHeight: '60px',
                                            padding: window.innerWidth < 768 ? '12px 16px' : '16px 20px',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            borderColor: currentTheme.choiceBorder,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCandyMode) {
                                                e.currentTarget.style.boxShadow = currentTheme.badgeGlow;
                                                e.currentTarget.style.borderColor = currentTheme.badgeColor;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCandyMode) {
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = currentTheme.choiceBorder;
                                            }
                                        }}
                                    >
                                        <span className={clsx("font-medium text-base leading-snug transition-colors flex-1 mr-3", isCandyTheme ? "text-white drop-shadow-md" : "text-white/90 group-hover:text-white")}>
                                            {choice.text}
                                        </span>
                                        {!isLearningScreen && <ChevronRight className={clsx("shrink-0 group-hover:translate-x-1 transition-transform", isCandyTheme ? "text-white" : "text-white/40")} />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {feedbackChoice && (
                            <div className="mt-8 flex justify-center animate-fade-in">
                                <button
                                    onClick={handleFeedbackContinue}
                                    className="cinematic-continue px-10 py-4 rounded-full font-bold uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 hover:scale-105"
                                    style={!isCandyMode ? {
                                        backgroundColor: currentTheme.badgeColor,
                                        boxShadow: `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`,
                                    } : { backgroundColor: '#f59e0b' }}
                                    onMouseEnter={(e) => {
                                        if (!isCandyMode) {
                                            e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.5), 0 0 30px ${currentTheme.badgeColor}cc`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isCandyMode) {
                                            e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`;
                                        }
                                    }}
                                >
                                    Continue <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                        </>
                        )}
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* Floating Text Overlay */}
            {floatTexts.map(ft => (
                <div
                    key={ft.id}
                    className={clsx(
                        "absolute z-50 font-black text-2xl px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 border-2 animate-float-score",
                        // Candy Theme: Vibrant gradients with white borders
                        isCandyTheme
                            ? (ft.type === 'positive'
                                ? "bg-gradient-to-r from-emerald-400 to-green-500 border-white text-white rotate-[-3deg]"
                                : "bg-gradient-to-r from-red-500 to-rose-600 border-white text-white rotate-[3deg]")
                            // Dark Theme: Neon gradients with glow
                            : (ft.type === 'positive'
                                ? "bg-black/60 border-green-400 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]"
                                : "bg-black/60 border-red-500 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]")
                    )}
                    style={{ left: `${ft.x}%`, top: `${ft.y}%` }}
                >
                    {ft.type === 'positive' ? <CheckCircle className="w-6 h-6 stroke-[3]" /> : <AlertCircle className="w-6 h-6 stroke-[3]" />}
                    {ft.text}
                </div>
            ))}

            {/* Save Status Toast — visible indicator so user knows if DB save worked */}
            {saveStatus !== 'idle' && (
                <div className={clsx(
                    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-2xl border backdrop-blur-md transition-all animate-fade-in-up",
                    saveStatus === 'saved'
                        ? "bg-emerald-900/80 border-emerald-400/50 text-emerald-300"
                        : "bg-red-900/80 border-red-400/50 text-red-300"
                )}>
                    {saveStatus === 'saved' ? '✓ Progress Saved' : '✗ Save Failed — check connection'}
                </div>
            )}

            {/* Post Journey Feedback Popup */}
            {showPostFeedback && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 relative animate-fade-in-up">
                        <PostJourneyFeedback
                            journeyId={level.id}
                            sessionDurationSeconds={null}
                            onFeedbackComplete={finalizeLevelComplete}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
