import React, { useState, useMemo } from 'react';
import { Word, WordProgressMap, WordStatus, LanguageMode } from '../types';
import { speakWord } from '../utils/speech';
import { getLanguageInfo } from '../utils/languages';
import {
  Search,
  Volume2,
  CheckCircle2,
  BookmarkX,
  Flame,
  Play,
  ArrowUpDown,
  RefreshCw,
  Eye,
  FileCode,
  ListFilter,
  Check,
  X,
} from 'lucide-react';

interface WordListViewProps {
  title: string;
  description: string;
  words: Word[];
  progressMap: WordProgressMap;
  onSetStatus: (wordId: string, status: WordStatus) => void;
  onStartPractice: (filter: 'all' | 'learning_only' | 'difficult_only' | 'mastered_only', startWordId?: string) => void;
  onReset?: () => void;
  currentListType: 'learning' | 'difficult' | 'mastered' | 'all';
  languageMode?: LanguageMode;
}

export const WordListView: React.FC<WordListViewProps> = ({
  title,
  description,
  words,
  progressMap,
  onSetStatus,
  onStartPractice,
  onReset,
  currentListType,
  languageMode = 'typescript' as LanguageMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'alphabetical' | 'recent'>('default');
  const [peekingWordId, setPeekingWordId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'code' | 'table'>('code');
  const langInfo = getLanguageInfo(languageMode);

  // Filter and sort words
  const filteredWords = useMemo(() => {
    let result = words.filter((w) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return (
        w.word.toLowerCase().includes(term) ||
        w.paraphrase_pos.toLowerCase().includes(term) ||
        w.paraphrase_english.toLowerCase().includes(term) ||
        w.us_phonetics.toLowerCase().includes(term)
      );
    });

    if (sortBy === 'alphabetical') {
      result = [...result].sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortBy === 'recent') {
      result = [...result].sort((a, b) => {
        const timeA = progressMap[a.id]?.lastReviewedAt || 0;
        const timeB = progressMap[b.id]?.lastReviewedAt || 0;
        return timeB - timeA;
      });
    }

    return result;
  }, [words, searchTerm, sortBy, progressMap]);

  const practiceFilterParam =
    currentListType === 'learning'
      ? 'learning_only'
      : currentListType === 'difficult'
      ? 'difficult_only'
      : currentListType === 'mastered'
      ? 'mastered_only'
      : 'all';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-mono-code text-xs overflow-hidden select-none">
      {/* File Top Bar / Find Widget */}
      <div className="h-10 bg-[#252526] border-b border-[#2b2b2b] px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <FileCode className="w-4 h-4 text-[#3178c6]" />
          <span className="font-semibold text-white">
            {currentListType === 'learning' && 'learning_queue.ts'}
            {currentListType === 'difficult' && 'difficult_cache.ts'}
            {currentListType === 'mastered' && 'mastered_records.ts'}
            {currentListType === 'all' && 'word_database.ts'}
          </span>
          <span className="text-[11px] text-[#858585] hidden sm:inline">
            // {title} ({words.length} items)
          </span>
        </div>

        {/* VS Code Find Widget */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-xs">
            <Search className="w-3.5 h-3.5 text-[#858585] mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Find (Ctrl+F)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white placeholder-[#666666] outline-none text-xs w-28 sm:w-44"
            />
            <span className="text-[10px] text-[#858585] ml-1">
              {filteredWords.length}/{words.length}
            </span>
          </div>

          <button
            onClick={() => onStartPractice(practiceFilterParam)}
            className="px-3 py-1 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-xs flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Launch Queue</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2b2b2b]/30">
        {/* Comment block banner */}
        <div className="p-4 bg-[#1e1e1e] text-[#6a9955] leading-relaxed border-b border-[#2b2b2b]">
          <div>/**</div>
          <div> * @module {title}</div>
          <div> * @description {description}</div>
          <div> * Tip: Mouse down on any token to reveal Chinese meaning, or click "Run" to practice from this word.</div>
          <div> */</div>
        </div>

        {filteredWords.length === 0 ? (
          <div className="p-12 text-center text-[#858585]">
            // No matching tokens found in this collection.
          </div>
        ) : (
          <div>
            {filteredWords.map((item, idx) => {
              const status = progressMap[item.id]?.status;
              const wrongCount = progressMap[item.id]?.wrongCount || 0;
              const isPeeking = peekingWordId === item.id;

              return (
                <div
                  key={item.id}
                  className="flex items-center hover:bg-[#282828] group px-2 py-1.5 transition-colors border-b border-[#262626]/40"
                >
                  {/* Line Number */}
                  <div className="w-10 text-right pr-3 text-[#858585] select-none shrink-0 text-[11px]">
                    {idx + 1}
                  </div>

                  {/* Code Line Content */}
                  <div className="flex-1 flex flex-wrap items-center gap-2 overflow-hidden">
                    {languageMode === 'java' ? (
                      <>
                        <span className="text-[#569cd6]">public static final</span>{' '}
                        <span className="text-[#4ec9b0]">WordToken</span>{' '}
                        <span className="text-[#9cdcfe] font-semibold">
                          TOKEN_{item.word.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}
                        </span>{' '}
                        <span className="text-[#d4d4d4]">=</span>{' '}
                        <span className="text-[#569cd6]">new</span>{' '}
                        <span className="text-[#4ec9b0]">WordToken</span>
                        <span className="text-[#d4d4d4]">(</span>
                      </>
                    ) : languageMode === 'python' ? (
                      <>
                        <span className="text-[#9cdcfe] font-semibold">
                          token_{item.word.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}
                        </span>{' '}
                        <span className="text-[#d4d4d4]">=</span>{' '}
                        <span className="text-[#d4d4d4]">{'{'}</span>{' '}
                        <span className="text-[#ce9178]">"word"</span>:
                      </>
                    ) : languageMode === 'cpp' ? (
                      <>
                        <span className="text-[#569cd6]">constexpr auto</span>{' '}
                        <span className="text-[#9cdcfe] font-semibold">
                          token_{item.word.replace(/[^a-zA-Z0-9]/g, '_')}
                        </span>{' '}
                        <span className="text-[#d4d4d4]">=</span>{' '}
                        <span className="text-[#4ec9b0]">WordToken</span>
                        <span className="text-[#d4d4d4]">{'{'}</span>
                      </>
                    ) : languageMode === 'go' ? (
                      <>
                        <span className="text-[#569cd6]">var</span>{' '}
                        <span className="text-[#9cdcfe] font-semibold">
                          Token_{item.word.replace(/[^a-zA-Z0-9]/g, '_')}
                        </span>{' '}
                        <span className="text-[#d4d4d4]">=</span>{' '}
                        <span className="text-[#4ec9b0]">WordToken</span>
                        <span className="text-[#d4d4d4]">{'{'}</span>
                      </>
                    ) : languageMode === 'rust' ? (
                      <>
                        <span className="text-[#569cd6]">pub const</span>{' '}
                        <span className="text-[#9cdcfe] font-semibold">
                          TOKEN_{item.word.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}
                        </span>
                        <span className="text-[#d4d4d4]">:</span>{' '}
                        <span className="text-[#4ec9b0]">WordToken</span>{' '}
                        <span className="text-[#d4d4d4]">=</span>{' '}
                        <span className="text-[#4ec9b0]">WordToken</span>{' '}
                        <span className="text-[#d4d4d4]">{'{'}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#569cd6]">export const</span>{' '}
                        <span className="text-[#9cdcfe] font-semibold">
                          token_{item.word.replace(/[^a-zA-Z0-9]/g, '_')}
                        </span>{' '}
                        <span className="text-[#d4d4d4]">=</span>{' '}
                        <span className="text-[#d4d4d4]">{'{'}</span>{' '}
                        <span className="text-[#9cdcfe]">word</span>:
                      </>
                    )}

                    {/* Word Token (Press and hold mouse to peek) */}
                    <span
                      onMouseDown={() => setPeekingWordId(item.id)}
                      onMouseUp={() => setPeekingWordId(null)}
                      onMouseLeave={() => setPeekingWordId(null)}
                      onTouchStart={() => setPeekingWordId(item.id)}
                      onTouchEnd={() => setPeekingWordId(null)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors border ${
                        isPeeking
                          ? 'bg-[#04395e] border-[#007acc] text-[#4ec9b0] font-bold'
                          : 'bg-[#252526] border-[#383838] text-[#ce9178] hover:border-[#007acc]'
                      }`}
                      title="按住滑鼠預覽中文釋義"
                    >
                      {isPeeking ? `"${item.word} (${item.paraphrase_pos})"` : `"${item.word}"`}
                    </span>

                    {/* Phonetic */}
                    {item.us_phonetics && (
                      <>
                        <span className="text-[#d4d4d4]">,</span>
                        <span className="text-[#ce9178]">"{item.us_phonetics}"</span>
                      </>
                    )}

                    {/* Definition inline code comment */}
                    <span className="text-[#6a9955] text-xs truncate max-w-xs md:max-w-md">
                      {languageMode === 'python' ? '#' : '//'} {isPeeking ? `【釋義】${item.paraphrase_pos}` : item.paraphrase_pos}
                    </span>

                    <span className="text-[#d4d4d4]">
                      {languageMode === 'java' ? ');' : '};'}
                    </span>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-2 opacity-80 group-hover:opacity-100">
                    {/* Status Pill */}
                    {status === 'mastered' ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#1e3a1e] text-[#89d185] border border-[#2b552b]">
                        ✓ Mastered
                      </span>
                    ) : status === 'difficult' ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#3a1d1d] text-[#f48771] border border-[#6b2525]">
                        ⚠ Difficult ({wrongCount})
                      </span>
                    ) : status === 'learning' ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#332b00] text-[#cca700] border border-[#554700]">
                        ⏳ Learning
                      </span>
                    ) : null}

                    {/* Speech */}
                    <button
                      onClick={() => speakWord(item.word)}
                      title="發音"
                      className="p-1 hover:bg-[#333333] text-[#858585] hover:text-[#4ec9b0] rounded cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Run practice from this word */}
                    <button
                      onClick={() => onStartPractice(practiceFilterParam, item.id)}
                      title="從此單字開始練習"
                      className="px-2 py-0.5 bg-[#252526] hover:bg-[#007acc] text-[#cccccc] hover:text-white rounded border border-[#3e3e3e] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Run</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
