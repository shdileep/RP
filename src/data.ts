import { Experience, Project, SkillCategory, Education, Tool, TerminalTheme } from './types';

export const PERSONAL_INFO = {
  name: "Revathi Galla",
  title: "Embedded Software Engineer",
  subtitle: "Linux Kernel • Firmware • Device Drivers",
  experienceYears: "3+",
  location: "Hyderabad, Telangana",
  email: "contact@revathigalla.dev",
  phone: "+91 9X-XXXX-XXXX",
  github: "https://github.com/revathigalla189",
  linkedin: "https://linkedin.com/in/revathi-galla-embedded",
  summary: "Embedded Software Engineer with 3+ years of experience in firmware and Embedded Linux development. Skilled in Linux Device Drivers, Platform Driver Development, Device Tree (DTS), bootloader mechanisms, and embedded communication protocols. Experience with ARM-based microcontrollers and Raspberry Pi 4 for low-level development and debugging. Strong foundation in Embedded C, Linux Kernel concepts, and embedded systems.",
  availability: "Available for technical roles",
  stats: [
    { label: "Experience", value: "3+ Years" },
    { label: "Kernel Drivers", value: "Platform/DTS" },
    { label: "Firmware Core", value: "ARM Cortex" },
    { label: "Smart Metering", value: "DLMS/COSEM" }
  ]
};

