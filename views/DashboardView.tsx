import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AreaChart, ArrowRight, Atom, Command, Divide, Dna,
  GraduationCap, Grid3X3, Infinity as InfinityIcon, Layers,
  MoveUpRight, Play, Search, TrendingUp
} from 'lucide-react';
import { ModuleType } from '../types';
import {
  getLearningDestination,
  LearningDestination,
  LearningDestinationRef,
  searchLearningDestinations,
} from '../data/learningCatalog';
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from '../data/branding';
import './DashboardView.css';

interface ModuleConfig {
  id: ModuleType;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  description: string;
  accent: string;
  visual: 'matrix' | 'sequences' | 'functions' | 'limits' | 'derivatives' | 'integrals' | 'dynamics' | 'exams';
}

const modules: ModuleConfig[] = [
  { id: ModuleType.MATRIX, title: 'Matrix', subtitle: 'Linear algebra', icon: Grid3X3, description: 'Explore systems, determinants and the geometry of vectors.', accent: '#69e6dc', visual: 'matrix' },
  { id: ModuleType.SEQUENCES, title: 'Sequences', subtitle: 'Discrete mathematics', icon: TrendingUp, description: 'Find structure in convergence, patterns and infinite series.', accent: '#b5a0ff', visual: 'sequences' },
  { id: ModuleType.FUNCTIONS, title: 'Functions', subtitle: 'Mathematical analysis', icon: Activity, description: 'Investigate curves, transformations and changing quantities.', accent: '#ef9fbe', visual: 'functions' },
  { id: ModuleType.LIMITS, title: 'Limits', subtitle: 'Foundations', icon: InfinityIcon, description: 'Reason about continuity, boundaries and local behavior.', accent: '#e7be84', visual: 'limits' },
  { id: ModuleType.DERIVATIVES, title: 'Derivatives', subtitle: 'Calculus I', icon: Divide, description: 'Understand rates of change, tangents and optimization.', accent: '#7bc9ed', visual: 'derivatives' },
  { id: ModuleType.INTEGRALS, title: 'Integrals', subtitle: 'Calculus II', icon: AreaChart, description: 'See how small contributions become areas and totals.', accent: '#83d5b2', visual: 'integrals' },
  { id: ModuleType.DIFF_EQ, title: 'Differential equations', subtitle: 'Mathematical modeling', icon: Layers, description: 'Model growth, decay and dynamics in living systems.', accent: '#c1a5f8', visual: 'dynamics' },
  { id: ModuleType.EXAMS, title: 'Exams', subtitle: 'Practice & assessment', icon: GraduationCap, description: 'Consolidate your understanding with guided practice.', accent: '#e1d3bc', visual: 'exams' },
];

const visualGrid = [30, 60, 90, 120, 150, 180, 210, 240];

