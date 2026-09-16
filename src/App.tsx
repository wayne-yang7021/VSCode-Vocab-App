import { useState, useEffect } from 'react';
import { useVocabulary } from './hooks/useVocabulary';
import { VSCodeTitlebar } from './components/VSCodeTitlebar';
import { VSCodeActivityBar, ActivityTab } from './components/VSCodeActivityBar';
import { VSCodeSidebar } from './components/VSCodeSidebar';
import { VSCodeEditorTabs } from './components/VSCodeEditorTabs';
import { VSCodeCodeEditor } from './components/VSCodeCodeEditor';
import { VSCodeTerminal } from './components/VSCodeTerminal';
import { VSCodeStatusBar } from './components/VSCodeStatusBar';
import { VSCodeCommandPalette } from './components/VSCodeCommandPalette';
import { VSCodeLanguageModeModal } from './components/VSCodeLanguageModeModal';
import { WordListView } from './components/WordListView';
import { AddWordView } from './components/AddWordView';
import { BackupModal } from './components/BackupModal';
import { CloudAccountModal } from './components/CloudAccountModal';
import { AppView, LanguageMode } from './types';
import { speakWord } from './utils/speech';
import { getLanguageInfo } from './utils/languages';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('flashcards');
  const [activeActivityTab, setActiveActivityTab] = useState<ActivityTab>('explorer');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Language mode state (persisted to localStorage)
  const [languageMode, setLanguageMode] = useState<LanguageMode>(() => {
    const saved = localStorage.getItem('gre_vscode_lang_mode') as LanguageMode | null;
    return saved || 'typescript';
  });

  const handleSelectLanguage = (lang: LanguageMode) => {
    setLanguageMode(lang);
    try {
      localStorage.setItem('gre_vscode_lang_mode', lang);
    } catch {
      // ignore
    }
  };

  const {
    allWords,
    currentWord,
    currentIndex,
    totalInQueue,
    uniqueWordNumber,
    totalUniqueWords,
    markAsMastered,
    markAsLearning,
    setWordStatus,
    resetAllProgress,
    initQueue,
    goToNextCard,
    goToPrevCard,
    practiceFilter,
    stats,
    learningWords,
    difficultWords,
    masteredWords,
    customWords,
    addCustomWord,
    deleteCustomWord,
    exportBackupData,
    importBackupData,
    progressMap,
    cloudAccount,
    loginCloudAccount,
    logoutCloudAccount,
    syncCurrentLocalToCloud,
  } = useVocabulary();

  // Global keyboard shortcuts (Ctrl+P / Cmd+P for Command Palette, Ctrl+B for Sidebar)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      // Ctrl+B / Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarVisible((prev) => !prev);
      }
      // Ctrl+` (tilde)
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setTerminalVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleStartPracticeWithFilter = (
    filter: 'all' | 'learning_only' | 'difficult_only' | 'mastered_only',
    startWordId?: string
  ) => {
    initQueue(filter, startWordId);
    setCurrentView('flashcards');
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
  };

  const handleTriggerReset = () => {
    setShowResetConfirm(true);
  };

  const handlePronounceCurrent = () => {
    if (currentWord) {
      speakWord(currentWord.word);
    }
  };

  const langInfo = getLanguageInfo(languageMode);

  // Get active file name for Titlebar
  const getActiveFileName = () => {
    switch (currentView) {
      case 'flashcards':
        return langInfo.practiceFileName;
      case 'difficult':
        return langInfo.difficultFileName;
      case 'learning':
        return langInfo.learningFileName;
      case 'mastered':
        return langInfo.masteredFileName;
      case 'all':
        return langInfo.allFileName;
      case 'add_word':
        return langInfo.customFileName;
      default:
        return `main${langInfo.ext}`;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#181818] text-[#cccccc] font-mono-code overflow-hidden select-none">
      {/* 1. VS Code Titlebar (Window Top Bar) */}
      <VSCodeTitlebar
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible((p) => !p)}
        terminalVisible={terminalVisible}
        onToggleTerminal={() => setTerminalVisible((p) => !p)}
        stealthMode={stealthMode}
        onToggleStealthMode={() => setStealthMode((p) => !p)}
        activeFileName={getActiveFileName()}
      />

      {/* 2. Main Workbench (Activity Bar + Sidebar + Editor + Terminal) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Leftmost Activity Bar (48px) */}
        <VSCodeActivityBar
          activeTab={activeActivityTab}
          setActiveTab={setActiveActivityTab}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onOpenCloudModal={() => setShowCloudModal(true)}
          onOpenBackupModal={() => setShowBackupModal(true)}
          onPronounceCurrent={handlePronounceCurrent}
          cloudAccount={cloudAccount}
          difficultCount={stats.difficultCount}
          learningCount={stats.learningCount}
        />

        {/* Collapsible Primary Side Bar */}
        {sidebarVisible && (
          <VSCodeSidebar
            activeTab={activeActivityTab}
            currentView={currentView}
            setCurrentView={setCurrentView}
            stats={stats}
            onInitQueue={(filter, startWordId) => handleStartPracticeWithFilter(filter, startWordId)}
            onReset={handleTriggerReset}
            onOpenCloudModal={() => setShowCloudModal(true)}
            onOpenBackupModal={() => setShowBackupModal(true)}
            languageMode={languageMode}
            onOpenLanguageModal={() => setShowLanguageModal(true)}
          />
        )}

        {/* Editor & Terminal Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
          {/* Editor Tabs & Breadcrumb */}
          <VSCodeEditorTabs
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentWordText={currentWord?.word}
            onPronounceCurrent={handlePronounceCurrent}
            languageMode={languageMode}
            onOpenLanguageModal={() => setShowLanguageModal(true)}
          />

          {/* Active View Body */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {currentView === 'flashcards' && (
              <VSCodeCodeEditor
                currentWord={currentWord}
                currentIndex={currentIndex}
                totalInQueue={totalInQueue}
                uniqueWordNumber={uniqueWordNumber}
                totalUniqueWords={totalUniqueWords}
                onMastered={markAsMastered}
                onLearning={markAsLearning}
                onNextCard={goToNextCard}
                onPrevCard={goToPrevCard}
                practiceFilter={practiceFilter}
                stats={stats}
                onInitQueue={(filter, startWordId, forceReset) => initQueue(filter, startWordId, forceReset)}
                onReset={handleTriggerReset}
                stealthMode={stealthMode}
                languageMode={languageMode}
                onOpenLanguageModal={() => setShowLanguageModal(true)}
              />
            )}

            {currentView === 'learning' && (
              <WordListView
                title="還不會的單字"
                description="翻卡練習中選擇「我還不會」的單字。若選擇滿 2 次會自動升級進入「較不熟單字」區。"
                words={learningWords}
                progressMap={progressMap}
                onSetStatus={setWordStatus}
                onStartPractice={(filter, startWordId) => handleStartPracticeWithFilter(filter, startWordId)}
                onReset={handleTriggerReset}
                currentListType="learning"
                languageMode={languageMode}
              />
            )}

            {currentView === 'difficult' && (
              <WordListView
                title="較不熟單字"
                description="翻卡練習中「我還不會」達到 2 次以上的單字，集中在此進行針對性特訓！"
                words={difficultWords}
                progressMap={progressMap}
                onSetStatus={setWordStatus}
                onStartPractice={(filter, startWordId) => handleStartPracticeWithFilter(filter, startWordId)}
                onReset={handleTriggerReset}
                currentListType="difficult"
                languageMode={languageMode}
              />
            )}

            {currentView === 'mastered' && (
              <WordListView
                title="已學會的單字"
                description="已經掌握的單字。隨時可以點擊 Run 重新拿出來進行溫故知新練習。"
                words={masteredWords}
                progressMap={progressMap}
                onSetStatus={setWordStatus}
                onStartPractice={(filter, startWordId) => handleStartPracticeWithFilter(filter, startWordId)}
                onReset={handleTriggerReset}
                currentListType="mastered"
                languageMode={languageMode}
              />
            )}

            {currentView === 'all' && (
              <WordListView
                title="完整單字庫"
                description="收錄的完整單字清單，支援即時搜尋單字與狀態切換。"
                words={allWords}
                progressMap={progressMap}
                onSetStatus={setWordStatus}
                onStartPractice={(filter, startWordId) => handleStartPracticeWithFilter(filter, startWordId)}
                onReset={handleTriggerReset}
                currentListType="all"
                languageMode={languageMode}
              />
            )}

            {currentView === 'add_word' && (
              <div className="flex-1 overflow-y-auto p-4 bg-[#1e1e1e]">
                <AddWordView
                  allWords={allWords}
                  customWords={customWords}
                  progressMap={progressMap}
                  onAddCustomWord={addCustomWord}
                  onDeleteCustomWord={deleteCustomWord}
                  onStartPractice={(filter, startWordId) => handleStartPracticeWithFilter(filter, startWordId)}
                />
              </div>
            )}
          </div>

          {/* Collapsible Bottom Terminal Panel */}
          <VSCodeTerminal
            isVisible={terminalVisible}
            onClose={() => setTerminalVisible(false)}
            currentWord={currentWord}
            currentIndex={currentIndex}
            totalInQueue={totalInQueue}
            stats={stats}
            progressMap={progressMap}
            difficultWords={difficultWords}
            onSelectWord={(wordId) => {
              handleStartPracticeWithFilter('all', wordId);
            }}
            onMastered={markAsMastered}
            onLearning={markAsLearning}
            onNextCard={goToNextCard}
            onPrevCard={goToPrevCard}
          />
        </div>
      </div>

      {/* 3. VS Code Status Bar (22px Bottom Line) */}
      <VSCodeStatusBar
        difficultCount={stats.difficultCount}
        learningCount={stats.learningCount}
        masteredCount={stats.masteredCount}
        totalCount={stats.total}
        currentWordText={currentWord?.word}
        onPronounceCurrent={handlePronounceCurrent}
        cloudAccount={cloudAccount}
        onOpenCloudModal={() => setShowCloudModal(true)}
        onToggleTerminal={() => setTerminalVisible((p) => !p)}
        terminalVisible={terminalVisible}
        languageMode={languageMode}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
      />

      {/* 4. VS Code Command Palette Modal (Ctrl+P / Cmd+P) */}
      <VSCodeCommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        allWords={allWords}
        onSelectWord={(wordId) => {
          handleStartPracticeWithFilter('all', wordId);
        }}
        onSwitchView={setCurrentView}
        onInitQueue={(filter) => handleStartPracticeWithFilter(filter)}
        onPronounceCurrent={handlePronounceCurrent}
        onOpenCloudModal={() => setShowCloudModal(true)}
        onOpenBackupModal={() => setShowBackupModal(true)}
        onReset={handleTriggerReset}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
      />

      {/* 5. Reset Progress Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono-code">
          <div className="bg-[#252526] border border-[#454545] rounded-md p-6 max-w-md w-full shadow-2xl text-xs text-[#cccccc]">
            <div className="w-10 h-10 rounded bg-[#3a1d1d] text-[#f48771] border border-[#6b2525] flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              git reset --hard HEAD (確定重置進度？)
            </h3>
            <p className="text-[#858585] text-xs mb-5 leading-relaxed">
              此操作將重設所有進度紀錄：已學會 ({stats.masteredCount} 個)、較不熟 ({stats.difficultCount} 個) 及學習中字卡將還原為初始狀態。
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded bg-[#2d2d2d] hover:bg-[#383838] text-[#cccccc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 rounded bg-[#a1260d] hover:bg-[#b82b0e] text-white font-semibold cursor-pointer"
              >
                Confirm Hard Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Cloud Account Modal */}
      <CloudAccountModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
        cloudAccount={cloudAccount}
        onLogin={loginCloudAccount}
        onLogout={logoutCloudAccount}
        onSyncLocalToCloud={syncCurrentLocalToCloud}
        customWordsCount={customWords.length}
        progressRecordCount={Object.keys(progressMap).length}
      />

      {/* 7. Backup Modal */}
      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onExport={exportBackupData}
        onImport={importBackupData}
      />

      {/* 8. VS Code Language Mode Switcher Modal */}
      <VSCodeLanguageModeModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={languageMode}
        onSelectLanguage={handleSelectLanguage}
      />
    </div>
  );
}
