import React from 'react';
import {
  Files,
  Search,
  GitFork,
  PlayCircle,
  Blocks,
  Settings,
  User,
  Volume2,
  Database,
  Cloud,
  FileCode,
} from 'lucide-react';
import { UserAccount } from '../lib/firebase';

export type ActivityTab = 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'database';

interface VSCodeActivityBarProps {
  activeTab: ActivityTab;
  setActiveTab: (tab: ActivityTab) => void;
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
  onOpenCommandPalette: () => void;
  onOpenCloudModal: () => void;
  onOpenBackupModal: () => void;
  onPronounceCurrent?: () => void;
  cloudAccount: UserAccount | null;
  difficultCount: number;
  learningCount: number;
}

export const VSCodeActivityBar: React.FC<VSCodeActivityBarProps> = ({
  activeTab,
  setActiveTab,
  sidebarVisible,
  setSidebarVisible,
  onOpenCommandPalette,
  onOpenCloudModal,
  onOpenBackupModal,
  onPronounceCurrent,
  cloudAccount,
  difficultCount,
  learningCount,
}) => {
  const handleTabClick = (tab: ActivityTab) => {
    if (activeTab === tab && sidebarVisible) {
      setSidebarVisible(false);
    } else {
      setActiveTab(tab);
      setSidebarVisible(true);
    }
  };

  return (
    <aside className="w-[48px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2 shrink-0 z-20 select-none">
      {/* Top Activity Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Explorer */}
        <button
          onClick={() => handleTabClick('explorer')}
          title="Explorer (Ctrl+Shift+E)"
          className={`relative w-full h-11 flex items-center justify-center cursor-pointer transition-colors ${
            activeTab === 'explorer' && sidebarVisible
              ? 'text-white'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          {activeTab === 'explorer' && sidebarVisible && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
          )}
          <Files className="w-5 h-5" />
        </button>

        {/* Search */}
        <button
          onClick={() => {
            onOpenCommandPalette();
          }}
          title="Search in Files (Ctrl+Shift+F)"
          className="relative w-full h-11 flex items-center justify-center cursor-pointer text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Source Control (Git) - shows difficult words count badge */}
        <button
          onClick={() => handleTabClick('git')}
          title="Source Control / Vocabulary Review Queue"
          className={`relative w-full h-11 flex items-center justify-center cursor-pointer transition-colors ${
            activeTab === 'git' && sidebarVisible
              ? 'text-white'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          {activeTab === 'git' && sidebarVisible && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
          )}
          <div className="relative">
            <GitFork className="w-5 h-5" />
            {difficultCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-[#f14c4c] text-white text-[9px] font-bold rounded-full min-w-[14px] text-center">
                {difficultCount}
              </span>
            )}
          </div>
        </button>

        {/* Run & Debug / Interactive Code Execution */}
        <button
          onClick={() => handleTabClick('debug')}
          title="Run and Debug Practice Session (Ctrl+Shift+D)"
          className={`relative w-full h-11 flex items-center justify-center cursor-pointer transition-colors ${
            activeTab === 'debug' && sidebarVisible
              ? 'text-white'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          {activeTab === 'debug' && sidebarVisible && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
          )}
          <PlayCircle className="w-5 h-5" />
        </button>

        {/* Database / Full Lexicon */}
        <button
          onClick={() => handleTabClick('database')}
          title="GRE Word Database (all_words.ts)"
          className={`relative w-full h-11 flex items-center justify-center cursor-pointer transition-colors ${
            activeTab === 'database' && sidebarVisible
              ? 'text-white'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          {activeTab === 'database' && sidebarVisible && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
          )}
          <Database className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Activity Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Audio Pronunciation shortcut */}
        <button
          onClick={onPronounceCurrent}
          title="Pronounce Current Target Word (Hotkey V)"
          className="w-full h-10 flex items-center justify-center cursor-pointer text-[#858585] hover:text-[#4ec9b0] transition-colors"
        >
          <Volume2 className="w-5 h-5" />
        </button>

        {/* Cloud Account */}
        <button
          onClick={onOpenCloudModal}
          title={
            cloudAccount
              ? `Signed in as ${cloudAccount.username} (Cloud Synced)`
              : 'Cloud Account / Sign In'
          }
          className={`w-full h-10 flex items-center justify-center cursor-pointer transition-colors ${
            cloudAccount ? 'text-[#4ec9b0]' : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        >
          {cloudAccount ? <Cloud className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </button>

        {/* Settings / Backup */}
        <button
          onClick={onOpenBackupModal}
          title="Settings / Backup & Storage"
          className="w-full h-10 flex items-center justify-center cursor-pointer text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