const ModuleSketch: React.FC<{ visual: ModuleConfig['visual'] }> = ({ visual }) => (
  <svg className="lab-module-sketch" viewBox="0 0 280 128" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeOpacity=".11" strokeWidth=".7">
      {visualGrid.map((x) => <line key={'v' + x} x1={x} x2={x} y1="0" y2="128" />)}
      {[26, 52, 78, 104].map((y) => <line key={'h' + y} x1="0" x2="280" y1={y} y2={y} />)}
    </g>
    {visual === 'matrix' && (
      <g transform="translate(92 11)">
        {Array.from({ length: 4 }, (_, row) => Array.from({ length: 5 }, (_, col) => (
          <rect key={row + '-' + col} x={col * 21} y={row * 24} width="15" height="17" rx="2.5"
            fill="currentColor" fillOpacity={row === col || (row + col) % 4 === 0 ? '.68' : '.10'}
            stroke="currentColor" strokeOpacity=".4" strokeWidth=".65" />
        )))}
        <path d="M-13 -1H-20V97H-13M117 -1H124V97H117" stroke="currentColor" strokeWidth="1.5" />
      </g>
    )}
    {visual === 'sequences' && (
      <g>
        <path d="M28 105H257" stroke="currentColor" strokeOpacity=".35" />
        {[91, 62, 78, 48, 57, 39, 45, 34, 39, 33].map((y, i) => (
          <g key={i}>
            <path d={'M' + (38 + i * 22) + ' 105V' + y} stroke="currentColor" strokeWidth="1" strokeOpacity=".38" strokeDasharray="3 4" />
            <circle cx={38 + i * 22} cy={y} r={i < 3 ? '4' : '3'} fill="currentColor" />
          </g>
        ))}
        <path d="M25 29H258" stroke="currentColor" strokeDasharray="3 6" strokeOpacity=".55"/>
      </g>
    )}
    {visual === 'functions' && (
      <g>
        <path d="M18 80H263M136 9V117" stroke="currentColor" strokeOpacity=".37" />
        <path d="M18 99C60 108 78 16 119 39S174 119 213 70S243 22 264 17" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="120" cy="39" r="4" fill="currentColor" />
        <circle cx="213" cy="70" r="4" fill="currentColor" />
      </g>
    )}
    {visual === 'limits' && (
      <g>
        <path d="M133 10V118M21 75H261" stroke="currentColor" strokeOpacity=".3" />
        <path d="M25 117C80 112 104 92 121 29M145 14C167 49 202 58 262 62" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
        <path d="M133 9V119M20 29H262" stroke="currentColor" strokeWidth="1.1" strokeDasharray="4 6" strokeOpacity=".5" />
        <circle cx="133" cy="29" r="5" stroke="currentColor" strokeWidth="2" fill="#0d1423" />
      </g>
    )}
    {visual === 'derivatives' && (
      <g>
        <path d="M20 108H260M34 16V116" stroke="currentColor" strokeOpacity=".3" />
        <path d="M33 104C71 110 103 95 133 70S196 13 255 21" stroke="currentColor" strokeWidth="2.9" strokeLinecap="round" />
        <path d="M77 121L213 10" stroke="currentColor" strokeWidth="1.7" strokeDasharray="6 5" strokeOpacity=".65" />
        <circle cx="146" cy="60" r="5" fill="currentColor" />
        <circle cx="146" cy="60" r="11" stroke="currentColor" strokeOpacity=".25" />
      </g>
    )}
    {visual === 'integrals' && (
      <g>
        <path d="M20 107H264M35 9V117" stroke="currentColor" strokeOpacity=".32" />
        <path d="M62 108V75C93 40 132 20 159 41S208 76 242 20V108Z" fill="currentColor" fillOpacity=".14" />
        {[72, 92, 112, 132, 152, 172, 192, 212, 232].map(x=><path key={x} d={'M'+x+' 48V107'} stroke="currentColor" strokeOpacity=".35" strokeDasharray="2 5"/>)}
        <path d="M35 108C75 61 124 23 159 41S208 76 242 20" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    )}
    {visual === 'dynamics' && (
      <g>
        <path d="M22 108H260M29 9V119" stroke="currentColor" strokeOpacity=".3" />
        <path d="M28 104C84 101 95 47 138 33S220 25 257 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M28 104C64 72 112 98 151 67S226 50 257 52" stroke="currentColor" strokeOpacity=".56" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M27 25H260" stroke="currentColor" strokeOpacity=".4" strokeDasharray="4 6" />
        <circle cx="138" cy="33" r="4.5" fill="currentColor" />
      </g>
    )}
    {visual === 'exams' && (
      <g transform="translate(139 64)">
        {[53, 37, 21].map((r) => <circle key={r} r={r} stroke="currentColor" strokeOpacity={r===53?'.25':'.6'} strokeWidth="1.3" strokeDasharray={r===53?'3 6':undefined}/>)}
        <path d="M-60 0H60M0 -60V60" stroke="currentColor" strokeOpacity=".25" />
        <path d="M-9 1L-1 9L16 -11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cy="-53" r="3.5" fill="currentColor" />
        <circle cx="53" r="3.5" fill="currentColor" />
      </g>
    )}
  </svg>
);

