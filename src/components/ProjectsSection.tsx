import { useState } from "react";
import { FolderGit2, ArrowRight, X, Github, Cpu, Network, FileCode, CheckCircle } from "lucide-react";
import { PROJECTS } from "../data";
import { Project } from "../types";

interface ProjectsSectionProps {
  terminalMode: boolean;
}

export default function ProjectsSection({ terminalMode }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((proj) => {
          const isHovered = hoveredProject === proj.id;
          
          return (
            <div
              key={proj.id}
              onMouseEnter={() => setHoveredProject(proj.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                terminalMode
                  ? "bg-black border-[#8FFF00]/20 hover:border-[#8FFF00] text-[#8FFF00]"
                  : "bg-[#121826]/80 backdrop-blur-md border-slate-800 hover:border-brand-cyan/50 hover:shadow-cyan-glow"
              }`}
            >
              {/* Corner tech index tag */}
              <span className="absolute top-3 right-4 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                UNIT: {proj.category.toUpperCase()}
              </span>

              <div>
                {/* Project Category Tag */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    terminalMode ? "bg-[#8FFF00]" : "bg-brand-cyan animate-pulse"
                  }`} />
                  <span className={`text-[10px] uppercase font-mono tracking-widest ${
                    terminalMode ? "text-[#8FFF00]/80" : "text-brand-cyan"
                  }`}>
                    {proj.category} Module
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-lg font-bold font-display tracking-tight ${
                  terminalMode ? "text-[#8FFF00] font-mono" : "text-white"
                }`}>
                  {proj.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Dynamic SVG Mini Architecture Bus Wiring Diagram */}
                <div className={`my-4 p-3 rounded-xl border ${
                  terminalMode 
                    ? "bg-black border-[#8FFF00]/10" 
                    : "bg-slate-950/40 border-slate-800/40"
                }`}>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Network className="w-3 h-3 text-brand-purple" /> signal bus routing map
                  </div>
                  
                  {/* Render 4 node linear block chain */}
                  <div className="flex items-center justify-between relative px-2 py-1.5">
                    {/* Linear background guide copper trace line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-slate-800 -translate-y-1/2 z-0" />
                    
                    {proj.architecture.blocks.slice(0, 4).map((blk, idx) => (
                      <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                        <div className={`p-1 rounded border min-w-[50px] text-center truncate ${
                          idx === 3
                            ? terminalMode
                              ? "bg-[#8FFF00]/10 border-[#8FFF00] text-[#8FFF00]"
                              : "bg-brand-lime/10 border-brand-lime text-brand-lime shadow-lime-glow"
                            : terminalMode
                              ? "bg-black border-slate-700 text-slate-300"
                              : "bg-[#1e293b]/70 border-slate-700 text-slate-300"
                        } transition-all duration-300`}>
                          <span className="text-[8px] font-mono uppercase font-bold tracking-tight">
                            {blk.split(" ")[0]}
                          </span>
                        </div>
                        {/* Little description marker under node */}
                        <span className="text-[7px] font-mono text-slate-600 mt-1 uppercase scale-90">
                          N{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills used */}
                <div className="flex flex-wrap gap-1.5 my-1">
                  {proj.skills.slice(0, 3).map((sk, index) => (
                    <span 
                      key={index} 
                      className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        terminalMode 
                          ? "bg-slate-900 text-slate-400 border border-slate-800" 
                          : "bg-slate-900/60 text-slate-300 border border-slate-850/60"
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                  {proj.skills.length > 3 && (
                    <span className="text-[9px] font-mono text-slate-500 px-1 pt-0.5">
                      +{proj.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-800/50">
                <a 
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-slate-400 hover:text-white transition-colors p-1 rounded-md`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setSelectedProject(proj)}
                  className={`text-[11px] font-mono font-bold uppercase flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                    terminalMode
                      ? "border-[#8FFF00]/30 text-[#8FFF00] hover:bg-[#8FFF00]/15"
                      : "border-slate-800 text-slate-300 hover:border-brand-cyan hover:text-white hover:shadow-cyan-glow"
                  }`}
                >
                  Inspect Probe
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL SCREEN INSPECT PROBE MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
            terminalMode
              ? "bg-black border-[#8FFF00]"
              : "bg-[#121826] border-slate-800 shadow-cyan-glow-intense"
          }`}>
            {/* Header decor band */}
            <div className={`h-1 w-full ${
              terminalMode ? "bg-[#8FFF00]" : "bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-lime"
            }`} />

            {/* Exit button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 max-h-[85vh] overflow-y-auto space-y-6">
              {/* Category, titles, and metrics */}
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${
                  terminalMode ? "text-[#8FFF00]" : "text-brand-cyan"
                }`}>
                  {selectedProject.category} / REGISTER DUMP ACTIVE
                </span>
                <h2 className={`text-2xl font-bold font-display mt-1 ${
                  terminalMode ? "text-[#8FFF00] font-mono" : "text-white"
                }`}>
                  {selectedProject.title}
                </h2>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  {selectedProject.longDescription}
                </p>
              </div>

              {/* Grid with Metrics and Bus map */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Embedded metrics */}
                <div className="md:col-span-4 space-y-4">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    physical metrics
                  </div>
                  <div className="space-y-3">
                    {selectedProject.metrics?.map((m, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl border ${
                          terminalMode 
                            ? "bg-black border-[#8FFF00]/10" 
                            : "bg-slate-950/50 border-slate-900"
                        }`}
                      >
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                          {m.label}
                        </p>
                        <p className={`text-sm font-bold font-mono mt-0.5 ${
                          terminalMode ? "text-[#8FFF00]" : "text-white"
                        }`}>
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extended structural SVG connection card */}
                <div className={`md:col-span-8 p-4 rounded-xl border flex flex-col justify-between ${
                  terminalMode ? "bg-black border-[#8FFF00]/10" : "bg-slate-950/40 border-slate-900"
                }`}>
                  <div>
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-brand-cyan" /> Complete Subsystem Pipeline topology
                    </div>
                    {/* Render comprehensive architecture path of project */}
                    <div className="grid grid-cols-5 items-center gap-1 text-center py-4 relative">
                      {/* Connection tracing wires */}
                      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2" />
                      
                      {selectedProject.architecture.blocks.map((bName, bi) => (
                        <div key={bName} className="flex flex-col items-center relative z-10 text-center">
                          <div className={`p-1.5 rounded-lg border text-center text-[7px] font-mono min-h-[46px] flex items-center justify-center font-semibold leading-tight max-w-[90px] ${
                            bi === selectedProject.architecture.blocks.length - 1
                              ? "bg-brand-lime/10 border-brand-lime text-brand-lime"
                              : "bg-slate-900 border-slate-800 text-slate-300"
                          }`}>
                            {bName}
                          </div>
                          <span className="text-[7px] font-mono text-slate-600 mt-1 uppercase">
                            REG_0{bi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 italic mt-2.5">
                    Signal lines represent verified physical SPI/UART/GPIO wire topologies checked at Hyderabad labs.
                  </div>
                </div>
              </div>

              {/* Technical Code Snippet Container */}
              {selectedProject.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-brand-cyan" /> driver_source_registers.c
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-955 rounded px-2">
                      ANSI C (GCC Compiler)
                    </span>
                  </div>
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 overflow-x-auto select-all max-h-56">
                    <pre className="font-mono text-[10px] leading-relaxed text-slate-300">
                      <code>{selectedProject.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800/60 font-mono text-xs">
                <a 
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2.5 rounded-lg flex items-center gap-2 border bg-slate-900 hover:bg-slate-800 transition-all ${
                    terminalMode ? "border-[#8FFF00]/30 text-[#8FFF00]" : "border-slate-800 text-slate-300 hover:text-white hover:border-slate-600"
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>inspect github repository</span>
                </a>

                <button 
                  onClick={() => setSelectedProject(null)}
                  className={`px-4 py-2.5 rounded-lg font-bold uppercase border transition-all ${
                    terminalMode
                      ? "border-[#8FFF00] text-black bg-[#8FFF00] hover:bg-black hover:text-[#8FFF00]"
                      : "border-brand-cyan text-black bg-brand-cyan hover:bg-transparent hover:text-brand-cyan"
                  }`}
                >
                  Close Register dump
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
