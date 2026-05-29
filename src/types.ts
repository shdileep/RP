export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'Driver' | 'Firmware' | 'Low-Level' | 'Bus';
  skills: string[];
  architecture: {
    blocks: string[];
    connections: { from: string; to: string }[];
  };
  metrics?: { label: string; value: string }[];
  codeSnippet?: string;
  githubUrl?: string;
  demoUrl?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  logo: string;
  bullets: string[];
  tech: string[];
  terminalLogs: string[];
}

export interface SkillCategory {
  title: string;
  skills: { name: string; percentage: number }[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  specialization: string;
  highlights: string[];
  addressUnit?: string;
}

export interface Tool {
  name: string;
  category: string;
  description: string;
}

export interface TerminalTheme {
  id: string;
  name: string;
  accent: string;
  accentMuted: string;
  bg: string;
  glowColor: string;
  nameCode: string;
  description: string;
}

