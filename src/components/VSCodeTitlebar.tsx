import React from 'react';
import { Search, SplitSquareVertical, PanelBottom, Sidebar, Minus, Square, X, Sparkles, Code2, ShieldAlert } from 'lucide-react';

interface VSCodeTitlebarProps {
  onOpenCommandPalette: () => void;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  terminalVisible: boolean;
  onToggleTerminal: () => void;
  stealthMode: boolean;
  onToggleStealthMode: () => void;
  activeFileName: string;
}

export const VSCodeTitlebar: React.FC<VSCodeTitlebarProps> = ({
  onOpenCommandPalette,
  sidebarVisible,
  onToggleSidebar,
  terminalVisible,
  onToggleTerminal,
  stealthMode,
  onToggleStealthMode,
  activeFileName,
}) => {
  return (
    <header className="h-[35px] bg-[#1f1f1f] border-b border-[#2b2b2b] flex items-center justify-between px-2 select-none text-[#cccccc] text-xs font-mono-code shrink-0 z-20">
      {/* Left: Window Menu / VS Code Brand Icon */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 cursor-pointer flex items-center justify-center group" title="Close">
            <span className="text-[8px] text-[#4c0000] opacity-0 group-hover:opacity-100 font-bold">×</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 cursor-pointer flex items-center justify-center group" title="Minimize">
            <span className="text-[8px] text-[#5b3c00] opacity-0 group-hover:opacity-100 font-bold">-</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 cursor-pointer flex items-center justify-center group" title="Expand">
            <span className="text-[8px] text-[#004d11] opacity-0 group-hover:opacity-100 font-bold">+</span>
          </div>
        </div>

        {/* VS Code Logo icon */}
        <div className="flex items-center gap-1.5 text-[#007acc]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .32 8.707L4.898 12 .32 15.293a1 1 0 0 0 .007 1.446l1.322 1.202c.369.335.917.357 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
          </svg>
        </div>

        {/* Window Menu items like File Edit Selection View Go */}
        <div className="hidden lg:flex items-center gap-2.5 text-[11px] text-[#999999]">
          <span className="hover:text-white cursor-pointer transition-colors">File</span>
          <span className="hover:text-white cursor-pointer transition-colors">Edit</span>
          <span className="hover:text-white cursor-pointer transition-colors">Selection</span>
          <span className="hover:text-white cursor-pointer transition-colors">View</span>
          <span className="hover:text-white cursor-pointer transition-colors">Run</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terminal</span>
          <span className="hover:text-white cursor-pointer transition-colors">Help</span>
        </div>
      </div>

      {/* Center: Command Palette / Search Bar */}
      <div className="flex-1 max-w-[540px] mx-2">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-[24px] bg-[#252526] hover:bg-[#2c2c2d] border border-[#3c3c3c] rounded-[4px] px-3 flex items-center justify-between text-[#858585] text-xs transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-[#858585] group-hover:text-[#cccccc]" />
            <span className="truncate group-hover:text-[#cccccc]">
              gre-project - {activeFileName}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="hidden sm:inline-block text-[10px] px-1 py-0.2 bg-[#333333] text-[#aaaaaa] rounded border border-[#444444]">
              Ctrl + P
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Window Controls & Layout Toggles */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Stealth Mode / Coding Camouflage indicator button */}
        <button
          onClick={onToggleStealthMode}
          title={stealthMode ? "Stealth Mode Active: Full camouflage as pure code" : "Normal Mode: Allows quick peek definitions"}
          className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 border transition-colors cursor-pointer ${
            stealthMode
              ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
              : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#aaaaaa] hover:text-white'
          }`}
        >
          <Code2 className="w-3 h-3 text-[#4ec9b0]" />
          <span className="hidden md:inline">Boss Key / 摸魚防護: {stealthMode ? 'ON' : 'OFF'}</span>
        </button>

        <div className="h-4 w-[1px] bg-[#333333] mx-1" />

        {/* Toggle Sidebar */}
        <button
          onClick={onToggleSidebar}
          title="Toggle Primary Side Bar (Ctrl+B)"
          className={`p-1.5 rounded hover:bg-[#333333] transition-colors cursor-pointer ${
            sidebarVisible ? 'text-[#007acc]' : 'text-[#858585]'
          }`}
        >
          <Sidebar className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Panel / Terminal */}
        <button
          onClick={onToggleTerminal}
          title="Toggle Bottom Terminal Panel (Ctrl+`)"
          className={`p-1.5 rounded hover:bg-[#333333] transition-colors cursor-pointer ${
            terminalVisible ? 'text-[#007acc]' : 'text-[#858585]'
          }`}
        >
          <PanelBottom className="w-3.5 h-3.5" />
        </button>

        {/* Window state icons */}
        <div className="hidden sm:flex items-center gap-0.5 ml-2 text-[#858585]">
          <button className="p-1.5 hover:bg-[#333333] rounded cursor-pointer">
            <Minus className="w-3 h-3" />
          </button>
          <button className="p-1.5 hover:bg-[#333333] rounded cursor-pointer">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button className="p-1.5 hover:bg-[#e81123] hover:text-white rounded cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
