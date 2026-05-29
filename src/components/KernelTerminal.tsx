import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Terminal, Cpu, Play, Trash2, HelpCircle } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "command" | "system" | "error" | "success" | "warning";
}

export default function KernelTerminal({ terminalMode }: { terminalMode: boolean }) {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "REVATHI_GALLA KERNEL DIAGNOSTIC WORKSTATION v4.2.1-lts", type: "system" },
    { text: "Initializing kernel platform modules...", type: "system" },
    { text: "[    0.000000] Booting Linux on physical CPU QEMU-ARMv8 Cortex-A72 Core", type: "system" },
    { text: "[    0.204105] i2c_rp: registered bus driver. (400kHz active)", type: "success" },
    { text: "[    0.342119] OF: devtree: Board has Device Tree enabled.", type: "system" },
    { text: "[    0.510920] galla_platform: char driver probe succeeded. Minor dev index 0..3 allocation.", type: "success" },
    { text: "[    0.741029] dlms_cosem: HDLC driver module binding established.", type: "success" },
    { text: "System diagnosis operational. Type 'help' or tap action switches below to run routines.", type: "warning" }
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const newLines: TerminalLine[] = [
      { text: `galla@embedded_rpi4:~$ ${cmd}`, type: "command" }
    ];

    switch (trimmed) {
      case "help":
      case "?":
        newLines.push(
          { text: "Available Diagnostics Commands:", type: "system" },
          { text: "  dmesg       - Display circular kernel debug messages & boot log info", type: "system" },
          { text: "  lsmod       - List active embedded drivers and device-tree hooks", type: "system" },
          { text: "  cpuinfo     - Print processor architecture registry specs & MCU core", type: "system" },
          { text: "  debug_diag  - Execute self-test on simulated physical I2C, SPI and DLMS meter buses", type: "system" },
          { text: "  clear       - Wipe terminal shell trace output", type: "system" },
          { text: "  uname -a    - Output core kernel architecture info", type: "system" }
        );
        break;
      case "uname -a":
        newLines.push({
          text: "Linux embedded_rpi4 6.1.21-v8+ #1 SMP PREEMPT Wed May 28 07:45:53 2026 aarch64 GNU/Linux",
          type: "success"
        });
        break;
      case "dmesg":
        newLines.push(
          { text: "[    0.010214] arm-cortex-m0+: booting energy subgrid telemetry task", type: "system" },
          { text: "[    0.045012] rpi-gpio: mapped physical register space 0xFE200000", type: "system" },
          { text: "[    0.110294] i2c_at24_eeprom: found device at bus address 0x50", type: "success" },
          { text: "[    0.184910] dlms_cosem: frame parsing bound to /dev/ttyAMA0", type: "system" },
          { text: "[    0.222419] systemd-modules-load[112]: Inserted platform driver: galla_platform.ko", type: "warning" },
          { text: "[    0.342125] watchdog: hardware watchdog timer activated (timeout=16s)", type: "warning" },
          { text: "[    0.620194] ext4-fs (mmcblk0p2): mounted filesystem with ordered data mode.", type: "success" },
          { text: "[ METER ] Primary core power state: HIGH PERFORMANCE. Volt validation verified.", type: "success" }
        );
        break;
      case "lsmod":
        newLines.push(
          { text: "Module                  Size  Used by", type: "system" },
          { text: "galla_platform         16384  0 ", type: "success" },
          { text: "dlms_cosem_core        49152  1 galla_platform", type: "success" },
          { text: "i2c_at24_eeprom        12288  0 ", type: "success" },
          { text: "spi_bcm2835            20480  0 ", type: "success" },
          { text: "bcm2835_gpiomem        16384  2 ", type: "system" }
        );
        break;
      case "cpuinfo":
        newLines.push(
          { text: "Processor       : ARM Cortex-A72 Quad-Core + ARM Cortex-M0+ Co-Processor", type: "system" },
          { text: "Architecture    : ARMv8-A (64-bit) & ARMv6-M (32-bit)", type: "system" },
          { text: "Features        : Neon SIMD, VFPv4 FPU, Secure Boot Support", type: "system" },
          { text: "Hardware Target : Raspberry Pi 4 Model B / Linkwell Smart Metering Hub", type: "system" },
          { text: "Clock Speed     : 1.50 GHz / 48 MHz", type: "system" },
          { text: "Instruction Set : MISRA C Compliant Firmware Stack", type: "success" }
        );
        break;
      case "debug_diag":
        newLines.push(
          { text: "[-STAGE-01-] PING [0x50]: Accessing physical board Atmel EEPROM registers...", type: "system" },
          { text: "[-STAGE-01-] READ ENCODEL: 0x48 0x45 0x4C 0x4C 0x4F (ASCII: 'HELLO')", type: "success" },
          { text: "[-STAGE-02-] BUS SPEED: Checking clock stretching on I²C pin SCL...", type: "system" },
          { text: "[-STAGE-02-] STRETCH DETECTED: 8.5 microseconds. Correcting line hold.", type: "warning" },
          { text: "[-STAGE-03-] DLMS CHECK: Sending OBIS active power code: 1.0.1.8.0.255...", type: "system" },
          { text: "[-STAGE-03-] COSEM FRAME: HDLC receive packet verified. Payload CRC: OK", type: "success" },
          { text: "[-STAGE-04-] MEMORY: Total Heap bounds check: 24.1KB raw stack free. No leaks.", type: "success" },
          { text: "[SUCCESS] Hardware validation score: 100/100 (Safe for flight-mode production).", type: "success" }
        );
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        newLines.push({
          text: `sh: command not found: '${trimmed}'. Type 'help' or tap action logs below.`,
          type: "error"
        });
    }

    setHistory((prev) => [...prev, ...newLines]);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      runCommand(inputVal);
      setInputVal("");
    }
  };

  const lineColors = {
    command: "text-slate-200 font-semibold",
    system: "text-slate-400",
    error: "text-red-400 font-mono",
    success: terminalMode ? "text-[#8FFF00] font-mono" : "text-brand-cyan font-mono",
    warning: "text-amber-400 font-mono"
  };

  return (
    <div className={`rounded-xl border ${
      terminalMode 
        ? "bg-black border-[#8FFF00]/40 shadow-[#8FFF00]/5 shadow-md text-[#8FFF00]" 
        : "bg-slate-950/95 border-slate-800 shadow-xl"
    } overflow-hidden font-mono text-xs transition-colors duration-300`}>
      {/* Terminal Title Bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b ${
        terminalMode ? "border-[#8FFF00]/20 bg-black" : "bg-slate-900/60 border-slate-800/80"
      }`}>
        <div className="flex items-center gap-2">
          <Terminal className={`w-4 h-4 ${terminalMode ? "text-[#8FFF00]" : "text-brand-cyan"}`} />
          <span className="font-semibold tracking-wider text-[11px] text-slate-300">
            FIRMWARE_DEBUG_CONSOLE_AMA0
          </span>
        </div>
        <div className="flex items-center gap-1.5Packed">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
        </div>
      </div>

      {/* Quick Diagnostic Taps */}
      <div className={`p-2 flex flex-wrap gap-2 text-[10px] border-b ${
        terminalMode ? "border-[#8FFF00]/20 bg-[#111]" : "bg-slate-900/30 border-slate-800/50"
      }`}>
        <button 
          onClick={() => runCommand("dmesg")}
          className={`px-2.5 py-1 rounded bg-slate-900/60 hover:bg-slate-800 border hover:border-brand-cyan/40 text-slate-300 flex items-center gap-1 transition-all ${
            terminalMode ? "border-[#8FFF00]/20 hover:text-[#8FFF00]" : "border-slate-800"
          }`}
        >
          <Cpu className="w-3 h-3" /> dmesg
        </button>
        <button 
          onClick={() => runCommand("lsmod")}
          className={`px-2.5 py-1 rounded bg-slate-900/60 hover:bg-slate-800 border hover:border-brand-cyan/40 text-slate-300 flex items-center gap-1 transition-all ${
            terminalMode ? "border-[#8FFF00]/20 hover:text-[#8FFF00]" : "border-slate-800"
          }`}
        >
          <Terminal className="w-3 h-3" /> lsmod
        </button>
        <button 
          onClick={() => runCommand("cpuinfo")}
          className={`px-2.5 py-1 rounded bg-slate-900/60 hover:bg-slate-800 border hover:border-brand-cyan/40 text-slate-300 flex items-center gap-1 transition-all ${
            terminalMode ? "border-[#8FFF00]/20 hover:text-[#8FFF00]" : "border-slate-800"
          }`}
        >
          <Terminal className="w-3 h-3" /> cpuinfo
        </button>
        <button 
          onClick={() => runCommand("debug_diag")}
          className={`px-2.5 py-1 rounded bg-slate-900/60 hover:bg-slate-800 border hover:border-brand-lime/40 text-slate-300 flex items-center gap-1 transition-all ${
            terminalMode ? "border-[#8FFF00]/20 hover:text-[#8FFF00]" : "border-slate-800"
          }`}
        >
          <Play className="w-3 h-3 text-brand-lime" /> debug_diag
        </button>
        <button 
          onClick={() => runCommand("clear")}
          className={`px-2.5 py-1 rounded bg-slate-900/60 hover:bg-slate-800 border hover:border-red-400/40 text-slate-300 flex items-center gap-1 transition-all ml-auto ${
            terminalMode ? "border-[#8FFF00]/20 hover:text-[#8FFF00]" : "border-slate-800"
          }`}
        >
          <Trash2 className="w-3 h-3 text-red-400" /> clear
        </button>
      </div>

      {/* Terminal View area */}
      <div 
        ref={terminalRef}
        className="h-64 p-4 overflow-y-auto space-y-1.5 select-text terminal-scanline shadow-inner max-h-64 scroll-smooth"
      >
        {history.map((line, idx) => (
          <div key={idx} className={`leading-relaxed ${lineColors[line.type]}`}>
            {line.text}
          </div>
        ))}
        {/* Blinking block cursor */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-slate-400 font-bold">galla@embedded_rpi4:~$</span>
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type 'help'..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono caret-white placeholder-slate-700 h-5"
          />
          <span className={`w-2 h-4 animate-pulse shrink-0 ${
            terminalMode ? "bg-brand-lime shadow-lime-glow" : "bg-brand-cyan shadow-cyan-glow"
          }`} />
        </div>
      </div>
    </div>
  );
}
