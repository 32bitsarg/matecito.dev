export type ProjectStatus = "live" | "wip";

export interface Project {
  id: string;
  title: string;
  tag: string;
  year: string;
  description: string;
  href: string | null;
  external?: boolean;
  status: ProjectStatus;
  image?: string | null;
  emoji: string;
  tint: string;
}

export const WHATSAPP_NUMBER = "542477699586";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, quiero contactar con matecito.dev"
)}`;

export const PROJECTS: Project[] = [
  {
    id: "recienllegue",
    title: "Recién Llegué",
    tag: "Plataforma local",
    year: "2025",
    description:
      "Ayudamos a adaptarse a nuevas ciudades con recursos, comunidad y orientación local en Pergamino y más.",
    href: "https://recienllegue.com",
    external: true,
    status: "live",
    image: "/projects/recienllegue.png",
    emoji: "🌎",
    tint: "#e8f2ef",
  },
  {
    id: "zerolag",
    title: "ZeroLagARG",
    tag: "Gaming hub",
    year: "2026",
    description:
      "Comunidad gaming argentina: servidores de Minecraft y MU Online, foro y eventos.",
    href: null,
    status: "wip",
    image: null,
    emoji: "🎮",
    tint: "#f0ebe3",
  },
  {
    id: "etheria",
    title: "Conquest of Etheria",
    tag: "Estrategia",
    year: "2026",
    description:
      "Juego de estrategia medieval con mapa mundial, facciones y economía en tiempo real.",
    href: null,
    status: "wip",
    image: null,
    emoji: "⚔️",
    tint: "#eeeaf4",
  },
  {
    id: "labs",
    title: "Labs",
    tag: "Experimentos",
    year: "2026",
    description: "IA, DevOps, scripts y prototipos abiertos antes de convertirse en producto.",
    href: "/labs",
    status: "wip",
    image: null,
    emoji: "🧪",
    tint: "#f4ebe8",
  },
];

export const LAB_NOTES = [
  {
    date: "Jun 2026",
    title: "Infra unificada en VPS",
    body: "Migración a un solo servidor con Caddy, systemd y despliegues por proyecto.",
    tag: "DevOps",
  },
  {
    date: "May 2026",
    title: "Digital Front / AVPS",
    body: "Backend del MMORTS con tiles, Redis y despliegue en producción.",
    tag: "Juego",
  },
  {
    date: "Abr 2026",
    title: "Agentes y automatización",
    body: "Flujos con LLMs para ops, documentación y tareas repetitivas del studio.",
    tag: "IA",
  },
  {
    date: "Próximo",
    title: "Devlogs públicos",
    body: "Bitácora semanal con decisiones, errores y métricas de cada proyecto.",
    tag: "Proceso",
  },
];
