# ASTROBASE: Junior Astronaut Mission Trainer

> **Tagline:** *Think like an engineer. Decide like a commander. Survive like an astronaut.*

An educational space simulation game designed for school students (ages 12–17). Players take on the role of Flight Commanders of a lunar surface research outpost, managing critical life support resources, balancing active power grids, making authentic engineering decisions, and surviving a 10-day lunar expedition.

---

## 🎮 How to Play

### Quick Launch Options:
1. **Option A (Instant in Browser):** Simply double-click `index.html` to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
2. **Option B (Local Python Server):** Open PowerShell / Terminal in this directory and run:
   ```bash
   python run_game.py
   ```
   This automatically starts a local server on `http://localhost:8000` and launches your default browser.

No installation, no npm, no node, no API keys, and no database required. 100% of the game runs locally in the browser with offline capability.

---

## 🌟 Key Game Features

### 1. Screen 1: Welcome Page
- Introduction to the junior astronaut command training program.
- Mission overview & learning objectives aligned with space science curricula.
- Interactive tutorial ("How to Play" guide).

### 2. Screen 2: Mission Setup
- **4 Distinct Lunar Research Base Sites:**
  - *Shackleton Crater Outpost* (Lunar South Pole, permanent sunlight & water ice cold traps).
  - *Oceanus Procellarum Lab* (Storm Ocean basalt plains, high titanium regolith & solar efficiency).
  - *Mare Tranquillitatis Hub* (Apollo 11 historic landing site, natural lava tube radiation shelter).
  - *Aristarchus Plateau Station* (Pyroclastic glass deposits & high scientific yield).
- **4 Specialist Astronauts:**
  - Commander Maya Chen (Morale & Emergency Ops)
  - Dr. Alex Mercer (ECLSS & Power Systems Lead)
  - Dr. Samantha Rao (Astrobiologist & Hydroponics Lead)
  - Marcus Vance (Geologist & EVA Specialist)
- **10-Day Mission Objectives:**
  - Maintain all 6 vital meters above zero.
  - Mitigate electrostatic lunar dust adhesion.
  - Protect the crew against Solar Particle Events (SPE) and cosmic rays.
  - Perform in-situ resource extraction and closed-loop recycling.

### 3. Screen 3: Mission Control Dashboard
- **6 Vital Resource Indicators (in simplified game units):**
  1. **Oxygen** (ECLSS breathing gas)
  2. **Water** (Catalytic recovery loop)
  3. **Food** (Aeroponic greenhouse pantry)
  4. **Energy** (Photovoltaic array & battery storage)
  5. **Radiation Protection** (Regolith shielding & magnetic coils)
  6. **Astronaut Health** (Overall crew vitality)
- **Visual Warning States:**
  - *Nominal* (> 40%): Green/Cyan indicator
  - *Warning* (20%–40%): Amber pulsing alert
  - *Critical* (< 20%): Red flashing alarm
- **Interactive Lunar Base SVG Illustration:**
  - Real-time visual depiction of the base dome, solar panels, vertical aeroponics greenhouse, Sabatier water tanks, communications tower beaming to Earth, lunar rover, and EVA astronaut against the lunar crater landscape with Earth hanging in the black sky.
- **Power Grid Management (Subsystem Toggles):**
  - Switch non-essential systems (Science Radar, Aux Shield, Hydroponics Grow Lamps) ON or OFF to balance daily net energy draw during shortages or dust events.
- **Emergency Alerts & Telemetry Feed:**
  - Real-time logging of environmental anomalies, low supply warnings, and milestone achievements.

### 4. Screen 4: Engineering Decision Centre (10 Scenarios)
10 scientifically grounded scenarios across the 10 mission days:
- **Day 1:** Lunar dust electrostatic clinging on solar arrays.
- **Day 2:** Catalytic water recovery loop contamination & catalyst fouling.
- **Day 3:** Oxygen electrolysis module pressure anomaly & ilmenite extraction.
- **Day 4:** Lunar midday extreme thermal surge (+120°C in vacuum).
- **Day 5:** Hydroponics aeroponic bay nutrient & spectrum LED imbalance.
- **Day 6:** Solar Particle Event (SPE) coronal mass ejection alert.
- **Day 7:** Deep Space Network high-gain parabolic antenna gimbal failure.
- **Day 8:** Hypervelocity micrometeoroid breach on air handler duct.
- **Day 9:** Permanently shadowed crater ice core drilling opportunity.
- **Day 10:** Final mission qualification & Earth return staging.

Each scenario features:
- Authentic narrative dilemma.
- Three balanced choices with tangible physical tradeoffs.
- Consequence feedback updating resources dynamically.
- **🧪 Space Science Curriculum Note** highlighting real physics and biology versus simplified game mechanics.

### 5. Screen 5: Base Upgrade Centre
Invest accumulated resources in 5 engineering tech-trees:
- **Bifacial Photovoltaic Solar Farm** (Up to +24 Energy/day, electrodynamic dust shields).
- **Vapor Compression Water Distillation Loop** (Reduces daily consumption by up to 10 units).
- **Vertical Aeroponic Plant Growth Bay** (Produces up to +20 Food/day and reduces O2 consumption).
- **Microwave-Sintered Regolith Shielding** (Melts lunar soil into protective basalt armor).
- **Solid-Oxide CO2 Electrolysis (MOXIE)** (Cracks $CO_2$ back into breathable $O_2$).

### 6. Screen 6: Mission Results & Debriefing
- Evaluation rank: *Distinguished Commander*, *Mission Success*, *Marginal Survival*, or *Critical Abort*.
- Final score out of 100 based on survival duration, crew health, resource reserves, scientific points, and completed upgrades.
- Detailed telemetry stats and decision history.
- 6 unlockable scientific achievement medals.
- Lessons learned in space architecture and ECLSS engineering.

### 7. Synthesized Web Audio Engine
- Built-in sound effects generated in real time using the browser's Web Audio API.
- Zero audio files to download.
- Full Mute/Unmute audio toggle.

---

## 🔬 Space Science Concepts Explained
- **ECLSS (Environmental Control and Life Support Systems):** Why closed-loop mass balance is essential when resupply flights from Earth cost tens of thousands of dollars per kilogram.
- **Lunar Regolith vs. Earth Soil:** How the lack of wind and water erosion leaves lunar dust razor-sharp and unweathered, and why solar ultraviolet radiation charges it electrostatically.
- **Atmospheric Absence & Vacuum Heat Transfer:** Why heat cannot escape through air breezes on the Moon and must be radiated into deep space as infrared emission.
- **Permanently Shadowed Regions (PSRs):** How polar crater bottoms stay at -246°C for billions of years, trapping volatile water ice deposited by comets.
- **In-Situ Resource Utilization (ISRU):** Sintering regolith with microwaves and extracting oxygen from minerals like ilmenite ($FeTiO_3$).

---

## 🛠️ Technical Stack & Architecture
- **Language & Framework:** React 18, Vanilla Modern JavaScript (ES6+), CSS3.
- **Zero Dependencies:** Pure local browser execution.
- **Resilient Dual-Engine:** Bundled with a micro-React fallback shim so the app runs smoothly even if completely offline or if external CDNs are firewalled.
- **Responsive Design:** Fully responsive layout with fluid grid breakpoints for laptops, desktop monitors, tablets, and mobile smartphones.

