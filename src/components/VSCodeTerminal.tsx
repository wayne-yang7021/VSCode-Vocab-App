import React, { useState } from 'react';
import { Word, WordProgressMap } from '../types';
import { Terminal, AlertCircle, X, ChevronUp, ChevronDown, Check, Flame, Play, Volume2, RotateCcw } from 'lucide-react';
import { speakWord } from '../utils/speech';

interface VSCodeTerminalProps {
  isVisible: boolean;
  onClose: () => void;
  currentWord: Word | null;
  currentIndex: number;
  totalInQueue: number;
  stats: {
    total: number;
    masteredCount: number;
    difficultCount: number;
    learningCount: number;
    unseenCount: number;
  };
  progressMap: WordProgressMap;
  difficultWords: Word[];
  onSelectWord: (wordId: string) => void;
  onMastered: () => void;
  onLearning: () => void;
  onNextCard?: () => void;
  onPrevCard?: () => void;
}

export const VSCodeTerminal: React.FC<VSCodeTerminalProps> = ({
  isVisible,
  onClose,
  currentWord,
  currentIndex,
  totalInQueue,
  stats,
  progressMap,
  difficultWords,
  onSelectWord,
  onMastered,
  onLearning,
  onNextCard,
  onPrevCard,
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'output' | 'debug'>('terminal');

  if (!isVisible) return null;

  const currentProgress = currentWord ? progressMap[currentWord.id] : null;

  return (
    <div className="h-44 bg-[#181818] border-t border-[#2b2b2b] flex flex-col font-mono-code text-xs text-[#cccccc] shrink-0 select-none z-10">
      {/* Terminal Header Tabs */}
      <div className="h-7 bg-[#1f1f1f] border-b border-[#2b2b2b] px-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 cursor-pointer pb-0.5 ${
              activeTab === 'terminal'
                ? 'text-white border-b-2 border-[#007acc] font-semibold'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>TERMINAL</span>
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-1.5 cursor-pointer pb-0.5 ${
              activeTab === 'problems'
                ? 'text-white border-b-2 border-[#007acc] font-semibold'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#f14c4c]" />
            <span>PROBLEMS</span>
            {stats.difficultCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#4c1d1d] text-[#f48771] rounded-full text-[10px] font-bold">
                {stats.difficultCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 cursor-pointer pb-0.5 ${
              activeTab === 'output'
                ? 'text-white border-b-2 border-[#007acc] font-semibold'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <span>OUTPUT</span>
          </button>

          <button
            onClick={() => setActiveTab('debug')}
            className={`flex items-center gap-1.5 cursor-pointer pb-0.5 ${
              activeTab === 'debug'
                ? 'text-white border-b-2 border-[#007acc] font-semibold'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <span>DEBUG CONSOLE</span>
          </button>
        </div>

        {/* Panel controls */}
        <div className="flex items-center gap-2 text-[#858585]">
          <button
            onClick={onClose}
            title="Close Panel"
            className="hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-[12px] leading-relaxed">
        {activeTab === 'terminal' && (
          <div className="space-y-2">
            <div className="text-[#858585]">
              <span className="text-[#89d185]">developer@vscode</span>:
              <span className="text-[#007acc]">~/gre-verbal-workspace</span>$ npx gre-vocab-eval --watch
            </div>

            {currentWord ? (
              <div className="space-y-1 text-[#cccccc]">
                <div className="text-[#4ec9b0]">
                  [DAEMON] Active Token: <span className="font-bold text-white">"{currentWord.word}"</span> ({currentIndex + 1}/{totalInQueue})
                </div>
                <div className="text-[#858585] text-[11px]">
                  Pronunciation: <span className="text-[#9cdcfe]">{currentWord.us_phonetics}</span> | Status: <span className="text-[#cca700]">{currentProgress?.status || 'unseen'}</span> | Review count: {currentProgress?.reviewCount || 0}
                </div>
                <div className="text-[#6a9955] text-[11px]">
                  Tip: Hold click on the word in the editor to peek Chinese definition. Release mouse to restore code camouflage.
                </div>
              </div>
            ) : (
              <div className="text-[#858585]">Waiting for vocabulary practice session...</div>
            )}

            {/* Interactive Terminal Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={onMastered}
                className="px-2 py-0.5 bg-[#1e3a1e] hover:bg-[#285028] text-[#89d185] border border-[#3e6b3e] rounded text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>$ npm run mark:mastered (Key 2)</span>
              </button>

              <button
                onClick={onLearning}
                className="px-2 py-0.5 bg-[#3a1d1d] hover:bg-[#522323] text-[#f48771] border border-[#6b2525] rounded text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>$ npm run mark:learning (Key 1)</span>
              </button>

              {currentWord && (
                <button
                  onClick={() => speakWord(currentWord.word)}
                  className="px-2 py-0.5 bg-[#1e2a3a] hover:bg-[#2a384c] text-[#4ec9b0] border border-[#2b4c6b] rounded text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>$ say "{currentWord.word}"</span>
                </button>
              )}

              {onNextCard && (
                <button
                  onClick={onNextCard}
                  className="px-2 py-0.5 bg-[#252526] hover:bg-[#333333] text-[#cccccc] border border-[#3e3e3e] rounded text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>$ git checkout next-word (→)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-[#858585]">
              {difficultWords.length} difficult memory warnings detected in project workspace:
            </div>
            {difficultWords.length === 0 ? (
              <div className="text-[#89d185] text-xs pt-2">
                ✓ No problems have been detected in the workspace. All difficult words resolved!
              </div>
            ) : (
              <div className="divide-y divide-[#2a2a2a] max-h-28 overflow-y-auto">
                {difficultWords.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectWord(item.id)}
                    className="py-1.5 px-2 hover:bg-[#252526] rounded flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-[#f14c4c] shrink-0" />
                      <span className="text-[#9cdcfe] font-semibold">{item.word}</span>
                      <span className="text-[#858585] text-[11px] truncate max-w-sm">
                        {item.paraphrase_pos}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#f48771] group-hover:underline">
                      Review Now ↵
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="space-y-1 text-[#aaaaaa]">
            <div>[Build Session] Loaded 3074 GRE Core 3000 tokens.</div>
            <div>[Diagnostics] Mastered: {stats.masteredCount} | Difficult: {stats.difficultCount} | Learning: {stats.learningCount}</div>
            <div>[Camouflage] Stealth code mode ready. Mouse-down inspect provider registered.</div>
          </div>
        )}

        {activeTab === 'debug' && (
          <div className="space-y-1 text-[#858585]">
            <div>debug&gt; session active. Queue size: {totalInQueue}.</div>
            <div>debug&gt; breakpoints disabled. Evaluator listening to keydown events.</div>
          </div>
        )}
      </div>
    </div>
  );
};
