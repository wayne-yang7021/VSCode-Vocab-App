import React from 'react';
import {
  GitBranch,
  AlertTriangle,
  XCircle,
  Bell,
  Check,
  Volume2,
  Radio,
  Sparkles,
  Cloud,
} from 'lucide-react';
import { UserAccount } from '../lib/firebase';
import { LanguageMode } from '../types';
import { getLanguageInfo } from '../utils/languages';
import { Code2 } from 'lucide-react';

interface VSCodeStatusBarProps {
  difficultCount: number;
  learningCount: number;
  masteredCount: number;
  totalCount: number;
  currentWordText?: string;
  onPronounceCurrent?: () => void;
  cloudAccount: UserAccount | null;
  onOpenCloudModal: () => void;
  onToggleTerminal: () => void;
  terminalVisible: boolean;
  languageMode: LanguageMode;
  onOpenLanguageModal: () => void;
}

export const VSCodeStatusBar: React.FC<VSCodeStatusBarProps> = ({
  difficultCount,
  learningCount,
  masteredCount,
  totalCount,
  currentWordText,
  onPronounceCurrent,
  cloudAccount,
  onOpenCloudModal,
  onToggleTerminal,
  terminalVisible,
  languageMode,
  onOpenLanguageModal,
}) => {
  const currentLangInfo = getLanguageInfo(languageMode);
  return (
    <footer className="h-[22px] bg-[#007acc] text-white flex items-center justify-between px-2 text-[11px] font-mono-code select-none shrink-0 z-20">
      {/* Left items */}
      <div className="flex items-center gap-3">
        {/* Remote / Source Control */}
        <button
          onClick={onToggleTerminal}
          className="flex items-center gap-1.5 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title="Git Branch: gre-verbal-3000"
        >
          <GitBranch className="w-3 h-3" />
          <span>gre-3000*</span>
        </button>

        {/* Problems indicator */}
        <button
          onClick={onToggleTerminal}
          className="flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title={`Problems: ${difficultCount} difficult words`}
        >
          <XCircle className="w-3 h-3" />
          <span>{difficultCount}</span>
          <AlertTriangle className="w-3 h-3 ml-1 text-amber-200" />
          <span>{learningCount}</span>
        </button>

        {/* Cloud Sync Status */}
        <button
          onClick={onOpenCloudModal}
          className="hidden sm:flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title={cloudAccount ? `Synced with ${cloudAccount.username}` : 'Offline / Click to Sync'}
        >
          <Cloud className="w-3 h-3" />
          <span>{cloudAccount ? cloudAccount.username : 'Local Storage'}</span>
        </button>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        {currentWordText && (
          <button
            onClick={onPronounceCurrent}
            className="flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
            title={`Pronounce "${currentWordText}" (Key V)`}
          >
            <Volume2 className="w-3 h-3" />
            <span className="hidden md:inline font-semibold">{currentWordText}</span>
          </button>
        )}

        <span className="hidden md:inline hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer">
          Ln 13, Col 32
        </span>

        <span className="hidden sm:inline hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer">
          Spaces: 2
        </span>

        <span className="hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer">
          UTF-8
        </span>

        {/* Discreet Language Mode Selector Button (authentic VS Code status bar item) */}
        <button
          onClick={onOpenLanguageModal}
          className="hidden sm:inline-flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer font-semibold text-white transition-colors"
          title={`Select Language Mode (目前語言: ${currentLangInfo.name}，點擊切換程式語言)`}
        >
          <Code2 className="w-3 h-3 text-cyan-200" />
          <span>{currentLangInfo.name}</span>
        </button>

        <span
          className="flex items-center gap-1 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer"
          title="Prettier Formatted & Ready"
        >
          <Check className="w-3 h-3" />
          <span className="hidden md:inline">Prettier</span>
        </span>

        <span className="hover:bg-black/20 p-1 rounded cursor-pointer">
          <Bell className="w-3 h-3" />
        </span>
      </div>
    </footer>
  );
};
