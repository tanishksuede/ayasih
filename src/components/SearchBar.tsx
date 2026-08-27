import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { getSessionId } from '../utils/session';
import { useUserStore } from '../store/userStore';
import clsx from 'clsx';

interface SearchBarProps {
  personalities: string[];
  onMatch: (name: string) => void;
  onClose?: () => void;
}

export function SearchBar({ personalities, onMatch, onClose }: SearchBarProps) {
  const isCandyMode = useUserStore((state) => state.isCandyMode);
  const [inputValue, setInputValue] = useState('');
  const [notedMessage, setNotedMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processSearch = async (query: string) => {
    if (!query.trim()) return;

    const lowerQuery = query.toLowerCase().trim();
    
    // Fuzzy match: case-insensitive partial match
    const matchedPersonality = personalities.find(p => 
      p.toLowerCase().includes(lowerQuery)
    );

    if (matchedPersonality) {
      onMatch(matchedPersonality);
      setNotedMessage(null);
    } else {
      // No match found
      setNotedMessage(`We don't have ${query.trim()} yet.`);
      
      // Clear message after 8 seconds to give time to click
      if (messageTimer.current) clearTimeout(messageTimer.current);
      messageTimer.current = setTimeout(() => {
        setNotedMessage(null);
      }, 8000);
    }
    
    // Update session intent for recommendations (even if unmatched, they want this topic)
    const store = useUserStore.getState();
    if (store.updateSessionPreference) {
        store.updateSessionPreference(lowerQuery, 0.5);
    }

    // Log to Supabase for ALL searches (matches and non-matches)
    try {
      await supabase.from('search_queries').insert({
        query_text: query.trim(),
        is_match: !!matchedPersonality,
        matched_personality: matchedPersonality || null,
        session_id: getSessionId()
      });
    } catch (err) {
      console.error('Failed to log search:', err);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (inputValue.trim()) {
      debounceTimer.current = setTimeout(() => {
        processSearch(inputValue);
      }, 800);
    } else {
      setNotedMessage(null);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, [inputValue, personalities]); // Run effect when input changes

  return (
    <div className="w-full relative z-50 flex flex-col items-start pointer-events-auto animate-fade-in">
      <div 
        className={clsx(
          "w-full flex items-center px-3 py-2 transition-all duration-300 rounded-full border-2",
          isFocused 
            ? isCandyMode 
              ? "bg-white/80 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]" 
              : "bg-slate-900/80 border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.4)]"
            : isCandyMode
              ? "bg-white/30 border-transparent hover:bg-white/50 hover:border-pink-300/50"
              : "bg-transparent border-transparent hover:bg-white/5 hover:border-[#00f2ff]/30"
        )}
      >
        <Search size={16} className={clsx(
          "transition-colors",
          isFocused 
            ? isCandyMode ? "text-pink-500" : "text-[#00f2ff]" 
            : isCandyMode ? "text-slate-600/50" : "text-white/50"
        )} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search stories..."
          className={clsx(
            "bg-transparent border-none outline-none w-full ml-2 text-sm font-bold tracking-wide transition-colors placeholder:font-medium",
            isCandyMode ? "text-slate-800 placeholder:text-slate-500/50" : "text-white placeholder:text-white/30"
          )}
        />
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white ml-2 transition-colors focus:outline-none"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Noted Message */}
      <div 
        className={clsx(
          "absolute top-full mt-2 left-0 w-full text-center px-4 py-2 rounded-xl backdrop-blur-md border text-xs font-bold tracking-wide transition-all duration-300 shadow-lg",
          notedMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
          isCandyMode
            ? "bg-white/80 border-pink-300 text-pink-600 shadow-pink-500/20"
            : "bg-black/60 border-[#00f2ff]/20 text-[#00f2ff]"
        )}
      >
        <div className="mb-2">{notedMessage}</div>
      </div>
    </div>
  );
}