const helixNodes = Array.from({ length: 94 }, (_, index) => {
  const y = 27 + index * 4.72;
  const wave = Math.sin(index * Math.PI / 16);
  return { x1: 300 + 62 * wave, x2: 300 - 62 * wave, y, phase: index };
});

const strandPath = (key: 'x1' | 'x2') =>
  helixNodes.map((node, index) => (index === 0 ? 'M ' : 'L ') + node[key].toFixed(2) + ' ' + node.y.toFixed(2)).join(' ');

const ObservatoryVisual: React.FC = () => (
  <div className="lab-observatory" aria-label="Illustration of a DNA double helix within mathematical orbital diagrams">
    <div className="lab-observatory-top"><span className="lab-live-dot" /> STRUCTURE / SYSTEMS / LIFE <span>FIG. 01</span></div>
    <svg className="lab-observatory-svg" viewBox="0 0 620 500" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lab-helix-cyan" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#e1fbf6" /><stop offset=".46" stopColor="#63e2d4" /><stop offset="1" stopColor="#468cbc" />
        </linearGradient>
        <linearGradient id="lab-helix-violet" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#dbb8fe" /><stop offset=".55" stopColor="#9576d7" /><stop offset="1" stopColor="#5187ac" />
        </linearGradient>
        <radialGradient id="lab-aurora">
          <stop stopColor="#387c9e" stopOpacity=".23" /><stop offset="1" stopColor="#15263f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="303" cy="258" rx="244" ry="232" fill="url(#lab-aurora)"/>
      <g stroke="#b9d5e2" strokeOpacity=".10" strokeWidth=".9">
        {[80, 115, 150, 185, 220].map(r => <circle key={r} cx="300" cy="252" r={r}/>)}
        <path d="M300 14V487M66 252H536"/>
        <ellipse cx="300" cy="252" rx="250" ry="88" transform="rotate(-29 300 252)" strokeOpacity=".4" />
        <ellipse cx="300" cy="252" rx="250" ry="88" transform="rotate(29 300 252)" strokeOpacity=".35" />
        <path d="M53 78H133V36M467 457H554V408M58 419H110V460M475 44H552V101" />
      </g>
      <g stroke="#8fadb9" strokeOpacity=".2" strokeDasharray="2 7">
        <circle cx="300" cy="252" r="198" strokeWidth="1" />
        <path d="M80 100L526 400M84 399L520 102" />
      </g>
      {helixNodes.filter((_, index) => index % 4 === 0).map(node => (
        <line key={node.phase} x1={node.x1} x2={node.x2} y1={node.y} y2={node.y}
          stroke={node.phase % 8 === 0 ? '#b2b2f5' : '#86dbc9'} strokeWidth="1.6"
          strokeOpacity={Math.abs(node.x1 - node.x2) > 38 ? '.70' : '.22'} />
      ))}
      <path d={strandPath('x1')} stroke="url(#lab-helix-cyan)" strokeWidth="3.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={strandPath('x2')} stroke="url(#lab-helix-violet)" strokeWidth="3.7" strokeLinecap="round" strokeLinejoin="round"/>
      {helixNodes.filter((_, index) => index % 8 === 0).map(node => (
        <g key={'atom-'+node.phase}>
          <circle cx={node.x1} cy={node.y} r="4.2" fill="#9af4e6" />
          <circle cx={node.x2} cy={node.y} r="4.2" fill="#d2baff" />
        </g>
      ))}
      <g stroke="#8fcecf" strokeWidth="1" strokeOpacity=".65">
        <path d="M104 374H210M104 374V277"/>
        <path d="M110 357C135 354 146 307 168 303S194 290 207 290" strokeWidth="2.3"/>
        <circle cx="168" cy="303" r="3.5" fill="#9cf4e7"/>
        <path d="M422 140H533M422 140V64" />
        <path d="M427 127C446 102 455 123 472 85S508 102 529 74" stroke="#c8b5ee" strokeWidth="2" />
        <path d="M437 92H533" strokeDasharray="3 6" strokeOpacity=".5"/>
      </g>
      <g fill="#b7d2df" fontSize="9.5" fontFamily="monospace" letterSpacing="2" opacity=".68">
        <text x="98" y="271">GROWTH / t</text>
        <text x="425" y="55">f(x) / CHANGE</text>
        <text x="74" y="114">01 / OBSERVE</text>
        <text x="445" y="398">02 / MODEL</text>
        <text x="300" y="15" textAnchor="middle">+ y</text>
        <text x="300" y="498" textAnchor="middle">- y</text>
      </g>
      <g stroke="#d2e9eb" strokeWidth="1.4">
        <circle cx="300" cy="33" r="5" fill="#091725" />
        <circle cx="523" cy="252" r="5" fill="#091725" />
        <circle cx="300" cy="471" r="5" fill="#091725" />
        <circle cx="78" cy="252" r="5" fill="#091725" />
      </g>
    </svg>
    <div className="lab-observatory-bottom">
      <span><Dna size={15} aria-hidden="true" /> THE OBSERVATION LAB</span>
      <span>MATHEMATICS × BIOLOGY <MoveUpRight size={14} aria-hidden="true" /></span>
    </div>
  </div>
);

interface LearningSearchProps {
  onNavigate: (destination: LearningDestinationRef) => void;
}

const LearningSearch: React.FC<LearningSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLearningDestinations(query), [query]);
  const showResults = query.trim().length > 0;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const selectResult = (destination: LearningDestination) => {
    setQuery('');
    onNavigate(destination);
  };

  return (
    <div className="lab-search-root">
      <label htmlFor="learning-search" className="sr-only">Search mathematics and biotechnology topics</label>
      <Search size={20} className="lab-search-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        id="learning-search"
        type="search"
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search Gaussian elimination, population growth, Taylor series..."
        className="lab-search-input"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showResults}
        aria-controls="learning-search-results"
      />
      <span className="lab-search-shortcut" aria-hidden="true"><Command size={12} /> /</span>
      {showResults && (
        <div id="learning-search-results" className="lab-search-results" role="listbox">
          {results.length > 0 ? results.map(result => (
            <button
              key={result.module + '-' + result.view}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => selectResult(result)}
              className="lab-search-result"
            >
              <span><strong>{result.title}</strong><small>{result.description}</small></span>
              <em>{result.moduleTitle}</em>
            </button>
          )) : (
            <div className="lab-search-empty">
              <strong>No matching learning topic</strong>
              <span>Try a concept, method or biological application.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface DashboardProps {
  onSelectModule: (module: ModuleType) => void;
  onNavigate: (destination: LearningDestinationRef) => void;
  lastDestination: LearningDestinationRef | null;
}

export const DashboardView: React.FC<DashboardProps> = ({ onSelectModule, onNavigate, lastDestination }) => {
  const resumeDestination = getLearningDestination(lastDestination);

  return (
    <main className="lab-home">
      <div className="lab-home-atmosphere" aria-hidden="true" />
      <div className="lab-home-inner">
        <div className="lab-topbar">
          <div className="lab-wordmark"><span className="lab-wordmark-symbol"><Dna size={22} strokeWidth={1.7} aria-hidden="true" /></span><span>{BRAND_NAME}<small>THE LEARNING LAB</small></span></div>
          <div className="lab-topbar-right"><span className="lab-live-dot" /> INTERACTIVE KNOWLEDGE SPACE <span className="lab-topbar-divider" /> VOL. 01</div>
        </div>

        <section className="lab-hero" aria-labelledby="lab-title">
          <div className="lab-hero-copy">
            <div className="lab-kicker"><span className="lab-kicker-line" /> {BRAND_TAGLINE} <span className="lab-kicker-index">/ 001</span></div>
            <h1 id="lab-title" className="lab-title">Study the <em>patterns</em><br />that shape life<span className="lab-title-dot">.</span></h1>
            <p className="lab-description">{BRAND_DESCRIPTION} A place to turn complex ideas into something you can explore, visualize and understand.</p>
            <div className="lab-hero-actions">
              <a href="#lab-modules" className="lab-primary-cta">Explore the lab <ArrowRight size={18} aria-hidden="true" /></a>
              <button type="button" className="lab-secondary-cta" onClick={() => onSelectModule(ModuleType.MATRIX)}>Start with matrices <MoveUpRight size={17} aria-hidden="true" /></button>
            </div>
            <div className="lab-hero-meta">
              <span><Atom size={17} aria-hidden="true" /> SCIENTIFIC CURIOSITY</span>
              <span><Activity size={17} aria-hidden="true" /> MATHEMATICAL THINKING</span>
            </div>
          </div>
          <ObservatoryVisual />
        </section>

        <section className="lab-tools" aria-label="Search and resume learning">
          <div className="lab-tools-search">
            <div className="lab-tool-caption">FIND A CONCEPT <span>→</span> EXPLORE A SYSTEM</div>
            <LearningSearch onNavigate={onNavigate} />
          </div>
          <div className="lab-tools-resume">
            <div className="lab-tool-caption">YOUR WORKSPACE <span>/</span> PICK UP A THREAD</div>
            {resumeDestination ? (
              <button type="button" className="lab-resume-button" onClick={() => onNavigate(resumeDestination)}>
                <span className="lab-resume-icon"><Play size={17} fill="currentColor" aria-hidden="true" /></span>
                <span className="lab-resume-copy"><small>CONTINUE LEARNING</small><strong>{resumeDestination.title}</strong><em>{resumeDestination.moduleTitle}</em></span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <div className="lab-resume-empty"><span className="lab-resume-icon"><Dna size={18} aria-hidden="true" /></span><span><strong>Your next discovery starts here.</strong><small>Opened topics will be saved for your next visit.</small></span></div>
            )}
          </div>
        </section>

        <section id="lab-modules" className="lab-catalogue" aria-labelledby="lab-modules-title">
          <div className="lab-catalogue-heading">
            <div><p className="lab-section-eyebrow">THE LEARNING COLLECTION <span>— 01</span></p><h2 id="lab-modules-title">Explore the disciplines<span>.</span></h2><p>Eight pathways to investigate, experiment and build understanding.</p></div>
            <div className="lab-collection-index"><strong>08</strong><span>CURATED<br/>MODULES</span></div>
          </div>
          <div className="lab-module-grid">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  type="button"
                  className="lab-module-card"
                  style={{ '--lab-accent': module.accent } as React.CSSProperties}
                  onClick={() => onSelectModule(module.id)}
                  aria-label={'Open ' + module.title + ' module'}
                >
                  <div className="lab-module-card-top"><span className="lab-module-index">{String(index + 1).padStart(2, '0')} / 08</span><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></div>
                  <div className="lab-module-art"><ModuleSketch visual={module.visual} /></div>
                  <div className="lab-module-info">
                    <p>{module.subtitle}</p><h3>{module.title}</h3><span className="lab-module-desc">{module.description}</span>
                  </div>
                  <div className="lab-module-footer"><span>ENTER MODULE</span><span className="lab-module-arrow"><ArrowRight size={17} aria-hidden="true" /></span></div>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="lab-home-footer"><span><span className="lab-live-dot" /> INMERSON RESEARCH SPACE</span><span>OBSERVE CAREFULLY · MODEL THOUGHTFULLY · LEARN DEEPLY</span><span>© {new Date().getFullYear()} INMERSON</span></footer>
      </div>
    </main>
  );
};
