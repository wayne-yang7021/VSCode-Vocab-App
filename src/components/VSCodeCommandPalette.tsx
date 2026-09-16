import React, { useState, useEffect, useRef } from 'react';
import { Word, WordProgressMap } from '../types';
import { Search, Terminal, Play, BookmarkX, Flame, CheckCircle2, RotateCcw, Cloud, Download, Volume2, Code2 } from 'lucide-react';

interface VSCodeCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  allWords: Word[];
  onSelectWord: (wordId: string) => void;
  onSwitchView: (view: any) => void;
  onInitQueue: (filter: 'all' | 'learning_only' | 'difficult_only' | 'mastered_only') => void;
  onPronounceCurrent?: () => void;
  onOpenCloudModal: () => void;
  onOpenBackupModal: () => void;
  onReset: () => void;
  onOpenLanguageModal?: () => void;
}

export const VSCodeCommandPalette: React.FC<VSCodeCommandPaletteProps> = ({
  isOpen,
  onClose,
  allWords,
  onSelectWord,
  onSwitchView,
  onInitQueue,
  onPronounceCurrent,
  onOpenCloudModal,
  onOpenBackupModal,
  onReset,
  onOpenLanguageModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Commands list
  const commands = [
    {
      id: 'cmd-practice-all',
      title: '> Practice: Start Practicing All Words',
      desc: 'Launch code practice session with all 3000+ words',
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onInitQueue('all');
        onSwitchView('flashcards');
      },
    },
    {
      id: 'cmd-practice-learning',
      title: '> Practice: Filter Still Learning Words',
      desc: 'Only review words marked as still learning',
      icon: <BookmarkX className="w-4 h-4 text-amber-400" />,
      action: () => {
        onInitQueue('learning_only');
        onSwitchView('flashcards');
      },
    },
    {
      id: 'cmd-practice-difficult',
      title: '> Practice: Filter Difficult Words (2+ Fails)',
      desc: 'Focus review on words failed 2 or more times',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      action: () => {
        onInitQueue('difficult_only');
        onSwitchView('flashcards');
      },
    },
    {
      id: 'cmd-pronounce',
      title: '> Audio: Pronounce Current Word (Key V)',
      desc: 'Play native US pronunciation audio',
      icon: <Volume2 className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onPronounceCurrent?.();
      },
    },
    {
      id: 'cmd-change-language',
      title: '> Change Language Mode (切換程式語言: TypeScript, Java, Python, C++, Go, Rust)',
      desc: 'Switch active programming language syntax without affecting vocabulary progress',
      icon: <Code2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onOpenLanguageModal?.();
      },
    },
    {
      id: 'cmd-view-db',
      title: '> File: Open word_database.ts',
      desc: 'Browse complete vocabulary dictionary and search',
      icon: <Terminal className="w-4 h-4 text-blue-400" />,
      action: () => {
        onSwitchView('all');
      },
    },
    {
      id: 'cmd-cloud',
      title: '> Cloud: Sync Account & Progress Data',
      desc: 'Log in to cloud account or sync local storage to cloud',
      icon: <Cloud className="w-4 h-4 text-sky-400" />,
      action: () => {
        onOpenCloudModal();
      },
    },
    {
      id: 'cmd-backup',
      title: '> Backup: Export / Import JSON Snapshot',
      desc: 'Download backup JSON or restore custom words and history',
      icon: <Download className="w-4 h-4 text-purple-400" />,
      action: () => {
        onOpenBackupModal();
      },
    },
    {
      id: 'cmd-reset',
      title: '> Reset: Clear All Learning Progress',
      desc: 'Reset all word statuses back to initial unseen state',
      icon: <RotateCcw className="w-4 h-4 text-rose-400" />,
      action: () => {
        onReset();
      },
    },
  ];

  // If query starts with '>', show commands, otherwise search words + commands
  const isCommandMode = query.startsWith('>');
  const cleanTerm = query.replace(/^>/, '').trim().toLowerCase();

  const matchingWords = cleanTerm
    ? allWords
        .filter(
          (w) =>
            w.word.toLowerCase().includes(cleanTerm) ||
            w.paraphrase_pos.toLowerCase().includes(cleanTerm) ||
            w.paraphrase_english.toLowerCase().includes(cleanTerm)
        )
        .slice(0, 15)
    : [];

  const filteredCommands = cleanTerm
    ? commands.filter(
        (c) =>
          c.title.toLowerCase().includes(cleanTerm) ||
          c.desc.toLowerCase().includes(cleanTerm)
      )
    : commands;

  const totalItems = isCommandMode
    ? filteredCommands.length
    : matchingWords.length + filteredCommands.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isCommandMode) {
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else {
        if (selectedIndex < matchingWords.length) {
          const selected = matchingWords[selectedIndex];
          onSelectWord(selected.id);
          onSwitchView('flashcards');
          onClose();
        } else {
          const cmdIndex = selectedIndex - matchingWords.length;
          if (filteredCommands[cmdIndex]) {
            filteredCommands[cmdIndex].action();
            onClose();
          }
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 bg-black/50 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-[620px] max-w-[95vw] bg-[#252526] border border-[#454545] rounded-md shadow-2xl overflow-hidden font-mono-code text-xs text-[#cccccc]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input styled exactly like VS Code quick open */}
        <div className="p-2 border-b border-[#333333] flex items-center gap-2 bg-[#1e1e1e]">
          <Search className="w-4 h-4 text-[#858585] ml-1 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a word to search or '>' for commands..."
            className="w-full bg-transparent text-[#ffffff] placeholder-[#707070] text-sm outline-none px-1 py-1"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] text-[#888888] bg-[#2d2d2d] border border-[#3e3e3e] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-[#2d2d2d]/40">
          {!isCommandMode && matchingWords.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] tracking-wider text-[#7a7a7a] font-semibold uppercase bg-[#202020]">
                Vocabulary Matches ({matchingWords.length})
              </div>
              {matchingWords.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectWord(item.id);
                      onSwitchView('flashcards');
                      onClose();
                    }}
                    className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#04395e] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-[#4ec9b0] font-bold text-sm">{item.word}</span>
                      <span className="text-[#858585] text-xs truncate">
                        {item.us_phonetics}
                      </span>
                      <span className="text-[#9cdcfe] text-xs truncate max-w-[280px]">
                        {item.paraphrase_pos}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6a9955] shrink-0 ml-2">
                      Jump to practice
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div>
            <div className="px-3 py-1 text-[10px] tracking-wider text-[#7a7a7a] font-semibold uppercase bg-[#202020]">
              Commands
            </div>
            {filteredCommands.map((cmd, idx) => {
              const overallIdx = isCommandMode ? idx : matchingWords.length + idx;
              const isSelected = overallIdx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#04395e] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {cmd.icon}
                    <div>
                      <div className="font-semibold text-xs text-[#d4d4d4]">{cmd.title}</div>
                      <div className="text-[10px] text-[#858585]">{cmd.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6a9955] shrink-0">Enter ↵</span>
                </div>
              );
            })}
          </div>

          {matchingWords.length === 0 && filteredCommands.length === 0 && (
            <div className="p-6 text-center text-[#858585] text-xs">
              No matching words or commands found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
