// ASTROBASE: Junior Astronaut Mission Trainer
// Interactive Lunar Base SVG Illustration Generator

function renderLunarBaseSvg(props) {
  const { 
    day = 1, 
    energy = 100, 
    radiation = 80, 
    health = 100,
    subsystems = {},
    upgrades = {},
    baseId = "shackleton"
  } = props;

  const solarEfficiency = subsystems.solarClean ? 1 : (1 - Math.min(0.4, (day - 1) * 0.05));
  const isGreenhouseActive = subsystems.hydroponics !== false;
  const isRadarActive = subsystems.scienceRadar !== false;
  const isNightOrDusk = day >= 8;
  const hasRegolithShield = (upgrades.shield_upgrade || 0) > 0;
  const hasAdvancedSolar = (upgrades.solar_upgrade || 0) > 0;

  return `
    <svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" class="base-svg">
      <defs>
        <!-- Sky Gradient -->
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#02040c" />
          <stop offset="60%" stop-color="#060c22" />
          <stop offset="100%" stop-color="#0e173a" />
        </linearGradient>

        <!-- Lunar Ground Gradient -->
        <linearGradient id="lunarGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2d3748" />
          <stop offset="40%" stop-color="#1a202c" />
          <stop offset="100%" stop-color="#0d111a" />
        </linearGradient>

        <!-- Dome Glow Gradient -->
        <radialGradient id="domeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85" />
          <stop offset="70%" stop-color="#0284c7" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#0369a1" stop-opacity="0.1" />
        </radialGradient>

        <!-- Greenhouse Glow -->
        <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#34d399" stop-opacity="${isGreenhouseActive ? '0.9' : '0.2'}" />
          <stop offset="75%" stop-color="#059669" stop-opacity="${isGreenhouseActive ? '0.45' : '0.1'}" />
          <stop offset="100%" stop-color="#047857" stop-opacity="0.05" />
        </radialGradient>

        <!-- Solar Panel Specular -->
        <linearGradient id="solarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="50%" stop-color="#1e3a8a" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>

        <!-- Shield Field -->
        <linearGradient id="shieldAura" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#c084fc" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0" />
        </linearGradient>

        <!-- Filter for Glow -->
        <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Deep Space Sky Background -->
      <rect width="900" height="320" fill="url(#skyGrad)" />

      <!-- Stars in Sky -->
      <g opacity="0.8">
        <circle cx="50" cy="30" r="1" fill="#fff" />
        <circle cx="120" cy="65" r="1.5" fill="#38bdf8" />
        <circle cx="210" cy="25" r="1" fill="#fff" />
        <circle cx="340" cy="80" r="1.2" fill="#fff" />
        <circle cx="430" cy="40" r="1.5" fill="#c084fc" />
        <circle cx="580" cy="20" r="1" fill="#fff" />
        <circle cx="670" cy="60" r="1.8" fill="#fff" />
        <circle cx="750" cy="35" r="1.2" fill="#38bdf8" />
        <circle cx="830" cy="75" r="1" fill="#fff" />
        <circle cx="880" cy="25" r="1.5" fill="#fff" />
      </g>

      <!-- Earth in the Lunar Sky (The Blue Marble) -->
      <g transform="translate(730, 45)">
        <!-- Earth Atmosphere Glow -->
        <circle cx="35" cy="35" r="33" fill="#00f0ff" opacity="0.25" filter="url(#neonBlur)" />
        <circle cx="35" cy="35" r="30" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.2" />
        <!-- Continents & Clouds (Stylized) -->
        <path d="M22,25 Q30,18 42,24 Q48,32 40,42 Q30,46 25,38 Z" fill="#10b981" opacity="0.8" />
        <path d="M38,40 Q48,38 52,48 Q44,55 35,52 Z" fill="#34d399" opacity="0.75" />
        <path d="M16,32 Q26,35 34,28 Q44,22 55,26" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.75" />
        <path d="M20,44 Q32,48 44,42 Q50,45 56,38" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.65" />
      </g>

      <!-- Distant Lunar Mountain & Crater Ridges -->
      <path d="M0,205 Q140,175 280,195 T580,185 Q720,165 900,195 L900,320 L0,320 Z" fill="#1e2433" opacity="0.7" />
      <path d="M0,225 Q180,205 380,220 T750,210 Q830,205 900,215 L900,320 L0,320 Z" fill="#171c28" opacity="0.85" />

      <!-- Foreground Lunar Regolith Surface -->
      <path d="M0,235 C200,225 450,245 900,230 L900,320 L0,320 Z" fill="url(#lunarGround)" />

      <!-- Craters on surface -->
      <ellipse cx="140" cy="275" rx="45" ry="10" fill="#111827" stroke="#374151" stroke-width="1" />
      <ellipse cx="780" cy="285" rx="60" ry="14" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
      <ellipse cx="490" cy="300" rx="35" ry="7" fill="#111827" opacity="0.6" />

      <!-- Regolith Berm Shielding (If upgraded) -->
      ${hasRegolithShield ? `
        <path d="M360,250 Q450,140 540,250 Z" fill="#334155" stroke="#64748b" stroke-width="2.5" opacity="0.85" />
        <path d="M375,250 Q450,160 525,250 Z" fill="none" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="1.5" />
      ` : ''}

      <!-- MAIN HABITAT DOME -->
      <g id="main-dome" transform="translate(450, 240)">
        <!-- Dome Structure Outer Shell -->
        <path d="M-90,0 A90,80 0 0,1 90,0 Z" fill="url(#domeGlow)" stroke="#38bdf8" stroke-width="2" />
        <path d="M-80,0 A80,72 0 0,1 80,0 Z" fill="none" stroke="#0284c7" stroke-width="1" stroke-dasharray="8,4" />
        
        <!-- Structural Geo-Ribs -->
        <path d="M0,-80 L0,0" stroke="#38bdf8" stroke-width="1.5" opacity="0.7" />
        <path d="M-55,-60 L-35,0" stroke="#38bdf8" stroke-width="1.2" opacity="0.5" />
        <path d="M55,-60 L35,0" stroke="#38bdf8" stroke-width="1.2" opacity="0.5" />
        <path d="M-75,-30 L-60,0" stroke="#38bdf8" stroke-width="1.2" opacity="0.5" />
        <path d="M75,-30 L60,0" stroke="#38bdf8" stroke-width="1.2" opacity="0.5" />

        <!-- Observation Cupola Windows (Warm Habitat Glow) -->
        <circle cx="0" cy="-45" r="14" fill="#fef08a" opacity="0.85" filter="url(#neonBlur)" />
        <circle cx="0" cy="-45" r="10" fill="#fde047" stroke="#d97706" stroke-width="1.5" />
        <line x1="-10" y1="-45" x2="10" y2="-45" stroke="#78350f" stroke-width="1" />
        <line x1="0" y1="-55" x2="0" y2="-35" stroke="#78350f" stroke-width="1" />

        <!-- Pressurized Base Airlock Cylinder -->
        <rect x="-115" y="-22" width="30" height="22" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="-100" cy="-11" r="5" fill="#22c55e" opacity="0.8" />
        <!-- Airlock Hatch Stripes -->
        <line x1="-110" y1="-22" x2="-110" y2="0" stroke="#38bdf8" stroke-width="1" />
      </g>

      <!-- GREENHOUSE HYDROPONICS MODULE (Left of Dome) -->
      <g id="greenhouse" transform="translate(305, 240)">
        <!-- Connecting Pressurized Tunnel -->
        <rect x="25" y="-14" width="40" height="14" fill="#1e293b" stroke="#00f0ff" stroke-width="1" />
        
        <!-- Greenhouse Barrel Vault -->
        <path d="M-45,0 A45,40 0 0,1 45,0 Z" fill="url(#greenGlow)" stroke="#10b981" stroke-width="2" />
        <path d="M-38,0 A38,34 0 0,1 38,0 Z" fill="none" stroke="#059669" stroke-width="1" stroke-dasharray="4,2" />
        
        <!-- Vertical Aeroponic Plant Racks inside -->
        <line x1="-25" y1="0" x2="-25" y2="-22" stroke="#22c55e" stroke-width="2.5" />
        <line x1="-10" y1="0" x2="-10" y2="-28" stroke="#16a34a" stroke-width="2.5" />
        <line x1="10" y1="0" x2="10" y2="-28" stroke="#22c55e" stroke-width="2.5" />
        <line x1="25" y1="0" x2="25" y2="-22" stroke="#16a34a" stroke-width="2.5" />
        <!-- Grow LED Lighting strip -->
        <line x1="-35" y1="-32" x2="35" y2="-32" stroke="#f43f5e" stroke-width="2" opacity="${isGreenhouseActive ? '0.85' : '0.2'}" />
      </g>

      <!-- WATER PURIFICATION & CRYOGENIC TANKS (Right of Dome) -->
      <g id="water-cryo" transform="translate(580, 240)">
        <rect x="-40" y="-12" width="30" height="12" fill="#1e293b" stroke="#00f0ff" stroke-width="1" />
        <!-- Primary Cryo-H2O Tank -->
        <rect x="-10" y="-38" width="28" height="38" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
        <path d="M-10,-30 L18,-30" stroke="#0284c7" stroke-width="1" />
        <circle cx="4" cy="-20" r="4" fill="#38bdf8" />
        <!-- Level Gauge -->
        <rect x="12" y="-32" width="3" height="24" fill="#38bdf8" opacity="0.8" />

        <!-- Secondary Sabatier Tank -->
        <rect x="24" y="-30" width="22" height="30" rx="5" fill="#0f172a" stroke="#a855f7" stroke-width="1.8" />
        <circle cx="35" cy="-16" r="3.5" fill="#c084fc" />
      </g>

      <!-- PHOTOVOLTAIC SOLAR FARM (Far Left) -->
      <g id="solar-farm" transform="translate(100, 240)">
        <!-- Array Support Gantry -->
        <line x1="30" y1="0" x2="45" y2="-45" stroke="#94a3b8" stroke-width="3" />
        <line x1="90" y1="0" x2="75" y2="-45" stroke="#94a3b8" stroke-width="3" />
        <line x1="60" y1="0" x2="60" y2="-45" stroke="#64748b" stroke-width="2" />

        <!-- Tilted Solar Array Plane -->
        <polygon points="10,-55 110,-55 100,-25 0,-25" fill="url(#solarGlass)" stroke="#38bdf8" stroke-width="1.5" />
        <!-- Grid Cells -->
        <line x1="25" y1="-55" x2="15" y2="-25" stroke="#38bdf8" stroke-width="0.75" />
        <line x1="50" y1="-55" x2="40" y2="-25" stroke="#38bdf8" stroke-width="0.75" />
        <line x1="75" y1="-55" x2="65" y2="-25" stroke="#38bdf8" stroke-width="0.75" />
        <line x1="5" y1="-40" x2="105" y2="-40" stroke="#38bdf8" stroke-width="0.75" />

        <!-- Dust effect if not clean -->
        ${!hasAdvancedSolar ? `
          <polygon points="10,-55 110,-55 100,-25 0,-25" fill="#78716c" opacity="${Math.max(0.05, (1 - solarEfficiency) * 0.75)}" />
        ` : ''}

        ${hasAdvancedSolar ? `
          <!-- Active Electrodynamic Dust Repeller Glow -->
          <line x1="0" y1="-25" x2="100" y2="-25" stroke="#00f0ff" stroke-width="2" filter="url(#neonBlur)" opacity="0.8" />
        ` : ''}
      </g>

      <!-- COMMUNICATIONS TOWER & HIGH GAIN DISH (Far Right) -->
      <g id="comm-tower" transform="translate(730, 240)">
        <!-- Lattice Mast -->
        <line x1="0" y1="0" x2="15" y2="-85" stroke="#94a3b8" stroke-width="2" />
        <line x1="30" y1="0" x2="15" y2="-85" stroke="#94a3b8" stroke-width="2" />
        <line x1="3" y1="-25" x2="27" y2="-25" stroke="#64748b" stroke-width="1" />
        <line x1="7" y1="-50" x2="23" y2="-50" stroke="#64748b" stroke-width="1" />
        <line x1="11" y1="-70" x2="19" y2="-70" stroke="#64748b" stroke-width="1" />

        <!-- Parabolic Dish -->
        <path d="M5,-95 Q25,-115 35,-90" fill="none" stroke="#e2e8f0" stroke-width="3" />
        <line x1="20" y1="-102" x2="28" y2="-112" stroke="#ef4444" stroke-width="2" />
        <circle cx="28" cy="-112" r="3" fill="#ef4444" />

        <!-- Radio Waves Beaming to Earth (Animated if radar active) -->
        ${isRadarActive ? `
          <path d="M35,-118 A12,12 0 0,1 48,-110" fill="none" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />
          <path d="M42,-126 A20,20 0 0,1 62,-114" fill="none" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6" />
          <path d="M50,-134 A28,28 0 0,1 78,-118" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="5,5" opacity="0.4" />
        ` : ''}
      </g>

      <!-- LUNAR ROVER & EVA ASTRONAUT (Foreground) -->
      <g id="rover-and-crew" transform="translate(230, 260)">
        <!-- Rover Chassis -->
        <rect x="0" y="5" width="45" height="15" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="1.2" />
        <rect x="8" y="-2" width="28" height="8" rx="2" fill="#334155" />
        <!-- Wheels -->
        <circle cx="8" cy="22" r="7" fill="#0f172a" stroke="#64748b" stroke-width="2.5" />
        <circle cx="37" cy="22" r="7" fill="#0f172a" stroke="#64748b" stroke-width="2.5" />
        <!-- Rover Antenna -->
        <line x1="12" y1="-2" x2="8" y2="-18" stroke="#94a3b8" stroke-width="1.2" />
        <circle cx="8" cy="-18" r="2" fill="#38bdf8" />

        <!-- Astronaut on EVA -->
        <g transform="translate(68, -4)">
          <!-- Spacesuit Body -->
          <ellipse cx="8" cy="18" rx="7" ry="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
          <!-- Life Support Backpack (PLSS) -->
          <rect x="-1" y="10" width="5" height="14" rx="2" fill="#94a3b8" />
          <!-- Helmet & Gold Visor -->
          <circle cx="8" cy="6" r="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" />
          <ellipse cx="9" cy="6" rx="4" ry="3.5" fill="#f59e0b" />
          <!-- Legs -->
          <line x1="5" y1="28" x2="4" y2="38" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round" />
          <line x1="11" y1="28" x2="13" y2="38" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round" />
          <!-- Boots -->
          <rect x="1" y="37" width="5" height="3" rx="1" fill="#475569" />
          <rect x="11" y="37" width="5" height="3" rx="1" fill="#475569" />
        </g>
      </g>
    </svg>
  `;
}

if (typeof window !== "undefined") {
  window.renderLunarBaseSvg = renderLunarBaseSvg;
}

