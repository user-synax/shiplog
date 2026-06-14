"use client";

import { useState } from "react";
import StackIcon from "tech-stack-icons";

const STACK_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

  .sp-root {
    --canvas:        #111110;
    --surface-1:     #1c1c1a;
    --surface-2:     #252522;
    --surface-3:     #2e2e2b;
    --hairline:      rgba(255,255,255,0.08);
    --hairline-soft: rgba(255,255,255,0.05);
    --ink:           #ffffff;
    --ink-muted:     #999999;
    --ink-faint:     #555553;
    --accent-blue:   #0099ff;
    --danger:        #ef4444;
    --success:       #22c55e;

    --r-xs:   4px;
    --r-sm:   6px;
    --r-md:   10px;
    --r-lg:   15px;
    --r-xl:   20px;
    --r-xxl:  30px;
    --r-pill: 100px;
    --r-full: 9999px;

    --sp-xs:  8px;
    --sp-sm:  12px;
    --sp-md:  15px;
    --sp-lg:  20px;
    --sp-xl:  30px;

    font-family: 'Inter', system-ui, sans-serif;
    font-feature-settings: "cv01","cv05","cv09","cv11","ss03","ss07","dlig";
    -webkit-font-smoothing: antialiased;
    color: var(--ink);
  }

  .sp-root * { box-sizing: border-box; }

  /* ── Page wrapper ── */
  .sp-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 56px 24px 80px;
  }

  /* ── Section block ── */
  .sp-section {
    margin-bottom: 48px;
  }

  /* ── Section header ── */
  .sp-section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .sp-section-title {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.8px;
    color: var(--ink);
  }

  /* ── Pro limit badge ── */
  .sp-limit-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: var(--surface-1);
    border: 1px solid var(--hairline);
    border-radius: var(--r-pill);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.12px;
    color: var(--ink-muted);
    white-space: nowrap;
  }
  .sp-limit-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--danger);
    flex-shrink: 0;
  }

  /* ── Add form card ── */
  .sp-form-card {
    background: var(--surface-1);
    border: 1px solid var(--hairline);
    border-radius: var(--r-xl);
    padding: var(--sp-lg);
    margin-bottom: 16px;
  }
  .sp-form-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: stretch;
  }

  /* ── Text input ── */
  .sp-input {
    flex: 1;
    min-width: 160px;
    padding: 10px 14px;
    background: var(--surface-2);
    color: var(--ink);
    border: 1px solid var(--hairline);
    border-radius: var(--r-md);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none;
  }
  .sp-input:focus {
    border-color: rgba(0,153,255,0.4);
    box-shadow: 0 0 0 1px rgba(0,153,255,0.2);
  }
  .sp-input::placeholder { color: var(--ink-faint); }

  /* ── Select ── */
  .sp-select {
    padding: 10px 14px;
    background: var(--surface-2);
    color: var(--ink);
    border: 1px solid var(--hairline);
    border-radius: var(--r-md);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.14px;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    padding-right: 32px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .sp-select:focus {
    border-color: rgba(0,153,255,0.4);
    box-shadow: 0 0 0 1px rgba(0,153,255,0.2);
  }
  .sp-select option { background: #1c1c1a; color: #fff; }

  /* Date input */
  .sp-input-date {
    flex: 0 0 auto;
    width: 160px;
  }
  .sp-input-date::-webkit-calendar-picker-indicator {
    filter: invert(0.5);
    cursor: pointer;
  }

  /* ── Pill button — primary (white) ── */
  .sp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: var(--ink);
    color: var(--canvas);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.14px;
    line-height: 1;
    border-radius: var(--r-pill);
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.1s ease, opacity 0.1s ease;
    flex-shrink: 0;
  }
  .sp-btn-primary:hover:not(:disabled) { opacity: 0.88; transform: scale(0.97); }
  .sp-btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  /* ── Pill button — secondary (charcoal) ── */
  .sp-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: var(--surface-2);
    color: var(--ink-muted);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.13px;
    line-height: 1;
    border-radius: var(--r-pill);
    border: 1px solid var(--hairline);
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.1s ease, color 0.1s ease, transform 0.1s ease;
    flex-shrink: 0;
  }
  .sp-btn-secondary:hover:not(:disabled) {
    background: var(--surface-3);
    color: var(--ink);
  }
  .sp-btn-secondary:disabled { opacity: 0.25; cursor: not-allowed; }

  /* ── Icon button ── */
  .sp-btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px; height: 30px;
    background: var(--surface-2);
    border: 1px solid var(--hairline);
    border-radius: var(--r-pill);
    cursor: pointer;
    transition: background 0.1s ease, transform 0.1s ease;
    flex-shrink: 0;
    color: var(--ink-muted);
    font-size: 14px;
    line-height: 1;
  }
  .sp-btn-icon:hover:not(:disabled) { background: var(--surface-3); color: var(--ink); transform: scale(0.95); }
  .sp-btn-icon:disabled { opacity: 0.2; cursor: not-allowed; }
  .sp-btn-icon-danger { color: var(--danger); }
  .sp-btn-icon-danger:hover { background: rgba(239,68,68,0.12) !important; color: var(--danger) !important; }

  /* ── Category label ── */
  .sp-category-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .sp-category-label:first-of-type { margin-top: 0; }

  /* ── Tech pill ── */
  .sp-tech-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--surface-1);
    border: 1px solid var(--hairline);
    border-radius: var(--r-pill);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.14px;
    color: var(--ink);
    transition: border-color 0.12s ease, background 0.12s ease;
    position: relative;
  }
  .sp-tech-pill:hover { border-color: rgba(255,255,255,0.16); background: var(--surface-2); }
  .sp-tech-pill-actions {
    display: none;
    align-items: center;
    gap: 3px;
    margin-left: 4px;
  }
  .sp-tech-pill:hover .sp-tech-pill-actions { display: flex; }

  /* ── Tech pills container ── */
  .sp-pills-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ── Goal / Learning row ── */
  .sp-list { display: flex; flex-direction: column; gap: 8px; }

  .sp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    background: var(--surface-1);
    border: 1px solid var(--hairline);
    border-radius: var(--r-lg);
    transition: border-color 0.12s ease;
  }
  .sp-row:hover { border-color: rgba(255,255,255,0.12); }

  .sp-row-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
  }
  .sp-row-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  /* ── Goal checkbox ── */
  .sp-checkbox {
    width: 20px; height: 20px;
    border-radius: 50%;
    border: 1.5px solid var(--hairline);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.15s, background 0.15s;
  }
  .sp-checkbox-done {
    border-color: var(--success);
    background: rgba(34,197,94,0.12);
  }
  .sp-checkbox svg { display: none; }
  .sp-checkbox-done svg { display: block; }

  /* ── Goal text ── */
  .sp-goal-title {
    font-size: 15px;
    font-weight: 400;
    letter-spacing: -0.15px;
    color: var(--ink);
    transition: color 0.15s;
  }
  .sp-goal-title-done {
    color: var(--ink-muted);
    text-decoration: line-through;
    text-decoration-color: var(--ink-faint);
  }
  .sp-goal-date {
    font-size: 12px;
    color: var(--ink-faint);
    letter-spacing: -0.12px;
    margin-top: 2px;
  }

  /* ── Learning link ── */
  .sp-learn-link {
    font-size: 15px;
    font-weight: 400;
    letter-spacing: -0.15px;
    color: var(--ink);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color 0.12s;
  }
  .sp-learn-link:hover { color: var(--accent-blue); }
  .sp-learn-arrow {
    font-size: 11px;
    color: var(--ink-faint);
  }

  /* ── Divider ── */
  .sp-divider {
    border: none;
    border-top: 1px solid var(--hairline-soft);
    margin: 40px 0;
  }

  /* ── Empty state ── */
  .sp-empty {
    padding: 32px 20px;
    text-align: center;
    font-size: 14px;
    color: var(--ink-faint);
    letter-spacing: -0.14px;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .sp-page { padding: 32px 16px 60px; }
    .sp-form-row { gap: 8px; }
    .sp-input, .sp-select { font-size: 16px; } /* prevent iOS zoom */
    .sp-input-date { width: 100%; flex: 1 1 100%; }
    .sp-btn-primary { width: 100%; justify-content: center; }
    .sp-row { padding: 12px 14px; }
    .sp-tech-pill-actions { display: flex; } /* always visible on touch */
  }
