import React, { useState, useEffect, useRef } from 'react';
import { Word, LanguageMode } from '../types';
import { speakWord } from '../utils/speech';
import { getLanguageInfo } from '../utils/languages';
import {
  Volume2,
  Check,
  X,
  Sparkles,
  Pin,
  PinOff,
  Code2,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Terminal,
  FileCode,
  Flame,
  BookmarkX,
  CheckCircle2,
} from 'lucide-react';

interface VSCodeCodeEditorProps {
  currentWord: Word | null;
  currentIndex: number;
  totalInQueue: number;
  uniqueWordNumber?: number;
  totalUniqueWords?: number;
  onMastered: () => void;
  onLearning: () => void;
  onNextCard?: () => void;
  onPrevCard?: () => void;
  practiceFilter: 'all' | 'learning_only' | 'difficult_only' | 'mastered_only';
  stats: {
    total: number;
    masteredCount: number;
    difficultCount: number;
    learningCount: number;
    unseenCount: number;
  };
  onInitQueue: (
    filter: 'all' | 'learning_only' | 'difficult_only' | 'mastered_only',
    startWordId?: string,
    forceResetIndex?: boolean
  ) => void;
  onReset: () => void;
  stealthMode: boolean;
  languageMode: LanguageMode;
  onOpenLanguageModal?: () => void;
}