export const EXPERIENCES: Experience[] = [
  {
    company: "Mirafra Software Technologies",
    role: "Embedded Software Engineer - II",
    period: "Apr 2026 - Present",
    location: "Hyderabad, India",
    logo: "M",
    bullets: [
      "Worked on Embedded Linux architectures, delving into Linux Kernel concepts and Linux Device Driver development.",
      "Developed and extensively tested Platform Drivers with and without Device Tree (DTS) on Raspberry Pi 4 Model B.",
      "Performed kernel module integration and completed rigorous low-level debugging tasks in complex Linux environments.",
      "Utilized dmesg kernel diagnostic buffers and printk logging metrics for driver diagnostics and target debugging."
    ],
    tech: ["Embedded Linux", "Linux Kernel", "Device Driver", "DTS", "Raspberry Pi 4", "printk/dmesg", "Platform Driver"],
    terminalLogs: [
      "$ uname -r",
      "6.1.21-v8+ #1 SMP PREEMPT RPi-4B",
      "$ insmod rp_platform_driver.ko config_pin=18",
      "[ 128.409210 ] rp_platform_driver: loading out-of-tree module taints kernel.",
      "[ 128.409893 ] rp_platform_driver: probing hardware device tree node '/soc/rp_driver@18'...",
      "[ 128.410112 ] rp_platform_driver: successfully mapped physical register space 0xFE200000",
      "[ 128.410250 ] rp_platform_driver: IRQ line 42 bound to handler.",
      "$ cat /proc/devices | grep rp_device",
      "241 rp_device"
    ]
  },
  {
    company: "Linkwell Telsystems Pvt Ltd",
    role: "Embedded Firmware Engineer",
    period: "Jun 2023 - Apr 2026",
    location: "Hyderabad, India",
    logo: "L",
    bullets: [
      "Developed high-reliability embedded firmware for smart energy metering products using Embedded C on resource-constrained ARM Cortex-M0+ microcontrollers.",
      "Coded and maintained low-level peripheral drivers for UART, I²C, SPI, flash EEPROM, and custom segment LCD controllers.",
      "Configured DLMS/COSEM communication layers, custom frame parsing tables, and executed protocol level debugging using Gurux DLMS Translator platforms.",
      "Engineered secure embedded bootloaders to support Over-The-Air firmware updates (FOTA) and dual-image flash rollback arrays.",
      "Optimized memory footprints (SRAM/Flash reduction) and strictly adhered to MISRA-C and Barr-C firmware secure coding guidelines."
    ],
    tech: ["ARM Cortex-M0+", "Embedded C", "DLMS/COSEM", "UART/I²C", "EEPROM Driver", "FOTA", "MISRA-C", "Bootloader"],
    terminalLogs: [
      "BOOTSTAGE: Primary Bootloader v1.4.2 [CRITICAL_SECURE]",
      "BOOTSTAGE: Initializing Flash bank verification...",
      "BOOTSTAGE: Image 0x08008000 validation checksum CRC16: [ OK ]",
      "BOOTSTAGE: Booting Main Application firmware @ 0x08008010",
      "[INIT] Smart Meter stack ready.",
      "[METER] DLMS: Initializing HDLC transport frame mapping (BAUD=9600)",
      "[METER] I2C: Calibration register readback: 0x3F01 [ADDR:0x50]"
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "linux-driver",
    title: "Linux Platform Driver",
    description: "Low-level Linux kernel platform driver supporting physical hardware integration via Device Tree overlays.",
    longDescription: "A custom character device platform driver designed for the Raspberry Pi 4 Model B. This project links with the Linux device model, dynamically parses parameters through Device Tree Source (DTS) properties, allocates major/minor numbers, registers character device files, coordinates system interrupts (IRQs) using softirq handlers, and handles synchronization constraints under SMP architecture.",
    category: "Driver",
    skills: ["Embedded Linux", "Platform Drivers", "DTS", "Raspberry Pi 4", "Sysfs Control", "printk"],
    metrics: [
      { label: "Kernel Target", value: "v6.1.x LTS" },
      { label: "Interrupt Latency", value: "< 14µs" },
      { label: "Data Throughput", value: "4.2 Mbps" }
    ],
    architecture: {
      blocks: ["User App", "VFS Node", "Char Driver", "DTS Probe", "Raspberry Pi Hardware"],
      connections: [
        { from: "User App", to: "VFS Node" },
        { from: "VFS Node", to: "Char Driver" },
        { from: "DTS Probe", to: "Char Driver" },
        { from: "Char Driver", to: "Raspberry Pi Hardware" }
      ]
    },
    codeSnippet: `#include <linux/module.h>
#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/fs.h>

static int galla_driver_probe(struct platform_device *pdev) {
    struct device *dev = &pdev->dev;
    struct device_node *np = dev->of_node;
    u32 gpio_pin;

    dev_info(dev, "Revathi Galla character device probe initiated\\n");
    if (!np) return -EINVAL;

    if (of_property_read_u32(np, "galla,control-gpio", &gpio_pin)) {
        dev_err(dev, "Missing 'galla,control-gpio' DTS property\\n");
        return -EINVAL;
    }
    dev_info(dev, "Bound successfully to GPIO Pin %u\\n", gpio_pin);
    return 0;
}

static struct platform_driver galla_driver = {
    .probe = galla_driver_probe,
    .driver = {
        .name = "galla_platform",
        .of_match_table = of_match_ptr(galla_of_match),
    },
};
module_platform_driver(galla_driver);`,
    githubUrl: "https://github.com/revathigalla189/rpi-platform-driver"
  },
  {
    id: "smart-meter",
    title: "DLMS Smart Meter Firmware",
    description: "Highly compliant utility smart meter firmware for ARM Cortex, utilizing DLMS/COSEM standard.",
    longDescription: "Production-ready smart energy meter firmware optimized for ultra-low power ARM Cortex-M0+ architectures. Implements secure client-side communication over HDLC, processes and translates frames with Gurux, logs parameters in flash sectors, drives segmented LCD panels directly, and integrates optical/RS485 transceiver state-machines.",
    category: "Firmware",
    skills: ["ARM Cortex-M0+", "DLMS/COSEM", "Gurux DLMS", "Low-Power Modes", "LCD Controllers", "UART"],
    metrics: [
      { label: "Processor Footprint", value: "64KB Flash" },
      { label: "Power Draw", value: "11µA (Sleep)" },
      { label: "Compliance Score", value: "100% CTT Passed" }
    ],
    architecture: {
      blocks: ["DLMS CTT Client", "Gurux Protocol Deck", "Meter Billing Task", "Internal EEPROM", "Transceiver Bus"],
      connections: [
        { from: "DLMS CTT Client", to: "Gurux Protocol Deck" },
        { from: "Gurux Protocol Deck", to: "Meter Billing Task" },
        { from: "Meter Billing Task", to: "Internal EEPROM" },
        { from: "Meter Billing Task", to: "Transceiver Bus" }
      ]
    },
    codeSnippet: `#include "dlms_cosem.h"
#include "eeprom_driver.h"

void process_cosem_request(CosemFrame_t *frame) {
    uint16_t class_id = (frame->data[0] << 8) | frame->data[1];
    uint8_t obis_code[6];
    memcpy(obis_code, &frame->data[2], 6);

    // Filter Active Energy import register 1.0.1.8.0.255
    if (obis_code[1] == 0 && obis_code[2] == 1 && obis_code[3] == 8) {
        uint32_t current_reading = read_billing_calibration_data();
        dlms_encode_unsigned32(current_reading, frame->response_buffer);
        transmit_dlms_frame(frame->response_buffer);
    }
}`,
    githubUrl: "https://github.com/revathigalla189/smartmeter-dlms-cosem"
  },
  {
    id: "fota-bootloader",
    title: "Secure Flash Bootloader",
    description: "Fault-tolerant secure bootloader supporting FOTA dual-bank swaps, validation, and watchdogs.",
    longDescription: "A bulletproof secondary bootloader designed for memory-constrained MCUs to execute fault-tolerant Firmware-Over-The-Air upgrades. Utilizes isolated flash banks for double-buffering, validates digital signatures (CRC16/AES), prevents bricking utilizing hardware watchdog modules, and handles power loss halfway through the image copy sector loop.",
    category: "Low-Level",
    skills: ["Bootloader", "FOTA Swaps", "Flash Controller", "AES Verification", "Watchdog Timer"],
    metrics: [
      { label: "Boot Recovery", value: "100% Guaranteed" },
      { label: "Image Size Limit", value: "256 KB x 2" },
      { label: "CRC Verification", value: "12ms (avg)" }
    ],
    architecture: {
      blocks: ["OTA Socket", "Stage-1 Bootloader", "Sector Flash Burner", "Backup Recovery Bank", "Core MCU Target"],
      connections: [
        { from: "OTA Socket", to: "Sector Flash Burner" },
        { from: "Stage-1 Bootloader", to: "Sector Flash Burner" },
        { from: "Sector Flash Burner", to: "Backup Recovery Bank" },
        { from: "Sector Flash Burner", to: "Core MCU Target" }
      ]
    },
    codeSnippet: `#define BANK_A_START  0x08008000
#define BANK_B_START  0x08040000

bool verify_firmware_image(uint32_t start_addr) {
    uint16_t computed_crc = 0xFFFF;
    FirmwareHeader_t *header = (FirmwareHeader_t*)start_addr;

    if (header->magic != GALLA_FW_MAGIC) return false;
    
    // Check checksum over image body
    computed_crc = crc16_calculate((uint8_t*)(start_addr + sizeof(FirmwareHeader_t)), header->file_size);
    return (computed_crc == header->crc16);
}

void swap_active_image_and_reboot() {
    disable_all_interrupts();
    flash_copy_bank(BANK_B_START, BANK_A_START);
    system_software_reset();
}`,
    githubUrl: "https://github.com/revathigalla189/mcu-dualbank-bootloader"
  },
  {
    id: "bus-stack",
    title: "I2C & EEPROM Driver Stack",
    description: "Metal-level driver written from specs for complex multi-byte page read/write cycles and bus error checks.",
    longDescription: "A precise bare-metal driver written directly from chip datasheets for high-reliability parameters logging. Features structured bus arbitration, clock-stretching handlers, multi-byte block page writes with internal timeouts, and asynchronous interrupt-driven state machines designed for MISRA-C compliance.",
    category: "Bus",
    skills: ["Bare-Metal UART/I2C", "EEPROM Controller", "MISRA-C Standards", "Bus Clock Stretching", "Oscilloscope Tuning"],
    metrics: [
      { label: "Bus Frequency", value: "400 kHz (Fast)" },
      { label: "MISRA Adherence", value: "Category A Compliant" },
      { label: "Error Detection", value: "Noise Filter Hooked" }
    ],
    architecture: {
      blocks: ["C Application", "Interrupt Controller", "I2C Controller Registers", "I2C Hardware Bus", "Atmel EEPROM Chip"],
      connections: [
        { from: "C Application", to: "Interrupt Controller" },
        { from: "Interrupt Controller", to: "I2C Controller Registers" },
        { from: "I2C Controller Registers", to: "I2C Hardware Bus" },
        { from: "I2C Hardware Bus", to: "Atmel EEPROM Chip" }
      ]
    },
    codeSnippet: `void i2c_eeprom_write_page(uint16_t device_addr, uint16_t memory_offset, const uint8_t *buffer, uint8_t size) {
    wait_until_bus_is_free();
    
    i2c_send_start();
    i2c_write_byte((device_addr << 1) | I2C_WRITE_BIT);
    wait_for_ack();

    // High and Low physical memory byte address
    i2c_write_byte((uint8_t)(memory_offset >> 8));
    wait_for_ack();
    i2c_write_byte((uint8_t)(memory_offset & 0xFF));
    wait_for_ack();

    for (uint8_t i = 0; i < size && i < EEPROM_PAGE_SIZE; i++) {
        i2c_write_byte(buffer[i]);
        wait_for_ack();
    }
    i2c_send_stop();
    delay_ms(5); // Physical write settling time
}`,
    githubUrl: "https://github.com/revathigalla189/baremetal-i2c-eeprom-stack"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Embedded Systems",
    skills: [
      { name: "Embedded C", percentage: 95 },
      { name: "ARM Cortex-M0+", percentage: 90 },
      { name: "Firmware Architecture", percentage: 88 },
      { name: "Bare-metal Coding", percentage: 85 }
    ]
  },
  {
    title: "Linux & Kernel dev",
    skills: [
      { name: "Embedded Linux", percentage: 92 },
      { name: "Platform Drivers", percentage: 89 },
      { name: "Device Tree (DTS)", percentage: 86 },
      { name: "Kernel Module loading", percentage: 90 }
    ]
  },
  {
    title: "Protocols & Storage",
    skills: [
      { name: "UART & I²C Bus", percentage: 96 },
      { name: "DLMS/COSEM", percentage: 86 },
      { name: "EEPROM Controller", percentage: 90 },
      { name: "Bootloader & FOTA", percentage: 85 }
    ]
  },
  {
    title: "Debugging Hardware",
    skills: [
      { name: "Low-level static checks", percentage: 90 },
      { name: "dmesg & printk diagnostic", percentage: 94 },
      { name: "JTAG & Oscilloscopes", percentage: 82 },
      { name: "Docklight Terminal", percentage: 88 }
    ]
  }
];

export const TECHNICAL_TOOLS: Tool[] = [
  { name: "Gurux DLMS Translator", category: "Protocols", description: "Interpreting, translating and parsing DLMS smart meters framing packets" },
  { name: "Docklight", category: "Bus Terminal", description: "High flexibility RS232, RS485 and TCP stream validation engine" },
  { name: "IAR Embedded Workbench", category: "IDE / Compiler", description: "Ultra-precise compiler toolchain optimized heavily for ARM microcontrollers" },
  { name: "VS Code", category: "Editor", description: "Lightweight file workspace containing terminal nodes and C/C++ static check parsers" },
  { name: "Raspberry Pi Imager", category: "Operating Systems", description: "Fast platform loader flashing custom buildroot profiles onto SD arrays" },
  { name: "JTAG Adapters", category: "Hardware Debugger", description: "Hardware emulator directly probing registers and RAM variables of running chips" }
];

export const EDUCATION: Education[] = [
  {
    degree: "B.Tech – ECE",
    institution: "RGUKT Nuzvid, AP",
    period: "2019 – 2023",
    specialization: "Electronics and Communication Engineering",
    highlights: [
      "Microprocessor & Microcontroller Interfacing (8086, ARM)",
      "Digital Design & Hardware Description Languages (Verilog)",
      "Varying signal vectors, Electronics Circuits, & Semiconductor Devices",
      "Signals & Systems, Controls Design, and Digital Signal Processing"
    ],
    addressUnit: "0x08100000"
  },
  {
    degree: "PUC (Pre-University Course)",
    institution: "RGUKT Nuzvid, AP",
    period: "2017 – 2019",
    specialization: "MPC (Mathematics, Physics, Chemistry)",
    highlights: [
      "Advanced Calculus, Vectors & Analytical Geometry",
      "Electromagnetism, Quantum Mechanics, & Semiconductor Physics",
      "Physical and Organic Chemistry laboratories"
    ],
    addressUnit: "0x0800C000"
  },
  {
    degree: "SSC (Secondary School Certificate)",
    institution: "ZPHS Unnava, AP",
    period: "2017",
    specialization: "General Science & Mathematics",
    highlights: [
      "Foundational Mathematics, Algebra & Geometry principles",
      "General Sciences (Physical & Natural science experiments)",
      "Introduction to algorithmic flowcharts & logical deduction"
    ],
    addressUnit: "0x08000000"
  }
];

export const TERMINAL_THEMES: TerminalTheme[] = [
  {
    id: "pipboy",
    name: "Pip-Boy Desert Green",
    accent: "#8FFF00",
    accentMuted: "rgba(143, 255, 0, 0.15)",
    bg: "#040800",
    glowColor: "rgba(143, 255, 0, 0.25)",
    nameCode: "PIP-100",
    description: "Vibrant yellow-green radioactive look modeled after wasteland survival wristbars."
  },
  {
    id: "vt100",
    name: "Classic VT100 CRT",
    accent: "#33FF33",
    accentMuted: "rgba(51, 255, 51, 0.15)",
    bg: "#030704",
    glowColor: "rgba(51, 255, 51, 0.25)",
    nameCode: "DEC-VT100",
    description: "Classic monochromatic phosphor line green terminal, the bedrock of computer laboratories."
  },
  {
    id: "amber",
    name: "IBM Warm Amber",
    accent: "#FFB000",
    accentMuted: "rgba(255, 176, 0, 0.15)",
    bg: "#080400",
    glowColor: "rgba(255, 176, 0, 0.25)",
    nameCode: "IBM-3278",
    description: "High-contrast phosphor orange-amber screen to minimize strain during night-shift driver testing."
  },
  {
    id: "cyberpunk",
    name: "Arasaka Neo Cyan",
    accent: "#00F0FF",
    accentMuted: "rgba(0, 240, 255, 0.15)",
    bg: "#020B0F",
    glowColor: "rgba(0, 240, 255, 0.25)",
    nameCode: "CYBER-77",
    description: "Bright neon electromagnetic cyan matching Tokyo style hacker consoles."
  },
  {
    id: "matrix",
    name: "Matrix Rain Digital",
    accent: "#00FF41",
    accentMuted: "rgba(0, 255, 65, 0.15)",
    bg: "#000501",
    glowColor: "rgba(0, 255, 65, 0.25)",
    nameCode: "SYS-NEO",
    description: "Deep pure emerald green mimicking absolute mainframe simulation pipelines."
  },
  {
    id: "dracula",
    name: "Vampire Violet",
    accent: "#BD93F9",
    accentMuted: "rgba(189, 147, 249, 0.15)",
    bg: "#0D0B12",
    glowColor: "rgba(189, 147, 249, 0.25)",
    nameCode: "VMP-DRC",
    description: "Elegant retro-goth purple shade selected by system engineers for comfortable code editors."
  },
  {
    id: "solarized",
    name: "Oceanic Solarized Teal",
    accent: "#2AA198",
    accentMuted: "rgba(42, 161, 152, 0.15)",
    bg: "#001A20",
    glowColor: "rgba(42, 161, 152, 0.2)",
    nameCode: "SLR-TEAL",
    description: "Warm scientific ocean teal optimized for strict lighting parity checks."
  },
  {
    id: "subred",
    name: "Submarine Red Alert",
    accent: "#FF3333",
    accentMuted: "rgba(255, 51, 51, 0.15)",
    bg: "#0B0000",
    glowColor: "rgba(255, 51, 51, 0.25)",
    nameCode: "RED-ALERT",
    description: "Tactical battle stations mode. High warning alert indicators matching nuclear reactor rooms."
  },
  {
    id: "c64",
    name: "Commodore 64 Bios",
    accent: "#7F7FFF",
    accentMuted: "rgba(127, 127, 255, 0.15)",
    bg: "#0A091A",
    glowColor: "rgba(127, 127, 255, 0.2)",
    nameCode: "C64-BASIC",
    description: "Nostalgic lavender purple-blue CRT background mimicking early 1982 home computing grids."
  },
  {
    id: "nuclear",
    name: "Radioactive Gold",
    accent: "#FFD700",
    accentMuted: "rgba(255, 215, 0, 0.15)",
    bg: "#080700",
    glowColor: "rgba(255, 215, 0, 0.2)",
    nameCode: "NUC-800",
    description: "Bright uranium gold warning signals to isolate potential firmware logic leaks."
  },
  {
    id: "bios",
    name: "Classic MS-DOS Blue",
    accent: "#FFFFFF",
    accentMuted: "rgba(59, 130, 246, 0.3)",
    bg: "#000033",
    glowColor: "rgba(59, 130, 246, 0.4)",
    nameCode: "DOS-622",
    description: "White text terminal on deep royal blue. Authentic BIOS setup and command line vibes."
  },
  {
    id: "synthwave",
    name: "Rad Cyber Synth",
    accent: "#FF007F",
    accentMuted: "rgba(255, 0, 127, 0.15)",
    bg: "#08000F",
    glowColor: "rgba(255, 0, 127, 0.25)",
    nameCode: "SYNTH-84",
    description: "Hot cyber neon magenta offset by deep space darkness for absolute retro synthwave vibes."
  }
];

