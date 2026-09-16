import React, { useState } from 'react';
import { AppView, LanguageMode } from '../types';
import { ActivityTab } from './VSCodeActivityBar';
import { getLanguageInfo } from '../utils/languages';
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FileJson,
  Flame,
  BookmarkX,
  CheckCircle2,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Database,
  Cloud,
  FileText,
  Search,
  Code2,
} from 'lucide-react';

interface VSCodeSidebarProps {
  activeTab: ActivityTab;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  stats: {
    total: number;
    masteredCount: number;
    difficultCount: number;
    learningCount: number;
    unseenCount: number;
    progressPercentage: number;
  };
  onInitQueue: (
    filter: 'all' | 'learning_only' | 'difficult_only' | 'mastered_only',
    startWordId?: string
  ) => void;
  onReset: () => void;
  onOpenCloudModal: () => void;
  onOpenBackupModal: () => void;
  languageMode: LanguageMode;
  onOpenLanguageModal?: () => void;
}

export const VSCodeSidebar: React.FC<VSCodeSidebarProps> = ({
  activeTab,
  currentView,
  setCurrentView,
  stats,
  onInitQueue,
  onReset,
  onOpenCloudModal,
  onOpenBackupModal,
  languageMode,
  onOpenLanguageModal,
}) => {
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [projectExpanded, setProjectExpanded] = useState(true);
  const [statsExpanded, setStatsExpanded] = useState(true);

  const langInfo = getLanguageInfo(languageMode);

  return (
    <div className="w-[250px] bg-[#252526] border-r border-[#2b2b2b] flex flex-col h-full shrink-0 select-none text-[#cccccc] font-mono-code text-xs">
      {/* Sidebar Header */}
      <div className="h-[35px] px-4 flex items-center justify-between font-semibold tracking-wider text-[11px] text-[#bbbbbb] uppercase border-b border-[#2b2b2b]">
        <span>
          {activeTab === 'explorer' && 'Explorer'}
          {activeTab === 'git' && 'Source Control: GRE'}
          {activeTab === 'debug' && 'Run & Debug Practice'}
          {activeTab === 'database' && 'Word Lexicon Database'}
          {activeTab === 'search' && 'Search Vocab'}
          {activeTab === 'extensions' && 'Vocabulary Packages'}
        </span>
        <div className="flex items-center gap-1 text-[#858585]">
          <span className="hover:text-white cursor-pointer px-1">...</span>
        </div>
      </div>

      {/* Explorer Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2b2b2b]/40">
        {activeTab === 'explorer' && (
          <>
            {/* Open Editors Section */}
            <div>
              <button
                onClick={() => setOpenEditorsExpanded((p) => !p)}
                className="w-full h-6 px-2 flex items-center gap-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-[#2a2d2e] cursor-pointer"
              >
                {openEditorsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="tracking-wide uppercase">Open Editors</span>
              </button>

              {openEditorsExpanded && (
                <div className="py-0.5">
                  <div
                    onClick={() => setCurrentView('flashcards')}
                    className={`h-6 px-4 flex items-center gap-2 cursor-pointer transition-colors ${
                      currentView === 'flashcards'
                        ? 'bg-[#37373d] text-white font-medium'
                        : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                    }`}
                  >
                    <span style={{ color: langInfo.color }} className="text-xs font-bold">{langInfo.badge}</span>
                    <span className="truncate">{langInfo.practiceFileName}</span>
                  </div>
                  <div
                    onClick={() => setCurrentView('all')}
                    className={`h-6 px-4 flex items-center gap-2 cursor-pointer transition-colors ${
                      currentView === 'all'
                        ? 'bg-[#37373d] text-white font-medium'
                        : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                    }`}
                  >
                    <span style={{ color: langInfo.color }} className="text-xs font-bold">{langInfo.badge}</span>
                    <span className="truncate">{langInfo.allFileName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Project Tree Section */}
            <div>
              <button
                onClick={() => setProjectExpanded((p) => !p)}
                className="w-full h-6 px-2 flex items-center gap-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-[#2a2d2e] cursor-pointer"
              >
                {projectExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="tracking-wide uppercase truncate">GRE-3000-PROJECT</span>
              </button>

              {projectExpanded && (
                <div className="py-0.5 pl-2">
                  {/* src folder */}
                  <div className="h-6 px-2 flex items-center gap-1.5 text-[#aaaaaa] font-medium">
                    <ChevronDown className="w-3 h-3 text-[#858585]" />
                    <span>src/</span>
                  </div>

                  {/* Files inside src */}
                  <div className="pl-4">
                    {/* Practice session (Flashcards) */}
                    <div
                      onClick={() => setCurrentView('flashcards')}
                      className={`h-6 px-2 flex items-center justify-between cursor-pointer rounded-sm ${
                        currentView === 'flashcards'
                          ? 'bg-[#04395e] text-white'
                          : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span style={{ color: langInfo.color }} className="font-bold text-[11px]">{langInfo.badge}</span>
                        <span className="truncate">{langInfo.practiceFileName}</span>
                      </div>
                      <span className="text-[10px] text-[#4ec9b0]">active</span>
                    </div>

                    {/* Difficult Words */}
                    <div
                      onClick={() => setCurrentView('difficult')}
                      className={`h-6 px-2 flex items-center justify-between cursor-pointer rounded-sm ${
                        currentView === 'difficult'
                          ? 'bg-[#04395e] text-white'
                          : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[#f14c4c] font-bold text-[11px]">{langInfo.badge}</span>
                        <span className="truncate">{langInfo.difficultFileName}</span>
                      </div>
                      {stats.difficultCount > 0 && (
                        <span className="text-[10px] px-1 bg-[#4c1d1d] text-[#f48771] rounded border border-[#6b2525]">
                          {stats.difficultCount}
                        </span>
                      )}
                    </div>

                    {/* Learning Queue */}
                    <div
                      onClick={() => setCurrentView('learning')}
                      className={`h-6 px-2 flex items-center justify-between cursor-pointer rounded-sm ${
                        currentView === 'learning'
                          ? 'bg-[#04395e] text-white'
                          : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[#cca700] font-bold text-[11px]">{langInfo.badge}</span>
                        <span className="truncate">{langInfo.learningFileName}</span>
                      </div>
                      {stats.learningCount > 0 && (
                        <span className="text-[10px] px-1 bg-[#3d3300] text-[#cca700] rounded">
                          {stats.learningCount}
                        </span>
                      )}
                    </div>

                    {/* Mastered Records */}
                    <div
                      onClick={() => setCurrentView('mastered')}
                      className={`h-6 px-2 flex items-center justify-between cursor-pointer rounded-sm ${
                        currentView === 'mastered'
                          ? 'bg-[#04395e] text-white'
                          : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[#89d185] font-bold text-[11px]">{langInfo.badge}</span>
                        <span className="truncate">{langInfo.masteredFileName}</span>
                      </div>
                      <span className="text-[10px] text-[#89d185]">
                        {stats.masteredCount}
                      </span>
                    </div>

                    {/* All Words Database */}
                    <div
                      onClick={() => setCurrentView('all')}
                      className={`h-6 px-2 flex items-center justify-between cursor-pointer rounded-sm ${
                        currentView === 'all'
                          ? 'bg-[#04395e] text-white'
                          : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span style={{ color: langInfo.color }} className="font-bold text-[11px]">{langInfo.badge}</span>
                        <span className="truncate">{langInfo.allFileName}</span>
                      </div>
                      <span className="text-[10px] text-[#858585]">{stats.total}</span>
                    </div>

                    {/* Add Custom Word */}
                    <div
                      onClick={() => setCurrentView('add_word')}
                      className={`h-6 px-2 flex items-center justify-between cursor-pointer rounded-sm ${
                        currentView === 'add_word'
                          ? 'bg-[#04395e] text-white'
                          : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[#4ec9b0] font-bold text-[11px]">{langInfo.badge}</span>
                        <span className="truncate">{langInfo.customFileName}</span>
                      </div>
                      <Plus className="w-3 h-3 text-[#858585]" />
                    </div>
                  </div>

                  {/* config folder */}
                  <div className="h-6 px-2 mt-1 flex items-center gap-1.5 text-[#aaaaaa] font-medium">
                    <ChevronDown className="w-3 h-3 text-[#858585]" />
                    <span>config/</span>
                  </div>
                  <div className="pl-4">
                    <div
                      onClick={onOpenCloudModal}
                      className="h-6 px-2 flex items-center gap-2 cursor-pointer hover:bg-[#2a2d2e] rounded-sm text-[#cccccc]"
                    >
                      <span className="text-[#d7ba7d] font-bold text-[11px]">ENV</span>
                      <span className="truncate">cloud_sync.env</span>
                    </div>
                    <div
                      onClick={onOpenBackupModal}
                      className="h-6 px-2 flex items-center gap-2 cursor-pointer hover:bg-[#2a2d2e] rounded-sm text-[#cccccc]"
                    >
                      <span className="text-[#cbcb41] font-bold text-[11px]">JSON</span>
                      <span className="truncate">backup_data.json</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Retention Stats Accordion */}
            <div>
              <button
                onClick={() => setStatsExpanded((p) => !p)}
                className="w-full h-6 px-2 flex items-center gap-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-[#2a2d2e] cursor-pointer"
              >
                {statsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="tracking-wide uppercase">Retention Diagnostics</span>
              </button>

              {statsExpanded && (
                <div className="p-3 space-y-2.5 bg-[#202021]/60 text-[11px]">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#858585] mb-1">
                      <span>Total Mastery</span>
                      <span className="text-[#89d185] font-bold">{stats.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-[#333333] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#007acc] h-full transition-all duration-300"
                        style={{ width: `${stats.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-[#aaaaaa]">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#89d185]" /> Mastered:
                      </span>
                      <span className="text-white font-semibold">{stats.masteredCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f14c4c]" /> Difficult (2+):
                      </span>
                      <span className="text-white font-semibold">{stats.difficultCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#cca700]" /> Still Learning:
                      </span>
                      <span className="text-white font-semibold">{stats.learningCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#555555]" /> Unseen / Remaining:
                      </span>
                      <span className="text-white font-semibold">{stats.unseenCount}</span>
                    </div>
                  </div>

                  <button
                    onClick={onReset}
                    className="w-full mt-2 py-1 px-2 text-[10px] bg-[#3a1d1d] hover:bg-[#522323] text-[#f48771] border border-[#6b2525] rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>git reset --hard HEAD (Reset)</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Source Control Tab */}
        {activeTab === 'git' && (
          <div className="p-3 space-y-3">
            <div className="text-[11px] text-[#858585]">
              Branch: <span className="text-[#007acc] font-semibold">master*</span>
            </div>
            <div className="text-[11px] text-[#bbbbbb] font-semibold">
              UNCOMMITTED VOCABULARY ({stats.learningCount + stats.difficultCount})
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onInitQueue('difficult_only');
                  setCurrentView('flashcards');
                }}
                className="w-full p-2 rounded bg-[#2a2d2e] hover:bg-[#37373d] text-left flex items-center justify-between text-[#cccccc] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#f14c4c] font-bold">M</span>
                  <span>Review Difficult ({stats.difficultCount})</span>
                </div>
                <Play className="w-3 h-3 text-[#89d185]" />
              </button>

              <button
                onClick={() => {
                  onInitQueue('learning_only');
                  setCurrentView('flashcards');
                }}
                className="w-full p-2 rounded bg-[#2a2d2e] hover:bg-[#37373d] text-left flex items-center justify-between text-[#cccccc] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#cca700] font-bold">U</span>
                  <span>Review Learning ({stats.learningCount})</span>
                </div>
                <Play className="w-3 h-3 text-[#89d185]" />
              </button>

              <button
                onClick={() => {
                  onInitQueue('all');
                  setCurrentView('flashcards');
                }}
                className="w-full p-2 rounded bg-[#2a2d2e] hover:bg-[#37373d] text-left flex items-center justify-between text-[#cccccc] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#89d185] font-bold">A</span>
                  <span>Review All 3000 Words</span>
                </div>
                <Play className="w-3 h-3 text-[#89d185]" />
              </button>
            </div>
          </div>
        )}

        {/* Run & Debug Tab */}
        {activeTab === 'debug' && (
          <div className="p-3 space-y-3">
            <div className="text-[11px] text-[#858585]">
              RUN CONFIGURATIONS
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  onInitQueue('all');
                  setCurrentView('flashcards');
                }}
                className="w-full py-1.5 px-2.5 rounded bg-[#0e639c] hover:bg-[#1177bb] text-white flex items-center gap-2 cursor-pointer font-medium"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch: All Words</span>
              </button>

              <button
                onClick={() => {
                  onInitQueue('difficult_only');
                  setCurrentView('flashcards');
                }}
                className="w-full py-1.5 px-2.5 rounded bg-[#2a2d2e] hover:bg-[#37373d] text-[#f48771] border border-[#6b2525] flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Launch: Difficult Only ({stats.difficultCount})</span>
              </button>

              <button
                onClick={() => {
                  onInitQueue('learning_only');
                  setCurrentView('flashcards');
                }}
                className="w-full py-1.5 px-2.5 rounded bg-[#2a2d2e] hover:bg-[#37373d] text-[#cca700] border border-[#554700] flex items-center gap-2 cursor-pointer"
              >
                <BookmarkX className="w-3.5 h-3.5" />
                <span>Launch: Learning Only ({stats.learningCount})</span>
              </button>

              <button
                onClick={() => {
                  onInitQueue('mastered_only');
                  setCurrentView('flashcards');
                }}
                className="w-full py-1.5 px-2.5 rounded bg-[#2a2d2e] hover:bg-[#37373d] text-[#89d185] border border-[#2b552b] flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Launch: Mastered Words ({stats.masteredCount})</span>
              </button>
            </div>
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="p-3 space-y-2">
            <div className="text-[11px] text-[#858585] flex items-center justify-between">
              <span>DICTIONARY COLLECTIONS</span>
              <span className="text-[#89d185]">{stats.total} words</span>
            </div>

            <button
              onClick={() => setCurrentView('all')}
              className="w-full py-2 px-3 rounded bg-[#04395e] hover:bg-[#064c7e] text-white flex items-center gap-2 cursor-pointer text-left"
            >
              <Database className="w-4 h-4 text-[#4ec9b0]" />
              <div>
                <div className="font-semibold">Full GRE 3000</div>
                <div className="text-[10px] text-[#aaaaaa]">Click to browse and search</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
