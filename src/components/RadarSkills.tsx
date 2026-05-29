import { useState } from "react";
import { Laptop, Cpu, Radio, ShieldAlert, Award } from "lucide-react";
import { SKILL_CATEGORIES } from "../data";

interface RadarSkillsProps {
  terminalMode: boolean;
}

export default function RadarSkills({ terminalMode }: RadarSkillsProps) {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Define 6 axes representing the core embedded expertise of Revathi Galla
  const radarAxes = [
    { name: "Kernel & Drivers", max: 100, value: 92, label: "Linux DTS/Modules (92%)" },
    { name: "Firmware Core", max: 100, value: 95, label: "Embedded C (95%)" },
    { name: "MCU Arch", max: 100, value: 90, label: "ARM Cortex (90%)" },
    { name: "Bus Protocols", max: 100, value: 96, label: "I2C, SPI, UART (96%)" },
    { name: "FOTA/Bootloader", max: 100, value: 85, label: "Security & Rollback (85%)" },
    { name: "Diagnostics/JTAG", max: 100, value: 90, label: "printk / dmesg (90%)" }
  ];

  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  // Calculate coordinates for polygon vertices
  const getCoordinates = (index: number, val: number) => {
    // Offset by -90 deg to put the first axis at the top
    const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2;
    const currentRadius = (val / 100) * radius;
    const x = centerX + currentRadius * Math.cos(angle);
    const y = centerY + currentRadius * Math.sin(angle);
    return { x, y };
  };

  // Outer concentric circles for scales
  const gridLevels = [25, 50, 75, 100];

  // Draw core polygon path representing stats
  const radarPoints = radarAxes.map((axis, i) => getCoordinates(i, axis.value));
  const polyPath = radarPoints.map(p => `${p.x},${p.y}`).join(" ");

  // Accent icon map for skill categories
  const categoryIcons = [
    <Cpu className="w-4 h-4" key="cpu" />,
    <Laptop className="w-4 h-4" key="lap" />,
    <Radio className="w-4 h-4" key="rad" />,
    <ShieldAlert className="w-4 h-4" key="sh" />
  ];

  return (
    <div className={`p-6 rounded-2xl border ${
      terminalMode
        ? "bg-black border-brand-lime/30 text-brand-lime"
        : "bg-[#121826]/80 backdrop-blur-md border-slate-800 shadow-lg"
    } transition-all duration-300`}>
      <h3 className={`text-lg font-bold font-display flex items-center gap-2 mb-6 ${
        terminalMode ? "text-brand-lime text-glow-lime font-mono" : "text-[#F8FAFC]"
      }`}>
        <Cpu className={`w-5 h-5 ${terminalMode ? "text-brand-lime text-glow-lime" : "text-brand-lime animate-pulse"}`} />
        CORE TELEMETRY: RADAR INDEX
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Interactive Categories and Chips */}
        <div className="md:col-span-7 flex flex-col space-y-4">
          <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">
            Select subsystem module:
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(idx)}
                className={`p-3 rounded-xl text-left border transition-all duration-300 relative overflow-hidden flex items-center gap-2.5 group ${
                  activeCategory === idx
                    ? terminalMode
                      ? "bg-brand-lime/10 border-brand-lime text-brand-lime shadow-lime-glow"
                      : "bg-[#00D9FF]/10 border-brand-cyan text-white shadow-cyan-glow"
                    : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  activeCategory === idx
                    ? terminalMode ? "bg-brand-lime/20 text-brand-lime shadow-lime-glow" : "bg-brand-cyan/20 text-brand-cyan"
                    : "bg-slate-950 text-slate-500"
                }`}>
                  {categoryIcons[idx] || <Cpu className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono uppercase tracking-wider block font-semibold truncate leading-tight">
                    {cat.title.split(" & ")[0]}
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono truncate">
                    {cat.skills.length} register items
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Individual Detailed Chips from Selected Category */}
          <div className={`p-4 rounded-xl relative ${
            terminalMode ? "bg-black border border-brand-lime/20" : "bg-slate-950/60 border border-slate-900"
          }`}>
            <span className="absolute top-1.5 right-2 font-mono text-[9px] text-slate-600 uppercase tracking-widest">
              Register Array [0x0{activeCategory}]
            </span>
            <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${terminalMode ? "bg-brand-lime shadow-lime-glow" : "bg-brand-cyan"}`} />
              {SKILL_CATEGORIES[activeCategory].title} Drivers
            </div>
            
            <div className="space-y-3">
              {SKILL_CATEGORIES[activeCategory].skills.map((skill, si) => (
                <div key={si} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className={terminalMode ? "text-brand-lime" : "text-brand-cyan"}>
                      {skill.percentage}% Ready
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
                    <div 
                      className={`h-full rounded-full ${
                        terminalMode 
                          ? "bg-brand-lime shadow-lime-glow" 
                          : "bg-gradient-to-r from-brand-cyan to-brand-lime"
                      }`}
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Vector SVG Radar Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
            {/* Hologram or radar interface grid overlay */}
            <svg 
              viewBox="0 0 300 300" 
              className={`w-full h-full ${terminalMode ? "text-brand-lime" : "text-slate-700"}`}
            >
              {/* Floating laser line sweeps (animated) */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                className={`fill-none stroke-[0.5px] stroke-slate-800 ${
                  !terminalMode && "animate-pulse"
                }`}
              />

              {/* Concentric rings represent calibration scales */}
              {gridLevels.map((lvl, index) => {
                const r = (lvl / 100) * radius;
                return (
                  <circle
                    key={index}
                    cx={centerX}
                    cy={centerY}
                    r={r}
                    fill="none"
                    className={`stroke-[1px] ${
                      terminalMode 
                        ? "stroke-brand-lime/10" 
                        : "stroke-slate-800/80"
                    } stroke-dasharray-4`}
                    style={terminalMode ? { stroke: "var(--terminal-accent)", strokeOpacity: 0.1 } : undefined}
                  />
                );
              })}

              {/* Angle axis partition indicators */}
              {radarAxes.map((axis, i) => {
                const outer = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={outer.x}
                    y2={outer.y}
                    className={`stroke-[1px] ${
                      terminalMode 
                        ? "stroke-brand-lime/15" 
                        : "stroke-slate-800/60"
                    }`}
                    style={terminalMode ? { stroke: "var(--terminal-accent)", strokeOpacity: 0.15 } : undefined}
                  />
                );
              })}

              {/* Static overlay lines linking core stats */}
              <polygon
                points={polyPath}
                className={`stroke-[2px] transition-all duration-500 ${
                  terminalMode 
                    ? "fill-brand-lime/10 stroke-brand-lime" 
                    : "fill-brand-cyan/15 stroke-brand-cyan shadow-lg"
                }`}
                style={terminalMode ? { fill: "var(--terminal-accent)", fillOpacity: 0.1, stroke: "var(--terminal-accent)" } : undefined}
              />

              {/* Glowing anchor dots plotted at precise measurements */}
              {radarAxes.map((axis, i) => {
                const p = getCoordinates(i, axis.value);
                const isHovered = hoveredPoint === axis.name;
                return (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4.5}
                      onMouseEnter={() => setHoveredPoint(axis.name)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className={`cursor-pointer transition-all duration-200 ${
                        terminalMode 
                          ? "fill-brand-lime stroke-black stroke-2 hover:fill-white" 
                          : "fill-white stroke-brand-cyan stroke-[2px] hover:stroke-brand-lime"
                      }`}
                      style={terminalMode ? { fill: "var(--terminal-accent)" } : undefined}
                    />
                    {/* Floating mini labels on nodes */}
                    {isHovered && (
                      <g>
                        <rect
                          x={p.x - 55}
                          y={p.y - 24}
                          width={110}
                          height={16}
                          rx={3}
                          className="fill-slate-950 stroke-slate-800 stroke-[1px]"
                        />
                        <text
                          x={p.x}
                          y={p.y - 13}
                          textAnchor="middle"
                          className="font-mono text-[9px] font-semibold fill-slate-200"
                        >
                          {axis.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Outer Text Marks for structural axes orientation */}
              {radarAxes.map((axis, i) => {
                const labelPos = getCoordinates(i, 118);
                let textAnchor = "middle";
                if (labelPos.x < centerX - 10) textAnchor = "end";
                if (labelPos.x > centerX + 10) textAnchor = "start";

                return (
                  <text
                    key={i}
                    x={labelPos.x}
                    y={labelPos.y + 3}
                    textAnchor={textAnchor}
                    className={`font-mono text-[9px] uppercase tracking-normal fill-slate-400 ${
                      hoveredPoint === axis.name && "fill-white' font-semibold"
                    }`}
                  >
                    {axis.name.split(" ")[0]}
                  </text>
                );
              })}
            </svg>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Hover sensor nodes for telemetry metrics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
