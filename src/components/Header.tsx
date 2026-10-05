import React from 'react';
import { Volume2, VolumeX, Ticket, Radio } from 'lucide-react';
import { isAudioEnabled, toggleAudio } from '../utils/audio';

interface HeaderProps {
  activeTab: 'map' | 'my-passes' | 'rates';
  onSelectTab: (tab: 'map' | 'my-passes' | 'rates') => void;
  activePassesCount: number;
  liveSensorCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  activePassesCount,
  liveSensorCount,
}) => {
  const [audioOn, setAudioOn] = React.useState(isAudioEnabled());

  const handleToggleAudio = () => {
    const nextState = toggleAudio();
    setAudioOn(nextState);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 border-b border-slate-200/80 transition-all shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('map');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-sky-600 transition-colors flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></span>
            <span>AuraPark</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              · Grand Horizon Mall
            </span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links with subtle hover states */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('map')}
            className={`transition-colors relative py-1 ${
              activeTab === 'map'
                ? 'text-sky-600 font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            Parking Map
            {activeTab === 'map' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full shadow-[0_0_6px_rgba(2,132,199,0.3)]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('rates')}
            className={`transition-colors relative py-1 ${
              activeTab === 'rates'
                ? 'text-sky-600 font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            Rates & Mall Guide
            {activeTab === 'rates' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full shadow-[0_0_6px_rgba(2,132,199,0.3)]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('my-passes')}
            className={`transition-colors relative py-1 flex items-center gap-1.5 ${
              activeTab === 'my-passes'
                ? 'text-sky-600 font-semibold'
                : 'hover:text-slate-900 text-slate-600'
            }`}
          >
            My Passes
            {activePassesCount > 0 && (
              <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 font-medium">
                {activePassesCount}
              </span>
            )}
            {activeTab === 'my-passes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full shadow-[0_0_6px_rgba(2,132,199,0.3)]" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Live sensor indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Live Sensors</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700 font-medium">{liveSensorCount} active</span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={handleToggleAudio}
            aria-label={audioOn ? 'Mute feedback sounds' : 'Enable feedback sounds'}
            className="p-2 rounded-lg bg-white/80 hover:bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            title={audioOn ? 'Sound feedback on' : 'Sound feedback muted'}
          >
            {audioOn ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* My Passes CTA */}
          <button
            onClick={() => onSelectTab('my-passes')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-800 bg-white/80 hover:bg-white border border-slate-200 rounded-lg transition-all shadow-xs whitespace-nowrap"
          >
            <Ticket className="w-3.5 h-3.5 text-sky-600" />
            <span>Digital Passes</span>
            {activePassesCount > 0 && (
              <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-sky-600 text-white font-semibold">
                {activePassesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
