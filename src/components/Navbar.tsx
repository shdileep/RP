import { useState, useEffect } from "react";
import { Cpu, Terminal, Sparkles, Menu, X, Layers } from "lucide-react";
import { TerminalTheme } from "../types";
import { TERMINAL_THEMES } from "../data";

interface NavbarProps {
  terminalMode: boolean;
  setTerminalMode: (val: boolean) => void;
  circuitMode: boolean;
  setCircuitMode: (val: boolean) => void;
  selectedTheme: TerminalTheme;
  setSelectedTheme: (theme: TerminalTheme) => void;
}

export default function Navbar({ 
  terminalMode, 
  setTerminalMode, 
  circuitMode, 
  setCircuitMode,
  selectedTheme,
  setSelectedTheme
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "tools", label: "Tools" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Detect active section based on proximity
      const scrollPos = window.scrollY + 120;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.offsetTop - 85;
      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? terminalMode 
          ? "bg-black/90 border-b border-brand-lime/20 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.8)]" 
          : "bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-900/80 py-2.5 shadow-lg"
        : "bg-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Profile logo badge */}
        <button 
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className={`p-1.5 rounded-lg border ${
            terminalMode 
              ? "bg-brand-lime/10 border-brand-lime text-brand-lime shadow-lime-glow" 
              : "bg-slate-900 border-slate-800 text-brand-cyan group-hover:border-brand-cyan group-hover:shadow-cyan-glow"
          } transition-all duration-300`}>
            {terminalMode ? <Terminal className="w-5 h-5 animate-pulse" style={{ color: selectedTheme.accent }} /> : <Cpu className="w-5 h-5" />}
          </div>
          <div>
            <span className={`block text-xs font-mono uppercase tracking-widest font-black ${
              terminalMode ? "text-brand-lime text-glow-lime" : "text-white"
            }`}>
              r.galla
            </span>
            <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">
              firmware v4.2
            </span>
          </div>
        </button>

        {/* Center Desktop items */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950/40 p-1 rounded-full border border-slate-900">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                  isActive
                    ? terminalMode
                      ? "bg-brand-lime text-black font-extrabold shadow-sm shadow-lime-glow"
                      : "bg-brand-cyan text-black font-extrabold shadow-cyan-glow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Side Options & Toggle Switches */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Dropdown, only visible in Terminal Mode */}
          {terminalMode && (
            <div className="relative flex items-center gap-1 animate-fade-in">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest hidden xl:inline">
                CRT THEME:
              </span>
              <select
                value={selectedTheme.id}
                onChange={(e) => {
                  const found = TERMINAL_THEMES.find(t => t.id === e.target.value);
                  if (found) setSelectedTheme(found);
                }}
                className="bg-black text-[10px] font-mono border border-brand-lime px-2 py-1 rounded cursor-pointer outline-none focus:ring-1 focus:ring-brand-lime text-brand-lime hover:bg-brand-lime/10 transition-colors pr-6 appearance-none relative"
                style={{
                  color: selectedTheme.accent,
                  borderColor: selectedTheme.accent,
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(selectedTheme.accent)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 6px center',
                  backgroundSize: '10px'
                }}
              >
                {TERMINAL_THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id} className="bg-slate-950 text-slate-100 font-mono">
                    [{theme.nameCode}] {theme.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Circuit background switch */}
          <button
            onClick={() => setCircuitMode(!circuitMode)}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1.5 transition-all duration-300 ${
              circuitMode
                ? terminalMode
                  ? "border-brand-lime text-brand-lime bg-brand-lime/10 shadow-lime-glow"
                  : "border-brand-purple text-brand-purple bg-brand-purple/10 shadow-purple-glow"
                : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
            }`}
            title="Toggle Animated Circuit Traces background"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PCB TRACES</span>
            <div className={`w-1.5 h-1.5 rounded-full ${circuitMode ? "bg-brand-lime animate-ping" : "bg-slate-700"}`} />
          </button>

          {/* Terminal Mode Switch */}
          <button
            onClick={() => setTerminalMode(!terminalMode)}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1.5 transition-all duration-300 ${
              terminalMode
                ? "border-brand-lime text-brand-lime bg-brand-lime/15 shadow-lime-glow"
                : "border-slate-800 text-slate-300 hover:border-brand-cyan hover:text-white"
            }`}
            title="Toggle retro console shell aesthetics"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>TERMINAL MODE</span>
            <div className={`w-1.5 h-1.5 rounded-full ${terminalMode ? "bg-amber-400 animate-pulse" : "bg-slate-700"}`} />
          </button>
        </div>

        {/* Mobile controls & hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Quick Terminal toggle on mobile */}
          <button
            onClick={() => setTerminalMode(!terminalMode)}
            className={`p-2 rounded-lg border ${
              terminalMode ? "border-brand-lime text-brand-lime shadow-lime-glow" : "border-slate-800 text-slate-300"
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border ${
              terminalMode ? "border-brand-lime text-brand-lime shadow-lime-glow" : "border-slate-800 text-slate-300"
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-4 pt-3 pb-5 space-y-3.5 border-b animate-fade-in ${
          terminalMode ? "bg-black border-brand-lime/20 text-brand-lime" : "bg-[#121826] border-slate-900"
        }`}>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800/60 text-center">
            <button
              onClick={() => {
                setCircuitMode(!circuitMode);
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-md border text-[10px] font-mono flex items-center justify-center gap-2 ${
                circuitMode ? "border-brand-purple text-brand-purple" : "border-slate-800 text-slate-400"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>PCB {circuitMode ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => {
                setTerminalMode(!terminalMode);
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-md border text-[10px] font-mono flex items-center justify-center gap-2 ${
                terminalMode ? "border-brand-lime text-brand-lime shadow-lime-glow" : "border-slate-800 text-slate-400"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SHELL {terminalMode ? "ON" : "OFF"}</span>
            </button>
          </div>

          {/* Core Theme Options for terminal mode on mobile */}
          {terminalMode && (
            <div className="py-2.5 px-3 rounded-lg bg-slate-950/90 border border-brand-lime/15 space-y-1.5">
              <span className="block text-[8px] font-mono text-slate-500 tracking-wider uppercase font-extrabold">
                Select CRT Terminal Preset (12 Presets):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {TERMINAL_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTheme(t);
                    }}
                    style={{ 
                      color: selectedTheme.id === t.id ? '#000000' : t.accent,
                      borderColor: t.accent,
                      backgroundColor: selectedTheme.id === t.id ? t.accent : 'transparent'
                    }}
                    className="p-1 rounded text-[9px] font-mono border truncate font-bold text-left flex items-center justify-between transition-all"
                  >
                    <span>{t.nameCode}</span>
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: selectedTheme.id === t.id ? '#000000' : t.accent }} 
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? terminalMode
                        ? "bg-brand-lime/15 text-brand-lime border-l-4 border-brand-lime pl-2 font-bold shadow-sm"
                        : "bg-brand-cyan/10 text-white border-l-4 border-brand-cyan pl-2 font-bold"
                      : "text-slate-400 hover:bg-slate-900/40"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
