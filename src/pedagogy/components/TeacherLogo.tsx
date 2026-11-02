import React, { useId } from "react";

export type TeacherLogoVariant =
  | "DOC2APP_MONO"
  | "ROYAL_GOLD"
  | "ACADEMIC_CREST"
  | "PRINT_MONO";

interface TeacherLogoProps {
  variant?: TeacherLogoVariant;
  size?: number;
  className?: string;
  customImageUrl?: string | null;
  teacherNameFirst?: string;
  teacherNameLast?: string;
  onClick?: () => void;
  title?: string;
}

export const TeacherLogo: React.FC<TeacherLogoProps> = ({
  variant = "DOC2APP_MONO",
  size = 56,
  className = "",
  customImageUrl = null,
  teacherNameFirst = "Brahim",
  teacherNameLast = "Kouziber",
  onClick,
  title = "Doc2App — Academic Mathematics Studio",
}) => {
  const uid = useId().replace(/:/g, "");

  if (customImageUrl) {
    return (
      <div
        onClick={onClick}
        title={title}
        style={{ width: size, height: size }}
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${
          onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""
        } ${className}`}
      >
        <img
          src={customImageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-full"
        />
      </div>
    );
  }

  if (variant === "DOC2APP_MONO") {
    return (
      <div
        onClick={onClick}
        title={title}
        style={{ width: size, height: size }}
        className={`relative inline-flex items-center justify-center shrink-0 select-none ${
          onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""
        } ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id={`d2aMonoBg_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#090D16" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id={`d2aMonoStroke_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>

          {/* Minimalist Monochromatic Academic Medallion */}
          <rect
            x="16"
            y="16"
            width="480"
            height="480"
            rx="116"
            fill={`url(#d2aMonoBg_${uid})`}
            stroke={`url(#d2aMonoStroke_${uid})`}
            strokeWidth="10"
          />
          <rect
            x="38"
            y="38"
            width="436"
            height="436"
            rx="98"
            fill="none"
            stroke="#334155"
            strokeWidth="2.5"
            strokeDasharray="8 8"
          />

          {/* Subtle Coordinate Axes & Golden Ratio Circle */}
          <g stroke="#1E293B" strokeWidth="2.5" fill="none">
            <line x1="88" y1="232" x2="424" y2="232" />
            <line x1="256" y1="72" x2="256" y2="372" />
            <circle
              cx="256"
              cy="232"
              r="122"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          </g>

          {/* Left Wing: Minimalist Academic Document Page (Doc) */}
          <g
            fill="none"
            stroke={`url(#d2aMonoStroke_${uid})`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M 118 112 H 212 L 242 142 V 332 C 242 344 232 354 220 354 H 118 C 106 354 96 344 96 332 V 134 C 96 122 106 112 118 112 Z"
              fill="#0F172A"
              fillOpacity="0.9"
              strokeWidth="10"
            />
            <path d="M 208 112 V 144 H 240" strokeWidth="8" />
            <line x1="126" y1="168" x2="186" y2="168" stroke="#CBD5E1" strokeWidth="7" />
            <path
              d="M 126 226 L 138 226 L 150 248 L 168 206 H 210"
              stroke="#FFFFFF"
              strokeWidth="7.5"
            />
            <line x1="126" y1="282" x2="196" y2="282" stroke="#94A3B8" strokeWidth="6.5" />
            <line x1="126" y1="314" x2="172" y2="314" stroke="#64748B" strokeWidth="6.5" />
          </g>

          {/* Right Wing: Digital App Vector Nodes & Math Modules (App) */}
          <g
            fill="none"
            stroke={`url(#d2aMonoStroke_${uid})`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="278"
              y="112"
              width="58"
              height="58"
              rx="14"
              fill="#0F172A"
              strokeWidth="8.5"
            />
            <rect
              x="354"
              y="112"
              width="58"
              height="58"
              rx="14"
              fill="#F8FAFC"
              strokeWidth="8.5"
            />
            <rect
              x="278"
              y="188"
              width="58"
              height="58"
              rx="14"
              fill="#0F172A"
              strokeWidth="8.5"
            />
            <rect
              x="354"
              y="188"
              width="58"
              height="58"
              rx="14"
              fill="#0F172A"
              strokeWidth="8.5"
            />

            {/* Sigma ∑ */}
            <path
              d="M 317 128 H 296 L 309 141 L 296 154 H 317"
              stroke="#FFFFFF"
              strokeWidth="5.5"
            />
            {/* Pi π */}
            <path
              d="M 369 131 H 397 M 376 131 V 153 M 390 131 V 151"
              stroke="#0F172A"
              strokeWidth="6"
            />
            {/* Delta Δ */}
            <path d="M 307 202 L 293 230 H 321 Z" stroke="#E2E8F0" strokeWidth="5" />
            {/* Analytic Curve */}
            <path d="M 367 228 Q 383 196 399 220" stroke="#FFFFFF" strokeWidth="5.5" />

            {/* Sinusoidal Vector Graph */}
            <path
              d="M 278 288 C 308 248, 338 326, 370 284 C 386 264, 398 274, 412 260"
              stroke="#F8FAFC"
              strokeWidth="8"
            />
            <circle cx="278" cy="288" r="8" fill="#0F172A" stroke="#FFFFFF" strokeWidth="5" />
            <circle cx="412" cy="260" r="9" fill="#FFFFFF" />
            <line x1="278" y1="338" x2="378" y2="338" stroke="#CBD5E1" strokeWidth="7" />
            <circle cx="404" cy="338" r="6.5" fill="#F8FAFC" />
          </g>

          {/* Centerpiece: Mathematical Integral Symbol (∫) Bridging Doc → App */}
          <g>
            <path
              d="M 288 90 C 260 90, 252 114, 252 156 L 252 304 C 252 346, 244 370, 216 370"
              fill="none"
              stroke="#090D16"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M 288 90 C 260 90, 252 114, 252 156 L 252 304 C 252 346, 244 370, 216 370"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <circle cx="290" cy="90" r="9.5" fill="#FFFFFF" />
            <circle cx="214" cy="370" r="9.5" fill="#FFFFFF" />
            <circle
              cx="252"
              cy="230"
              r="19"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="7.5"
            />
            <circle cx="252" cy="230" r="6.5" fill="#FFFFFF" />
          </g>

          {/* Minimalist Monochromatic Wordmark: DOC2APP */}
          <text
            x="256"
            y="436"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="'Inter', system-ui, -apple-system, sans-serif"
            fontSize="48"
            fontWeight="900"
            letterSpacing="7"
          >
            DOC<tspan fill="#94A3B8">2</tspan>APP
          </text>
        </svg>
      </div>
    );
  }

  const isPrintMono = variant === "PRINT_MONO";
  const isCrest = variant === "ACADEMIC_CREST";

  return (
    <div
      onClick={onClick}
      title={title}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label={title}
      >
        <defs>
          {/* 24K Gold Metallic Rim Gradient */}
          <linearGradient id={`goldRimOuter_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isPrintMono ? "#1E293B" : "#784B12"} />
            <stop offset="18%" stopColor={isPrintMono ? "#475569" : "#FDE68A"} />
            <stop offset="38%" stopColor={isPrintMono ? "#0F172A" : "#CA8A04"} />
            <stop offset="55%" stopColor={isPrintMono ? "#64748B" : "#FEF08A"} />
            <stop offset="75%" stopColor={isPrintMono ? "#1E293B" : "#A16207"} />
            <stop offset="90%" stopColor={isPrintMono ? "#475569" : "#FDE047"} />
            <stop offset="100%" stopColor={isPrintMono ? "#0F172A" : "#6B3A0E"} />
          </linearGradient>

          <linearGradient id={`goldRimInner_${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPrintMono ? "#334155" : "#FEF08A"} />
            <stop offset="35%" stopColor={isPrintMono ? "#0F172A" : "#B45309"} />
            <stop offset="65%" stopColor={isPrintMono ? "#475569" : "#FACC15"} />
            <stop offset="100%" stopColor={isPrintMono ? "#0F172A" : "#78350F"} />
          </linearGradient>

          {/* Obsidian Core Radial Gradient */}
          <radialGradient id={`obsidianCore_${uid}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={isPrintMono ? "#FFFFFF" : isCrest ? "#13192B" : "#18181B"} />
            <stop offset="68%" stopColor={isPrintMono ? "#F8FAFC" : isCrest ? "#090D16" : "#060608"} />
            <stop offset="100%" stopColor={isPrintMono ? "#F1F5F9" : "#000000"} />
          </radialGradient>

          {/* Copper-Orange & Gold 3D 'M' Gradient */}
          <linearGradient id={`copperM_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isPrintMono ? "#0F172A" : "#FDBA74"} />
            <stop offset="30%" stopColor={isPrintMono ? "#1E293B" : "#EA580C"} />
            <stop offset="65%" stopColor={isPrintMono ? "#0F172A" : "#9A3412"} />
            <stop offset="100%" stopColor={isPrintMono ? "#334155" : "#F97316"} />
          </linearGradient>

          <linearGradient id={`innerMHighlight_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPrintMono ? "#FFFFFF" : "#FFFBEB"} />
            <stop offset="50%" stopColor={isPrintMono ? "#CBD5E1" : "#FDE047"} />
            <stop offset="100%" stopColor={isPrintMono ? "#94A3B8" : "#FB923C"} />
          </linearGradient>

          {/* 3D Platinum-Silver Radical (√) Gradient */}
          <linearGradient id={`platinumRadical_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isPrintMono ? "#0F172A" : "#F8FAFC"} />
            <stop offset="25%" stopColor={isPrintMono ? "#1E293B" : "#CBD5E1"} />
            <stop offset="55%" stopColor={isPrintMono ? "#334155" : "#94A3B8"} />
            <stop offset="80%" stopColor={isPrintMono ? "#1E293B" : "#E2E8F0"} />
            <stop offset="100%" stopColor={isPrintMono ? "#0F172A" : "#64748B"} />
          </linearGradient>

          <linearGradient id={`radicalHighlight_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPrintMono ? "#E2E8F0" : "#FFFFFF"} />
            <stop offset="100%" stopColor={isPrintMono ? "#94A3B8" : "#CBD5E1"} />
          </linearGradient>

          {/* Golden Script Gradient for Kouziber */}
          <linearGradient id={`goldScript_${uid}`} x1="0%" y1="0%" x2="100%" y2="40%">
            <stop offset="0%" stopColor={isPrintMono ? "#0F172A" : "#FEF9C3"} />
            <stop offset="40%" stopColor={isPrintMono ? "#1E293B" : "#FACC15"} />
            <stop offset="80%" stopColor={isPrintMono ? "#0F172A" : "#EAB308"} />
            <stop offset="100%" stopColor={isPrintMono ? "#334155" : "#FEF08A"} />
          </linearGradient>

          {/* Glow Filters */}
          <filter id={`goldGlow_${uid}`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation={isPrintMono ? "0" : "4.5"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={`whiteGlow_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isPrintMono ? "0" : "3"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={`shadow3D_${uid}`} x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow
              dx={isPrintMono ? "1" : "3"}
              dy={isPrintMono ? "2" : "5"}
              stdDeviation={isPrintMono ? "0.5" : "3.5"}
              floodColor="#000000"
              floodOpacity={isPrintMono ? "0.2" : "0.85"}
            />
          </filter>
        </defs>

        {/* Outer Gold Medallion Ring */}
        <circle
          cx="250"
          cy="250"
          r="244"
          fill={`url(#goldRimOuter_${uid})`}
          stroke={isPrintMono ? "#0F172A" : "#451A03"}
          strokeWidth="3.5"
        />
        <circle
          cx="250"
          cy="250"
          r="231"
          fill="none"
          stroke={isPrintMono ? "#FFFFFF" : "#18181B"}
          strokeWidth="4"
        />
        <circle cx="250" cy="250" r="226" fill={`url(#goldRimInner_${uid})`} />

        {/* Obsidian Black (or Crisp White in Print Mode) Inner Disc */}
        <circle
          cx="250"
          cy="250"
          r="217"
          fill={`url(#obsidianCore_${uid})`}
          stroke={isPrintMono ? "#0F172A" : "#B45309"}
          strokeWidth="2"
        />

        {/* Subtle Mathematical Etching Ring */}
        <circle
          cx="250"
          cy="250"
          r="204"
          fill="none"
          stroke={isPrintMono ? "#64748B" : "#FACC15"}
          strokeOpacity={isPrintMono ? "0.35" : "0.2"}
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />

        {/* Academic Crest Extra Mathematical Symbols Watermark */}
        {isCrest && (
          <g
            fill={isPrintMono ? "#94A3B8" : "#FACC15"}
            opacity="0.16"
            fontFamily="Georgia, serif"
            fontSize="20"
            fontWeight="bold"
          >
            <text x="250" y="46" textAnchor="middle">∫</text>
            <text x="95" y="110" textAnchor="middle">π</text>
            <text x="405" y="110" textAnchor="middle">∑</text>
            <text x="80" y="395" textAnchor="middle">∞</text>
            <text x="415" y="395" textAnchor="middle">Δ</text>
          </g>
        )}

        {/* ATHE [M] ATICS Header */}
        <g filter={`url(#shadow3D_${uid})`}>
          {/* Left: A T H E */}
          <text
            x="150"
            y="153"
            textAnchor="middle"
            fill={isPrintMono ? "#0F172A" : `url(#goldScript_${uid})`}
            fontFamily="Cinzel, Georgia, 'Times New Roman', serif"
            fontSize="26"
            fontWeight="700"
            letterSpacing="7.5"
          >
            ATHE
          </text>

          {/* Right: A T I C S */}
          <text
            x="355"
            y="153"
            textAnchor="middle"
            fill={isPrintMono ? "#0F172A" : `url(#goldScript_${uid})`}
            fontFamily="Cinzel, Georgia, 'Times New Roman', serif"
            fontSize="26"
            fontWeight="700"
            letterSpacing="6.5"
          >
            ATICS
          </text>

          {/* Center Tall Sculptural 3D 'M' */}
          <path
            d="M 221 168 L 233 63 L 250 131 L 267 63 L 279 168"
            fill="none"
            stroke={`url(#copperM_${uid})`}
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 221 168 L 233 63 L 250 131 L 267 63 L 279 168"
            fill="none"
            stroke={`url(#innerMHighlight_${uid})`}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#goldGlow_${uid})`}
          />
        </g>

        {/* 3D Platinum-Silver Square Root Radical Symbol (√) */}
        <g filter={`url(#shadow3D_${uid})`}>
          <path
            d="M 76 312 L 135 312 L 195 432 L 252 184 L 448 184"
            fill="none"
            stroke={`url(#platinumRadical_${uid})`}
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 76 309 L 137 309 L 195 425 L 250 181 L 446 181"
            fill="none"
            stroke={`url(#radicalHighlight_${uid})`}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* "Prof" in Radiant White Script (Left of Radical) */}
        <text
          x="130"
          y="286"
          textAnchor="middle"
          fill={isPrintMono ? "#0F172A" : "#FFFFFF"}
          fontFamily="'Great Vibes', 'Brush Script MT', 'Segoe Script', cursive"
          fontSize="65"
          fontStyle="italic"
          filter={`url(#whiteGlow_${uid})`}
        >
          Prof
        </text>

        {/* "Kouziber" in Luminous Golden Script (Center) */}
        <text
          x="312"
          y="278"
          textAnchor="middle"
          fill={isPrintMono ? "#0F172A" : `url(#goldScript_${uid})`}
          fontFamily="'Great Vibes', 'Brush Script MT', 'Segoe Script', cursive"
          fontSize="82"
          fontStyle="italic"
          filter={`url(#goldGlow_${uid})`}
        >
          {teacherNameLast}
        </text>

        {/* Lightbulb #1 over the 'i' in Kouziber */}
        <g transform="translate(348, 212)" filter={`url(#goldGlow_${uid})`}>
          <line x1="0" y1="-16" x2="0" y2="-22" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="11" y1="-12" x2="16" y2="-16" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="-11" y1="-12" x2="-16" y2="-16" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="15" y1="-2" x2="21" y2="-2" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="-15" y1="-2" x2="-21" y2="-2" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <circle
            cx="0"
            cy="-3"
            r="9"
            fill={isPrintMono ? "#FFFFFF" : "#FACC15"}
            stroke={isPrintMono ? "#0F172A" : "#FEF08A"}
            strokeWidth="1.8"
          />
          <path d="M -3 1 L 0 -6 L 3 1" fill="none" stroke={isPrintMono ? "#0F172A" : "#78350F"} strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="-4.5" y="5" width="9" height="4.5" rx="1.5" fill={isPrintMono ? "#334155" : "#CBD5E1"} />
        </g>

        {/* "Brahim" in Radiant White Script (Lower Right) */}
        <text
          x="332"
          y="374"
          textAnchor="middle"
          fill={isPrintMono ? "#1E293B" : "#FFFFFF"}
          fontFamily="'Great Vibes', 'Brush Script MT', 'Segoe Script', cursive"
          fontSize="74"
          fontStyle="italic"
          filter={`url(#whiteGlow_${uid})`}
        >
          {teacherNameFirst}
        </text>

        {/* Lightbulb #2 over the 'i' in Brahim */}
        <g transform="translate(374, 314)" filter={`url(#goldGlow_${uid})`}>
          <line x1="0" y1="-15" x2="0" y2="-21" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="11" y1="-11" x2="15" y2="-15" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="-11" y1="-11" x2="-15" y2="-15" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="14" y1="-2" x2="20" y2="-2" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="-14" y1="-2" x2="-20" y2="-2" stroke={isPrintMono ? "#0F172A" : "#FDE047"} strokeWidth="2.2" strokeLinecap="round" />
          <circle
            cx="0"
            cy="-3"
            r="8.5"
            fill={isPrintMono ? "#FFFFFF" : "#FACC15"}
            stroke={isPrintMono ? "#0F172A" : "#FEF08A"}
            strokeWidth="1.8"
          />
          <path d="M -3 1 L 0 -5.5 L 3 1" fill="none" stroke={isPrintMono ? "#0F172A" : "#78350F"} strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="-4" y="4.5" width="8" height="4" rx="1.5" fill={isPrintMono ? "#334155" : "#CBD5E1"} />
        </g>

        {/* Academic Crest Bottom Ribbon Caption */}
        {isCrest && (
          <text
            x="250"
            y="456"
            textAnchor="middle"
            fill={isPrintMono ? "#0F172A" : "#FDE047"}
            fontFamily="Cinzel, Georgia, serif"
            fontSize="13"
            fontWeight="700"
            letterSpacing="3"
          >
            EXCELLENCE MATHÉMATIQUE
          </text>
        )}
      </svg>
    </div>
  );
};
