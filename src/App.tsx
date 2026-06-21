import { useState, useEffect, FormEvent } from "react";
import { 
  Laptop, Cpu, Terminal, Radio, ShieldAlert, Award, ChevronDown, 
  Send, Sparkles, Download, ArrowRight, MessageSquare, Briefcase, 
  CheckCircle, Hammer, Code, ShieldCheck, GraduationCap
} from "lucide-react";

import Navbar from "./components/Navbar";
import SidebarPanel from "./components/SidebarPanel";
import KernelTerminal from "./components/KernelTerminal";
import RadarSkills from "./components/RadarSkills";
import HardwareLogicStudio from "./components/HardwareLogicStudio";
import ProjectsSection from "./components/ProjectsSection";
import CircuitBackground from "./components/CircuitBackground";
import chipSchematicImage from "./assets/images/embedded_chip_schematic_1779954502893.png";

import { PERSONAL_INFO, EXPERIENCES, TECHNICAL_TOOLS, EDUCATION, TERMINAL_THEMES } from "./data";

export default function App() {
  const [terminalMode, setTerminalMode] = useState(false);
  const [circuitMode, setCircuitMode] = useState(true);
  const [selectedTermTheme, setSelectedTermTheme] = useState(TERMINAL_THEMES[0]);

  // Sync selected term theme attributes to document custom CSS properties
  useEffect(() => {
    if (terminalMode) {
      document.documentElement.style.setProperty('--terminal-accent', selectedTermTheme.accent);
      document.documentElement.style.setProperty('--terminal-accent-muted', selectedTermTheme.accentMuted);
      document.documentElement.style.setProperty('--terminal-bg', selectedTermTheme.bg);
      document.documentElement.style.setProperty('--terminal-glow', selectedTermTheme.glowColor);
    } else {
      document.documentElement.style.removeProperty('--terminal-accent');
      document.documentElement.style.removeProperty('--terminal-accent-muted');
      document.documentElement.style.removeProperty('--terminal-bg');
      document.documentElement.style.removeProperty('--terminal-glow');
    }
  }, [terminalMode, selectedTermTheme]);

  // Typing effect hook configuration
  const typingWords = [
    "Embedded C & Firmware",
    "Embedded Linux Kernel",
    "Linux Device Drivers",
    "Platform Drivers & DTS",
    "Bootloaders & FOTA Updates",
    "UART & I²C bus protocols",
    "DLMS/COSEM Smart Metering",
    "Low-Level Debugging & dmesg"
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = typingWords[wordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        setTypingSpeed(40);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && !currentText) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % typingWords.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  // Serial contact form interactive states
  const [contactForm, setContactForm] = useState({ name: "", email: "", msg: "" });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; msg?: string }>({});
  const [txLogs, setTxLogs] = useState<string[]>([]);
  const [isTxing, setIsTxing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const handleSendSerial = async (e: FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; email?: string; msg?: string } = {};

    if (!contactForm.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!contactForm.msg.trim()) {
      errors.msg = "Message is required";
    }

    // Strict email format validation: must contain @, domain name, and extension (e.g. gmail.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(contactForm.email.trim())) {
      errors.email = "Provide a valid email (e.g. user@gmail.com)";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTxSuccess(false);
      return;
    }

    // Clear previous errors if check passes
    setFieldErrors({});
    setIsTxing(true);
    setTxSuccess(false);
    setTxLogs([
      "Initializing connection to uplink gateway...",
      "Formatting mail envelope configuration parameters...",
      `Binding message meta payload: { sender: '${contactForm.name}' }`
    ]);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      await delay(700);
      setTxLogs(prev => [...prev, "Routing packet stream safely to Web3Forms API gateway..."]);
      
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        await delay(800);
        setTxLogs(prev => [
          ...prev,
          "WARNING: No active VITE_WEB3FORMS_ACCESS_KEY found in environment variables.",
          "SIMULATION MODE: Simulating email delivery...",
        ]);
        await delay(1000);
        setTxLogs(prev => [...prev, "SUCCESS: Simulated delivery complete. Set VITE_WEB3FORMS_ACCESS_KEY for real delivery."]);
        setIsTxing(false);
        setTxSuccess(true);
        setContactForm({ name: "", email: "", msg: "" });
        return;
      }

      await delay(500);
      setTxLogs(prev => [...prev, "Transmitting data packets..."]);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.msg,
          from_name: "Revathi Galla Portfolio"
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setTxLogs(prev => [...prev, "SUCCESS: Delivery complete! Message successfully routed to Revathi's inbox."]);
        setTxSuccess(true);
        setContactForm({ name: "", email: "", msg: "" });
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (err: any) {
      setTxLogs(prev => [
        ...prev,
        `ERROR: Transmission failed! ${err.message || err}`,
        "Please check your network connection or API configuration."
      ]);
      setTxSuccess(false);
    } finally {
      setIsTxing(false);
    }
  };

  // Download simulation state
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0);

  const triggerDownloadSimulation = () => {
    setDownloadStep(1);
    setIsDownloading(true);
    let step = 1;
    const interval = setInterval(() => {
      step += 1;
      setDownloadStep(step);
      if (step > 4) {
        clearInterval(interval);
        setIsDownloading(false);
        // Prompt physical browser file save
        const resumeUrl = "https://raw.githubusercontent.com/revathigalla189/embedded-portfolio/main/Revathi_Galla_Resume.pdf";
        const link = document.createElement("a");
        link.href = "#";
        // Create actual download placeholder blob text mirroring Galla's background to make it perfectly real
        const textBlobContents = `REVATHI GALLA - Embedded Software Engineer Resume\n\nContact:\nEmail: ${PERSONAL_INFO.email}\nPhone: ${PERSONAL_INFO.phone}\nLocation: Hyderabad, Telangana\n\nEducation:\nB.Tech - ECE, RGUKT Nuzvid (AP) | GPA: 8.0\n\nExperience:\nMirafra Software Technologies | Embedded Software Engineer II | Apr 2026 - Present\nLinkwell Telsystems Pvt Ltd | Embedded Firmware Engineer | Jun 2023 - Apr 2026\n\nSee full online interactive layout at applet link.`;
        const blob = new Blob([textBlobContents], { type: "text/plain" });
        link.href = URL.createObjectURL(blob);
        link.download = "Revathi_Galla_Embedded_Resume.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 850);
  };

  return (
    <div 
      style={{ backgroundColor: terminalMode ? selectedTermTheme.bg : undefined }}
      className={`min-h-screen relative overflow-hidden transition-all duration-500 font-sans ${
        terminalMode 
          ? "text-brand-lime selection:bg-brand-lime/30 selection:text-black font-mono" 
          : "bg-[#0B0F19] text-[#F8FAFC]"
      }`}
    >
      
      {/* 1. PCB Circuit Active Background Nodes */}
      {circuitMode && <CircuitBackground />}

      {/* Decorative cyber grid overlay */}
      <div className="absolute inset-0 hex-grid opacity-15 pointer-events-none z-0" />

      {/* Top Floating Glass Header */}
      <Navbar 
        terminalMode={terminalMode} 
        setTerminalMode={setTerminalMode} 
        circuitMode={circuitMode} 
        setCircuitMode={setCircuitMode} 
        selectedTheme={selectedTermTheme}
        setSelectedTheme={setSelectedTermTheme}
      />

      {/* Primary Container Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16 relative z-10">
        
        {/* Responsive dual split panels grid: Col-12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT SIDE CONTENT PANEL (lg:col-span-8) - Core Scrolling Layout */}
          {/* ========================================================= */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* 1. HERO SECTION */}
            <section id="home" className="pt-8 space-y-7 relative">
              {/* Glowing hardware logic element */}
              <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-brand-cyan/10 blur-3xl pointer-events-none" />
              
              <div className="space-y-3.5">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-widest uppercase ${
                  terminalMode 
                    ? "border-[#8FFF00]/40 bg-[#8FFF00]/5 text-[#8FFF00]" 
                    : "border-slate-800 bg-[#121826]/60 text-brand-cyan shadow-sm"
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
                  </span>
                  UPLINK: ACTIVE FIRMWARE DEVELOPMENT CORES
                </div>

                <p className={`text-sm font-mono tracking-widest ${
                  terminalMode ? "text-[#8FFF00]" : "text-slate-400"
                }`}>
                  Hello, I’m
                </p>

                <h1 className={`text-4xl sm:text-6xl font-black font-display tracking-tight leading-none ${
                  terminalMode ? "text-[#8FFF00] font-mono" : "text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400"
                }`}>
                  {PERSONAL_INFO.name.toUpperCase()}
                </h1>

                {/* Subtitle / Animated Typing Node */}
                <div className="space-y-1">
                  <h3 className={`text-lg sm:text-2xl font-bold ${
                    terminalMode ? "text-[#8FFF00]" : "text-brand-cyan"
                  } font-mono flex items-center gap-2`}>
                    <Cpu className="w-5.5 h-5.5 animate-spin-slow" />
                    {PERSONAL_INFO.title}
                  </h3>
                  
                  {/* Rotating software features */}
                  <div className="h-6 flex items-center font-mono">
                    <span className={`text-xs sm:text-sm font-medium ${
                      terminalMode ? "text-slate-300" : "text-slate-400"
                    }`}>
                      $ cat /sys/class/skills/active
                      <span className={`ml-2 px-1.5 py-0.5 rounded font-mono font-semibold ${
                        terminalMode 
                          ? "text-[#8FFF00] bg-black" 
                          : "bg-slate-950 text-brand-cyan border border-slate-900/40"
                      }`}>
                        {currentText}
                      </span>
                      <span className="animate-pulse font-extrabold text-brand-cyan">|</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Brief intro pitch */}
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
                {PERSONAL_INFO.summary}
              </p>

              {/* Action Buttons & Resume simulation controller */}
              <div className="flex flex-wrap gap-3 items-center pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("projects");
                    if (el) window.scrollTo({ top: el.offsetTop - 85, behavior: "smooth" });
                  }}
                  className={`px-4.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                    terminalMode
                      ? "bg-[#8FFF00] text-black border border-[#8FFF00] hover:bg-transparent hover:text-[#8FFF00]"
                      : "bg-gradient-to-r from-brand-cyan to-brand-purple text-black hover:scale-105 active:scale-95 shadow-cyan-glow"
                  }`}
                >
                  View Live Projects
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={triggerDownloadSimulation}
                  disabled={isDownloading}
                  className={`px-4.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all duration-300 ${
                    isDownloading
                      ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                      : terminalMode
                        ? "border-[#8FFF00]/40 text-[#8FFF00] hover:bg-[#8FFF00]/15"
                        : "border-slate-800 text-slate-300 hover:border-brand-cyan hover:text-white"
                  }`}
                >
                  <Download className={`w-4 h-4 ${isDownloading && "animate-bounce"}`} />
                  <span>
                    {isDownloading 
                      ? `FLASHING: ${downloadStep * 25}%` 
                      : "Download Resume"}
                  </span>
                </button>
              </div>

              {/* Simulated terminal file writing overlay display */}
              {isDownloading && (
                <div className="animate-fade-in p-3 rounded-lg bg-black border border-slate-800 max-w-md font-mono text-[9px]">
                  <p className="text-amber-400"># initiating direct flash memory transfer...</p>
                  <p className="text-slate-500">Connecting endpoint target: Hyderabad_lab01.bin</p>
                  <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden mt-1 text-slate-700">
                    <div 
                      className="bg-brand-cyan h-full transition-all duration-300"
                      style={{ width: `${downloadStep * 25}%` }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* 2. ABOUT PROFESSIONAL SUMMARY SECTION */}
            <section id="about" className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-brand-cyan font-black">01.</span>
                <h2 className={`text-xl font-bold font-display tracking-tight text-white uppercase ${
                  terminalMode && "font-mono text-[#8FFF00]"
                }`}>
                  CORE PLATFORM METRICS
                </h2>
                <div className="h-[1.5px] bg-slate-800 flex-grow" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  <p>
                    As an Embedded Software Engineer specializing in low-level firmware and Embedded Linux environments, I bridge physical hardware signals with operational kernel structures. My core work spans developing custom Linux device drivers, configuring Device Trees (DTS) on ARM-based hardware like the Raspberry Pi 4, and fabricating smart telemetric architectures complying with strict industry standards.
                  </p>
                  <p>
                    With specialized domain expertise in smart metering, I construct reliable DLMS/COSEM protocol telemetry frameworks on ARM Cortex-M0+ microcontrollers. I focus on safe firmware upgrade paths (FOTA), hardware bus optimization (UART, I²C), and low-level diagnostic probes utilizing printk trace pipelines, dmesg, and logical signal analyzers under MISRA-C guidelines.
                  </p>
                </div>

                {/* Grid holding Hexagon-style microchip stat metrics summary */}
                <div className="md:col-span-5 grid grid-cols-2 gap-3.5">
                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:scale-102 ${
                    terminalMode 
                      ? "bg-black border-[#8FFF00]/20" 
                      : "bg-[#121826]/75 border-slate-800 hover:border-brand-cyan/40"
                  }`}>
                    <span className="absolute bottom-2 right-2 text-slate-900 font-mono text-3xl select-none font-bold">XP</span>
                    <h4 className="text-2xl font-mono text-brand-cyan font-black">3+ yrs</h4>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">Professional Experience</p>
                  </div>

                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:scale-102 ${
                    terminalMode 
                      ? "bg-black border-[#8FFF00]/20" 
                      : "bg-[#121826]/75 border-slate-800 hover:border-brand-purple/40"
                  }`}>
                    <span className="absolute bottom-2 right-2 text-slate-900 font-mono text-3xl select-none font-bold">DRV</span>
                    <h4 className="text-2xl font-mono text-brand-purple font-black">LTS</h4>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">Linux Kernel Driver Core</p>
                  </div>

                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:scale-102 ${
                    terminalMode 
                      ? "bg-black border-[#8FFF00]/20" 
                      : "bg-[#121826]/75 border-slate-800 hover:border-brand-lime/40"
                  }`}>
                    <span className="absolute bottom-2 right-2 text-slate-900 font-mono text-3xl select-none font-bold">MCU</span>
                    <h4 className="text-2xl font-mono text-brand-lime font-black">ARM</h4>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">Cortex Embedded Core</p>
                  </div>

                  <div className={`p-4 rounded-xl border relative overflow-hidden transition-all hover:scale-102 ${
                    terminalMode 
                      ? "bg-black border-[#8FFF00]/20" 
                      : "bg-[#121826]/75 border-slate-800 hover:border-brand-cyan/40"
                  }`}>
                    <span className="absolute bottom-2 right-2 text-slate-900 font-mono text-3xl select-none font-bold">COSEM</span>
                    <h4 className="text-2xl font-mono text-white font-black">DLMS</h4>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">Energy Smart Meter Standard</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. WORK EXPERIENCE SECTION */}
            <section id="experience" className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-brand-cyan font-black">02.</span>
                <h2 className={`text-xl font-bold font-display tracking-tight text-white uppercase ${
                  terminalMode && "font-mono text-[#8FFF00]"
                }`}>
                  FIRMWARE WORKSTATION LOGS
                </h2>
                <div className="h-[1.5px] bg-slate-800 flex-grow" />
              </div>

              {/* Vertical timeline containing career developments */}
              <div className="relative border-l-2 border-slate-850 pl-5 md:pl-8 ml-3 md:ml-4 space-y-12">
                {EXPERIENCES.map((exp, idx) => {
                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline structural signal light pin */}
                      <span className={`absolute -left-[30px] md:-left-[42px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0B0F19] border ${
                        terminalMode 
                          ? "border-[#8FFF00]/70 text-[#8FFF00]" 
                          : idx === 0 ? "border-brand-cyan text-brand-cyan" : "border-brand-purple text-brand-purple"
                      } font-mono text-[9px] font-bold shadow-md`}>
                        {idx + 1}
                      </span>

                      <div className="space-y-3">
                        {/* Title block */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
                          <div>
                            <span className={`text-[10px] font-mono tracking-widest uppercase block ${
                              idx === 0 ? "text-brand-cyan" : "text-brand-purple"
                            }`}>
                              {exp.period}
                            </span>
                            <h3 className={`text-lg font-bold font-display ${
                              terminalMode ? "text-[#8FFF00] font-mono" : "text-slate-100"
                            }`}>
                              {exp.role}
                            </h3>
                            <p className="text-xs text-slate-400 font-mono">
                              {exp.company} • {exp.location}
                            </p>
                          </div>
                        </div>

                        {/* Bullet achievements list parsed from PDF */}
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-400 list-none font-sans">
                          {exp.bullets.map((bullet, bi) => (
                            <li key={bi} className="flex items-start gap-2.5 leading-relaxed">
                              <span className={`font-mono text-[10px] font-bold mt-1 shrink-0 ${
                                terminalMode ? "text-[#8FFF00]" : "text-brand-lime"
                              }`}>
                                [✓]
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Specific drivers tags applied */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {exp.tech.map((chip, ci) => (
                            <span key={ci} className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                              terminalMode 
                                ? "bg-black border border-[#8FFF00]/20 text-[#8FFF00]" 
                                : "bg-slate-900 text-slate-300 border border-slate-850/60"
                            }`}>
                              {chip}
                            </span>
                          ))}
                        </div>

                        {/* Integrated inline terminal boots panel for individual experiences */}
                        <div className={`p-4 rounded-xl border ${
                          terminalMode 
                            ? "bg-black border-[#8FFF00]/20 text-[#8FFF00]" 
                            : "bg-slate-950/40 border-slate-900"
                        } font-mono text-[10px] space-y-1`}>
                          <div className="text-[8px] uppercase text-slate-500 font-black flex items-center gap-1 mb-2">
                            <Terminal className="w-3.5 h-3.5 text-brand-purple" /> Simulated debugging trace - {exp.company.split(" ")[0]}
                          </div>
                          {exp.terminalLogs.map((logLine, lIdx) => (
                            <div key={lIdx} className={logLine.startsWith("$") ? "text-slate-300 font-semibold" : "text-slate-500"}>
                              {logLine}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. SKILLS & INTERACTIVE RADAR UI SECTION */}
            <section id="skills" className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-brand-cyan font-black">03.</span>
                <h2 className={`text-xl font-bold font-display tracking-tight text-white uppercase ${
                  terminalMode && "font-mono text-[#8FFF00]"
                }`}>
                  INTERACTIVE HARDWARE SIMULATION & TELEMETRY
                </h2>
                <div className="h-[1.5px] bg-slate-800 flex-grow" />
              </div>

              {/* Hardware logic simulation & signal decoding analyzer */}
              <HardwareLogicStudio terminalMode={terminalMode} />

              {/* Mini radar skills controller */}
              <RadarSkills terminalMode={terminalMode} />
            </section>

            {/* 5. PROJECTS SECTION */}
            <section id="projects" className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-brand-cyan font-black">04.</span>
                <h2 className={`text-xl font-bold font-display tracking-tight text-white uppercase ${
                  terminalMode && "font-mono text-[#8FFF00]"
                }`}>
                  HARDWARE ARCHITECTURES & SOURCE FILE DUMPS
                </h2>
                <div className="h-[1.5px] bg-slate-800 flex-grow" />
              </div>

              {/* Grid lists with inspect-overlay support */}
              <ProjectsSection terminalMode={terminalMode} />
            </section>

            {/* 6. TECHNICAL TOOLS LIST SECTION */}
            <section id="tools" className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-brand-cyan font-black">05.</span>
                <h2 className={`text-xl font-bold font-display tracking-tight text-white uppercase ${
                  terminalMode && "font-mono text-[#8FFF00]"
                }`}>
                  PROBING EMULATION TOOLS & SOFTWARE IDEs
                </h2>
                <div className="h-[1.5px] bg-slate-800 flex-grow" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {TECHNICAL_TOOLS.map((tool, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      terminalMode
                        ? "bg-black border-[#8FFF00]/20 text-[#8FFF00] hover:border-[#8FFF00]"
                        : "bg-[#121826]/75 border-slate-800 hover:border-brand-purple/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${
                        terminalMode ? "text-[#8FFF00]/80" : "text-brand-purple"
                      }`}>
                        {tool.category}
                      </span>
                      <Hammer className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <h4 className={`text-sm font-bold font-sans mt-1.5 ${
                      terminalMode ? "text-slate-100 font-mono" : "text-white"
                    }`}>
                      {tool.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-serif leading-relaxed mt-1">
                      {tool.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. ACADEMIC ROOT / EDUCATION BACKGROUND */}
            <section id="education" className="space-y-8 pt-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-brand-cyan font-black">06.</span>
                <h2 className={`text-xl font-bold font-display tracking-tight text-white uppercase ${
                  terminalMode ? "font-mono text-brand-lime text-glow-lime" : ""
                }`}>
                  CORE ACADEMIC RETRIEVAL PIPELINE
                </h2>
                <div className="h-[1.5px] bg-slate-800/85 flex-grow" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
                  SECURE_ROM_MAP_v3.2
                </span>
              </div>

              {/* Advanced Interactive Academic Timeline Map */}
              <div className="relative pl-6 sm:pl-10 space-y-8">
                {/* Embedded PCB Pipeline Tracking Line */}
                <div className={`absolute left-[11px] sm:left-[19px] top-6 bottom-6 w-[1.5px] ${
                  terminalMode
                    ? "bg-gradient-to-b from-brand-lime via-brand-lime/40 to-brand-lime/10"
                    : "bg-gradient-to-b from-brand-cyan via-brand-purple to-slate-900"
                }`} />

                {EDUCATION.map((edu, idx) => (
                  <div key={idx} className="relative group/edu">
                    {/* Pipeline Tracking Node Indicator (Microchip pin representation) */}
                    <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 flex items-center justify-center">
                      <div className={`w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        terminalMode
                          ? "bg-black border-brand-lime group-hover/edu:scale-125 shadow-lime-glow"
                          : "bg-[#0B0F19] border-brand-cyan group-hover/edu:scale-125 group-hover/edu:border-brand-purple group-hover/edu:shadow-cyan-glow"
                      }`}>
                        <div className={`w-1.5 h-1.5 sm:w-2 h-2 rounded-full transition-all duration-300 ${
                          terminalMode ? "bg-brand-lime animate-pulse" : "bg-brand-cyan group-hover/edu:bg-brand-purple"
                        }`} />
                      </div>
                    </div>

                    {/* Timeline Data Card - Premium polished visual chassis */}
                    <div className={`p-5 sm:p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group/card ${
                      terminalMode
                        ? "bg-black border-brand-lime/25 text-brand-lime hover:border-brand-lime/50 shadow-lime-glow"
                        : "bg-[#111827]/85 border-slate-800/80 hover:border-brand-cyan/60 hover:bg-[#111827] shadow-xl hover:shadow-cyan-glow/10"
                    }`}>
                      {/* Academic Content Section with Perfectly Legible White Contrast typography */}
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-3.5 flex-grow">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl border shrink-0 transition-all duration-300 group-hover/card:scale-105 ${
                              terminalMode 
                                ? "border-brand-lime/40 text-brand-lime bg-brand-lime/10 shadow-lime-glow" 
                                : "border-brand-cyan/40 text-brand-cyan bg-brand-cyan/10 shadow-cyan-glow"
                            }`}>
                              <GraduationCap className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                              <h3 className={`text-base sm:text-xl font-black tracking-tight leading-snug text-white font-display ${
                                terminalMode ? "text-brand-lime font-mono text-glow-lime" : "text-white text-glow-cyan"
                              }`}>
                                {edu.degree}
                              </h3>
                              <div className="space-y-1.5">
                                <p className="text-xs sm:text-sm font-extrabold text-white font-mono flex flex-wrap items-center gap-1.5">
                                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">SPECIALIZATION:</span>
                                  <span className={`uppercase font-black ${
                                    terminalMode ? "text-brand-lime" : "text-brand-cyan font-bold"
                                  }`}>
                                    {edu.specialization}
                                  </span>
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-white flex flex-wrap items-center gap-1.5">
                                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">INSTITUTION:</span>
                                  <span className="font-extrabold text-white border-b border-slate-700 pb-0.5">{edu.institution}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Highly Visible Time Period Indicator Badge */}
                        <div className="shrink-0 flex items-center">
                          <div className={`px-4 py-2 w-full md:w-auto rounded-lg font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center md:justify-start gap-2 border ${
                            terminalMode
                              ? "bg-black border-brand-lime/30 text-brand-lime shadow-lime-glow"
                              : "bg-[#0b1329]/80 border-[#1e294b] text-white shadow-md shadow-brand-cyan/5"
                          }`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${
                              terminalMode ? "bg-brand-lime" : "bg-brand-cyan"
                            }`} />
                            <span className="text-slate-400 text-[10px] uppercase font-bold">CALENDAR_SPAN:</span>
                            <span className={`px-2 py-0.5 rounded font-extrabold ${
                              terminalMode ? "bg-brand-lime/15 text-brand-lime" : "bg-brand-cyan/15 text-[#00E5FF] font-black"
                            }`}>
                              {edu.period}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. KERNEL TERMINAL SECTION (THE OUTLET CONSOLE AS HIGHLIGHTED) */}
            <section className="space-y-4 pt-4">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-cyan animate-pulse" /> LIVE TERMINAL EMULATOR SHELL
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Interact with the dynamic diagnostic module. Test register addresses, inspect device-tree structures, or simulate diagnostic runs. Tapping interactive terminal macros below triggers prompt executions.
              </p>
              
              {/* Interactive diagnostic terminal */}
              <KernelTerminal terminalMode={terminalMode} />
            </section>

            {/* 9. CONTACT DETAILS FORM */}
            <section id="contact" className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-brand-cyan font-black">07.</span>
                <h2 className={`text-xl font-bold font-display tracking-tight text-white uppercase ${
                  terminalMode && "font-mono text-[#8FFF00]"
                }`}>
                  GET IN TOUCH
                </h2>
                <div className="h-[1.5px] bg-slate-800 flex-grow" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Contact forms block: Left */}
                <form 
                  onSubmit={handleSendSerial}
                  className={`md:col-span-7 p-6 rounded-2xl border flex flex-col justify-between ${
                    terminalMode
                      ? "bg-black border-[#8FFF00]/25 text-[#8FFF00]"
                      : "bg-[#121826]/75 border-slate-800 shadow-cyan-glow"
                  }`}
                >
                  <div className="space-y-4">

                    <div className="grid grid-cols-2 gap-3.5 font-sans text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => {
                            setContactForm({ ...contactForm, name: e.target.value });
                            if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                          }}
                          placeholder="Your name..."
                          className={`w-full p-2.5 rounded bg-slate-950/80 border outline-none text-slate-200 transition-all ${
                            fieldErrors.name
                              ? "border-red-500/50 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                              : terminalMode ? "border-slate-900 focus:border-[#8FFF00]" : "border-slate-900 focus:border-brand-cyan"
                          }`}
                        />
                        {fieldErrors.name && (
                          <span className="text-[9px] text-red-500 font-bold block mt-0.5 uppercase tracking-wider">
                            ⚠️ {fieldErrors.name}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Your Email</label>
                        <input 
                          type="email" 
                          required
                          value={contactForm.email}
                          onChange={(e) => {
                            setContactForm({ ...contactForm, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                          }}
                          placeholder="your.email@example.com"
                          className={`w-full p-2.5 rounded bg-slate-950/80 border outline-none text-slate-200 transition-all ${
                            fieldErrors.email
                              ? "border-red-500/50 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                              : terminalMode ? "border-slate-900 focus:border-[#8FFF00]" : "border-slate-900 focus:border-brand-cyan"
                          }`}
                        />
                        {fieldErrors.email && (
                          <span className="text-[9px] text-red-500 font-bold block mt-0.5 uppercase tracking-wider">
                            ⚠️ {fieldErrors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 font-sans text-xs">
                      <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Message</label>
                      <textarea 
                        required
                        rows={4}
                        value={contactForm.msg}
                        onChange={(e) => {
                          setContactForm({ ...contactForm, msg: e.target.value });
                          if (fieldErrors.msg) setFieldErrors(prev => ({ ...prev, msg: undefined }));
                        }}
                        placeholder="Write your message here..."
                        className={`w-full p-2.5 rounded bg-slate-950/80 border outline-none text-slate-200 resize-none transition-all ${
                          fieldErrors.msg
                            ? "border-red-500/50 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                            : terminalMode ? "border-slate-900 focus:border-[#8FFF00]" : "border-slate-900 focus:border-brand-cyan"
                        }`}
                      />
                      {fieldErrors.msg && (
                        <span className="text-[9px] text-red-500 font-bold block mt-0.5 uppercase tracking-wider">
                          ⚠️ {fieldErrors.msg}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Serial Transmission Log status */}
                  {txLogs.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-black/80 border border-slate-900 font-mono text-[9px] text-slate-450 space-y-1">
                      <div className="text-[8px] uppercase font-black text-slate-500 tracking-wider">Message status logs</div>
                      {txLogs.map((log, li) => (
                        <div key={li} className={log.startsWith("SUCCESS") ? "text-[#8FFF00]" : "text-slate-400"}>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {txSuccess && (
                        <span className="text-[10px] font-mono text-brand-lime flex items-center gap-1 uppercase font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> Message successfully sent
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isTxing}
                      className={`px-4.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-extrabold flex items-center gap-1.5 transition-all duration-300 ${
                        isTxing
                          ? "bg-slate-900 text-slate-600 border border-slate-900 cursor-wait"
                          : terminalMode
                            ? "bg-[#8FFF00] text-black hover:bg-black hover:text-[#8FFF00] border border-[#8FFF00]"
                            : "bg-brand-cyan text-black hover:scale-103 shadow-cyan-glow"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTxing ? "Sending..." : "Send Message"}</span>
                    </button>
                  </div>
                </form>

                {/* Animated Embedded microchip: Right */}
                <div className={`md:col-span-5 p-5 rounded-2xl border flex flex-col justify-between items-center relative overflow-hidden text-center select-none ${
                  terminalMode
                    ? "bg-black border-[#8FFF00]/20" 
                    : "bg-[#121826]/75 border-slate-800"
                }`}>
                  <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(0, 217, 255, 0.04) 0%, transparent 80%) z-0 pointer-events-none" />
                  
                  <div className="relative z-10 w-full">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">
                      Cores block diagram
                    </span>
                    <h4 className={`text-md font-bold font-display mt-1 ${
                      terminalMode ? "text-[#8FFF00] font-mono" : "text-slate-100"
                    }`}>
                      ARM CORTEX-M0+ SYSTEM
                    </h4>
                  </div>

                  {/* Microcontroller Silicon structural image generated earlier */}
                  <div className="relative my-4 w-40 h-40 flex items-center justify-center p-1 border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden group">
                    <div className="absolute -inset-1 blur-md bg-gradient-to-tr from-brand-cyan via-brand-purple to-brand-lime opacity-35 animate-pulse" />
                    <img 
                      src={chipSchematicImage} 
                      alt="System Microprocessor Diagram" 
                      referrerPolicy="no-referrer"
                      className="relative z-10 w-full h-full object-cover rounded-xl border border-slate-900 filter saturate-[110%]"
                    />
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 tracking-wider max-w-[200px] relative z-10 leading-normal">
                    Designed with fault-tolerant serial protocols and safe MISRA structures.
                  </div>
                </div>
              </div>
            </section>

          </main>

          {/* ========================================================= */}
          {/* RIGHT SIDE DETAILED PANEL (lg:col-span-4) - Fixed Profile */}
          {/* ========================================================= */}
          <aside className="lg:col-span-4 lg:sticky lg:top-[125px]">
            <SidebarPanel terminalMode={terminalMode} />
          </aside>

        </div>

      </div>

      {/* 10. PREMIUM TECHNICAL FOOTER */}
      <footer className={`border-t py-12 px-4 transition-colors ${
        terminalMode ? "border-[#8FFF00]/20 bg-black text-[#8FFF00]" : "border-slate-900 bg-[#0B0F19]"
      } relative overflow-hidden z-10`}>
        
        {/* Animated oscilloscope line above footer */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900 overflow-hidden">
          <div className="h-full w-48 bg-brand-cyan blur-[1px] animate-[pushProgress_4s_infinite_linear]" 
               style={{
                 backgroundImage: "linear-gradient(90deg, transparent, #00D9FF, transparent)",
                 animation: "pulseOscilloscope 3s infinite linear"
               }} 
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h4 className="text-sm font-semibold uppercase tracking-widest font-mono">
              Revathi Galla Portfolio
            </h4>
          </div>

          <div className="flex gap-4.5 text-xs font-mono">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Uplink Stage
            </button>
            <span className="text-slate-800">/</span>
            <span className="text-slate-500 select-all">ADDR: Hyderabad, India</span>
          </div>

          <div className="text-[10px] font-mono text-slate-500 text-center md:text-right">
            <span>© 2026 Revathi Galla. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
