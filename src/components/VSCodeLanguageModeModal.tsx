import React, { useState, useEffect, useRef } from 'react';
import { LanguageMode } from '../types';
import { SUPPORTED_LANGUAGES, LanguageInfo } from '../utils/languages';
import { Search, Check, FileCode, Code2, X } from 'lucide-react';

interface VSCodeLanguageModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageMode;
  onSelectLanguage: (language: LanguageMode) => void;
}

export const VSCodeLanguageModeModal: React.FC<VSCodeLanguageModeModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.id.toLowerCase().includes(q) ||
      lang.badge.toLowerCase().includes(q) ||
      lang.ext.toLowerCase().includes(q) ||
      lang.description.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredLanguages.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredLanguages.length) % Math.max(1, filteredLanguages.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLanguages[selectedIndex]) {
        onSelectLanguage(filteredLanguages[selectedIndex].id);
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-4 bg-black/65 backdrop-blur-xs font-mono-code text-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[580px] bg-[#252526] border border-[#454545] rounded-md shadow-2xl overflow-hidden flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Header / Search input */}
        <div className="p-2.5 border-b border-[#3c3c3c] bg-[#1f1f1f] flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#007acc] shrink-0" />
          <div className="flex-1 flex items-center bg-[#2d2d2d] border border-[#3e3e3e] focus-within:border-[#007acc] rounded px-2.5 py-1.5 transition-colors">
            <Search className="w-3.5 h-3.5 text-[#858585] mr-2 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Select Language Mode (切換程式語言顯示：Java, TypeScript, Python...)"
              className="bg-transparent text-white placeholder-[#666666] outline-none text-xs w-full"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#858585] hover:text-white rounded hover:bg-[#333333] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions / Context Banner */}
        <div className="px-3 py-1.5 bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between text-[11px] text-[#858585]">
          <span>選擇要在畫面中偽裝顯示的程式語言語法（不影響當前單字進度）</span>
          <span className="text-[#4ec9b0] font-semibold">
            {filteredLanguages.length} Languages
          </span>
        </div>

        {/* Language Options List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#2a2a2a] p-1">
          {filteredLanguages.length === 0 ? (
            <div className="p-8 text-center text-[#858585]">
              // No matching language modes found.
            </div>
          ) : (
            filteredLanguages.map((lang, index) => {
              const isCurrent = currentLanguage === lang.id;
              const isHighlighted = index === selectedIndex;

              return (
                <div
                  key={lang.id}
                  onClick={() => {
                    onSelectLanguage(lang.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3 py-2.5 rounded flex items-center justify-between cursor-pointer transition-colors ${
                    isHighlighted ? 'bg-[#04395e] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Badge */}
                    <div
                      className="w-10 h-7 rounded flex items-center justify-center font-bold text-[11px] shrink-0 border"
                      style={{
                        backgroundColor: `${lang.color}22`,
                        borderColor: `${lang.color}66`,
                        color: lang.color,
                      }}
                    >
                      {lang.badge}
                    </div>

                    {/* Name and Description */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-[13px]">{lang.name}</span>
                        <span className="text-[11px] text-[#858585] font-normal">
                          ({lang.practiceFileName})
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 bg-[#007acc]/30 text-[#4ec9b0] border border-[#007acc]/60 rounded text-[10px] font-semibold">
                            Current Active
                          </span>
                        )}
                      </div>
                      <div className="text-[#888888] text-[11px] mt-0.5">
                        {lang.description}
                      </div>
                    </div>
                  </div>

                  {/* Checkmark indicator */}
                  <div className="flex items-center gap-2">
                    {isCurrent && <Check className="w-4 h-4 text-[#4ec9b0]" />}
                    <span className="text-[10px] text-[#858585] font-mono">
                      {lang.ext}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer tip */}
        <div className="px-3 py-1.5 bg-[#1f1f1f] border-t border-[#333333] flex items-center justify-between text-[10px] text-[#777777]">
          <span>Tip: 也可以在右下角狀態列直接點擊程式語言名稱開啟切換</span>
          <span>Press Enter to select, Esc to close</span>
        </div>
      </div>
    </div>
  );
};