`;

/* ─────────────────────────────────
   Icon components
───────────────────────────────── */
const IconCheck = () => (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconPlus = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const CATEGORIES = ["language", "framework", "database", "tool", "other"];

// Curated Tech Icon Library
const TECH_ICONS = [
    // Languages
    {
        id: "js",
        name: "js",
        category: "language",
        color: "#F7DF1E",
        icon: "js",
    },
    {
        id: "typescript",
        name: "TypeScript",
        category: "language",
        color: "#3178C6",
        icon: "ts",
    },
    {
        id: "python",
        name: "Python",
        category: "language",
        color: "#3776AB",
        icon: "py",
    },
    {
        id: "rust",
        name: "Rust",
        category: "language",
        color: "#000000",
        icon: "rs",
    },
    {
        id: "go",
        name: "Go",
        category: "language",
        color: "#00ADD8",
        icon: "go",
    },
    {
        id: "java",
        name: "Java",
        category: "language",
        color: "#007396",
        icon: "java",
    },
    {
        id: "csharp",
        name: "C#",
        category: "language",
        color: "#512BD4",
        icon: "cs",
    },
    {
        id: "c++",
        name: "c++",
        category: "language",
        color: "#00599C",
        icon: "cpp",
    },
    {
        id: "php",
        name: "PHP",
        category: "language",
        color: "#777BB4",
        icon: "php",
    },
    {
        id: "ruby",
        name: "Ruby",
        category: "language",
        color: "#CC342D",
        icon: "rb",
    },
    {
        id: "kotlin",
        name: "Kotlin",
        category: "language",
        color: "#7F52FF",
        icon: "kt",
    },
    {
        id: "swift",
        name: "Swift",
        category: "language",
        color: "#F05138",
        icon: "swift",
    },
    {
        id: "dart",
        name: "Dart",
        category: "language",
        color: "#0175C2",
        icon: "dart",
    },

    // Frameworks
    {
        id: "react",
        name: "React",
        category: "framework",
        color: "#61DAFB",
        icon: "react",
    },
    {
        id: "nextjs",
        name: "Next.js",
        category: "framework",
        color: "#000000",
        icon: "next",
    },
    {
        id: "vuejs",
        name: "Vue.js",
        category: "framework",
        color: "#4FC08D",
        icon: "vue",
    },
    {
        id: "angular",
        name: "Angular",
        category: "framework",
        color: "#DD0031",
        icon: "ng",
    },
    {
        id: "sveltejs",
        name: "Svelte",
        category: "framework",
        color: "#FF3E00",
        icon: "svelte",
    },
    {
        id: "expressjs",
        name: "Express.js",
        category: "framework",
        color: "#000000",
        icon: "express",
    },
    {
        id: "django",
        name: "Django",
        category: "framework",
        color: "#092E20",
        icon: "django",
    },
    {
        id: "flask",
        name: "Flask",
        category: "framework",
        color: "#000000",
        icon: "flask",
    },
    {
        id: "spring",
        name: "Spring",
        category: "framework",
        color: "#6DB33F",
        icon: "spring",
    },
    {
        id: "tailwindcss",
        name: "Tailwind CSS",
        category: "framework",
        color: "#06B6D4",
        icon: "tw",
    },
    {
        id: "bootstrap4",
        name: "Bootstrap",
        category: "framework",
        color: "#7952B3",
        icon: "bs",
    },

    // Databases
    {
        id: "postgresql",
        name: "PostgreSQL",
        category: "database",
        color: "#4169E1",
        icon: "pg",
    },
    {
        id: "mongodb",
        name: "MongoDB",
        category: "database",
        color: "#47A248",
        icon: "mongo",
    },
    {
        id: "mysql",
        name: "MySQL",
        category: "database",
        color: "#4479A1",
        icon: "mysql",
    },
    {
        id: "sqlite",
        name: "SQLite",
        category: "database",
        color: "#003B57",
        icon: "sqlite",
    },
    {
        id: "redis",
        name: "Redis",
        category: "database",
        color: "#DC382D",
        icon: "redis",
    },
    {
        id: "supabase",
        name: "Supabase",
        category: "database",
        color: "#3ECF8E",
        icon: "supabase",
    },
    {
        id: "firebase",
        name: "Firebase",
        category: "database",
        color: "#FFCA28",
        icon: "firebase",
    },

    // Tools
    { id: "git", name: "Git", category: "tool", color: "#F05032", icon: "git" },
    {
        id: "github",
        name: "GitHub",
        category: "tool",
        color: "#181717",
        icon: "gh",
    },
    {
        id: "docker",
        name: "Docker",
        category: "tool",
        color: "#2496ED",
        icon: "docker",
    },
    {
        id: "kubernetes",
        name: "Kubernetes",
        category: "tool",
        color: "#326CE5",
        icon: "k8s",
    },
    { id: "aws", name: "AWS", category: "tool", color: "#FF9900", icon: "aws" },
    {
        id: "figma",
        name: "Figma",
        category: "tool",
        color: "#F24E1E",
        icon: "figma",
    },
    {
        id: "vscode",
        name: "VS Code",
        category: "tool",
        color: "#007ACC",
        icon: "vscode",
    },
    {
        id: "linux",
        name: "Linux",
        category: "tool",
        color: "#FCC624",
        icon: "linux",
    },
    {
        id: "android",
        name: "Android",
        category: "tool",
        color: "#0078D4",
        icon: "android",
    },
    {
        id: "astro",
        name: "Astro",
        category: "tool",
        color: "#000000",
        icon: "astro",
    },
    {
        id: "nodejs",
        name: "Node.js",
        category: "tool",
        color: "#5FA04E",
        icon: "node",
    },
    { id: "npm", name: "npm", category: "tool", color: "#CB3837", icon: "npm" },
    {
        id: "yarn",
        name: "Yarn",
        category: "tool",
        color: "#2C8EBB",
        icon: "yarn",
    },
    {
        id: "pnpm",
        name: "pnpm",
        category: "tool",
        color: "#F69220",
        icon: "pnpm",
    },
        {
        id: "bunjs",
        name: "bun",
        category: "tool",
        color: "#F69220",
        icon: "bun",
    },
];

// SVG icon components for each tech
const TechIcon = ({ id, size = 32 }) => {
    const icons = {
        js: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M12.173 17.722c-.376.627-.789 1.114-1.601 1.114-.812 0-1.27-.41-1.27-1.053 0-.718.573-1.045 1.45-1.51l.366-.196c2.128-1.114 3.553-2.267 3.553-4.635 0-2.318-1.842-4.045-4.912-4.045-2.094 0-3.427.846-4.374 2.254l1.98 1.255c.441-.718.965-1.27 1.98-1.27.812 0 1.332.47 1.332 1.066 0 .683-.376 1.008-1.332 1.51l-.366.196c-2.365 1.24-3.692 2.443-3.692 4.66 0 2.618 2.052 4.213 5.013 4.213 2.268 0 3.603-.86 4.55-2.491l-2.139-1.341zM24 0H0v24h24V0z" />
            </svg>
        ),
        ts: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.649-.303 5.527 5.527 0 0 0-.85-.11 9.762 9.762 0 0 0-.782.03v2.538a21.41 21.41 0 0 1 .782.03 5.527 5.527 0 0 0 .85-.11 3.95 3.95 0 0 0 .649-.303v2.522a6.239 6.239 0 0 1-1.306.341c-.473.075-1.015.112-1.627.112V9.75zm-7.5 0c.539 0 1.03.036 1.474.11a5.899 5.899 0 0 1 1.199.341v2.458a4.2 4.2 0 0 0-.593-.304 5.07 5.07 0 0 0-.777-.11 8.701 8.701 0 0 0-.708.03v7.59h-2.55V12.274a8.44 8.44 0 0 0-.707-.03 5.07 5.07 0 0 0-.778.11 4.199 4.199 0 0 0-.592.304v-2.522a5.899 5.899 0 0 1 1.199-.341c.444-.074.935-.11 1.474-.11z" />
            </svg>
        ),
        py: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.07.07-.07-.17.06-.07h.17h8.15l.69-.05.59-.14.5-.21.4-.27.3-.32.2-.35.1-.35.06-.2.02-.1V3.17h.83v.01l2.75.02.37.03-.05.37-.11.34-.17.31-.25.29-.32.25-.38.22-.44.18-.5.15-.57.13-.63.1-.7.07-.76.04-.83.01z" />
            </svg>
        ),
        react: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89S13.03 13.89 12 13.89s-1.87-.84-1.87-1.89.84-1.89 1.87-1.89M6.37 20c1.73 0 3.31-1.36 4.5-3.24-.56-.57-1.1-1.21-1.6-1.89-.75 1.37-1.6 2.58-2.5 3.13A1.6 1.6 0 016.37 20m0-16a1.6 1.6 0 011.4 1c.9.56 1.75 1.77 2.5 3.14.5-.68 1.04-1.32 1.6-1.89C10.54 4.64 8.96 4 7.25 4h-.88m12 16a1.6 1.6 0 01-1.4-1c-.9-.56-1.75-1.77-2.5-3.14.5-.68 1.04-1.32 1.6-1.89C18.96 15.36 20.54 16 22.25 16h.88m0-12h-.88c-1.73 0-3.31 1.36-4.5 3.24.56.57 1.1 1.21 1.6 1.89.75-1.37 1.6-2.58 2.5-3.13A1.6 1.6 0 0123.5 4m-23.5 8c0-4.09 3.56-7.44 8-8 4.44.56 8 3.91 8 8-.56 4.44-3.56 8-8 8-4.44-.56-8-3.91-8-8m20.5 8c4.44-.56 8-3.91 8-8-.56-4.44-3.56-8-8-8-4.44.56-8 3.91-8 8 .56 4.44 3.56 8 8 8" />
            </svg>
        ),
        next: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.918-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.902 2.795.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.5-.054z" />
            </svg>
        ),
        vue: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78L24 1.61zM12 14.08L5.16 2.23h4.43L12 6.41l2.41-4.18h4.43L12 14.08z" />
            </svg>
        ),
        node: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12.02-.01 5.5-3.18c.21-.12.46-.18.72-.18.26 0 .51.06.72.18l5.5 3.18.02.01 1.93-1.12c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3a1.66 1.66 0 00-.73-.2zm.05 1.83l6.67 3.85v7.94l-6.67-3.85V3.68zM5.28 7.53l6.67 3.85v7.94l-6.67-3.85V7.53z" />
            </svg>
        ),
        default: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
    };
    // Fallback to default if icon not found
    const IconComponent = icons[id] || icons.default;
    return IconComponent;
};

/* ─────────────────────────────────
   Main Component
───────────────────────────────── */
export default function StackPageClient({
    initialTechStack,
    initialGoals,
    initialLearning,
    isPro,
}) {
    const [techStack, setTechStack] = useState(initialTechStack);
    const [goals, setGoals] = useState(initialGoals);
    const [learning, setLearning] = useState(initialLearning);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [newTechCategory, setNewTechCategory] = useState("language");
    const [newGoalTitle, setNewGoalTitle] = useState("");
    const [newGoalDate, setNewGoalDate] = useState("");
    const [newLearnTitle, setNewLearnTitle] = useState("");
    const [newLearnUrl, setNewLearnUrl] = useState("");

    // Filter and search icons
    const filteredIcons = TECH_ICONS.filter((icon) => {
        const matchesSearch = icon.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            filterCategory === "all" || icon.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Check if tech is already selected
    const isTechSelected = (techId) => {
        return techStack.some((t) => t.name === techId || t.id === techId);
    };

    /* ── Tech Stack ── */
    async function addTech(techItem) {
        // Check if already exists
        if (isTechSelected(techItem.id)) return;

        const res = await fetch("/api/stack", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: techItem.id,
                category: techItem.category,
                color: techItem.color,
                icon: techItem.icon,
                displayName: techItem.name,
            }),
        });
        const item = await res.json();
        setTechStack([...techStack, item]);
    }

    async function deleteTech(id) {
        if (!confirm("Delete this tech item?")) return;
        await fetch(`/api/stack?id=${id}`, { method: "DELETE" });
        setTechStack(techStack.filter((t) => t._id !== id));
    }

    async function reorderTech(category, id, direction) {
        const catItems = techStack.filter((t) => t.category === category);
        const idx = catItems.findIndex((t) => t._id === id);
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= catItems.length) return;

        const reordered = [...catItems];
        [reordered[idx], reordered[newIdx]] = [
            reordered[newIdx],
            reordered[idx],
        ];

        const updated = techStack.map((t) => {
            if (t.category !== category) return t;
            return { ...t, order: reordered.findIndex((r) => r._id === t._id) };
        });
        setTechStack(updated);

        await fetch("/api/stack/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: reordered.map((t, i) => ({ id: t._id, order: i })),
            }),
        });
    }

    /* ── Goals ── */
    async function addGoal() {
        if (!newGoalTitle.trim()) return;
        const res = await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newGoalTitle.trim(),
                targetDate: newGoalDate || null,
            }),
        });
        if (!res.ok) {
            alert(await res.text());
            return;
        }
        const goal = await res.json();
        setGoals([...goals, goal]);
        setNewGoalTitle("");
        setNewGoalDate("");
    }

    async function toggleGoal(id, current) {
        const res = await fetch("/api/goals", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, isCompleted: !current }),
        });
        const updated = await res.json();
        setGoals(goals.map((g) => (g._id === id ? updated : g)));
    }

    async function deleteGoal(id) {
        if (!confirm("Delete this goal?")) return;
        await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
        setGoals(goals.filter((g) => g._id !== id));
    }

    async function reorderGoals(id, direction) {
        const idx = goals.findIndex((g) => g._id === id);
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= goals.length) return;
        const reordered = [...goals];
        [reordered[idx], reordered[newIdx]] = [
            reordered[newIdx],
            reordered[idx],
        ];
        const withOrder = reordered.map((g, i) => ({ ...g, order: i }));
        setGoals(withOrder);
        await fetch("/api/goals/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: withOrder.map((g, i) => ({ id: g._id, order: i })),
            }),
        });
    }

    /* ── Learning ── */
    async function addLearning() {
        if (!newLearnTitle.trim()) return;
        const res = await fetch("/api/learning", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newLearnTitle.trim(),
                url: newLearnUrl.trim() || null,
            }),
        });
        if (!res.ok) {
            alert(await res.text());
            return;
        }
        const item = await res.json();
        setLearning([...learning, item]);
        setNewLearnTitle("");
        setNewLearnUrl("");
    }

    async function deleteLearning(id) {
        if (!confirm("Delete this learning item?")) return;
        await fetch(`/api/learning?id=${id}`, { method: "DELETE" });
        setLearning(learning.filter((l) => l._id !== id));
    }

    /* ── Grouped tech ── */
    const groupedTech = CATEGORIES.reduce((acc, cat) => {
        const items = techStack
            .filter((t) => t.category === cat)
            .sort((a, b) => a.order - b.order);
        if (items.length) acc[cat] = items;
        return acc;
    }, {});

    const atGoalLimit = !isPro && goals.length >= 10;
    const atLearnLimit = !isPro && learning.length >= 5;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: STACK_CSS }} />

            <div className="sp-root">
                <div className="sp-page">
                    {/* ══════════════════════════════════════
                        TECH STACK
                    ══════════════════════════════════════ */}
                    <section className="sp-section">
                        <div className="sp-section-header">
                            <h2 className="sp-section-title">Tech Stack</h2>
                        </div>

                        {/* Add tech button */}
                        <div className="sp-form-card">
                            <button
                                className="sp-btn-primary w-full"
                                onClick={() =>
                                    setShowIconPicker(!showIconPicker)
                                }
                            >
                                <IconPlus />{" "}
                                {showIconPicker
                                    ? "Hide Icon Picker"
                                    : "Add Technology"}
                            </button>

                            {/* Icon picker */}
                            {showIconPicker && (
                                <div className="mt-4">
                                    {/* Search and filter */}
                                    <div className="sp-form-row mb-4">
                                        <input
                                            type="text"
                                            className="sp-input flex-1"
                                            placeholder="Search technologies…"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                        />
                                        <select
                                            className="sp-select"
                                            value={filterCategory}
                                            onChange={(e) =>
                                                setFilterCategory(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="all">
                                                All Categories
                                            </option>
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>
                                                    {c.charAt(0).toUpperCase() +
                                                        c.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Icons grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-3">
                                        {filteredIcons.map((tech) => {
                                            const selected = isTechSelected(
                                                tech.id,
                                            );
                                            return (
                                                <button
                                                    key={tech.id}
                                                    onClick={() =>
                                                        !selected &&
                                                        addTech(tech)
                                                    }
                                                    disabled={selected}
                                                    className={`p-3 rounded-xl transition-all flex flex-col items-center gap-2 ${
                                                        selected
                                                            ? "opacity-40 cursor-not-allowed"
                                                            : "hover:scale-105 cursor-pointer"
                                                    }`}
                                                    style={{
                                                        background:
                                                            "var(--surface-2)",
                                                        border: selected
                                                            ? "2px solid var(--ink-muted)"
                                                            : "1px solid var(--hairline)",
                                                    }}
                                                >
                                                    <div
                                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                        style={{
                                                            color: tech.color,
                                                        }}
                                                    >
                                                        <StackIcon
                                                            name={tech.id}
                                                            dark
                                                        />
                                                    </div>
                                                    <span
                                                        className="text-xs text-center"
                                                        style={{
                                                            color: "var(--ink)",
                                                        }}
                                                    >
                                                        {tech.name}
                                                    </span>
                                                    {selected && (
                                                        <span
                                                            className="text-xs"
                                                            style={{
                                                                color: "var(--ink-muted)",
                                                            }}
                                                        >
                                                            Added
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {filteredIcons.length === 0 && (
                                        <div className="sp-empty">
                                            No technologies match your search.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tech stack display */}
                        {Object.keys(groupedTech).length === 0 ? (
                            <div className="sp-empty">
                                No tech added yet — click{" "}
                                <span className="text-primary">
                                    Add Technology
                                </span>{" "}
                                to start building your stack.
                            </div>
                        ) : (
                            Object.entries(groupedTech).map(
                                ([category, items]) => (
                                    <div key={category}>
                                        <p className="sp-category-label">
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </p>
                                        <div className="sp-pills-wrap">
                                            {items.map((item, index) => {
                                                // Find the tech icon data
                                                const techData =
                                                    TECH_ICONS.find(
                                                        (t) =>
                                                            t.id ===
                                                                item.name ||
                                                            t.name ===
                                                                item.name,
                                                    );
                                                const displayName =
                                                    techData?.name ||
                                                    item.displayName ||
                                                    item.name;
                                                const color =
                                                    techData?.color ||
                                                    item.color ||
                                                    "#fff";
                                                const iconId =
                                                    techData?.icon ||
                                                    item.icon ||
                                                    "default";

                                                return (
                                                    <div
                                                        key={item._id}
                                                        className="sp-tech-pill"
                                                    >
                                                        <div
                                                            className="w-6 h-6 rounded flex items-center justify-center mr-2"
                                                            style={{ color }}
                                                        >
                                                            <StackIcon
                                                                name={item.name}
                                                                dark
                                                            />
                                                        </div>
                                                        <span>
                                                            {displayName}
                                                        </span>
                                                        <div className="sp-tech-pill-actions">
                                                            <button
                                                                className="sp-btn-icon"
                                                                title="Move up"
                                                                disabled={
                                                                    index === 0
                                                                }
                                                                onClick={() =>
                                                                    reorderTech(
                                                                        category,
                                                                        item._id,
                                                                        "up",
                                                                    )
                                                                }
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                className="sp-btn-icon"
                                                                title="Move down"
                                                                disabled={
                                                                    index ===
                                                                    items.length -
                                                                        1
                                                                }
                                                                onClick={() =>
                                                                    reorderTech(
                                                                        category,
                                                                        item._id,
                                                                        "down",
                                                                    )
                                                                }
                                                            >
                                                                ↓
                                                            </button>
                                                            <button
                                                                className="sp-btn-icon sp-btn-icon-danger"
                                                                title="Remove"
                                                                onClick={() =>
                                                                    deleteTech(
                                                                        item._id,
                                                                    )
                                                                }
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ),
                            )
                        )}
                    </section>

                    <hr className="sp-divider" />

                    {/* ══════════════════════════════════════
                        GOALS
                    ══════════════════════════════════════ */}
                    <section className="sp-section">
                        <div className="sp-section-header">
                            <h2 className="sp-section-title">Goals</h2>
                            {atGoalLimit && (
                                <span className="sp-limit-badge">
                                    <span className="sp-limit-dot" />
                                    Limit reached · Upgrade for unlimited
                                </span>
                            )}
                        </div>

                        {/* Add form */}
                        <div className="sp-form-card">
                            <div className="sp-form-row">
                                <input
                                    type="text"
                                    className="sp-input"
                                    placeholder="Goal description…"
                                    value={newGoalTitle}
                                    onChange={(e) =>
                                        setNewGoalTitle(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && addGoal()
                                    }
                                    disabled={atGoalLimit}
                                />
                                <input
                                    type="date"
                                    className="sp-input sp-input-date"
                                    value={newGoalDate}
                                    onChange={(e) =>
                                        setNewGoalDate(e.target.value)
                                    }
                                    disabled={atGoalLimit}
                                />
                                <button
                                    className="sp-btn-primary"
                                    onClick={addGoal}
                                    disabled={atGoalLimit}
                                >
                                    <IconPlus /> Add
                                </button>
                            </div>
                        </div>

                        {/* Goals list */}
                        {goals.length === 0 ? (
                            <div className="sp-empty">
                                No goals yet — set your first milestone above.
                            </div>
                        ) : (
                            <div className="sp-list">
                                {goals.map((goal, index) => (
                                    <div key={goal._id} className="sp-row">
                                        {/* Left: checkbox + text */}
                                        <div className="sp-row-left">
                                            <button
                                                className={`sp-checkbox ${goal.isCompleted ? "sp-checkbox-done" : ""}`}
                                                onClick={() =>
                                                    toggleGoal(
                                                        goal._id,
                                                        goal.isCompleted,
                                                    )
                                                }
                                                title={
                                                    goal.isCompleted
                                                        ? "Mark incomplete"
                                                        : "Mark complete"
                                                }
                                            >
                                                <IconCheck />
                                            </button>
                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    className={`sp-goal-title ${goal.isCompleted ? "sp-goal-title-done" : ""}`}
                                                >
                                                    {goal.title}
                                                </p>
                                                {goal.targetDate && (
                                                    <p className="sp-goal-date">
                                                        Due{" "}
                                                        {new Date(
                                                            goal.targetDate,
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: order + delete */}
                                        <div className="sp-row-right">
                                            <button
                                                className="sp-btn-icon"
                                                title="Move up"
                                                disabled={index === 0}
                                                onClick={() =>
                                                    reorderGoals(goal._id, "up")
                                                }
                                            >
                                                ↑
                                            </button>
                                            <button
                                                className="sp-btn-icon"
                                                title="Move down"
                                                disabled={
                                                    index === goals.length - 1
                                                }
                                                onClick={() =>
                                                    reorderGoals(
                                                        goal._id,
                                                        "down",
                                                    )
                                                }
                                            >
                                                ↓
                                            </button>
                                            <button
                                                className="sp-btn-icon sp-btn-icon-danger"
                                                title="Delete goal"
                                                onClick={() =>
                                                    deleteGoal(goal._id)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <hr className="sp-divider" />

                    {/* ══════════════════════════════════════
                        CURRENTLY LEARNING
                    ══════════════════════════════════════ */}
                    <section className="sp-section">
                        <div className="sp-section-header">
                            <h2 className="sp-section-title">
                                Currently Learning
                            </h2>
                            {atLearnLimit && (
                                <span className="sp-limit-badge">
                                    <span className="sp-limit-dot" />
                                    Limit reached · Upgrade for unlimited
                                </span>
                            )}
                        </div>

                        {/* Add form */}
                        <div className="sp-form-card">
                            <div className="sp-form-row">
                                <input
                                    type="text"
                                    className="sp-input"
                                    placeholder="What are you learning?"
                                    value={newLearnTitle}
                                    onChange={(e) =>
                                        setNewLearnTitle(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && addLearning()
                                    }
                                    disabled={atLearnLimit}
                                />
                                <input
                                    type="url"
                                    className="sp-input"
                                    placeholder="Resource URL (optional)"
                                    value={newLearnUrl}
                                    onChange={(e) =>
                                        setNewLearnUrl(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && addLearning()
                                    }
                                    disabled={atLearnLimit}
                                />
                                <button
                                    className="sp-btn-primary"
                                    onClick={addLearning}
                                    disabled={atLearnLimit}
                                >
                                    <IconPlus /> Add
                                </button>
                            </div>
                        </div>

                        {/* Learning list */}
                        {learning.length === 0 ? (
                            <div className="sp-empty">
                                Nothing added yet — what are you studying right
                                now?
                            </div>
                        ) : (
                            <div className="sp-list">
                                {learning.map((item) => (
                                    <div key={item._id} className="sp-row">
                                        <div className="sp-row-left">
                                            {/* Small book mark */}
                                            <span
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    color: "var(--ink-faint)",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                ◈
                                            </span>
                                            {item.url ? (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sp-learn-link"
                                                >
                                                    {item.title}
                                                    <span className="sp-learn-arrow">
                                                        ↗
                                                    </span>
                                                </a>
                                            ) : (
                                                <span
                                                    style={{
                                                        fontSize: "15px",
                                                        letterSpacing:
                                                            "-0.15px",
                                                        color: "var(--ink)",
                                                    }}
                                                >
                                                    {item.title}
                                                </span>
                                            )}
                                        </div>
                                        <div className="sp-row-right">
                                            <button
                                                className="sp-btn-icon sp-btn-icon-danger"
                                                title="Delete"
                                                onClick={() =>
                                                    deleteLearning(item._id)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
