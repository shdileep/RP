import { Mail, Phone, MapPin, CircleDot, Github, Linkedin, Cpu, Terminal, Layers } from "lucide-react";
import { PERSONAL_INFO } from "../data";
import { motion } from "motion/react";
import avatarImage from "../assets/images/revaa.png";

interface SidebarPanelProps {
  terminalMode: boolean;
}

export default function SidebarPanel({ terminalMode }: SidebarPanelProps) {
  const avatarPath = avatarImage;

  return (
    <div className={`p-6 rounded-3xl border ${terminalMode
      ? "bg-black border-brand-lime/30 shadow-lime-glow shadow-sm"
      : "bg-[#121826]/80 backdrop-blur-xl border-slate-800 shadow-cyan-glow"
      } transition-all duration-300 relative overflow-hidden group`}>
      {/* Decorative motherboard background element for panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-purple-500/0 opacity-30 pointer-events-none" />

      {/* Laser visual guide bar */}
      <div className={`absolute top-0 left-0 w-2 h-full ${terminalMode ? "bg-brand-lime shadow-lime-glow" : "bg-gradient-to-b from-brand-cyan to-brand-purple"
        }`} />

      <div className="flex flex-col items-center text-center relative z-10">
        {/* Profile Avatar with double neon pulsing ring */}
        <div className="relative mb-6">
          <div className={`absolute -inset-2 rounded-full blur-md opacity-75 ${terminalMode
            ? "bg-brand-lime/20 animate-pulse"
            : "bg-gradient-to-tr from-brand-cyan via-brand-purple to-brand-lime/50 animate-pulse-slow"
            }`} />
          <div className="relative w-40 h-40 rounded-full p-1.5 bg-[#0B0F19] overflow-hidden">
            <div className={`absolute inset-0 rounded-full border-2 ${terminalMode ? "border-brand-lime shadow-lime-glow" : "border-brand-cyan animate-spin-slow duration-[10s]"
              }`} />
            <img
              src={avatarPath}
              alt={PERSONAL_INFO.name}
              referrerPolicy="no-referrer"
              style={{ objectPosition: "center 15%" }}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Signal Indicator for availability status */}
          <div className="absolute bottom-1 right-2 bg-slate-900 border border-slate-800 rounded-full py-1 px-3 flex items-center gap-1.5 shadow-md">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${terminalMode ? "bg-brand-lime" : "bg-brand-lime"
                }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${terminalMode ? "bg-brand-lime" : "bg-brand-lime"
                }`}></span>
            </span>
            <span className="text-[10px] font-mono tracking-tight text-white font-medium">SYS: OK</span>
          </div>
        </div>

        {/* Name and Designation */}
        <h2 className={`text-2xl font-bold font-display tracking-tight ${terminalMode ? "text-brand-lime text-glow-lime font-mono" : "text-[#F8FAFC]"
          }`}>
          {PERSONAL_INFO.name}
        </h2>
        <p className={`text-xs font-mono mt-1 ${terminalMode ? "text-brand-lime/80" : "text-brand-cyan"
          } font-semibold uppercase tracking-wider flex items-center gap-1`}>
          <Cpu className="w-3.5 h-3.5" />
          {PERSONAL_INFO.title}
        </p>

        {/* Microchip Specs Dividers */}
        <div className="w-full flex items-center justify-between my-4 px-2">
          <span className="h-[1px] flex-1 bg-slate-800/80" />
          <span className="mx-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Layers className="w-3 h-3" /> hardware panel
          </span>
          <span className="h-[1px] flex-1 bg-slate-800/80" />
        </div>

        {/* Quick Skill Badges */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-5 max-w-[320px]">
          {["Embedded Linux", "ARM Cortex", "Device Trees", "Firmware", "I²C"].map((tag, index) => (
            <span key={index} className={`text-[10px] font-mono px-2 py-0.5 rounded ${terminalMode
              ? "bg-brand-lime/10 text-brand-lime border border-brand-lime/30 shadow-lime-glow shadow-[0_0_8px_rgba(0,0,0,0.1)]"
              : "bg-[#1E293B] text-slate-300 border border-slate-800/80 hover:border-brand-cyan/40 hover:text-white"
              } transition-colors duration-200`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats segment */}
        <div className={`grid grid-cols-2 gap-2.5 w-full mb-6 p-3 rounded-xl ${terminalMode ? "bg-black" : "bg-slate-950/50 border border-slate-900"
          }`}>
          {PERSONAL_INFO.stats.map((stat, i) => (
            <div key={i} className="text-left p-2 border-l border-slate-800">
              <p className={`text-[10px] font-mono ${terminalMode ? "text-slate-400" : "text-slate-500"
                } uppercase tracking-wider`}>
                {stat.label}
              </p>
              <p className={`text-sm font-semibold font-display ${terminalMode ? "text-brand-lime text-glow-lime font-mono" : "text-[#F8FAFC]"
                }`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Deck: Simplified standard layout */}
        <div className="w-full space-y-3 text-left mb-6">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
            System Communications Link
          </span>

          {/* Normal clean links grid - 2 columns side by side */}
          <div className="grid grid-cols-2 gap-2.5">

            {/* Email */}
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              title="Compose Email"
              className={`p-2.5 rounded-xl border flex items-center gap-2 group/icon ${terminalMode
                ? "bg-black border-brand-lime/25 text-brand-lime hover:bg-brand-lime/10 shadow-lime-glow"
                : "bg-slate-900/40 border-slate-800 hover:border-brand-cyan hover:bg-slate-900/80 hover:shadow-cyan-glow"
                } transition-all duration-300`}
            >
              <Mail className={`w-4 h-4 shrink-0 ${terminalMode ? "text-brand-lime shadow-lime-glow" : "text-brand-cyan group-hover/icon:scale-110 transition-transform"}`} />
              <div className="min-w-0 flex-1 font-mono text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-slate-300 group-hover/icon:text-white">Email</span>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${PERSONAL_INFO.phone}`}
              title="Call Phone"
              className={`p-2.5 rounded-xl border flex items-center gap-2 group/icon ${terminalMode
                ? "bg-black border-brand-lime/25 text-brand-lime hover:bg-brand-lime/10 shadow-lime-glow"
                : "bg-slate-900/40 border-slate-800 hover:border-brand-purple hover:bg-slate-900/80 hover:shadow-purple-glow"
                } transition-all duration-300`}
            >
              <Phone className={`w-4 h-4 shrink-0 ${terminalMode ? "text-brand-lime shadow-lime-glow" : "text-brand-purple group-hover/icon:scale-110 transition-transform"}`} />
              <div className="min-w-0 flex-1 font-mono text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-slate-300 group-hover/icon:text-white">Phone</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className={`p-2.5 rounded-xl border flex items-center gap-2 group/icon ${terminalMode
                ? "bg-black border-brand-lime/25 text-brand-lime hover:bg-brand-lime/10 shadow-lime-glow"
                : "bg-slate-900/40 border-slate-800 hover:border-brand-purple hover:bg-slate-900/80 hover:shadow-purple-glow"
                } transition-all duration-300`}
            >
              <Linkedin className={`w-4 h-4 shrink-0 ${terminalMode ? "text-brand-lime shadow-lime-glow" : "text-brand-purple group-hover/icon:scale-110 transition-transform"}`} />
              <div className="min-w-0 flex-1 font-mono text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-slate-300 group-hover/icon:text-white">LinkedIn</span>
              </div>
            </a>

            {/* GitHub */}
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              className={`p-2.5 rounded-xl border flex items-center gap-2 group/icon ${terminalMode
                ? "bg-black border-brand-lime/25 text-brand-lime hover:bg-brand-lime/10 shadow-lime-glow"
                : "bg-[#0f172a]/90 border-slate-800 hover:border-brand-cyan hover:bg-slate-900/80 hover:shadow-cyan-glow"
                } transition-all duration-300`}
            >
              <Github className={`w-4 h-4 shrink-0 ${terminalMode ? "text-brand-lime shadow-lime-glow" : "text-slate-300 group-hover/icon:scale-110 transition-transform"}`} />
              <div className="min-w-0 flex-1 font-mono text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-slate-300 group-hover/icon:text-white">GitHub</span>
              </div>
            </a>

          </div>

          {/* Location status node */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 font-mono text-[10px] text-slate-400">
            <MapPin className={`w-4 h-4 ${terminalMode ? "text-brand-lime shadow-lime-glow" : "text-brand-cyan"}`} />
            <span>LOC GATEWAY: {PERSONAL_INFO.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
