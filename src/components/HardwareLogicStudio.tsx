import { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Activity, 
  Info, 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  RefreshCw, 
  Settings, 
  Radio, 
  Zap, 
  Flame, 
  Workflow, 
  Sliders, 
  FileText
} from "lucide-react";

export default function HardwareLogicStudio({ terminalMode }: { terminalMode: boolean }) {
  // Protocol configuration
  const [selectedProtocol, setSelectedProtocol] = useState<"UART" | "I2C" | "SPI">("UART");
  
  // Register bits state: Idx 0 is Bit 7 (COM_LOCK), Idx 7 is Bit 0 (INT_EN)
  // Saved default signature values
  const defaultRegisterBits = [0, 1, 0, 1, 0, 1, 0, 0]; // default: 0x54 (Com lock off, active addr config, fast clk off, LED/INT configuration)
  const [registerBits, setRegisterBits] = useState<number[]>(defaultRegisterBits);
  
  // Simulation and transmission state
  const [isPulsing, setIsPulsing] = useState(false);
  const [pulseValue, setPulseValue] = useState("0x5A");
  const [baudRate, setBaudRate] = useState<string>("115200");
  const [noiseLevel, setNoiseLevel] = useState<number>(0); // 0 (None) to 4 (Extreme)
  const [parityMode, setParityMode] = useState<"None" | "Even" | "Odd">("None");
  
  // Core temperatures / live diagnostics (fluctuates dynamically)
  const [coreTemp, setCoreTemp] = useState<number>(41.5);
  const [voltageLevel, setVoltageLevel] = useState<number>(3.31);
  const [packetErrorRate, setPacketErrorRate] = useState<number>(0.0);
  
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([
    "SYS: Logical analyzer core initialized on address boundary 0x40003024.",
    "SYS: Select peripheral channels and trigger real-time signal loop probing."
  ]);

  // Real-time Local Offline RAG Knowledge Retrieval System (No APIs)
  const [ragQuery, setRagQuery] = useState("");
  const [activeRightTab, setActiveRightTab] = useState<"diagnostics" | "rag">("diagnostics");
  const [ragResult, setRagResult] = useState<{
    topic: string;
    content: string;
    confidence: number;
    chunkSource: string;
    keysMatched: string[];
  } | null>(null);

  const knowledgeBase = [
    {
      topic: "COM_LOCK & FLASH SECTOR SECURITY",
      content: "Physical write-lock barriers on flash partition 0x08100000 are asserted active when COM_LOCK (Bit 7) is written HIGH (1). Protects mission-critical boot sector firmware blocks against any overwrites.",
      chunkSource: "SEC_ROM_BLOCK_00_MANIFEST.TXT [Offset 0x08F0]",
      keywords: ["lock", "com_lock", "secure", "flash", "write", "partition", "protect"]
    },
    {
      topic: "INTELLIGENT NESTED INTERRUPTS",
      content: "INT_EN (Bit 0) dynamically maps physical pin triggers and nested NVIC priority registers to vector offset 0x3C. Toggling this off causes the processor to run in high-overhead status polling pattern.",
      chunkSource: "NVIC_VECTOR_MATRIX_CORE.BAK [Offset 0x00A4]",
      keywords: ["interrupt", "int_en", "nvic", "irq", "vector", "priority", "poll"]
    },
    {
      topic: "CLK_FAST MULTIPLIER & TEMPERATURE",
      content: "Dynamic clock regulator CLK_FAST (Bit 2) drives system internal PLL from 16MHz crystal base up to 120MHz speed boosts. Overclocking triggers high heat generation (nominal ~68°C) demanding dynamic fans.",
      chunkSource: "SYSTEM_PLL_MULTIPLIER_MAP.CFG [Offset 0x12CC]",
      keywords: ["overclock", "clk_fast", "speed", "frequency", "ambient", "hz", "pll", "temp"]
    },
    {
      topic: "I2C SLAVE REGISTER BUS ADDRESSING",
      content: "I2C_ADDR_0 (Bit 6) and I2C_ADDR_1 (Bit 5) establish the physical peripheral device target address vector (ranging from 0x50 to 0x57) during bus broadcast handshakes on SDA and SCL paths.",
      chunkSource: "I2C_PERIPHERAL_BUS_ADDRESS_INDEX.DB [Offset 0x03B0]",
      keywords: ["i2c", "sda", "scl", "address", "peripheral", "i2c_ad", "device"]
    },
    {
      topic: "UART PARITY INTERFERANCE CORRECTION",
      content: "UART frames validate transmitting packet structures via Parity register flags. Noise interference levels (+18dBm) may cause frame failures, requiring CRC validation checks or Even/Odd configuration matches.",
      chunkSource: "UART_FRAME_ALIGNER_CONTROLLER.LOG [Offset 0x2210]",
      keywords: ["uart", "parity", "noise", "baudrate", "transmission", "frame", "even", "odd"]
    },
    {
      topic: "SPI PROTOCOL MASTER SYNCHRONIZATION",
      content: "SPI synchronous serial engine synchronizes MOSI (Master-Out-Slave-In) driver data pulses precisely in tune with SCK (Shift Clock) master wave rising edge boundaries to guarantee glitch-free logic levels.",
      chunkSource: "SPI_CONTROLLER_MASTER_SHIFT.DAT [Offset 0x0A2B]",
      keywords: ["spi", "mosi", "sck", "slave", "master", "sync", "clock", "glitch"]
    },
    {
      topic: "ADC REFERENCE SIGNAL CALIBRATION",
      content: "ADC_REF (Bit 3) acts as a high-density feedback calibration scale routing analog input sweeps to external VREF reference voltages, ensuring highly accurate multi-bit ADC conversion.",
      chunkSource: "ANALOG_CONVERTER_CALIBRATION_SPEC.TXT [Offset 0x08F4]",
      keywords: ["adc", "adc_ref", "reference", "analog", "vref", "voltage", "resolution"]
    },
    {
      topic: "WATCHDOG GUARD TIMER (WDT)",
      content: "Internal 24-bit Watchdog driver acts as secondary protective barrier. Automatically generates system software resets upon nested instruction runtime execution stalls or vector deadlocks.",
      chunkSource: "WATCHDOG_TIMER_SUPERVISOR_CORE.SYS [Offset 0x0010]",
      keywords: ["watchdog", "wdt", "timer", "reset", "stall", "deadlock", "reboot"]
    }
  ];

  const handleRagSearch = (queryText: string) => {
    setRagQuery(queryText);
    if (!queryText.trim()) {
      setRagResult(null);
      return;
    }
    
    const queryTokens = queryText.toLowerCase().replace(/[^a-z0-9_]/g, " ").split(/\s+/).filter(Boolean);
    if (queryTokens.length === 0) {
      setRagResult(null);
      return;
    }

    let bestMatch: typeof knowledgeBase[0] | null = null;
    let highestScore = 0;
    let matchedKeys: string[] = [];

    knowledgeBase.forEach((kb) => {
      let score = 0;
      let matchedInThisKb: string[] = [];
      queryTokens.forEach((token) => {
        kb.keywords.forEach((keyword) => {
          if (keyword.includes(token) || token.includes(keyword)) {
            score += 2;
            if (!matchedInThisKb.includes(keyword)) {
              matchedInThisKb.push(keyword);
            }
          }
        });
        if (kb.topic.toLowerCase().includes(token)) score += 3;
        if (kb.content.toLowerCase().includes(token)) score += 1;
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = kb;
        matchedKeys = matchedInThisKb;
      }
    });

    if (bestMatch && highestScore > 0) {
      const calculatedConfidence = Math.min(99.8, 72 + (highestScore * 3.5));
      setRagResult({
        topic: (bestMatch as any).topic,
        content: (bestMatch as any).content,
        confidence: +calculatedConfidence.toFixed(1),
        chunkSource: (bestMatch as any).chunkSource,
        keysMatched: matchedKeys
      });
    } else {
      setRagResult({
        topic: "SIMULATED LOCAL KNOWLEDGE SCANNER",
        content: `Standard verification vector queries processed: "${queryText}". No precise local register chunks matched. Please query standard system vectors like 'COM_LOCK', 'interrupt', 'overclock', 'SPI', 'I2C' or 'Watchdog'.`,
        confidence: 45.5,
        chunkSource: "RECOVERY_NODE_INDEX_0xFF.BAK",
        keysMatched: ["re-index"]
      });
    }
  };

  // Handle register bit toggles
  const toggleBit = (index: number) => {
    const updated = [...registerBits];
    updated[index] = updated[index] === 0 ? 1 : 0;
    setRegisterBits(updated);
    
    const hex = calculateHex(updated);
    const bitNames = [
      "COM_LOCK",   // Bit 7
      "I2C_ADDR_0", // Bit 6
      "I2C_ADDR_1", // Bit 5
      "PARITY_ON",  // Bit 4
      "ADC_REF",    // Bit 3
      "CLK_FAST",   // Bit 2
      "LED_STAT",   // Bit 1
      "INT_EN"      // Bit 0
    ];
    // Since idx 0 corresponds to COM_LOCK (Bit 7), map carefully:
    const toggledBitName = bitNames[index];
    const status = updated[index] === 1 ? "ASSERTED HIGH (1)" : "PULLED LOW (0)";
    
    setTransmissionLogs(prev => [
      `REG: Written register flag [${toggledBitName}] -> ${status}`,
      `REG: Active byte recalculated: Bin=0b${updated.join("")} (${hex})`,
      ...prev.slice(0, 12)
    ]);
  };

  // Convert bits values
  const calculateHex = (bits: number[]) => {
    const byteVal = parseInt(bits.join(""), 2);
    return "0x" + byteVal.toString(16).toUpperCase().padStart(2, "0");
  };

  const calculateDec = (bits: number[]) => {
    return parseInt(bits.join(""), 2);
  };

  // Pulse edge processing simulator loop
  useEffect(() => {
    if (!isPulsing) return;
    
    // Core timing speeds match the selected baudrate scale
    const parseTimeout = baudRate === "9600" ? 1800 : baudRate === "115200" ? 800 : 350;
    
    const token = setTimeout(() => {
      setIsPulsing(false);
      
      const errorOccurred = noiseLevel > 1 && Math.random() * 5 < noiseLevel;
      if (errorOccurred) {
        setPacketErrorRate(prev => Math.min(100, +(prev + (noiseLevel * 4.5)).toFixed(1)));
        setTransmissionLogs(prev => [
          `ERROR: Framing error detected at bit offset [0x04]. Noise amplitude exceeded parity margins.`,
          `SYS: Peripheral buffer transmission FAILED. Corrupt packet rejected by node.`,
          ...prev.slice(0, 12)
        ]);
      } else {
        setTransmissionLogs(prev => [
          `PROBE: Successfully matched logical data frames. No checksum/parity mismatch.`,
          `PROBE: Packet [${pulseValue}] successfully loaded in downstream DMA storage register.`,
          ...prev.slice(0, 12)
        ]);
      }
    }, parseTimeout);

    return () => clearTimeout(token);
  }, [isPulsing, baudRate, noiseLevel, pulseValue]);

  // Dynamic background diagnostics fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      // Overclock register is CLK_FAST (Idx 5 - Bit 2)
      const overclockActive = registerBits[5] === 1;
      const baseTemp = overclockActive ? 68.2 : 40.5;
      const jitt = (Math.random() - 0.5) * 1.5;
      setCoreTemp(+(baseTemp + jitt).toFixed(1));

      const voltJitt = (Math.random() - 0.5) * 0.04;
      const targetVolt = overclockActive ? 3.42 : 3.30;
      setVoltageLevel(+(targetVolt + voltJitt).toFixed(2));

      // Auto decrease packet error rate slowly if noise level is low
      if (noiseLevel === 0) {
        setPacketErrorRate(prev => Math.max(0, +(prev - 0.2).toFixed(1)));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [registerBits, noiseLevel]);

  // Logic signal edge trigger action
  const triggerPulse = () => {
    setIsPulsing(true);
    
    // Incorporate parameters in logic console output
    setTransmissionLogs(prev => [
      `PROBE: Triggering active probe stream on [${selectedProtocol}] Channel 1 / 2`,
      `PROBE: Line settings: ${baudRate} bps | Noise offset: +${noiseLevel * 6}dBm | Parity: ${parityMode}`,
      `PROBE: Modulating wave payload to encode parsed hexadecimal binary: ${pulseValue}...`,
      ...prev.slice(0, 12)
    ]);
  };

  // Full firmware reset action
  const resetController = () => {
    setIsPulsing(false);
    setRegisterBits([...defaultRegisterBits]);
    setSelectedProtocol("UART");
    setBaudRate("115200");
    setNoiseLevel(0);
    setParityMode("None");
    setPulseValue("0x5A");
    setPacketErrorRate(0.0);
    setTransmissionLogs([
      "RESET: COLD BOOT DIAGNOSTIC RUN COMPLETED.",
      "RESET: Re-aligned clock dividers & loaded default NVRAM flash profiles successfully.",
      "RESET: Active registers flushed to hex signature 0x54 (Standard state established)."
    ]);
  };

  // Trace logic path generation based on protocol and noise interference levels
  const generateWaveformPath = (bits: number[], isSecChannel: boolean = false) => {
    let path = "M 10 " + (isSecChannel ? "24" : "30");
    let currentX = 10;
    const bitWidth = 45;
    
    // Waveform amplitudes - tightly scaled for ultra-compact display
    const highY = isSecChannel ? 4 : 6;
    const lowYValue = isSecChannel ? 24 : 30;

    bits.forEach((bit, idx) => {
      let targetY = bit === 1 ? highY : lowYValue;
      
      // Inject distortion glitches if noiseLevel is configured
      if (noiseLevel > 0) {
        const noiseSway = (idx % 2 === 0 ? 1 : -1) * (noiseLevel * 2.2);
        targetY += noiseSway;
      }

      // Draw transition step with a hardware edge slew
      path += ` L ${currentX} ${targetY}`;
      
      // Horizontal signal plateau with optional high-frequency micro jitter
      currentX += bitWidth;
      
      if (noiseLevel > 1) {
        // Multi-point jitter line to show physical high-frequency electromagnetic interference
        const steps = 4;
        const subStep = bitWidth / steps;
        for (let i = 1; i <= steps; i++) {
          const jitterX = currentX - bitWidth + (i * subStep);
          // Add random jitter noise
          const jitterY = targetY + (Math.sin(i * 1.5) * (noiseLevel * 1.0));
          path += ` L ${jitterX} ${jitterY}`;
        }
      } else {
        path += ` L ${currentX} ${targetY}`;
      }
    });
    return path;
  };

  // Gather simulated binary profiles for output waveforms
  const getProtocolSignalMap = () => {
    switch (selectedProtocol) {
      case "UART":
        return {
          mainLabel: "TX Data Line (Serial Matrix)",
          mainBits: [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1], // Represents character bits with start/stop
          secLabel: "RX Line Standby state",
          secBits: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        };
      case "I2C":
        return {
          mainLabel: "SDA (Serial Bus Data Edge)",
          mainBits: [1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
          secLabel: "SCL (Synchronous Bus Clock Period)",
          secBits: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
        };
      case "SPI":
        return {
          mainLabel: "MOSI Driver Vector Out",
          mainBits: [0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1],
          secLabel: "SCK Master Shift Clock",
          secBits: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
        };
    }
  };

  const { mainLabel, mainBits, secLabel, secBits } = getProtocolSignalMap();

  // Accurate localized hardware feedback computation block
  const getRegisterFeedbackList = () => {
    // Binary flags matching register configuration
    const isComLocked = registerBits[0] === 1;   // COM_LOCK
    const isParityOn = registerBits[3] === 1;    // PARITY_ON
    const isAdcRefExt = registerBits[4] === 1;   // ADC_REF
    const isClockFast = registerBits[5] === 1;   // CLK_FAST
    const isLedBlinking = registerBits[6] === 1; // LED_STAT
    const isInterruptOn = registerBits[7] === 1; // INT_EN

    const alerts = [];

    // Core Interrupt Controller (INT_EN)
    if (isInterruptOn) {
      alerts.push({
        type: "SUCCESS",
        icon: <Workflow className="w-4 h-4 text-emerald-400 shrink-0" />,
        title: "IRQ ACTIVE",
        text: "NVIC active; mapped to vector 0x3C."
      });
    } else {
      alerts.push({
        type: "INFO",
        icon: <Info className="w-4 h-4 text-slate-400 shrink-0" />,
        title: "POLLING ENGAGED",
        text: "Interrupts disabled (polling mode)."
      });
    }

    // Core Overclock Multiplying Diagnostics (CLK_FAST)
    if (isClockFast) {
      alerts.push({
        type: "WARNING",
        icon: <Flame className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />,
        title: "OVERCLOCK ACTIVE",
        text: "PLL overclocked to 120MHz (high heat)."
      });
    } else {
      alerts.push({
        type: "SUCCESS",
        icon: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
        title: "ECO CLOCK MODE",
        text: "CPU running on nominal 16MHz crystal."
      });
    }

    // Secure ROM Write-Barrier Protection Gate (COM_LOCK)
    if (isComLocked) {
      alerts.push({
        type: "DANGER",
        icon: <Shield className="w-4 h-4 text-red-500 shrink-0 animate-bounce" />,
        title: "SECTOR LOCKED",
        text: "Flash partition 0x08100000 write-locked."
      });
    } else {
      alerts.push({
        type: "INFO",
        icon: <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />,
        title: "FLASH UNLOCKED",
        text: "Sector write-enabled (upgrades active)."
      });
    }

    // ADC Differential VREF Grounding Calibration (ADC_REF)
    if (isAdcRefExt) {
      alerts.push({
        type: "INFO",
        icon: <Sliders className="w-4 h-4 text-brand-cyan shrink-0" />,
        title: "EXT REFERENCE",
        text: "VREF enabled for ADC calibration."
      });
    }

    // Heartbeat LED Output pin status (LED_STAT)
    if (isLedBlinking) {
      alerts.push({
        type: "SUCCESS",
        icon: <Radio className="w-4 h-4 text-emerald-400 shrink-0 animate-ping text-[8px]" />,
        title: "HEARTBEAT LED",
        text: "Run-state indicator active."
      });
    }

    // Signal Line Noise Alerts
    if (noiseLevel > 1) {
      alerts.push({
        type: "WARNING",
        icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />,
        title: "HIGH NOISE ALERT",
        text: `Bus interference is at +${noiseLevel * 6}dBm.`
      });
    }

    return alerts;
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
      terminalMode
        ? "bg-black border-brand-lime/20 text-brand-lime shadow-lime-glow"
        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-800"
    }`}>
      
      {/* Visual Ambient Frame Background glow points */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${terminalMode ? "bg-brand-lime/10 text-brand-lime" : "bg-brand-cyan/10 text-brand-cyan"}`}>
              <Cpu className="w-5.5 h-5.5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className={`text-lg font-black uppercase tracking-tight text-white font-display ${terminalMode && "font-mono text-brand-lime"}`}>
                Interactive ASIC Logic & Register Studio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-bold">
                Real-time custom validation of hardware register structures & electromagnetic transmission paths.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controller Management Actions */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          {/* Protocol selector capsules */}
          <div className="flex bg-slate-950/90 p-1 rounded-lg border border-slate-800">
            {(["UART", "I2C", "SPI"] as const).map((proto) => (
              <button
                key={proto}
                onClick={() => {
                  setSelectedProtocol(proto);
                  setTransmissionLogs(prev => [
                    `SYS: Focused channel registers updated to mount protocol: [${proto}]`,
                    ...prev.slice(0, 5)
                  ]);
                }}
                className={`px-3 py-1.5 rounded font-black uppercase transition-all tracking-wider ${
                  selectedProtocol === proto
                    ? terminalMode
                      ? "bg-brand-lime/20 text-brand-lime border border-brand-lime/30"
                      : "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 shadow-cyan-glow"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          {/* Reset Controller Action */}
          <button
            onClick={resetController}
            title="Perform hardware reboot & reset registers to factory state"
            className={`px-3 py-2 rounded-lg font-extrabold uppercase border flex items-center gap-1.5 transition-all text-white ${
              terminalMode
                ? "border-brand-lime/30 bg-black hover:border-brand-lime hover:bg-brand-lime/10"
                : "border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-slate-700"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Microcontroller</span>
          </button>
        </div>
      </div>

      {/* Grid Layout of Controls & Waveforms screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COMPARTMENT: The Signal Analyzer Scope Output (7 columns) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          <div className="bg-slate-950/90 border border-slate-850 rounded-xl p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0 opacity-15" />
            
            {/* Header Telemetry stats readout in oscilloscope frame */}
            <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-4 font-mono text-[10px] text-slate-400 gap-2">
              <span className="font-extrabold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                SCOPE: CO-AXIAL PROBE IN_0x00
              </span>
              
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-wider text-slate-500">PARAMS:</span>
                <span className="text-white">VOLTs: <span className="font-bold text-brand-cyan">{voltageLevel}V</span></span>
                <span className="text-white">TEMP: <span className="font-bold text-amber-400">{coreTemp}°C</span></span>
                <span className="text-white">ERROR_PER: <span className={`font-bold ${packetErrorRate > 10 ? "text-red-500" : "text-emerald-400"}`}>{packetErrorRate}%</span></span>
              </div>

              <span className={`animate-pulse flex items-center gap-1.5 font-black ${isPulsing ? "text-amber-400" : "text-slate-500"}`}>
                <span className={`w-2 h-2 rounded-full ${isPulsing ? "bg-amber-400" : "bg-slate-600"}`} />
                {isPulsing ? "PROBE TRIGGER ACTIVE" : "STANDBY"}
              </span>
            </div>            {/* Simulated Logic Traces SVG Graphics Area */}
            <div className="relative z-10 space-y-2.5">
              
              {/* Primary Data Line Trace */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className={`font-black ${terminalMode ? "text-brand-lime" : "text-brand-cyan"}`}>
                    {mainLabel}
                  </span>
                  <span className="text-[9px] text-slate-400 font-extrabold bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800/50">
                    DATA_BYTE: {mainBits.map(b => (isPulsing ? Math.round(Math.random()) : b)).join("")}
                  </span>
                </div>
                
                <div className="w-full bg-[#070a13] rounded-xl border border-slate-850 p-2 overflow-x-auto select-none scrollbar-thin">
                  <svg className="w-full min-w-[500px] h-14" viewBox="0 0 510 38">
                    {/* Background Coordinate Axis Grid */}
                    <line x1="0" y1="19" x2="510" y2="19" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="120" y1="0" x2="120" y2="38" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="240" y1="0" x2="240" y2="38" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="360" y1="0" x2="360" y2="38" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="480" y1="0" x2="480" y2="38" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
 
                    {/* Laser Trace Line rendering */}
                    <path
                      d={generateWaveformPath(isPulsing ? mainBits.map((b, i) => (i % 2 === 0 ? b : 1 - b)) : mainBits, false)}
                      fill="none"
                      stroke={terminalMode ? "var(--terminal-accent)" : "#00FFFF"}
                      strokeWidth="2.0"
                      className="transition-all duration-300 drop-shadow-[0_0_3px_rgba(0,255,255,0.3)]"
                    />
 
                    {/* Numeric logic state overlays */}
                    {(isPulsing ? mainBits.map((b, i) => (i % 2 === 0 ? b : 1 - b)) : mainBits).map((bit, idx) => {
                      const cyVal = (bit === 1 ? 6 : 30) + (noiseLevel > 0 ? (idx % 2 === 0 ? 1 : -1) * (noiseLevel * 2.2) : 0);
                      return (
                        <g key={idx}>
                          <circle
                            cx={10 + idx * 45}
                            cy={cyVal}
                            r="3.5"
                            fill={terminalMode ? "var(--terminal-accent)" : (bit === 1 ? "#00D9FF" : "#FF007F")}
                            className="transition-all duration-200"
                          />
                          <text
                            x={10 + idx * 45}
                            y={bit === 1 ? 14 : 26}
                            fill="#FFFFFF"
                            fontSize="8"
                            fontWeight="800"
                            textAnchor="middle"
                            fontFamily="monospace"
                            className="pointer-events-none select-none opacity-80"
                          >
                            {bit}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
 
              {/* Secondary Reference Clock Line Trace */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400 font-extrabold">{secLabel}</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    SYNCHRONIZED CORE REFERENCE SIGNALS
                  </span>
                </div>
 
                <div className="w-full bg-[#070a13] rounded-xl border border-slate-850 p-2 overflow-x-auto select-none scrollbar-thin">
                  <svg className="w-full min-w-[500px] h-10" viewBox="0 0 510 28">
                    <line x1="0" y1="14" x2="510" y2="14" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
                    
                    <path
                      d={generateWaveformPath(secBits, true)}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1.5"
                      className="drop-shadow-[0_0_1px_rgba(71,85,105,0.2)]"
                    />
                    
                    {secBits.map((bit, idx) => (
                      <text
                        key={idx}
                        x={10 + idx * 45}
                        y="24"
                        fill="#475569"
                        fontSize="7"
                        fontWeight="black"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="select-none pointer-events-none"
                      >
                        CLK
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Parameters Adjustments Cockpit inside Oscilloscope panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-850 relative z-10">
              
              {/* Byte to transmit config */}
              <div className="space-y-1 font-mono text-xs text-white">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  PROBE BYTE
                </span>
                <input
                  type="text"
                  value={pulseValue}
                  onChange={(e) => setPulseValue(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="0x5A"
                  className="w-full p-2 rounded-lg bg-slate-900 text-center text-white border border-slate-800 focus:border-brand-cyan font-bold outline-none text-xs"
                />
              </div>

              {/* Baud Rate selector */}
              <div className="space-y-1 font-mono text-xs text-white">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  BAUDRATE MODE
                </span>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-800 font-bold outline-none text-xs"
                >
                  <option value="9600">9600 bps</option>
                  <option value="115200">115200 bps</option>
                  <option value="400000">400 kHz (SCL)</option>
                </select>
              </div>

              {/* Noise electromagnetic interference injector level */}
              <div className="space-y-1 font-mono text-xs text-white">
                <span className="text-slate-350 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                  NOISE SPANS: +{noiseLevel * 6}dBm
                </span>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 text-[10px] font-black">
                  {[0, 1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setNoiseLevel(level)}
                      className={`flex-1 py-1 rounded text-center transition-all ${
                        noiseLevel === level
                          ? level > 1
                            ? "bg-red-500/20 text-red-400 font-extrabold border border-red-500/30"
                            : "bg-brand-cyan/20 text-brand-cyan font-extrabold border border-brand-cyan/30"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {level === 0 ? "NONE" : `${level}G`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parity Frame option */}
              <div className="space-y-1 font-mono text-xs text-white">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  PARITY BIT
                </span>
                <select
                  value={parityMode}
                  onChange={(e) => setParityMode(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-slate-900 text-white border border-slate-800 font-bold outline-none text-xs"
                >
                  <option value="None">None (Standard)</option>
                  <option value="Even">Even Match</option>
                  <option value="Odd">Odd Match</option>
                </select>
              </div>

            </div>

            {/* Probe trigger button */}
            <div className="mt-4 flex items-center justify-end relative z-10">
              <button
                onClick={triggerPulse}
                disabled={isPulsing}
                className={`py-2.5 px-6 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
                  isPulsing
                    ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed"
                    : terminalMode
                      ? "bg-brand-lime text-black hover:bg-black hover:text-brand-lime border border-brand-lime shadow-lime-glow"
                      : "bg-[#00E5FF] text-black hover:bg-black hover:text-[#00E5FF] border border-[#00E5FF] font-black shadow-cyan-glow"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isPulsing && "animate-spin"}`} />
                <span>{isPulsing ? "DEMODULATING STATE WAVE..." : "Assert Trigger Logic Probe"}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Core Telemetry Terminal Packet stream view */}
          <div className="bg-black/95 rounded-xl p-4 border border-slate-850 font-mono text-[10px] space-y-2 h-[120px] overflow-y-auto shadow-inner relative">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block sticky top-0 bg-black/95 py-0.5 border-b border-slate-900">
              // TELEMETRY LIVE PACKET TRANSMISSION STREAM CODES
            </span>
            <div className="space-y-1 text-white">
              {transmissionLogs.map((log, lIdx) => {
                const isErr = log.startsWith("ERROR:");
                const isReg = log.startsWith("REG:");
                const isSys = log.startsWith("SYS:");
                const isReset = log.startsWith("RESET:");
                
                let textColor = "text-[#00FFFF]";
                if (isErr) textColor = "text-red-400 font-bold";
                else if (isReg) textColor = "text-purple-400";
                else if (isSys) textColor = "text-slate-400";
                else if (isReset) textColor = "text-amber-400 font-extrabold";

                return (
                  <div key={lIdx} className="flex gap-2">
                    <span className="text-slate-600 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
                    <span className={textColor}>{log}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: ASIC Core Flag Settings Registers Dashboard (5 columns) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-4">
          <div className="bg-[#111827]/85 border border-slate-850 p-5 rounded-xl flex flex-col justify-between hover:border-[#1e294b] transition-all duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3.5 font-mono text-[10px]">
                <span className="text-slate-400 tracking-wider font-extrabold">GATEWAY_OFFSET: 0x40003024</span>
                <span className="text-brand-purple font-black uppercase tracking-wider">
                  CONTROL_BYTE_REG
                </span>
              </div>

              <p className="text-xs text-white leading-relaxed mb-4 font-normal">
                Toggle bits to modify register offsets.
              </p>

              {/* Bit Array Interactive Box Units */}
              <div className="grid grid-cols-2 gap-2.5 mb-4 font-mono">
                {registerBits.map((bitVal, idx) => {
                  // Index matches flags:
                  // 0: COM_LOCK (Bit 7), 1: I2C_ADDR_0 (Bit 6), 2: I2C_ADDR_1 (Bit 5),
                  // 3: PARITY_ON (Bit 4), 4: ADC_REF (Bit 3), 5: CLK_FAST (Bit 2),
                  // 6: LED_STAT (Bit 1), 7: INT_EN (Bit 0)
                  const Labels = [
                    "COM_LOCK",
                    "I2C_AD_0",
                    "I2C_AD_1",
                    "PARITY",
                    "ADC_REF",
                    "CLK_FAST",
                    "LED_STAT",
                    "INT_EN"
                  ];
                  const bitLabel = Labels[idx];
                  const bitNumber = 7 - idx;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleBit(idx)}
                      title={`Toggle flag node [Bit ${bitNumber}]: ${bitLabel}`}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all duration-200 select-none ${
                        bitVal === 1
                          ? terminalMode
                            ? "bg-brand-lime/15 border-brand-lime text-brand-lime shadow-lime-glow"
                            : "bg-[#8b5cf6]/10 border-brand-purple/75 text-violet-300 hover:border-brand-purple hover:scale-[1.02] shadow-md shadow-brand-purple/5"
                          : "bg-slate-950/80 border-slate-850/80 text-slate-500 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-500 tracking-wider">BIT {bitNumber}</span>
                        <span className={`text-xs font-black tracking-wide truncate ${bitVal === 1 ? 'text-white' : 'text-slate-400'}`}>{bitLabel}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 ml-1">
                        <span className={`text-xs font-black ${bitVal === 1 ? 'text-white' : 'text-slate-500'}`}>
                          {bitVal}
                        </span>
                        <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          bitVal === 1 
                            ? terminalMode 
                              ? "bg-brand-lime shadow-lime-glow" 
                              : "bg-[#A855F7] shadow-purple-glow animate-pulse"
                            : "bg-slate-800"
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Binary to Hex/Decimal Converter readouts */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/90 rounded-xl p-3 border border-slate-850 text-center font-mono mb-4 text-white">
                <div className="p-1">
                  <span className="text-[9px] text-[#00E5FF] font-extrabold uppercase tracking-wider block">Binary</span>
                  <span className="text-xs font-black block mt-1">0b{registerBits.join("")}</span>
                </div>
                <div className="border-x border-slate-850 p-1">
                  <span className="text-[9px] text-[#A855F7] font-extrabold uppercase tracking-wider block">Hex Value</span>
                  <span className={`text-xs font-black block mt-1 ${terminalMode ? "text-brand-lime text-glow-lime" : "text-brand-cyan text-glow-cyan"}`}>
                    {calculateHex(registerBits)}
                  </span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Decimal</span>
                  <span className="text-xs font-black text-slate-200 block mt-1">{calculateDec(registerBits)}</span>
                </div>
              </div>

              {/* Tab Selector for Diagnostics vs RAG Finder */}
              <div className="border-t border-slate-850/80 pt-3.5 mt-3">
                <div className="flex bg-slate-950/95 rounded-lg p-1 border border-slate-850/60 mb-3 font-mono text-[9px]">
                  <button
                    onClick={() => setActiveRightTab("diagnostics")}
                    className={`flex-1 py-1 px-2 rounded font-black uppercase text-center transition-all flex items-center justify-center gap-1.5 ${
                      activeRightTab === "diagnostics"
                        ? terminalMode
                          ? "bg-brand-lime/25 text-brand-lime font-black"
                          : "bg-[#8b5cf6]/20 text-indigo-300 border border-[#8b5cf6]/35 font-extrabold"
                        : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    <span>📡</span>
                    <span>Diagnostic Signals</span>
                  </button>
                  <button
                    onClick={() => setActiveRightTab("rag")}
                    className={`flex-1 py-1 px-2 rounded font-black uppercase text-center transition-all flex items-center justify-center gap-1.5 ${
                      activeRightTab === "rag"
                        ? terminalMode
                          ? "bg-brand-lime/25 text-brand-lime font-black"
                          : "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/35 font-extrabold"
                        : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    <span>⚡</span>
                    <span>Offline RAG Finder</span>
                  </button>
                </div>

                {/* Tab Content area */}
                <div className="transition-all duration-300 min-h-[220px]">
                  {activeRightTab === "diagnostics" ? (
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black block">
                        // Core Active Status Signal Indicators
                      </span>
                      
                      <div className="grid grid-cols-1 gap-2 max-h-[190px] overflow-y-auto pr-1">
                        {getRegisterFeedbackList().map((item, idx) => {
                          const isSuccess = item.type === "SUCCESS";
                          const isWarning = item.type === "WARNING";
                          const isDanger = item.type === "DANGER";
                          
                          let bgBorderClass = "bg-slate-950/80 border-slate-850 text-slate-400";
                          let titleColor = "text-slate-350";
                          if (isSuccess) {
                            bgBorderClass = "bg-emerald-950/10 border-emerald-500/20 text-emerald-400";
                            titleColor = "text-emerald-300";
                          } else if (isWarning) {
                            bgBorderClass = "bg-amber-950/15 border-amber-500/20 text-amber-500";
                            titleColor = "text-amber-450";
                          } else if (isDanger) {
                            bgBorderClass = "bg-red-950/15 border-red-500/25 text-red-400";
                            titleColor = "text-red-300";
                          }

                          return (
                            <div 
                              key={idx}
                              className={`flex items-start gap-2.5 p-2.5 rounded-lg text-[10.5px] font-mono border transition-all duration-300 hover:translate-x-0.5 ${bgBorderClass}`}
                            >
                              <div className="mt-0.5 bg-slate-900/60 p-1 rounded border border-white/5">{item.icon}</div>
                              <div className="space-y-0.5 select-none">
                                <span className={`block text-[9px] font-black tracking-wider uppercase ${titleColor}`}>
                                  {item.title}
                                </span>
                                <span className="leading-relaxed text-white font-medium block">
                                  {item.text}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block">
                          // VECTOR RETRIEVAL: LOC_RAG_ENGINE
                        </span>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/15 font-black">
                          OFFLINE
                        </span>
                      </div>

                      {/* Simulated Query Search Input bar */}
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={ragQuery}
                            onChange={(e) => handleRagSearch(e.target.value)}
                            placeholder="Type keyword e.g. 'COM_LOCK', 'interrupt', 'overclock'..."
                            className="w-full pl-2.5 pr-12 py-1.5 rounded-lg bg-slate-950 text-white border border-slate-850/80 focus:border-brand-cyan/80 outline-none text-[11px]"
                          />
                          {ragQuery && (
                            <button 
                              onClick={() => handleRagSearch("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[9px] font-bold"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {/* Fast Lookup Chips */}
                        <div className="flex flex-wrap gap-1">
                          {[
                            "COM_LOCK protect",
                            "overclock frequency",
                            "SPI MOSI SCK",
                            "interrupt nvic"
                          ].map((suggested) => (
                            <button
                              key={suggested}
                              onClick={() => handleRagSearch(suggested)}
                              className="text-[8px] px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-850/60 text-slate-400 hover:text-white transition-all text-left flex items-center gap-1 font-bold"
                            >
                              <span>⚡</span> {suggested}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Simulated local chunk search result rendering */}
                      {ragResult ? (
                        <div className="bg-slate-950/90 rounded-lg p-2.5 border border-slate-850/80 text-left space-y-1.5 animate-fadeIn transition-all duration-300">
                          <div className="flex items-center justify-between border-b border-slate-850 pb-1 text-[9px] gap-2">
                            <span className="text-[#00E5FF] font-black truncate uppercase tracking-tight">
                              📂 {ragResult.topic}
                            </span>
                            <span className={`text-[8px] px-1 rounded font-bold shrink-0 ${
                              ragResult.confidence > 70 ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-500"
                            }`}>
                              CONF: {ragResult.confidence}%
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-200 leading-relaxed font-sans">{ragResult.content}</p>

                          <div className="flex flex-wrap items-center justify-between text-[7px] text-slate-500 pt-1 border-t border-slate-900 gap-1.5 uppercase font-bold">
                            <span className="truncate">SOURCE: {ragResult.chunkSource}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-950/50 rounded-lg py-4 px-2.5 border border-dashed border-slate-850/85 text-center">
                          <span className="text-[8.5px] text-slate-500 block leading-normal font-bold">
                            // TAP A VECTOR KEYWORD OR TYPE ABOVE TO QUERY
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
 
            {/* Bottom hardware security verification tag */}
            <div className="mt-3.5 flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-850/60 font-mono text-[9px] text-slate-400 justify-center">
              <Shield className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
              <span className="text-center font-bold select-none">Asynchronous peripheral status synchronization secured.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
