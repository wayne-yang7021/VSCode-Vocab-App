import React from 'react';
import { AppView, LanguageMode } from '../types';
import { getLanguageInfo } from '../utils/languages';
import { X, Play, SplitSquareVertical, MoreHorizontal, FileCode, Code2 } from 'lucide-react';

interface VSCodeEditorTabsProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentWordText?: string;
  onPronounceCurrent?: () => void;
  openTabs?: AppView[];
  languageMode: LanguageMode;
  onOpenLanguageModal?: () => void;
}

export const VSCodeEditorTabs: React.FC<VSCodeEditorTabsProps> = ({
  currentView,
  setCurrentView,
  currentWordText,
  onPronounceCurrent,
  languageMode,
  onOpenLanguageModal,
}) => {
  const langInfo = getLanguageInfo(languageMode);

  const tabs: { id: AppView; label: string; ext: string; color: string }[] = [
    { id: 'flashcards', label: langInfo.practiceFileName, ext: langInfo.badge, color: langInfo.color },
    { id: 'difficult', label: langInfo.difficultFileName, ext: langInfo.badge, color: '#f14c4c' },
    { id: 'learning', label: langInfo.learningFileName, ext: langInfo.badge, color: '#cca700' },
    { id: 'mastered', label: langInfo.masteredFileName, ext: langInfo.badge, color: '#89d185' },
    { id: 'all', label: langInfo.allFileName, ext: langInfo.badge, color: langInfo.color },
    { id: 'add_word', label: langInfo.customFileName, ext: langInfo.badge, color: '#4ec9b0' },
  ];

  const currentTab = tabs.find((t) => t.id === currentView) || tabs[0];

  return (
    <div className="bg-[#1e1e1e] select-none font-mono-code text-xs shrink-0">
      {/* Top Tab Strip */}
      <div className="flex items-center justify-between bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto">
        <div className="flex items-center">
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`h-[35px] px-3.5 flex items-center gap-2 border-r border-[#1e1e1e] cursor-pointer transition-colors shrink-0 group ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                    : 'bg-[#2d2d2d] hover:bg-[#282828] text-[#969696] border-t-2 border-t-transparent'
                }`}
              >
                <span style={{ color: tab.color }} className="font-bold text-[11px]">
                  {tab.ext}
                </span>
                <span className="text-xs">{tab.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tab.id !== 'flashcards') {
                      setCurrentView('flashcards');
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#333333] transition-opacity ml-1"
                >
                  <X className="w-3 h-3 text-[#aaaaaa]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Tab Right Actions */}
        <div className="flex items-center gap-1 px-2 text-[#858585] shrink-0">
          {/* Discreet Language Mode Selector Button */}
          {onOpenLanguageModal && (
            <button
              onClick={onOpenLanguageModal}
              title={`Select Language Mode (目前: ${langInfo.name}，點擊切換)`}
              className="p-1.5 hover:bg-[#333333] rounded hover:text-white cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-[#4ec9b0]" />
              <span className="text-[10px] font-semibold text-[#bbbbbb]">{langInfo.badge}</span>
            </button>
          )}
          <button
            onClick={onPronounceCurrent}
            title="Audio: Pronounce Current Word (Key V)"
            className="p-1.5 hover:bg-[#333333] rounded hover:text-white cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#4ec9b0]" />
          </button>
          <button
            title="Split Editor Right"
            className="p-1.5 hover:bg-[#333333] rounded hover:text-white cursor-pointer"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </button>
          <button
            title="More Actions..."
            className="p-1.5 hover:bg-[#333333] rounded hover:text-white cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumbs Bar */}
      <div className="h-[22px] px-4 bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center gap-1.5 text-[11px] text-[#888888] overflow-hidden">
        <span className="hover:text-[#cccccc] cursor-pointer">src</span>
        <span>&gt;</span>
        <span className="hover:text-[#cccccc] cursor-pointer">vocabulary</span>
        <span>&gt;</span>
        <span className="hover:text-[#cccccc] cursor-pointer text-[#cccccc]">
          {currentTab.label}
        </span>
        {currentWordText && currentView === 'flashcards' && (
          <>
            <span>&gt;</span>
            <span className="text-[#dcdcaa] font-medium flex items-center gap-1">
              <span>class {langInfo.className}</span>
              <span>&gt;</span>
              <span className="text-[#4ec9b0] font-semibold">{currentWordText}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