export const VSCodeCodeEditor: React.FC<VSCodeCodeEditorProps> = ({
  currentWord,
  currentIndex,
  totalInQueue,
  uniqueWordNumber,
  totalUniqueWords,
  onMastered,
  onLearning,
  onNextCard,
  onPrevCard,
  practiceFilter,
  stats,
  onInitQueue,
  onReset,
  stealthMode,
  languageMode,
  onOpenLanguageModal,
}) => {
  // Whether user is holding down mouse / touch or holding Space
  const [isHoldingPeek, setIsHoldingPeek] = useState(false);
  // Whether the user pinned the definition to stay open without holding
  const [isPinned, setIsPinned] = useState(false);

  const wordRef = useRef<HTMLSpanElement>(null);
  const langInfo = getLanguageInfo(languageMode);

  // Computed: show definition if holding peek OR pinned
  const showDefinition = isHoldingPeek || isPinned;

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsHoldingPeek(true);
      } else if (e.code === 'KeyT') {
        // Toggle pin
        e.preventDefault();
        setIsPinned((prev) => !prev);
      } else if (e.key === '1' || e.code === 'ArrowDown') {
        e.preventDefault();
        onLearning();
      } else if (e.key === '2' || e.code === 'ArrowUp') {
        e.preventDefault();
        onMastered();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrevCard?.();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNextCard?.();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        if (currentWord) {
          speakWord(currentWord.word);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsHoldingPeek(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentWord, onLearning, onMastered, onNextCard, onPrevCard]);

  // If there are no words in queue or queue is empty
  if (!currentWord || totalInQueue === 0) {
    return (
      <div className="flex-1 bg-[#1e1e1e] flex flex-col items-center justify-center p-8 text-[#cccccc] select-none font-mono-code">
        <div className="max-w-md w-full bg-[#252526] border border-[#3c3c3c] rounded-md p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#007acc]/20 border border-[#007acc]/40 flex items-center justify-center text-[#007acc]">
            <CheckCircle2 className="w-6 h-6 text-[#4ec9b0]" />
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-1">
              // Queue Execution Completed
            </h2>
            <p className="text-xs text-[#858585] leading-relaxed">
              當前分類清單中的所有單字已評估完畢，沒有待處理的記憶體單元。
            </p>
          </div>

          <div className="pt-2 border-t border-[#333333] space-y-2">
            <button
              onClick={() => onInitQueue('all')}
              className="w-full py-2 bg-[#007acc] hover:bg-[#0062a3] text-white rounded font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>重新開始練習全部單字 (Load All Lexicon)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onInitQueue('difficult_only')}
                disabled={stats.difficultCount === 0}
                className="py-1.5 px-2 bg-[#333333] hover:bg-[#3d3d3d] disabled:opacity-40 disabled:pointer-events-none text-[#f14c4c] rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-[#444444]"
              >
                <Flame className="w-3 h-3" />
                <span>複習生詞 ({stats.difficultCount})</span>
              </button>

              <button
                onClick={() => onInitQueue('learning_only')}
                disabled={stats.learningCount === 0}
                className="py-1.5 px-2 bg-[#333333] hover:bg-[#3d3d3d] disabled:opacity-40 disabled:pointer-events-none text-[#cca700] rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-[#444444]"
              >
                <BookmarkX className="w-3 h-3" />
                <span>學習中隊列 ({stats.learningCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCardNumber = currentIndex + 1;

  // Render unified CodeLens Action Row
  const renderCodeLens = () => (
    <div className="pl-6 pt-1 text-[11px] text-[#858585] flex items-center gap-3 select-none">
      <span
        className="hover:text-[#4ec9b0] cursor-pointer flex items-center gap-1"
        onClick={() => speakWord(currentWord.word)}
        title="發音 (Key V)"
      >
        <Volume2 className="w-3 h-3 text-[#4ec9b0]" />
        <span>Audio (V)</span>
      </span>
      <span>|</span>
      <span
        className="hover:text-[#89d185] cursor-pointer flex items-center gap-1 text-[#89d185]"
        onClick={onMastered}
        title="標記已掌握 (Key 2 或 ↑)"
      >
        <Check className="w-3 h-3" />
        <span>Mark Mastered (2)</span>
      </span>
      <span>|</span>
      <span
        className="hover:text-[#f48771] cursor-pointer flex items-center gap-1 text-[#f48771]"
        onClick={onLearning}
        title="標記還在學 (Key 1 或 ↓)"
      >
        <X className="w-3 h-3" />
        <span>Still Learning (1)</span>
      </span>
      <span>|</span>
      <span
        onMouseDown={() => setIsHoldingPeek(true)}
        onMouseUp={() => setIsHoldingPeek(false)}
        onTouchStart={() => setIsHoldingPeek(true)}
        onTouchEnd={() => setIsHoldingPeek(false)}
        className="hover:text-[#dcdcaa] cursor-pointer flex items-center gap-1 text-[#cca700]"
        title="按住滑鼠或空白鍵即可查看中文釋義"
      >
        <Eye className="w-3 h-3" />
        <span>按住預覽釋義 (Hold Space / Mouse)</span>
      </span>
    </div>
  );

  // Render unified Interactive Target Word Token with VS Code inspection popup
  const renderInteractiveWordToken = () => (
    <div className="relative inline-block">
      <span
        ref={wordRef}
        onMouseDown={() => setIsHoldingPeek(true)}
        onMouseUp={() => setIsHoldingPeek(false)}
        onMouseLeave={() => !isPinned && setIsHoldingPeek(false)}
        onTouchStart={() => setIsHoldingPeek(true)}
        onTouchEnd={() => setIsHoldingPeek(false)}
        className={`px-2 py-0.5 rounded cursor-pointer transition-all duration-150 border inline-block ${
          showDefinition
            ? 'bg-[#04395e] border-[#007acc] text-white shadow-lg shadow-[#007acc]/20 scale-[1.02]'
            : 'bg-[#2d2d2d] hover:bg-[#383838] border-[#444444] text-[#ce9178] hover:border-[#007acc]/60'
        }`}
        title="滑鼠點擊並按住可預覽中文釋義，放開即還原為程式碼"
      >
        {showDefinition ? (
          <span className="text-[#4ec9b0] font-bold">
            "{currentWord.word}": {currentWord.paraphrase_pos}
          </span>
        ) : (
          <span className="font-bold tracking-wide">
            "{currentWord.word}"
          </span>
        )}
      </span>

      {/* VS CODE HOVER INSPECTION TOOLTIP (Rich hover definition) */}
      {showDefinition && (
        <div
          className="absolute left-0 bottom-full mb-2 z-40 w-[420px] max-w-[85vw] bg-[#252526] border border-[#454545] rounded shadow-2xl p-3 text-xs text-[#cccccc] font-mono-code animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tooltip Header */}
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#333333]">
            <div className="flex items-center gap-2">
              <span className="text-[#858585] text-[10px]">
                {languageMode === 'java'
                  ? '(field)'
                  : languageMode === 'python'
                  ? '(attribute)'
                  : languageMode === 'cpp'
                  ? '(constexpr member)'
                  : languageMode === 'go'
                  ? '(constant)'
                  : '(property)'}
              </span>
              <span className="text-[#9cdcfe] font-semibold">
                {langInfo.className}.{currentWord.word}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPinned((p) => !p)}
                title={isPinned ? '取消釘選' : '釘選此資訊視窗 (Key T)'}
                className={`p-1 rounded cursor-pointer ${
                  isPinned ? 'bg-[#04395e] text-white' : 'text-[#858585] hover:text-white'
                }`}
              >
                {isPinned ? <PinOff className="w-3 h-3 text-[#4ec9b0]" /> : <Pin className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Pronunciation and Audio */}
          <div className="flex items-center gap-2 mb-2 bg-[#1e1e1e] p-1.5 rounded border border-[#333333]">
            <span className="text-white font-bold text-sm tracking-wide">
              {currentWord.word}
            </span>
            <span className="text-[#858585] text-xs">
              {currentWord.us_phonetics || '[Phonetics]'}
            </span>
            <button
              onClick={() => speakWord(currentWord.word)}
              className="ml-auto px-2 py-0.5 bg-[#2d2d2d] hover:bg-[#383838] text-[#4ec9b0] rounded flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>發音 (V)</span>
            </button>
          </div>

          {/* Chinese Translation & POS */}
          <div className="mb-2">
            <div className="text-[10px] text-[#6a9955] font-semibold mb-0.5">
              // 中文釋義 (Chinese Definition)
            </div>
            <div className="text-[#dcdcaa] font-semibold text-[13px] leading-snug">
              {currentWord.paraphrase_pos}
            </div>
          </div>

          {/* English Paraphrase if present */}
          {currentWord.paraphrase_english && (
            <div className="mb-2.5">
              <div className="text-[10px] text-[#6a9955] font-semibold mb-0.5">
                // 英文釋義 (English Meaning)
              </div>
              <div className="text-[#9cdcfe] text-[11px] leading-relaxed">
                {currentWord.paraphrase_english}
              </div>
            </div>
          )}

          {/* Quick Mastery Buttons inside Tooltip */}
          <div className="pt-2 border-t border-[#333333] flex items-center justify-between gap-2">
            <div className="text-[10px] text-[#858585]">
              放開滑鼠即可還原為程式碼
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onLearning}
                className="px-2.5 py-1 bg-[#3a1d1d] hover:bg-[#522323] text-[#f48771] border border-[#6b2525] rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>還不會 [1]</span>
              </button>
              <button
                onClick={onMastered}
                className="px-2.5 py-1 bg-[#1e3a1e] hover:bg-[#285028] text-[#89d185] border border-[#3e6b3e] rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>我會了 [2]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] font-mono-code text-xs select-text overflow-hidden">
      {/* Editor Sub-header / Status Toolbar */}
      <div className="h-7 px-4 bg-[#1f1f1f] border-b border-[#2b2b2b] flex items-center justify-between text-[11px] text-[#888888] shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="text-[#858585] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#007acc]" />
            Queue: <strong className="text-white">{currentCardNumber}</strong> / {totalInQueue}
          </span>
          <span className="hidden sm:inline text-[#555555]">|</span>
          <span className="hidden sm:flex items-center gap-1 text-[#858585]">
            Total Lexicon: <strong className="text-[#cccccc]">{uniqueWordNumber || currentCardNumber}</strong> / {totalUniqueWords || stats.total}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Discreet Language Selector Button */}
          {onOpenLanguageModal && (
            <button
              onClick={onOpenLanguageModal}
              title={`Select Language Mode (目前: ${langInfo.name}，點擊切換程式語言顯示)`}
              className="flex items-center gap-1.5 bg-[#252526] hover:bg-[#2d2d2d] px-2 py-0.5 rounded border border-[#333333] hover:border-[#007acc]/60 text-[#cccccc] cursor-pointer transition-colors text-[11px]"
            >
              <Code2 className="w-3.5 h-3.5 text-[#4ec9b0]" />
              <span className="text-[#888888]">Lang:</span>
              <span className="font-semibold text-white">{langInfo.name}</span>
              <span className="text-[10px] text-[#666666]">▾</span>
            </button>
          )}

          {/* Pin Tooltip Button */}
          <button
            onClick={() => setIsPinned((prev) => !prev)}
            title="Pin / Toggle Definition (Key T)"
            className={`px-2 py-0.5 rounded flex items-center gap-1 border text-[11px] cursor-pointer transition-colors ${
              isPinned
                ? 'bg-[#04395e] border-[#007acc] text-white'
                : 'bg-[#252526] border-[#333333] text-[#888888] hover:text-white'
            }`}
          >
            {isPinned ? <PinOff className="w-3 h-3 text-[#4ec9b0]" /> : <Pin className="w-3 h-3" />}
            <span className="hidden md:inline">{isPinned ? '已釘選釋義 (T)' : '釘選釋義 (T)'}</span>
          </button>
        </div>
      </div>

      {/* Main Editor Body with Line Numbers Gutter */}
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden relative">
        {/* Line Numbers Gutter */}
        <div className="w-12 bg-[#1e1e1e] border-r border-[#2b2b2b] pt-3 pb-6 flex flex-col items-end pr-3 select-none text-[#858585] text-[12px] leading-6 shrink-0">
          {Array.from({ length: 28 }).map((_, i) => {
            const lineNum = i + 1;
            const isTargetLine = lineNum === 13;
            return (
              <span
                key={i}
                className={`${
                  isTargetLine ? 'text-white font-bold' : 'hover:text-[#bbbbbb]'
                }`}
              >
                {lineNum}
              </span>
            );
          })}
        </div>

        {/* Code Canvas Area */}
        <div className="flex-1 pt-3 pb-8 pl-4 pr-12 text-[13px] leading-6 font-mono-code text-[#d4d4d4] overflow-x-auto relative">
          {/* Active Line Highlight Background */}
          <div
            className="absolute left-0 right-0 h-6 bg-[#282828]/70 pointer-events-none"
            style={{ top: `${12 * 24 + 12}px` }}
          />

          {/* 1. TYPESCRIPT SYNTAX */}
          {languageMode === 'typescript' && (
            <div>
              <div>
                <span className="text-[#569cd6]">import</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>{' '}
                <span className="text-[#4ec9b0]">VocabularyToken</span>
                <span className="text-[#d4d4d4]">,</span>{' '}
                <span className="text-[#4ec9b0]">MemoryBuffer</span>{' '}
                <span className="text-[#d4d4d4]">{'}'}</span>{' '}
                <span className="text-[#569cd6]">from</span>{' '}
                <span className="text-[#ce9178]">'@gre/core'</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="text-[#6a9955] mt-1">
                <span>/**</span>
              </div>
              <div className="text-[#6a9955]">
                <span> * GRE Verbal Preparation Suite | Word #{currentCardNumber} of {totalInQueue}</span>
              </div>
              <div className="text-[#6a9955]">
                <span> * US Phonetics: {currentWord.us_phonetics || '[unavailable]'}</span>
              </div>
              <div className="text-[#6a9955]">
                <span> * Quick Actions: Press [1] for Still Learning | Press [2] for Mastered | [V] Pronounce</span>
              </div>
              <div className="text-[#6a9955]">
                <span> */</span>
              </div>

              <div>
                <span className="text-[#569cd6]">export class</span>{' '}
                <span className="text-[#4ec9b0]">VocabularyEvaluator</span>{' '}
                <span className="text-[#569cd6]">implements</span>{' '}
                <span className="text-[#4ec9b0]">VocabularyToken</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">public readonly</span>{' '}
                <span className="text-[#9cdcfe]">id</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.id}"</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">public readonly</span>{' '}
                <span className="text-[#9cdcfe]">usPhonetics</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.us_phonetics}"</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              {/* CodeLens Action Row */}
              {renderCodeLens()}

              {/* LINE 13: THE TARGET WORD LINE */}
              <div className="pl-6 py-0.5 flex items-center gap-2 relative">
                <span className="text-[#569cd6]">public readonly</span>{' '}
                <span className="text-[#9cdcfe]">targetToken</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}

                {renderInteractiveWordToken()}

                <span className="text-[#d4d4d4]">;</span>

                <span className="text-[#6a9955] text-xs ml-2 truncate">
                  {showDefinition
                    ? `// 【釋義】${currentWord.paraphrase_pos}`
                    : `// 點擊並按住上方單字查看釋義 (Hold Space / Mouse)`}
                </span>
              </div>

              <div className="pl-6 pt-2">
                <span className="text-[#6a9955]">/**</span>
              </div>
              <div className="pl-6">
                <span className="text-[#6a9955]"> * Dispatches cognitive mastery assessment.</span>
              </div>
              <div className="pl-6">
                <span className="text-[#6a9955]"> * @returns evaluated retention score</span>
              </div>
              <div className="pl-6">
                <span className="text-[#6a9955]"> */</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">public async</span>{' '}
                <span className="text-[#dcdcaa]">evaluateRetention</span>
                <span className="text-[#d4d4d4]">():</span>{' '}
                <span className="text-[#4ec9b0]">Promise</span>
                <span className="text-[#d4d4d4]">&lt;</span>
                <span className="text-[#4ec9b0]">boolean</span>
                <span className="text-[#d4d4d4]">&gt;</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-12">
                <span className="text-[#569cd6]">const</span>{' '}
                <span className="text-[#9cdcfe]">isRecalled</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#569cd6]">await</span>{' '}
                <span className="text-[#4ec9b0]">MemoryBuffer</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">prompt</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#569cd6]">this</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#9cdcfe]">targetToken</span>
                <span className="text-[#d4d4d4]">);</span>
              </div>

              <div className="pl-12">
                <span className="text-[#c586c0]">if</span>{' '}
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">isRecalled</span>
                <span className="text-[#d4d4d4]">) {'{'}</span>
              </div>

              <div className="pl-16">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#569cd6]">this</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">markMastered</span>
                <span className="text-[#d4d4d4]">();</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [2] or Up Arrow</span>
              </div>

              <div className="pl-12">
                <span className="text-[#d4d4d4]">{'}'}</span>{' '}
                <span className="text-[#c586c0]">else</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-16">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#569cd6]">this</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">markStillLearning</span>
                <span className="text-[#d4d4d4]">();</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [1] or Down Arrow</span>
              </div>

              <div className="pl-12">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div className="pl-6">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div>
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>
            </div>
          )}

          {/* 2. JAVA SYNTAX (User Requested) */}
          {languageMode === 'java' && (
            <div>
              <div>
                <span className="text-[#c586c0]">package</span>{' '}
                <span className="text-[#9cdcfe]">com.gre.vocabulary</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="mt-0.5">
                <span className="text-[#c586c0]">import</span>{' '}
                <span className="text-[#4ec9b0]">java.util.concurrent.CompletableFuture</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>
              <div>
                <span className="text-[#c586c0]">import</span>{' '}
                <span className="text-[#4ec9b0]">com.gre.core.VocabularyToken</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>
              <div>
                <span className="text-[#c586c0]">import</span>{' '}
                <span className="text-[#4ec9b0]">com.gre.core.MemoryBuffer</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="text-[#6a9955] mt-1">
                <span>/**</span>
              </div>
              <div className="text-[#6a9955]">
                <span> * GRE Verbal Preparation Suite | Word #{currentCardNumber} of {totalInQueue}</span>
              </div>
              <div className="text-[#6a9955]">
                <span> * US Phonetics: {currentWord.us_phonetics || '[unavailable]'}</span>
              </div>
              <div className="text-[#6a9955]">
                <span> * Actions: Press [1] Still Learning | Press [2] Mastered | [V] Pronounce</span>
              </div>
              <div className="text-[#6a9955]">
                <span> */</span>
              </div>

              <div>
                <span className="text-[#569cd6]">public class</span>{' '}
                <span className="text-[#4ec9b0]">PracticeSession</span>{' '}
                <span className="text-[#569cd6]">implements</span>{' '}
                <span className="text-[#4ec9b0]">VocabularyToken</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">public static final</span>{' '}
                <span className="text-[#4ec9b0]">String</span>{' '}
                <span className="text-[#9cdcfe]">WORD_ID</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.id}"</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">public static final</span>{' '}
                <span className="text-[#4ec9b0]">String</span>{' '}
                <span className="text-[#9cdcfe]">US_PHONETICS</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.us_phonetics}"</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              {/* CodeLens Action Row */}
              {renderCodeLens()}

              {/* LINE 13: THE TARGET WORD LINE IN JAVA */}
              <div className="pl-6 py-0.5 flex items-center gap-2 relative">
                <span className="text-[#569cd6]">public static final</span>{' '}
                <span className="text-[#4ec9b0]">String</span>{' '}
                <span className="text-[#9cdcfe]">TARGET_TOKEN</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}

                {renderInteractiveWordToken()}

                <span className="text-[#d4d4d4]">;</span>

                <span className="text-[#6a9955] text-xs ml-2 truncate">
                  {showDefinition
                    ? `// 【釋義】${currentWord.paraphrase_pos}`
                    : `// 點擊並按住上方單字查看釋義 (Hold Space / Mouse)`}
                </span>
              </div>

              <div className="pl-6 pt-2">
                <span className="text-[#6a9955]">/**</span>
              </div>
              <div className="pl-6">
                <span className="text-[#6a9955]"> * Evaluates retention asynchronously on JVM pool.</span>
              </div>
              <div className="pl-6">
                <span className="text-[#6a9955]"> */</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">public</span>{' '}
                <span className="text-[#4ec9b0]">CompletableFuture</span>
                <span className="text-[#d4d4d4]">&lt;</span>
                <span className="text-[#4ec9b0]">Boolean</span>
                <span className="text-[#d4d4d4]">&gt;</span>{' '}
                <span className="text-[#dcdcaa]">evaluateRetention</span>
                <span className="text-[#d4d4d4]">() {'{'}</span>
              </div>

              <div className="pl-12">
                <span className="text-[#4ec9b0]">boolean</span>{' '}
                <span className="text-[#9cdcfe]">isRecalled</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#4ec9b0]">MemoryBuffer</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">prompt</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">TARGET_TOKEN</span>
                <span className="text-[#d4d4d4]">);</span>
              </div>

              <div className="pl-12">
                <span className="text-[#c586c0]">if</span>{' '}
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">isRecalled</span>
                <span className="text-[#d4d4d4]">) {'{'}</span>
              </div>

              <div className="pl-16">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#4ec9b0]">CompletableFuture</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">completedFuture</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#569cd6]">this</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">markMastered</span>
                <span className="text-[#d4d4d4]">());</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [2]</span>
              </div>

              <div className="pl-12">
                <span className="text-[#d4d4d4]">{'}'}</span>{' '}
                <span className="text-[#c586c0]">else</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-16">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#4ec9b0]">CompletableFuture</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">completedFuture</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#569cd6]">this</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">markStillLearning</span>
                <span className="text-[#d4d4d4]">());</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [1]</span>
              </div>

              <div className="pl-12">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div className="pl-6">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div>
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>
            </div>
          )}

          {/* 3. PYTHON SYNTAX */}
          {languageMode === 'python' && (
            <div>
              <div className="text-[#6a9955]"># -*- coding: utf-8 -*-</div>
              <div>
                <span className="text-[#c586c0]">from</span>{' '}
                <span className="text-[#4ec9b0]">typing</span>{' '}
                <span className="text-[#c586c0]">import</span>{' '}
                <span className="text-[#9cdcfe]">Final</span>
                <span className="text-[#d4d4d4]">,</span>{' '}
                <span className="text-[#9cdcfe]">Optional</span>
              </div>
              <div>
                <span className="text-[#c586c0]">from</span>{' '}
                <span className="text-[#4ec9b0]">gre_core</span>{' '}
                <span className="text-[#c586c0]">import</span>{' '}
                <span className="text-[#9cdcfe]">VocabularyToken</span>
                <span className="text-[#d4d4d4]">,</span>{' '}
                <span className="text-[#9cdcfe]">MemoryBuffer</span>
              </div>

              <div className="text-[#6a9955] mt-1">
                # GRE Verbal Preparation | Word #{currentCardNumber} of {totalInQueue}
              </div>
              <div className="text-[#6a9955]">
                # US Phonetics: {currentWord.us_phonetics || '[unavailable]'}
              </div>

              <div className="mt-1">
                <span className="text-[#569cd6]">class</span>{' '}
                <span className="text-[#4ec9b0]">WordEvaluationContext</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#4ec9b0]">VocabularyToken</span>
                <span className="text-[#d4d4d4]">):</span>
              </div>

              <div className="pl-6">
                <span className="text-[#9cdcfe]">word_id</span>
                <span className="text-[#d4d4d4]">:</span>{' '}
                <span className="text-[#4ec9b0]">Final[str]</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.id}"</span>
              </div>

              <div className="pl-6">
                <span className="text-[#9cdcfe]">us_phonetics</span>
                <span className="text-[#d4d4d4]">:</span>{' '}
                <span className="text-[#4ec9b0]">Final[str]</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.us_phonetics}"</span>
              </div>

              {/* CodeLens Action Row */}
              {renderCodeLens()}

              {/* LINE 13: THE TARGET WORD LINE IN PYTHON */}
              <div className="pl-6 py-0.5 flex items-center gap-2 relative">
                <span className="text-[#9cdcfe]">target_token</span>
                <span className="text-[#d4d4d4]">:</span>{' '}
                <span className="text-[#4ec9b0]">Final[str]</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}

                {renderInteractiveWordToken()}

                <span className="text-[#6a9955] text-xs ml-2 truncate">
                  {showDefinition
                    ? `# 【釋義】${currentWord.paraphrase_pos}`
                    : `# 點擊並按住上方單字查看釋義 (Hold Space / Mouse)`}
                </span>
              </div>

              <div className="pl-6 pt-2">
                <span className="text-[#569cd6]">async def</span>{' '}
                <span className="text-[#dcdcaa]">evaluate_retention</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">self</span>
                <span className="text-[#d4d4d4]">) -&gt;</span>{' '}
                <span className="text-[#4ec9b0]">bool</span>
                <span className="text-[#d4d4d4]">:</span>
              </div>

              <div className="pl-12 text-[#6a9955]">
                """Evaluates user recollection for GRE word retention."""
              </div>

              <div className="pl-12">
                <span className="text-[#9cdcfe]">is_recalled</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#c586c0]">await</span>{' '}
                <span className="text-[#4ec9b0]">MemoryBuffer</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">prompt</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">self</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#9cdcfe]">target_token</span>
                <span className="text-[#d4d4d4]">)</span>
              </div>

              <div className="pl-12">
                <span className="text-[#c586c0]">if</span>{' '}
                <span className="text-[#9cdcfe]">is_recalled</span>
                <span className="text-[#d4d4d4]">:</span>
              </div>

              <div className="pl-16">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#9cdcfe]">self</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">mark_mastered</span>
                <span className="text-[#d4d4d4]">()</span>{' '}
                <span className="text-[#6a9955]"># Hotkey [2]</span>
              </div>

              <div className="pl-12">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#9cdcfe]">self</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">mark_still_learning</span>
                <span className="text-[#d4d4d4]">()</span>{' '}
                <span className="text-[#6a9955]"># Hotkey [1]</span>
              </div>
            </div>
          )}

          {/* 4. C++ SYNTAX */}
          {languageMode === 'cpp' && (
            <div>
              <div>
                <span className="text-[#9cdcfe]">#include</span>{' '}
                <span className="text-[#ce9178]">&lt;iostream&gt;</span>
              </div>
              <div>
                <span className="text-[#9cdcfe]">#include</span>{' '}
                <span className="text-[#ce9178]">&lt;string_view&gt;</span>
              </div>
              <div>
                <span className="text-[#9cdcfe]">#include</span>{' '}
                <span className="text-[#ce9178]">"gre/vocabulary_token.hpp"</span>
              </div>

              <div className="text-[#6a9955] mt-1">
                // GRE Verbal Preparation Suite | Word #{currentCardNumber} of {totalInQueue}
              </div>
              <div className="text-[#6a9955]">
                // US Phonetics: {currentWord.us_phonetics || '[unavailable]'}
              </div>

              <div className="mt-1">
                <span className="text-[#569cd6]">namespace</span>{' '}
                <span className="text-[#9cdcfe]">gre::practice</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-4">
                <span className="text-[#569cd6]">class</span>{' '}
                <span className="text-[#4ec9b0]">PracticeSession</span>{' '}
                <span className="text-[#569cd6]">final</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-4">
                <span className="text-[#569cd6]">public:</span>
              </div>

              <div className="pl-8">
                <span className="text-[#569cd6]">static constexpr</span>{' '}
                <span className="text-[#4ec9b0]">std::string_view</span>{' '}
                <span className="text-[#9cdcfe]">WORD_ID</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.id}"</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="pl-8">
                <span className="text-[#569cd6]">static constexpr</span>{' '}
                <span className="text-[#4ec9b0]">std::string_view</span>{' '}
                <span className="text-[#9cdcfe]">US_PHONETICS</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.us_phonetics}"</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              {/* CodeLens Action Row */}
              {renderCodeLens()}

              {/* LINE 13: THE TARGET WORD LINE IN C++ */}
              <div className="pl-8 py-0.5 flex items-center gap-2 relative">
                <span className="text-[#569cd6]">static constexpr</span>{' '}
                <span className="text-[#4ec9b0]">std::string_view</span>{' '}
                <span className="text-[#9cdcfe]">TARGET_TOKEN</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}

                {renderInteractiveWordToken()}

                <span className="text-[#d4d4d4]">;</span>

                <span className="text-[#6a9955] text-xs ml-2 truncate">
                  {showDefinition
                    ? `// 【釋義】${currentWord.paraphrase_pos}`
                    : `// 點擊並按住上方單字查看釋義 (Hold Space / Mouse)`}
                </span>
              </div>

              <div className="pl-8 pt-2">
                <span className="text-[#4ec9b0]">bool</span>{' '}
                <span className="text-[#dcdcaa]">evaluateRetention</span>
                <span className="text-[#d4d4d4]">()</span>{' '}
                <span className="text-[#569cd6]">noexcept</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-14">
                <span className="text-[#569cd6]">const auto</span>{' '}
                <span className="text-[#9cdcfe]">isRecalled</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#4ec9b0]">MemoryBuffer</span>
                <span className="text-[#d4d4d4]">::</span>
                <span className="text-[#dcdcaa]">prompt</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">TARGET_TOKEN</span>
                <span className="text-[#d4d4d4]">);</span>
              </div>

              <div className="pl-14">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#9cdcfe]">isRecalled</span>{' '}
                <span className="text-[#d4d4d4]">?</span>{' '}
                <span className="text-[#569cd6]">this</span>
                <span className="text-[#d4d4d4]">-&gt;</span>
                <span className="text-[#dcdcaa]">markMastered</span>
                <span className="text-[#d4d4d4]">()</span>{' '}
                <span className="text-[#d4d4d4]">:</span>{' '}
                <span className="text-[#569cd6]">this</span>
                <span className="text-[#d4d4d4]">-&gt;</span>
                <span className="text-[#dcdcaa]">markStillLearning</span>
                <span className="text-[#d4d4d4]">();</span>
              </div>

              <div className="pl-8">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div className="pl-4">
                <span className="text-[#d4d4d4]">{'};'}</span>
              </div>

              <div>
                <span className="text-[#d4d4d4]">{'}'}</span>{' '}
                <span className="text-[#6a9955]">// namespace gre::practice</span>
              </div>
            </div>
          )}

          {/* 5. GO SYNTAX */}
          {languageMode === 'go' && (
            <div>
              <div>
                <span className="text-[#c586c0]">package</span>{' '}
                <span className="text-[#9cdcfe]">vocabulary</span>
              </div>

              <div className="mt-1">
                <span className="text-[#c586c0]">import</span>{' '}
                <span className="text-[#d4d4d4]">(</span>
              </div>
              <div className="pl-4">
                <span className="text-[#ce9178]">"context"</span>
              </div>
              <div className="pl-4">
                <span className="text-[#ce9178]">"github.com/gre/core"</span>
              </div>
              <div>
                <span className="text-[#d4d4d4]">)</span>
              </div>

              <div className="text-[#6a9955] mt-1">
                // GRE Verbal Preparation Suite | Word #{currentCardNumber} of {totalInQueue}
              </div>
              <div className="text-[#6a9955]">
                // US Phonetics: {currentWord.us_phonetics || '[unavailable]'}
              </div>

              <div className="mt-1">
                <span className="text-[#569cd6]">const</span>{' '}
                <span className="text-[#d4d4d4]">(</span>
              </div>

              <div className="pl-4">
                <span className="text-[#9cdcfe]">WordID</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.id}"</span>
              </div>

              <div className="pl-4">
                <span className="text-[#9cdcfe]">UsPhonetics</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#ce9178]">"{currentWord.us_phonetics}"</span>
              </div>

              <div>
                <span className="text-[#d4d4d4]">)</span>
              </div>

              {/* CodeLens Action Row */}
              {renderCodeLens()}

              {/* LINE 13: THE TARGET WORD LINE IN GO */}
              <div className="pl-4 py-0.5 flex items-center gap-2 relative">
                <span className="text-[#569cd6]">var</span>{' '}
                <span className="text-[#9cdcfe]">TargetToken</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}

                {renderInteractiveWordToken()}

                <span className="text-[#6a9955] text-xs ml-2 truncate">
                  {showDefinition
                    ? `// 【釋義】${currentWord.paraphrase_pos}`
                    : `// 點擊並按住上方單字查看釋義 (Hold Space / Mouse)`}
                </span>
              </div>

              <div className="pl-4 pt-2">
                <span className="text-[#569cd6]">func</span>{' '}
                <span className="text-[#dcdcaa]">EvaluateRetention</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">ctx</span>{' '}
                <span className="text-[#4ec9b0]">context.Context</span>
                <span className="text-[#d4d4d4]">) (</span>
                <span className="text-[#4ec9b0]">bool</span>
                <span className="text-[#d4d4d4]">,</span>{' '}
                <span className="text-[#4ec9b0]">error</span>
                <span className="text-[#d4d4d4]">) {'{'}</span>
              </div>

              <div className="pl-8">
                <span className="text-[#9cdcfe]">isRecalled</span>{' '}
                <span className="text-[#d4d4d4]">:=</span>{' '}
                <span className="text-[#4ec9b0]">core</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">Prompt</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">TargetToken</span>
                <span className="text-[#d4d4d4]">)</span>
              </div>

              <div className="pl-8">
                <span className="text-[#c586c0]">if</span>{' '}
                <span className="text-[#9cdcfe]">isRecalled</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-12">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#dcdcaa]">MarkMastered</span>
                <span className="text-[#d4d4d4]">(),</span>{' '}
                <span className="text-[#569cd6]">nil</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [2]</span>
              </div>

              <div className="pl-8">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div className="pl-8">
                <span className="text-[#c586c0]">return</span>{' '}
                <span className="text-[#dcdcaa]">MarkStillLearning</span>
                <span className="text-[#d4d4d4]">(),</span>{' '}
                <span className="text-[#569cd6]">nil</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [1]</span>
              </div>

              <div className="pl-4">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>
            </div>
          )}

          {/* 6. RUST SYNTAX */}
          {languageMode === 'rust' && (
            <div>
              <div>
                <span className="text-[#c586c0]">use</span>{' '}
                <span className="text-[#4ec9b0]">gre_vocabulary</span>
                <span className="text-[#d4d4d4]">::</span>
                <span className="text-[#d4d4d4]">{'{'}</span>
                <span className="text-[#4ec9b0]">WordToken</span>
                <span className="text-[#d4d4d4]">,</span>{' '}
                <span className="text-[#4ec9b0]">RetentionStatus</span>
                <span className="text-[#d4d4d4]">,</span>{' '}
                <span className="text-[#4ec9b0]">MemoryBuffer</span>
                <span className="text-[#d4d4d4]">{'}'}</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="text-[#6a9955] mt-1">
                // GRE Verbal Core 3000 | Token #{currentCardNumber} of {totalInQueue}
              </div>
              <div className="text-[#6a9955]">
                // US Phonetics: {currentWord.us_phonetics || '[unavailable]'}
              </div>

              <div className="mt-1">
                <span className="text-[#569cd6]">pub struct</span>{' '}
                <span className="text-[#4ec9b0]">Evaluator</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">pub</span>{' '}
                <span className="text-[#9cdcfe]">word_id</span>
                <span className="text-[#d4d4d4]">:</span>{' '}
                <span className="text-[#4ec9b0]">&amp;'static str</span>
                <span className="text-[#d4d4d4]">,</span>
              </div>

              <div className="pl-6">
                <span className="text-[#569cd6]">pub</span>{' '}
                <span className="text-[#9cdcfe]">phonetics</span>
                <span className="text-[#d4d4d4]">:</span>{' '}
                <span className="text-[#4ec9b0]">&amp;'static str</span>
                <span className="text-[#d4d4d4]">,</span>
              </div>

              <div>
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div className="mt-2">
                <span className="text-[#569cd6]">impl</span>{' '}
                <span className="text-[#4ec9b0]">Evaluator</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              {/* CodeLens Action Row */}
              {renderCodeLens()}

              {/* LINE 13: THE TARGET WORD LINE IN RUST */}
              <div className="pl-6 py-0.5 flex items-center gap-2 relative">
                <span className="text-[#569cd6]">pub const</span>{' '}
                <span className="text-[#9cdcfe]">TARGET_TOKEN</span>
                <span className="text-[#d4d4d4]">:</span>{' '}
                <span className="text-[#4ec9b0]">&amp;'static str</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}

                {renderInteractiveWordToken()}

                <span className="text-[#d4d4d4]">;</span>

                <span className="text-[#6a9955] text-xs ml-2 truncate">
                  {showDefinition
                    ? `// 【釋義】${currentWord.paraphrase_pos}`
                    : `// 點擊並按住上方單字查看釋義 (Hold Space / Mouse)`}
                </span>
              </div>

              <div className="pl-6 pt-2">
                <span className="text-[#569cd6]">pub async fn</span>{' '}
                <span className="text-[#dcdcaa]">evaluate_retention</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#d4d4d4]">&amp;</span>
                <span className="text-[#9cdcfe]">self</span>
                <span className="text-[#d4d4d4]">) -&gt;</span>{' '}
                <span className="text-[#4ec9b0]">Result</span>
                <span className="text-[#d4d4d4]">&lt;</span>
                <span className="text-[#4ec9b0]">RetentionStatus</span>
                <span className="text-[#d4d4d4]">, ()&gt; {'{'}</span>
              </div>

              <div className="pl-12">
                <span className="text-[#569cd6]">let</span>{' '}
                <span className="text-[#9cdcfe]">is_recalled</span>{' '}
                <span className="text-[#d4d4d4]">=</span>{' '}
                <span className="text-[#4ec9b0]">MemoryBuffer</span>
                <span className="text-[#d4d4d4]">::</span>
                <span className="text-[#dcdcaa]">prompt</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#4ec9b0]">Self</span>
                <span className="text-[#d4d4d4]">::</span>
                <span className="text-[#9cdcfe]">TARGET_TOKEN</span>
                <span className="text-[#d4d4d4]">).</span>
                <span className="text-[#c586c0]">await</span>
                <span className="text-[#d4d4d4]">;</span>
              </div>

              <div className="pl-12">
                <span className="text-[#c586c0]">if</span>{' '}
                <span className="text-[#9cdcfe]">is_recalled</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-16">
                <span className="text-[#4ec9b0]">Ok</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">self</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">mark_mastered</span>
                <span className="text-[#d4d4d4]">())</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [2]</span>
              </div>

              <div className="pl-12">
                <span className="text-[#d4d4d4]">{'}'}</span>{' '}
                <span className="text-[#c586c0]">else</span>{' '}
                <span className="text-[#d4d4d4]">{'{'}</span>
              </div>

              <div className="pl-16">
                <span className="text-[#4ec9b0]">Ok</span>
                <span className="text-[#d4d4d4]">(</span>
                <span className="text-[#9cdcfe]">self</span>
                <span className="text-[#d4d4d4]">.</span>
                <span className="text-[#dcdcaa]">mark_still_learning</span>
                <span className="text-[#d4d4d4]">())</span>{' '}
                <span className="text-[#6a9955]">// Hotkey [1]</span>
              </div>

              <div className="pl-12">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div className="pl-6">
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>

              <div>
                <span className="text-[#d4d4d4]">{'}'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Simulated VS Code Minimap on the right */}
        <div className="hidden lg:block w-16 bg-[#1e1e1e]/90 border-l border-[#2b2b2b] select-none pointer-events-none p-1 shrink-0 opacity-40">
          <div className="space-y-1">
            <div className="h-1 bg-[#569cd6] w-8 rounded-xs" />
            <div className="h-1 bg-[#6a9955] w-12 rounded-xs" />
            <div className="h-1 bg-[#6a9955] w-10 rounded-xs" />
            <div className="h-1 bg-[#4ec9b0] w-9 rounded-xs" />
            <div className="h-1 bg-[#9cdcfe] w-11 rounded-xs" />
            <div className="h-1 bg-[#007acc] w-14 rounded-xs font-bold" />
            <div className="h-1 bg-[#ce9178] w-7 rounded-xs" />
            <div className="h-1 bg-[#569cd6] w-9 rounded-xs" />
            <div className="h-1 bg-[#c586c0] w-6 rounded-xs" />
            <div className="h-1 bg-[#dcdcaa] w-8 rounded-xs" />
          </div>
        </div>
      </div>

      {/* Editor Floating Bottom Navigation Strip */}
      <div className="h-10 px-4 bg-[#252526] border-t border-[#2b2b2b] flex items-center justify-between text-xs text-[#cccccc] shrink-0 z-10 select-none">
        <div className="flex items-center gap-2">
          {/* Prev / Next buttons */}
          <button
            onClick={onPrevCard}
            disabled={!onPrevCard || currentIndex <= 0}
            className="px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] disabled:opacity-40 disabled:pointer-events-none text-[#cccccc] flex items-center gap-1 cursor-pointer transition-colors"
            title="Previous Word (Left Arrow)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev (←)</span>
          </button>

          <button
            onClick={onNextCard}
            disabled={!onNextCard || currentIndex >= totalInQueue - 1}
            className="px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] disabled:opacity-40 disabled:pointer-events-none text-[#cccccc] flex items-center gap-1 cursor-pointer transition-colors"
            title="Next Word (Right Arrow)"
          >
            <span className="hidden sm:inline">Next (→)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => speakWord(currentWord.word)}
            className="px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] text-[#4ec9b0] flex items-center gap-1 cursor-pointer transition-colors"
            title="Play Pronunciation (Key V)"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">發音 (V)</span>
          </button>
        </div>

        {/* Primary Action Buttons (Still Learning vs Mastered) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLearning}
            className="px-3 py-1 bg-[#3a1d1d] hover:bg-[#522323] text-[#f48771] border border-[#6b2525] rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Mark as Still Learning (Key 1 or Down Arrow)"
          >
            <X className="w-3.5 h-3.5" />
            <span>我還不會 (Key 1)</span>
          </button>

          <button
            onClick={onMastered}
            className="px-3.5 py-1 bg-[#1e3a1e] hover:bg-[#285028] text-[#89d185] border border-[#3e6b3e] rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            title="Mark as Mastered (Key 2 or Up Arrow)"
          >
            <Check className="w-3.5 h-3.5" />
            <span>我會了 (Key 2)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
