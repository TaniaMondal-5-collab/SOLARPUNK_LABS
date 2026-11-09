# ASTROBASE: Junior Astronaut Mission Trainer (3D Space Simulator)

> **NASA Space Apps Challenge 2026 Special Edition**  
> *“Think like an engineer. Decide like a commander. Survive like an astronaut.”*

A professional, immersive PC-quality 3D space simulation and educational game built with Three.js, React, and Web Audio. Players assume direct command of an astronaut on the lunar surface, managing life support systems (ECLSS), balancing power grids, exploring a realistic 3D lunar base, and making critical engineering decisions across a 10-day survival campaign.

---

## 🎮 How to Play

### Quick Launch Options:
1. **Option A (Instant in Browser):** Simply double-click `index.html` to play in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
2. **Option B (Local Python Server):** Open a terminal/PowerShell in this directory and run:
   ```bash
   python run_game.py
   ```
   This automatically starts a local server on `http://localhost:8000` and opens the browser.
3. **Option C (Live on Vercel):** Automatically deployed via GitHub integration.

No installation, no npm, no node, no API keys, and no database required. 100% of the game simulation, 3D graphics, physics, and audio run locally in the browser with full offline capability.

---

## 🕹️ Controls

| Key | Action | Description |
| :--- | :--- | :--- |
| **W, A, S, D** | Movement | Walk across the lunar surface |
| **Shift** | Sprint | Accelerated movement (increases suit oxygen consumption) |
| **Space** | Low-G Jump | Authentic 1/6th lunar gravity leap with slow descent |
| **Mouse** | Camera Look | 360° mouse-look (Click canvas to lock pointer) |
| **E** | Interact | Operate base stations, inspect anomalies, execute engineering repairs |
| **V** | Camera Mode | Toggle between Third-Person and First-Person helmet view |
| **ESC** | Pause Menu | Opens pause menu, settings, science log, and game save |

---

## 🌟 Key Features

### 1. Professional PC Game Main Menu
- Full-screen cinematic game opening inspired by PC titles like *PUBG*, *Free Fire*, and *Euro Truck Simulator 2*.
- Background 3D lunar landscape with real-time camera orbit showcasing the habitat dome, solar farm, communications tower, rover, Earth, and starfield.
- Professional vertical right-aligned action menu:
  1. **RESUME MISSION:** Automatically loads saved progress from `localStorage`.
  2. **NEW GAME:** Choose your landing site and crew to launch the campaign.
  3. **MISSION SELECT:** Select and train on any of the 10 operational crisis scenarios.
  4. **SETTINGS:** Adjust audio volumes (Master, SFX, Ambient Space Drone), mouse sensitivity, and fullscreen mode.
  5. **SCIENCE LOG:** Interactive curriculum database of genuine space science principles.
  6. **RESET / EXIT:** Safe reset of current simulation parameters.

### 2. Immersive 3D Gameplay & Physics
- Full-screen 3D lunar environment built with Three.js (r128) using PBR materials and directional sun shadows.
- Realistic lunar surface with craters, elevated rim mountains, and scattered basalt boulders.
- Playable astronaut character in NASA EMU spacesuit with golden reflective sun visor.
- True 1/6th lunar gravity physics ($1.62 \text{ m/s}^2$) with floaty jumps and footstep dust puffs.
- Earth (The Blue Marble) hovering in the black starfield with atmospheric glow.

### 3. Real Space Survival Mechanics
- **Oxygen Management:** Active life-support consumption with hypoxia warnings if depleted.
- **Water Recycling:** Distillation loops and catalytic oxidation recovery.
- **Food Production:** Aeroponic greenhouse yields and nutrient balance.
- **Energy Generation:** Solar panel sun-tracking and battery storage.
- **Radiation Protection:** Regolith shielding against solar particle events (SPE) and cosmic rays.
- **Crew Health:** Vitality of the 4 specialist astronauts.

### 4. 10-Day Lunar Survival Campaign
1. **Day 1:** Electrostatic lunar dust clinging on solar arrays.
2. **Day 2:** Catalytic water recovery loop contamination & filter fouling.
3. **Day 3:** Oxygen electrolysis pressure spike & molten regolith mineral extraction.
4. **Day 4:** Lunar midday extreme thermal surge (+120°C in vacuum).
5. **Day 5:** Hydroponic aeroponic bay nutrient & LED spectrum failure.
6. **Day 6:** Solar Particle Event (SPE) coronal mass ejection alert.
7. **Day 7:** Deep Space Network high-gain antenna gimbal jam.
8. **Day 8:** Hypervelocity micrometeoroid puncture on exterior air handler duct.
9. **Day 9:** Permanently shadowed crater ice core drilling opportunity.
10. **Day 10:** Final mission qualification stress-test & Earth school broadcast.

### 5. Interactive 3D Base Stations
Walk directly to base structures and press `[E]` to interact:
- **Photovoltaic Solar Arrays:** Clean abrasive dust and adjust sun angle.
- **Water Distillation Facility:** Flush catalytic reactor and replace filters.
- **Oxygen Electrolysis / MOXIE Loop:** Vent overpressure and crack mineral oxygen.
- **Aeroponic Greenhouse Bay:** Check root misting and tune LED grow spectrums.
- **Deep Space Network Tower:** Re-align jammed antenna dish toward Earth.
- **Habitat Airlock:** Check crew health, rest, and enter radiation storm shelter.
- **Lunar Rover:** Access telemetry and ice core drilling data.

### 6. Synthesized Space Audio Engine
- Built-in sound synthesis via Web Audio API (zero audio files to download).
- Space drone ambient pad (EVA suit life-support hum + solar wind).
- Regolith footstep crunches, jump thrusters, airlock hisses, alarm klaxons, and Apollo Quindar tones.

---

## 🔬 Space Science Educational Grounding
- **ECLSS Mass Balance:** Understand closed-loop oxygen and water reclamation in extraterrestrial habitats.
- **Lunar Regolith Properties:** Why unweathered, razor-sharp dust is hazardous and electrostatically active.
- **Vacuum Heat Transfer:** Rejection of waste heat solely through radiation in the absence of an atmosphere.
- **In-Situ Resource Utilization (ISRU):** Sintering regolith into protective ceramics and extracting water ice from polar cold traps.

---

## 🛠️ Verification & Quality Assurance
- **Syntactic Integrity:** All 6 JavaScript files verified with 100% balanced brackets and strings.
- **Automated Test Runner:** `test_runner.html` passes **54 out of 54 automated assertions** headlessly with 0 errors.
- **Offline Resilience:** Bundled with local `three.min.js` and an embedded React engine so the game operates completely offline.
