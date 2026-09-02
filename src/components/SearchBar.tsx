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

    // Log to search_analytics table
    try {
      const { logSearchQuery } = await import('../services/recommendationEngine');
      const profile = useUserStore.getState().profile;
      await logSearchQuery({
        user_id: profile?.id,
        query: query.trim(),
        results_count: matchedPersonality ? 1 : 0,
        matched_story_ids: matchedPersonality ? [matchedPersonality] : [],
        is_zero_result: !matchedPersonality,
        is_low_confidence: false,
        session_id: getSessionId() || undefined,
      });

      // Also maintain legacy search_queries for backward compatibility
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
          "w-full flex items-center px-4 py-2 transition-all duration-200 rounded-lg border",
          isFocused 
            ? "bg-[#0C1220] border-[#00E5FF]/40 shadow-[0_2px_8px_rgba(0,229,255,0.15)]"
            : "bg-[#080B14] border-white/[0.06] shadow-inner shadow-black/50 hover:bg-[#0C1220] hover:border-white/[0.1]"
        )}
      >
        <Search size={14} className={clsx(
          "transition-colors",
          isFocused ? "text-[#00E5FF]" : "text-[#667085]"
        )} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search stories..."
          className="bg-transparent border-none outline-none w-full ml-3 text-sm font-medium tracking-wide transition-colors text-[#F5F7FA] placeholder:text-[#667085]"
        />
        {onClose && (
          <button 
            onClick={onClose}
            className="text-[#667085] hover:text-[#F5F7FA] ml-2 transition-colors focus:outline-none"
            aria-label="Close search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      {/* Noted Message */}
      <div 
        className={clsx(
          "absolute top-full mt-2 left-0 w-full text-center px-4 py-2 rounded-lg bg-[#0C1220] border border-[#00E5FF]/20 text-xs font-medium tracking-wide transition-all duration-300 shadow-xl shadow-black/40 text-[#00E5FF]",
          notedMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="mb-1">{notedMessage}</div>
      </div>
    </div>
  );
}
