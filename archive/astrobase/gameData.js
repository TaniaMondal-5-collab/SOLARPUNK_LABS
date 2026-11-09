// ASTROBASE: Junior Astronaut Mission Trainer
// Game Data & Science Curriculum Definitions

const GAME_DATA = {
  bases: [
    {
      id: "shackleton",
      name: "Shackleton Crater Outpost",
      location: "Lunar South Pole (89.9°S, 0.0°E)",
      tagline: "Eternal Sunlight & Cold-Trap Ice",
      description: "Perched on the crater rim where solar peaks receive near-permanent sunlight, while the shadowed interior holds billion-year-old water ice deposits.",
      bonusText: "+10 Starting Water, -20% Water recycling loss",
      startingBonus: { water: 10, oxygen: 0, food: 0, energy: 5, radiation: 0 },
      waterDiscount: 0.2,
      difficulty: "Recommended for First-Time Commanders",
      badge: "❄️ Polar Ice Outpost",
      accent: "#38bdf8"
    },
    {
      id: "oceanus",
      name: "Oceanus Procellarum Lab",
      location: "Ocean of Storms (18.4°N, 57.4°W)",
      tagline: "Vast Basalt Plains & High Solar Yield",
      description: "An open equatorial volcanic plain rich in ilmenite and titanium, providing unmatched flat expanse for sprawling solar panel farms.",
      bonusText: "+15 Starting Energy, +15% Solar efficiency",
      startingBonus: { water: 0, oxygen: 0, food: 0, energy: 15, radiation: 0 },
      energyBonus: 0.15,
      difficulty: "Energy Surplus Strategy",
      badge: "⚡ Solar Giant",
      accent: "#facc15"
    },
    {
      id: "tranquillitatis",
      name: "Mare Tranquillitatis Sub-Hub",
      location: "Sea of Tranquility (0.7°N, 23.5°E)",
      tagline: "Historic Basalt & Natural Lava Tube Haven",
      description: "Located near Apollo 11's touchdown, built into a collapsed basalt lava tube that offers incredible natural cosmic radiation and micrometeorite shielding.",
      bonusText: "+15 Radiation Protection, Natural Radiation Buff",
      startingBonus: { water: 0, oxygen: 0, food: 0, energy: 0, radiation: 15 },
      radiationBonus: 10,
      difficulty: "High Defense & Safety",
      badge: "🛡️ Lava Tube Fortress",
      accent: "#a855f7"
    },
    {
      id: "aristarchus",
      name: "Aristarchus Plateau Research Complex",
      location: "Aristarchus Plateau (23.7°N, 47.4°W)",
      tagline: "Pyroclastic Glass & Volatile Science Yield",
      description: "A geologically complex volcanic plateau with dense pyroclastic ash deposits. High scientific research value with advanced greenhouses.",
      bonusText: "+10 Starting Food, +10 Starting Oxygen",
      startingBonus: { water: 0, oxygen: 10, food: 10, energy: 0, radiation: 0 },
      scienceBonus: 1.2,
      difficulty: "Advanced Research Focus",
      badge: "🔬 High Science Frontier",
      accent: "#34d399"
    }
  ],

  crew: [
    {
      id: "commander",
      name: "Commander Maya Chen",
      role: "Mission Commander & Flight Operations",
      specialty: "High-stress decision making & crew morale",
      bio: "Former test pilot and aerospace systems lead. Excels at orchestrating emergency responses.",
      icon: "🧑‍🚀",
      trait: "Morale Anchor: Minimizes health drops during resource crises."
    },
    {
      id: "engineer",
      name: "Dr. Alex Mercer",
      role: "ECLSS & Power Systems Lead",
      specialty: "Closed-loop life support & solar tracking",
      bio: "Mechanical engineer specializing in cryogenic oxygen electrolysis and vacuum heat exchangers.",
      icon: "👩‍🔧",
      trait: "Efficiency Expert: Reduces energy drain on life support subsystems."
    },
    {
      id: "biologist",
      name: "Dr. Samantha Rao",
      role: "Astrobiologist & Plant Physiologist",
      specialty: "Aeroponic microgreens & biological recycling",
      bio: "Botanist who pioneered LED spectrum growth cycles for extraterrestrial dwarf wheat.",
      icon: "🌱",
      trait: "Green Thumb: Boosts food production yields by 20%."
    },
    {
      id: "geologist",
      name: "Marcus Vance",
      role: "Lunar Geologist & EVA Specialist",
      specialty: "Regolith sintering & in-situ resource utilization",
      bio: "Expert on lunar volcanism and abrasive dust mitigation. Has logged 200+ EVA hours.",
      icon: "⛏️",
      trait: "Dust Pioneer: Reduces repairs costs and speeds up exterior fixes."
    }
  ],

  scenarios: [
    {
      id: 1,
      day: 1,
      title: "Lunar Dust Electrostatic Clinging on Solar Arrays",
      problem: "Sunrise has illuminated the base, but sub-micron lunar regolith particles—charged by solar ultraviolet radiation—have electrostatically coated 45% of the primary solar panels. Photovoltaic power output has dropped by 35%.",
      choices: [
        {
          id: "dust_eva",
          label: "Dispatch Marcus on an EVA with an Electrostatic Dust Wand",
          costText: "Costs 12 Energy, 5 Crew Health fatigue",
          benefitText: "Restores 100% solar array efficiency & gives +5 Science",
          delta: { energy: -12, health: -5, science: 5, panelEfficiency: 1.0 },
          feedback: "Marcus braved the abrasive regolith dust. Using an oscillating electric curtain wand, he repelled the clingy particles and restored peak solar output!",
          scienceFact: "Real Lunar Science: Unlike Earth dust, lunar dust is jagged like microscopic broken glass because there is no wind or liquid water to erode sharp edges. Furthermore, UV rays from the Sun knock electrons off dust particles, charging them positively and causing them to levitate and stick tenaciously to solar panels, spacesuits, and camera lenses!"
        },
        {
          id: "dust_tilt",
          label: "Trigger Mechanical Array Shakers & Piezoelectric Vibrators",
          costText: "Costs 20 Energy, 0 Health",
          benefitText: "Restores 80% solar efficiency with zero crew danger",
          delta: { energy: -20, health: 0, science: 2, panelEfficiency: 0.8 },
          feedback: "The motorized gimbals vigorously tilted the arrays and fired piezoelectric acoustic pulses. About 80% of the dust slid off without risking crew safety outside.",
          scienceFact: "Real Lunar Science: In-situ mechanical cleaning (such as ultrasonic vibrators and high-voltage electrodynamic dust shields) is being tested for future lunar surface infrastructure so astronauts don't have to risk life and limb wiping panels manually in vacuum."
        },
        {
          id: "dust_conserve",
          label: "Postpone Cleaning: Throttle Science Systems to Conserve Power",
          costText: "0 Resources spent today",
          benefitText: "Panels remain 35% impaired; requires strict energy rationing",
          delta: { energy: 0, health: 0, science: 0, panelEfficiency: 0.65 },
          feedback: "You opted to preserve crew stamina and battery reserves. The base survived on throttled power, though lighting and secondary heating were dimmed.",
          scienceFact: "Simplified Game Mechanics: In real lunar operations, leaving abrasive dust on solar arrays can cause thermal hotspots and permanently scratch antireflective optical coatings over multiple lunar days."
        }
      ]
    },
    {
      id: 2,
      day: 2,
      title: "Catalytic Water Recovery Loop Contamination",
      problem: "A high-pressure seal in the greywater distillation assembly degraded. Microbial contaminants have bypassed the primary nanofiltration membrane. Recycled water purity has plummeted to 60%, threatening the drinking supply.",
      choices: [
        {
          id: "water_thermal",
          label: "Execute High-Temperature Catalytic Thermal Flash Flush",
          costText: "Costs 25 Energy, preserves all water",
          benefitText: "Purifies system back to 100% purity and yields +10 Clean Water",
          delta: { energy: -25, water: 10, health: 0, science: 3 },
          feedback: "Dr. Alex Mercer energized the catalytic reactor to 140°C under vacuum, incinerating all organic particulates and sterilizing the recovery loop completely.",
          scienceFact: "Real Lunar Science: On the International Space Station and future Artemis habitats, the Environmental Control and Life Support System (ECLSS) recovers over 98% of all water from sweat, exhaled breath moisture, and urine using vacuum rotary distillation followed by catalytic oxidation!"
        },
        {
          id: "water_filter",
          label: "Swap in Expendable Backup Carbon-Nanotube Filter Cartridges",
          costText: "Costs 10 Water for flush, 5 Energy",
          benefitText: "Restores 95% water recovery; consumes precious backup parts",
          delta: { water: -10, energy: -5, health: 0, science: 1 },
          feedback: "The crew installed the spare filtration canisters. Water flow was quickly restored with minimal energy consumption, though spare supplies are now depleted.",
          scienceFact: "Real Lunar Science: Transporting replacement parts from Earth to the Moon is extremely expensive (~$50,000 to $100,000 per kilogram of payload). Sustainable bases must rely on regenerative, cleanable filters rather than single-use disposables."
        },
        {
          id: "water_ration",
          label: "Ration Water by 40% & Manually Backwash the Membrane",
          costText: "Saves Energy, but crew gets dehydrated (-8 Health)",
          benefitText: "Saves critical energy grid reserves",
          delta: { health: -8, energy: 0, water: -5, science: 0 },
          feedback: "The crew tightened their drinking rations and manually cleared the manifold. The base conserved battery reserves, but mild dehydration left the astronauts fatigued.",
          scienceFact: "Simplified Game Mechanics: Dehydration quickly impacts cognitive performance, kidney function, and motor coordination—dangerous vulnerabilities in a hostile lunar environment."
        }
      ]
    },
    {
      id: 3,
      day: 3,
      title: "Oxygen Electrolysis Module Pressure Anomaly",
      problem: "The Sabatier-electrolysis unit experienced a pressure valve spike. Exhaled carbon dioxide is not being cracked into oxygen fast enough, and the habitat atmospheric CO2 levels are steadily climbing toward 0.8% (above safety thresholds).",
      choices: [
        {
          id: "o2_cryo",
          label: "Open Emergency Pressurized Cryogenic Liquid O2 Tanks",
          costText: "Consumes 15 Oxygen reserve, 5 Energy",
          benefitText: "Instantly normalizes habitat atmosphere; 100% safe",
          delta: { oxygen: -15, energy: -5, health: 0, science: 2 },
          feedback: "Commander Chen authorized venting cryogenic liquid oxygen through the environmental vaporizers. The cabin atmosphere immediately normalized, protecting crew cognition.",
          scienceFact: "Real Lunar Science: Deep-space habitats carry high-pressure liquid oxygen Dewars as emergency reserves. Even small increases in carbon dioxide ($CO_2$) above 0.5% cause astronauts to suffer headaches, lethargy, and impaired judgment."
        },
        {
          id: "o2_regolith",
          label: "Fire Up Experimental Molten Regolith Electrolysis Reactor",
          costText: "Costs 30 Energy, 5 Water",
          benefitText: "Extracts +20 fresh Oxygen from lunar soil! +10 Science points!",
          delta: { energy: -30, water: -5, oxygen: 20, science: 10 },
          feedback: "Marcus shoveled lunar regolith into the high-temperature reactor. Heating the mineral ilmenite ($FeTiO_3$) cracked trapped oxygen directly out of the stone!",
          scienceFact: "Real Lunar Science: Lunar regolith (soil) is 40% to 45% oxygen by weight, bound chemically to silicon, iron, and titanium minerals. In-Situ Resource Utilization (ISRU) experiments like NASA's carbothermal and molten electrolysis reactors prove we can 'breathe the Moon'!"
        },
        {
          id: "o2_scrub",
          label: "Manually Shake Chemical Lithium Hydroxide (LiOH) Canisters",
          costText: "Costs 8 Crew Health fatigue, 10 Energy",
          benefitText: "Removes CO2 without using oxygen reserves",
          delta: { health: -8, energy: -10, oxygen: 0, science: 4 },
          feedback: "The crew manually routed cabin air through backup chemical $LiOH$ canisters. It neutralized the excess $CO_2$, but the heavy physical labor left the crew exhausted.",
          scienceFact: "Real Lunar Science: Apollo missions and Apollo 13 famously used lithium hydroxide canisters to absorb $CO_2$. While reliable, $LiOH$ is consumable and cannot easily be recycled in space without large processing equipment."
        }
      ]
    },
    {
      id: 4,
      day: 4,
      title: "Lunar Midday Extreme Thermal Surge",
      problem: "The Sun has reached its maximum elevation. With no atmosphere to scatter or shield thermal radiation, base exterior temperatures have hit +120°C (+248°F). The external cooling loops are struggling to dump interior heat into space.",
      choices: [
        {
          id: "heat_shade",
          label: "Deploy Thermal Specular Sunshades & Boost Radiator Heat Pumps",
          costText: "Costs 20 Energy, 5 Radiation integrity",
          benefitText: "Stabilizes habitat temperature perfectly; protects electronics",
          delta: { energy: -20, radiation: -5, health: 0, science: 3 },
          feedback: "Dr. Mercer unfurled reflective mylar thermal blankets and cranked the ammonia fluid loops. Internal base temperature stabilized at a comfortable 21°C.",
          scienceFact: "Real Lunar Science: The Moon has zero atmospheric air convection—heat can only be rejected by conduction into the ground or by emitting infrared radiation into the void of space through giant radiator panels pointed away from the Sun."
        },
        {
          id: "heat_water",
          label: "Circulate Water Reservoir as an Internal Thermal Heat Sink",
          costText: "Consumes 12 Water through evaporative venting",
          benefitText: "Conserves Energy grid, avoids electrical brownout",
          delta: { water: -12, energy: 0, health: 0, science: 2 },
          feedback: "You routed thermal lines through the bulk water tanks, using water's enormous specific heat capacity to soak up thermal energy before venting steam into vacuum.",
          scienceFact: "Real Lunar Science: Water has one of the highest specific heat capacities of any known substance ($4.184 \\text{ J}/(\\text{g}\\cdot°\\text{C})$), making it a superb emergency thermal buffer for spacecraft and lunar stations."
        },
        {
          id: "heat_throttle",
          label: "Shutdown Hydroponics & Scientific Equipment to Minimize Internal Heat",
          costText: "Loss of 10 Food yield, -5 Science points",
          benefitText: "Zero water or energy lost; interior stays safe",
          delta: { food: -10, science: -5, energy: 5, health: 0 },
          feedback: "You cut power to all computing racks and greenhouse lamps. Internal thermal generation dropped immediately, preventing heat damage at the cost of crop growth.",
          scienceFact: "Simplified Game Mechanics: Electrical equipment in space generates waste heat equal to almost 100% of the electricity it consumes, meaning turning off lights directly cools the habitat."
        }
      ]
    },
    {
      id: 5,
      day: 5,
      title: "Hydroponics Aeroponic Bay Nutrient Imbalance",
      problem: "Dr. Samantha Rao reports that the aeroponic vertical farm nozzles have clogged with crystallized magnesium salts. The dwarf wheat and spirulina algae crops are wilting, threatening next week's food supply.",
      choices: [
        {
          id: "farm_flush",
          label: "Flush Nozzles with Purified Distilled Water & Micro-Nutrient Boost",
          costText: "Costs 15 Water, 15 Energy",
          benefitText: "Revives the crops completely; yields +20 Fresh Food!",
          delta: { water: -15, energy: -15, food: 20, science: 5 },
          feedback: "Dr. Rao flushed the ultrasonic mister manifolds and recalibrated the solution pH. Within hours, the lush green leaves perked up, producing a bumper harvest of nutrient-rich salad!",
          scienceFact: "Real Lunar Science: Space farming utilizes aeroponics—hanging plant roots in humid air and spraying them with nutrient mist. This requires 95% less water than Earth farming and 0% soil, while producing fresh vitamins and psychological joy for the crew."
        },
        {
          id: "farm_harvest",
          label: "Early Emergency Harvest: Freeze-Dry and Mill Current Crops",
          costText: "Costs 5 Energy, 0 Water",
          benefitText: "Yields +10 Food immediately; crops must be reseeded",
          delta: { energy: -5, food: 10, science: 2 },
          feedback: "The crew harvested the immature crops before rot could set in. While biomass was lower than projected, the emergency freeze-dry rations supplemented the pantry nicely.",
          scienceFact: "Real Lunar Science: Astronauts cannot survive long-term purely on packaged Earth rations because shelf-stable vitamins (especially Vitamin C and B12) degrade over months of radiation exposure."
        },
        {
          id: "farm_algae",
          label: "Switch Greenhouse from Crops to Fast-Growing Chlorella Microalgae",
          costText: "Costs 10 Water, -5 Crew Health (astronauts dislike algae paste)",
          benefitText: "Yields +15 Food and +5 Oxygen regeneration!",
          delta: { water: -10, health: -5, food: 15, oxygen: 5, science: 6 },
          feedback: "Dr. Rao inoculated the photobioreactors with chlorella algae. It grew at triple the speed and generated oxygen, though the astronauts groaned at the taste of green paste rations.",
          scienceFact: "Real Lunar Science: Microalgae such as Chlorella and Spirulina are superfoods in space architecture: they convert carbon dioxide into oxygen with up to 10 times the photosynthetic efficiency of leafy plants!"
        }
      ]
    },
    {
      id: 6,
      day: 6,
      title: "Solar Particle Event (SPE) Coronal Mass Ejection Alert",
      problem: "Earth Space Weather Prediction Center sends an urgent flash: a powerful X-class solar flare has erupted from the Sun, directing a torrent of high-energy relativistic protons toward the Moon. Arrival time: 3 hours!",
      choices: [
        {
          id: "spe_shelter",
          label: "Order All Crew into the Deep Regolith Storm Shelter Burrow",
          costText: "Halts all base maintenance; costs 15 Energy for life support bunker",
          benefitText: "100% Crew Health protected; shields against all radiation sickness",
          delta: { energy: -15, health: 0, radiation: 5, science: 4 },
          feedback: "Commander Chen sounded the alarm. The 4 astronauts squeezed into the heavily shielded underground storm shelter beneath 3 meters of regolith until the proton flux subsided.",
          scienceFact: "Real Lunar Science: Without Earth's protective magnetosphere and thick atmosphere, astronauts on the Moon are exposed to deadly Solar Particle Events (SPE). A coronal mass ejection can deliver over 1 to 2 Sieverts of radiation—enough to cause acute radiation poisoning without thick regolith or water shielding!"
        },
        {
          id: "spe_shield",
          label: "Power Up Active Electromagnetic Habitat Deflector Grid",
          costText: "Consumes 35 Energy, -10 Water for cooling coils",
          benefitText: "Protects habitat surface; crew continues active research (+8 Science)",
          delta: { energy: -35, water: -10, radiation: 10, science: 8 },
          feedback: "Dr. Mercer energized the superconducting magnetic coils on the exterior dome. The magnetic field deflected incoming charged ions like a miniature artificial Earth magnetosphere!",
          scienceFact: "Real Lunar Science: Active magnetic shielding is an active area of space research: generating artificial magnetic fields (0.5 to 1 Tesla) around space habitats to deflect charged protons and heavy cosmic ray ions."
        },
        {
          id: "spe_risk",
          label: "Leave Rover Outside to Log High-Energy Radiation Data",
          costText: "Crew suffers minor radiation exposure (-10 Health)",
          benefitText: "Yields immense scientific data (+18 Science points)",
          delta: { health: -10, science: 18, radiation: -15 },
          feedback: "The crew stayed in the main dome to keep scientific sensor rigs recording. They captured historic heliophysics data, but personal dosimeters indicated safe radiation limits were strained.",
          scienceFact: "Simplified Game Mechanics: Astronauts have career radiation limits monitored closely in micro-Sieverts. Sacrificing crew health for research points reflects real ethical dilemmas faced by flight directors."
        }
      ]
    },
    {
      id: 7,
      day: 7,
      title: "Deep Space Network High-Gain Antenna Gear Failure",
      problem: "The steerable 3-meter parabolic antenna tracking Earth has jammed at its azimuth gimbal due to fine dust intrusion. Data transmission rates to Houston have dropped by 85%, disrupting telemetry and remote diagnostics.",
      choices: [
        {
          id: "ant_eva",
          label: "Conduct a 2-Person Spacewalk (EVA) to Disassemble & Lubricate Gear",
          costText: "Consumes 10 Oxygen, 6 Crew Health fatigue",
          benefitText: "100% signal restored; Earth Mission Control provides +10 Energy grid optimization",
          delta: { oxygen: -10, health: -6, energy: 10, science: 5 },
          feedback: "Marcus and Dr. Mercer donned their EMU spacesuits. Working in vacuum, they cleaned the planetary gear teeth and applied Braycote space grease. Direct high-speed comms were restored!",
          scienceFact: "Real Lunar Science: Standard lubricants evaporate or seize up in the high vacuum and extreme cold of space. Space mechanisms require specialized low-outgassing perfluorinated synthetic greases like Braycote."
        },
        {
          id: "ant_omni",
          label: "Switch to Fixed Low-Gain Omnidirectional Relay Antennas",
          costText: "Consumes 20 Energy to boost transmitter amplification",
          benefitText: "Zero astronaut spacewalk risk; maintains voice and low-res telemetry",
          delta: { energy: -20, health: 0, science: 1 },
          feedback: "Commander Chen rerouted communications through wide-angle low-gain horn antennas. Signal strength was lower and power draw was high, but the crew avoided an exterior EVA hazard.",
          scienceFact: "Real Lunar Science: Spacecraft always carry low-gain omnidirectional antennas as failsafes. Because they broadcast in all directions, they do not need precise pointing, but require significantly more power to transmit high data volumes."
        },
        {
          id: "ant_auto",
          label: "Engage Autonomous Base AI Pilot Mode to Operate Offline",
          costText: "0 Resources spent",
          benefitText: "Saves power, but delayed Earth diagnostics; -5 Science points",
          delta: { energy: 0, science: -5, health: 0 },
          feedback: "You opted to let the station run on local computer autonomy without constant Earth hand-holding. The base held steady, though unvalidated science batches couldn't be transmitted.",
          scienceFact: "Real Lunar Science: Because radio signals travel at the speed of light, latency between the Earth and Moon is roughly 1.3 seconds each way (2.6 second round-trip). While manageable for voice, future Mars missions will face delays of up to 40 minutes!"
        }
      ]
    },
    {
      id: 8,
      day: 8,
      title: "Hypervelocity Micrometeoroid Pierces Air Handler Duct",
      problem: "A cosmic grain of sand traveling at 22 kilometers per second slammed into the external air intake plenum. Pressure sensors sound an audible alarm: habitat pressure is dropping by 2 millibars per minute!",
      choices: [
        {
          id: "meteor_patch",
          label: "Rapid Internal Depressurization Isolation & Self-Expanding Epoxy Seal",
          costText: "Costs 12 Oxygen lost during seal, 10 Energy",
          benefitText: "Completely seals puncture; protects habitat envelope",
          delta: { oxygen: -12, energy: -10, health: 0, science: 3 },
          feedback: "Dr. Mercer raced through the service duct with a rapid-curing silicone vacuum sealant. He applied the patch over the puncture, arresting pressure loss within 90 seconds!",
          scienceFact: "Real Lunar Science: Without an atmosphere to incinerate space debris, tiny micrometeoroids strike the lunar surface at velocities ranging from 11 to 72 km/s (30 to 200 times faster than a rifle bullet)! Spacecraft use Whipple shields (multiple spaced metal and Kevlar bumpers) to shatter incoming particles before they reach the pressure hull."
        },
        {
          id: "meteor_bulkhead",
          label: "Seal Compartment Bulkheads and Quarantine the Science Module",
          costText: "Loses 10 Science points; zero oxygen wasted",
          benefitText: "Zero risk to crew living quarters",
          delta: { science: -10, oxygen: 0, health: 0, energy: 0 },
          feedback: "Commander Chen slammed the heavy titanium pressure doors, isolating the breached science lab. The rest of the habitat remained at nominal pressure, though the lab equipment is offline.",
          scienceFact: "Real Lunar Science: Compartmentalized bulkheads are vital safety features in space station architecture. If one module experiences rapid decompression, sealing the hatches ensures the remaining crew survives."
        },
        {
          id: "meteor_armor",
          label: "EVA Mission: Bolt Heavy Titanium Armor Over the Puncture",
          costText: "Consumes 15 Oxygen, 8 Crew Health risk",
          benefitText: "Permanently reinforces base (+15 Radiation/Structural Protection!)",
          delta: { oxygen: -15, health: -8, radiation: 15, science: 6 },
          feedback: "Marcus suited up and bolted an extra ballistic Whipple bumper over the scar. The repair not only sealed the breach but left the station stronger against future impacts!",
          scienceFact: "Simplified Game Mechanics: Structural armor in this simulation also boosts radiation protection because solid mass shields against cosmic rays as well as mechanical debris."
        }
      ]
    },
    {
      id: 9,
      day: 9,
      title: "Permanently Shadowed Crater Ice Core Extraction",
      problem: "Long-range radar on the autonomous lunar rover detected a massive sheet of subsurface water ice in the dark recesses of Faustini crater nearby, where temperatures stay at -240°C. Extracting a deep core requires a massive energy surge.",
      choices: [
        {
          id: "ice_deep",
          label: "Authorize Full Deep-Rotary Thermal Drill Operation",
          costText: "Consumes 35 Energy, 5 Health fatigue",
          benefitText: "Yields a huge haul of +35 Water and +15 Science points!",
          delta: { energy: -35, health: -5, water: 35, science: 15 },
          feedback: "Marcus operated the heavy rotary percussive drill remotely. The bit bored 2 meters into cryo-hardened regolith, hauling up crystalline water ice preserved since the formation of the Solar System!",
          scienceFact: "Real Lunar Science: Permanently Shadowed Regions (PSRs) at the lunar poles exist because the Moon's axial tilt is only 1.5 degrees. Sunlight never reaches crater bottoms, creating permanent 'cold traps' as frigid as -246°C (30 Kelvin)—colder than Pluto!"
        },
        {
          id: "ice_sublime",
          label: "Deploy Optical Thermal Mirror Tent to Gently Sublime Surface Frost",
          costText: "Costs 15 Energy, 0 Health risk",
          benefitText: "Yields a modest +15 Water and +5 Science points",
          delta: { energy: -15, water: 15, health: 0, science: 5 },
          feedback: "The crew directed inflatable mylar mirrors to bounce sunlight into the crater rim, gently vaporizing volatile frost into a cold trap condenser tent. Safe, steady, and efficient.",
          scienceFact: "Real Lunar Science: Thermal mining involves using sunlight concentrators or infrared heaters to vaporize volatile water from lunar dirt without digging heavy bulldozers into rock-hard cryogenic permafrost."
        },
        {
          id: "ice_skip",
          label: "Conserve Power for the Approaching 10-Day Mission Finale",
          costText: "0 Resources spent",
          benefitText: "Keeps batteries at 100% readiness; passes on science",
          delta: { energy: 0, water: 0, health: 0, science: 0 },
          feedback: "Commander Chen opted for caution. With mission day 10 looming, all power reserves were preserved to ensure flawless life-support readiness.",
          scienceFact: "Simplified Game Mechanics: Balancing ambitious exploration versus mission safety is the central challenge of human spaceflight commanders."
        }
      ]
    },
    {
      id: 10,
      day: 10,
      title: "Final Mission Certification & Handover to Earth Command",
      problem: "It is Day 10—the final operational day of your junior astronaut mission training! Flight operations at Earth request a comprehensive habitat stress-test and science downlink to certify Astrobase for permanent human settlement.",
      choices: [
        {
          id: "final_stress",
          label: "Perform Full-Spectrum System Diagnostic & Transmit Complete Science Corpus",
          costText: "Consumes 20 Energy, 10 Oxygen",
          benefitText: "Unlocks the 'Master Commander Citation' and +20 Science Score!",
          delta: { energy: -20, oxygen: -10, science: 20, health: 0 },
          feedback: "Every computer core fired in unison. A massive data beam beamed petabytes of lunar geology, hydroponics, and life support benchmarks back to Earth!",
          scienceFact: "Real Lunar Science: Space stations require extensive operational qualification testing. Proving that an ECLSS loop can operate reliably without Earth resupply is the primary hurdle before humanity can voyage to Mars!"
        },
        {
          id: "final_conserve",
          label: "Mothball Secondary Subsystems and Stage Pristine Safety Reserves",
          costText: "Conserves all remaining supplies",
          benefitText: "Protects crew health (+10 Health boost) and preserves all stockpiles",
          delta: { health: 10, science: 5 },
          feedback: "The crew systematically flushed filters, charged emergency battery banks, and left the base in immaculate turnkey condition for the incoming Expedition 2 crew.",
          scienceFact: "Real Lunar Science: Proper station handover protocol includes clean microbial swabs, atmospheric filter replacements, and inventory tracking so the relief crew steps into a safe, flight-ready habitat."
        },
        {
          id: "final_celebrate",
          label: "Host a Fresh Greenhouse Harvest Feast & Live Broadcast to Earth Schools",
          costText: "Consumes 15 Food, 10 Energy",
          benefitText: "Maxes out Crew Health (+15 Health) and Inspires Future Astronauts (+15 Science)",
          delta: { food: -15, energy: -10, health: 15, science: 15 },
          feedback: "The crew whipped up a celebratory dinner of fresh hydroponic strawberries, wheat bread, and tea while answering questions from thousands of excited school students on Earth!",
          scienceFact: "Real Lunar Science: Psychological health, group cohesion, and public science engagement are vital components of astronaut wellbeing during long-duration isolation missions."
        }
      ]
    }
  ],

  upgrades: [
    {
      id: "solar_upgrade",
      name: "Bifacial Photovoltaic Solar Farm",
      icon: "⚡",
      category: "Energy",
      description: "Installs high-efficiency multi-junction solar cells that capture direct sunlight plus sunlight reflected off the bright lunar regolith.",
      levels: [
        {
          level: 1,
          name: "Gen-1 Bifacial Trackers",
          cost: { energy: 20, water: 10 },
          effect: "+12 Energy generated each new day",
          bonus: { dailyEnergy: 12 },
          science: "Multi-junction photovoltaic cells can achieve over 32% efficiency in space vacuum, capturing both direct rays and lunar albedo (reflected light)."
        },
        {
          level: 2,
          name: "Electrodynamic Dust Shield Arrays",
          cost: { energy: 35, water: 15 },
          effect: "+24 Energy/day, immune to minor dust penalties",
          bonus: { dailyEnergy: 24, dustImmune: true },
          science: "Electrodynamic dust shields use transparent conductive electrodes embedded in panel glass to push abrasive charged particles off using pulsed electric waves."
        }
      ]
    },
    {
      id: "water_upgrade",
      name: "Vapor Compression Distillation Loop",
      icon: "💧",
      category: "Life Support",
      description: "Upgrades the wastewater distillation centrifuge with catalytic oxidation tubes to recover 95%+ of cabin moisture.",
      levels: [
        {
          level: 1,
          name: "Closed-Loop Catalytic Condenser",
          cost: { energy: 20, water: 25 },
          effect: "Reduces daily water consumption by 5 units",
          bonus: { waterSavings: 5 },
          science: "On the ISS, water recovery distillation centrifuges spin in microgravity to separate water vapor from dense waste brine, achieving near 98% water loop closure."
        },
        {
          level: 2,
          name: "Graphene Oxide Nanofiltration Matrix",
          cost: { energy: 30, water: 30 },
          effect: "Reduces daily water consumption by 10 units & +5 Starting daily reserve",
          bonus: { waterSavings: 10, waterGen: 5 },
          science: "Atomically thin graphene oxide membranes block ions and microscopic organic molecules while allowing water molecules to pass through with near-zero hydraulic drag."
        }
      ]
    },
    {
      id: "hydro_upgrade",
      name: "Vertical Aeroponic Plant Growth Bay",
      icon: "🌱",
      category: "Biomass & O2",
      description: "Automated revolving crop racks with custom spectrum blue/red LED illumination and ultrasonic nutrient vaporizers.",
      levels: [
        {
          level: 1,
          name: "Automated Aeroponic Towers",
          cost: { energy: 25, water: 20 },
          effect: "Produces +10 Food each day, reduces O2 consumption by 3",
          bonus: { dailyFood: 10, o2Savings: 3 },
          science: "Plants consume carbon dioxide and emit oxygen through photosynthesis, meaning a flourishing greenhouse doubles as a biological air scrubber."
        },
        {
          level: 2,
          name: "Robotic Pollination & Microgreen Bay",
          cost: { energy: 38, water: 25 },
          effect: "Produces +20 Food/day, reduces O2 consumption by 6",
          bonus: { dailyFood: 20, o2Savings: 6 },
          science: "Dwarf crops like Apogee wheat and micro-tomatoes were bred specifically for extraterrestrial habitats to maximize edible harvest index per watt of electrical lighting."
        }
      ]
    },
    {
      id: "shield_upgrade",
      name: "Microwave-Sintered Regolith Shielding",
      icon: "🛡️",
      category: "Habitat Protection",
      description: "Autonomous rovers use microwave sintering to melt raw lunar dust into dense basalt ceramic tiles over the dome exterior.",
      levels: [
        {
          level: 1,
          name: "1-Meter Basalt Armor Shell",
          cost: { energy: 25, food: 15 },
          effect: "+15 Radiation Protection, reduces daily radiation decay",
          bonus: { radiationBoost: 15, radiationResist: 3 },
          science: "Raw lunar soil contains iron and titanium oxides. Heating regolith with microwaves at 2.45 GHz melts the grains together into solid, interlocking stone bricks without adding water."
        },
        {
          level: 2,
          name: "3-Meter Monolithic Dome Overcoat",
          cost: { energy: 40, food: 20 },
          effect: "+25 Radiation Protection & immune to micrometeoroid hull breaches",
          bonus: { radiationBoost: 25, radiationResist: 6, hullImmune: true },
          science: "A three-meter blanket of compacted regolith provides equivalent radiation shielding to Earth's sea-level atmosphere, completely blocking galactic cosmic rays and micrometeoroids."
        }
      ]
    },
    {
      id: "moxie_upgrade",
      name: "Solid-Oxide CO2 Electrolysis (MOXIE)",
      icon: "💨",
      category: "Life Support",
      description: "Splits carbon dioxide molecules from cabin exhaust into breathable oxygen and harmless carbon monoxide exhaust.",
      levels: [
        {
          level: 1,
          name: "Electrochemical Oxygen Concentrator",
          cost: { energy: 25, water: 15 },
          effect: "Reduces daily oxygen consumption by 6 units",
          bonus: { o2Savings: 6 },
          science: "NASA's MOXIE instrument on the Perseverance rover proved solid oxide electrolysis can extract pure breathable $O_2$ from atmospheric $CO_2$ at 800°C temperatures."
        },
        {
          level: 2,
          name: "High-Temperature Sabatier Methane Loop",
          cost: { energy: 35, water: 20 },
          effect: "Reduces daily oxygen consumption by 12 units & yields +4 Water/day",
          bonus: { o2Savings: 12, waterGen: 4 },
          science: "The Sabatier reaction combines hydrogen with waste carbon dioxide over a nickel catalyst to create water ($H_2O$) and methane ($CH_4$), closing the life-support chemical loop."
        }
      ]
    }
  ],

  achievements: [
    {
      id: "survivor",
      name: "Lunar Pioneer",
      icon: "🏅",
      description: "Successfully complete all 10 mission days with your crew intact.",
      check: (state) => state.day >= 10 && state.health > 0
    },
    {
      id: "healthy_crew",
      name: "Zero Casualty Medal",
      icon: "🩺",
      description: "Finish the 10-day mission with astronaut health at 80% or higher.",
      check: (state) => state.day >= 10 && state.health >= 80
    },
    {
      id: "ice_master",
      name: "Polar Hydrologist",
      icon: "🧊",
      description: "Successfully extract water ice and finish with over 50 units of water.",
      check: (state) => state.water >= 50
    },
    {
      id: "power_grid",
      name: "Helios Energy Architect",
      icon: "⚡",
      description: "Upgrade the solar power array and finish with over 50 units of energy.",
      check: (state) => state.energy >= 50
    },
    {
      id: "greenhouse_master",
      name: "Extraterrestrial Botanist",
      icon: "🥗",
      description: "Invest in hydroponics upgrades and finish with 50+ units of food.",
      check: (state) => state.food >= 50
    },
    {
      id: "science_laureate",
      name: "Chief Science Officer",
      icon: "🔬",
      description: "Accumulate 40 or more Scientific Achievement points during the mission.",
      check: (state) => state.scienceScore >= 40
    }
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.GAME_DATA = GAME_DATA;
}

