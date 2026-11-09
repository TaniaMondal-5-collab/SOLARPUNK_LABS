// ASTROBASE: Junior Astronaut Mission Trainer
// Core React Application Implementation

(function() {
  const { createElement: h, useState, useEffect, useMemo, useRef } = window.React;

  // Sound helper wrapper
  const sound = window.astroAudio || {
    click: () => {},
    toggle: () => {},
    success: () => {},
    warning: () => {},
    danger: () => {},
    dayAdvance: () => {},
    upgrade: () => {},
    gameComplete: () => {},
    toggleMute: () => false,
    isMuted: () => false
  };

  function App() {
    // Navigation / Screen state
    const [screen, setScreen] = useState("welcome"); // 'welcome' | 'setup' | 'dashboard' | 'decision' | 'upgrades' | 'results'
    const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'decision' | 'upgrades' | 'crew'
    
    // Mission Configuration
    const [selectedBase, setSelectedBase] = useState(window.GAME_DATA.bases[0]);
    
    // Day progression (1 to 10)
    const [day, setDay] = useState(1);
    
    // Vital Resources (simplified game units)
    const [resources, setResources] = useState({
      oxygen: 100,
      water: 100,
      food: 100,
      energy: 100,
      radiation: 80,
      health: 100
    });

    const [scienceScore, setScienceScore] = useState(0);

    // Active Base Subsystems (Energy Management)
    const [subsystems, setSubsystems] = useState({
      oxygenGen: true,       // 14 energy
      waterRecycler: true,   // 10 energy
      hydroponics: true,     // 12 energy
      thermalRadiators: true,// 8 energy
      scienceRadar: true,    // 6 energy
      auxShield: false       // 16 energy
    });

    // Installed Upgrades { upgrade_id: level (1 or 2) }
    const [upgrades, setUpgrades] = useState({});

    // Decisions Tracking
    const [decisionsHistory, setDecisionsHistory] = useState([]);
    const [scenarioResolvedToday, setScenarioResolvedToday] = useState(false);
    const [recentChoiceResult, setRecentChoiceResult] = useState(null);

    // Modals
    const [tutorialOpen, setTutorialOpen] = useState(false);
    const [scienceLogOpen, setScienceLogOpen] = useState(false);
    const [dailyReportModal, setDailyReportModal] = useState(null);

    // Alerts / Telemetry Feed
    const [alerts, setAlerts] = useState([
      { id: 1, text: "Mission clock initialized. Base systems nominal at lunar dawn.", type: "info", day: 1 }
    ]);

    // Audio Mute state
    const [isMuted, setIsMuted] = useState(sound.isMuted());

    const toggleAudio = () => {
      const state = sound.toggleMute();
      setIsMuted(state);
    };

    // Add alert helper
    const addAlert = (text, type = "info") => {
      setAlerts(prev => [
        { id: Date.now() + Math.random(), text, type, day },
        ...prev.slice(0, 19)
      ]);
    };

    // Reset whole game
    const handleStartNewMission = (base = window.GAME_DATA.bases[0]) => {
      sound.success();
      setSelectedBase(base);
      setDay(1);
      setResources({
        oxygen: 100 + (base.startingBonus.oxygen || 0),
        water: 100 + (base.startingBonus.water || 0),
        food: 100 + (base.startingBonus.food || 0),
        energy: 100 + (base.startingBonus.energy || 0),
        radiation: 80 + (base.startingBonus.radiation || 0),
        health: 100
      });
      setScienceScore(0);
      setSubsystems({
        oxygenGen: true,
        waterRecycler: true,
        hydroponics: true,
        thermalRadiators: true,
        scienceRadar: true,
        auxShield: false
      });
      setUpgrades({});
      setDecisionsHistory([]);
      setScenarioResolvedToday(false);
      setRecentChoiceResult(null);
      setDailyReportModal(null);
      setAlerts([
        { id: 1, text: `Expedition 1 landed at ${base.name}. 10-day mission underway!`, type: "success", day: 1 }
      ]);
      setScreen("dashboard");
      setActiveTab("dashboard");
    };

    // Subsystem toggle
    const handleToggleSubsystem = (key) => {
      sound.toggle();
      setSubsystems(prev => {
        const next = { ...prev, [key]: !prev[key] };
        addAlert(`Subsystem ${key} switched ${next[key] ? 'ONLINE' : 'OFFLINE'}.`, next[key] ? 'info' : 'warn');
        return next;
      });
    };

    // Calculate dynamic daily energy budget
    const energyCalculations = useMemo(() => {
      let solarEfficiency = 1.0;
      if (day > 1 && !upgrades.solar_upgrade) {
        solarEfficiency = Math.max(0.65, 1.0 - (day - 1) * 0.04);
      }
      
      let baseGen = 45;
      if (selectedBase.energyBonus) {
        baseGen *= (1 + selectedBase.energyBonus);
      }
      
      if (upgrades.solar_upgrade === 1) baseGen += 12;
      if (upgrades.solar_upgrade === 2) {
        baseGen += 24;
        solarEfficiency = 1.0; // dust immune
      }

      const totalGeneration = Math.round(baseGen * solarEfficiency);

      // Active drain
      let totalDrain = 0;
      if (subsystems.oxygenGen) totalDrain += 14;
      if (subsystems.waterRecycler) totalDrain += 10;
      if (subsystems.hydroponics) totalDrain += 12;
      if (subsystems.thermalRadiators) totalDrain += 8;
      if (subsystems.scienceRadar) totalDrain += 6;
      if (subsystems.auxShield) totalDrain += 16;

      return {
        generation: totalGeneration,
        drain: totalDrain,
        net: totalGeneration - totalDrain,
        efficiency: Math.round(solarEfficiency * 100)
      };
    }, [day, selectedBase, upgrades, subsystems]);

    // Handle Decision Selection
    const handleMakeDecision = (choice) => {
      sound.click();
      const currentScenario = window.GAME_DATA.scenarios.find(s => s.day === day) || window.GAME_DATA.scenarios[0];
      
      // Compute new resources ensuring no drops below 0
      setResources(prev => {
        const next = { ...prev };
        if (choice.delta.oxygen) next.oxygen = Math.max(0, Math.min(100, next.oxygen + choice.delta.oxygen));
        if (choice.delta.water) next.water = Math.max(0, Math.min(100, next.water + choice.delta.water));
        if (choice.delta.food) next.food = Math.max(0, Math.min(100, next.food + choice.delta.food));
        if (choice.delta.energy) next.energy = Math.max(0, Math.min(100, next.energy + choice.delta.energy));
        if (choice.delta.radiation) next.radiation = Math.max(0, Math.min(100, next.radiation + choice.delta.radiation));
        if (choice.delta.health) next.health = Math.max(0, Math.min(100, next.health + choice.delta.health));
        return next;
      });

      if (choice.delta.science) {
        setScienceScore(s => s + choice.delta.science);
      }

      setScenarioResolvedToday(true);
      setRecentChoiceResult({
        choice,
        scenario: currentScenario
      });

      setDecisionsHistory(prev => [
        ...prev,
        {
          day,
          scenarioTitle: currentScenario.title,
          chosenLabel: choice.label,
          feedback: choice.feedback,
          scienceFact: choice.scienceFact,
          delta: choice.delta
        }
      ]);

      addAlert(`Engineering Decision Logged: "${choice.label}".`, "info");
      sound.success();
    };

    // Advance to Next Day
    const handleAdvanceDay = () => {
      if (day >= 10) {
        sound.gameComplete();
        setScreen("results");
        return;
      }

      sound.dayAdvance();

      // Run daily simulation calculations
      const report = {
        prevDay: day,
        nextDay: day + 1,
        o2Consumed: 0,
        waterConsumed: 0,
        foodNet: 0,
        energyNet: energyCalculations.net,
        radiationDecay: 0,
        healthChange: 0,
        warnings: []
      };

      setResources(prev => {
        const next = { ...prev };

        // 1. Oxygen consumption
        let o2Burn = 15;
        if (!subsystems.oxygenGen) {
          o2Burn = 25; // no active recycling, burns backup tanks
          report.warnings.push("O2 Generator offline! Depleted backup oxygen reserves.");
        }
        if (upgrades.moxie_upgrade === 1) o2Burn -= 6;
        if (upgrades.moxie_upgrade === 2) o2Burn -= 12;
        if (upgrades.hydro_upgrade === 1) o2Burn -= 3;
        if (upgrades.hydro_upgrade === 2) o2Burn -= 6;
        o2Burn = Math.max(4, o2Burn);
        report.o2Consumed = o2Burn;
        next.oxygen = Math.max(0, next.oxygen - o2Burn);

        // 2. Water consumption
        let waterBurn = 16;
        if (!subsystems.waterRecycler) {
          waterBurn = 26;
          report.warnings.push("Water Recycler offline! Burning clean reserve tanks.");
        }
        if (selectedBase.waterDiscount) {
          waterBurn = Math.round(waterBurn * (1 - selectedBase.waterDiscount));
        }
        if (upgrades.water_upgrade === 1) waterBurn -= 5;
        if (upgrades.water_upgrade === 2) waterBurn -= 10;
        waterBurn = Math.max(4, waterBurn);
        report.waterConsumed = waterBurn;
        next.water = Math.max(0, next.water - waterBurn);

        // 3. Food consumption & Greenhouse production
        const foodEaten = 14;
        let foodProduced = 0;
        if (subsystems.hydroponics) {
          foodProduced = 9; // base + botanist trait
          if (upgrades.hydro_upgrade === 1) foodProduced += 10;
          if (upgrades.hydro_upgrade === 2) foodProduced += 20;
        } else {
          report.warnings.push("Hydroponic Greenhouse unpowered! Zero fresh crops harvested.");
        }
        const foodNet = foodProduced - foodEaten;
        report.foodNet = foodNet;
        next.food = Math.max(0, Math.min(100, next.food + foodNet));

        // 4. Energy net
        next.energy = Math.max(0, Math.min(100, next.energy + energyCalculations.net));
        if (next.energy <= 0) {
          report.warnings.push("ELECTRICAL BROWNOUT! Base battery banks fully drained.");
        }

        // 5. Radiation shield natural degradation & cosmic rays
        let radDecay = 4;
        if (selectedBase.radiationBonus) radDecay = Math.max(1, radDecay - 2);
        if (upgrades.shield_upgrade === 1) radDecay = Math.max(1, radDecay - 2);
        if (upgrades.shield_upgrade === 2) radDecay = 0; // complete basalt dome
        if (subsystems.auxShield) radDecay = 0;
        report.radiationDecay = radDecay;
        next.radiation = Math.max(0, next.radiation - radDecay);

        // 6. Crew Health impact checks
        let healthDelta = 0;

        if (next.oxygen <= 0) {
          healthDelta -= 24;
          report.warnings.push("CRITICAL HYPOXIA! Zero oxygen in habitat atmosphere.");
        }
        if (next.water <= 0) {
          healthDelta -= 18;
          report.warnings.push("ACUTE DEHYDRATION! Potable water exhausted.");
        }
        if (next.food <= 0) {
          healthDelta -= 12;
          report.warnings.push("STARVATION HAZARD! Food rations depleted.");
        }
        if (next.energy <= 0) {
          healthDelta -= 10;
          report.warnings.push("ENVIRONMENTAL FREEZE! Thermal radiators failed.");
        }
        if (next.radiation < 20) {
          healthDelta -= 8;
          report.warnings.push("HIGH RADIATION DOSE! Space radiation penetrating habitat.");
        }

        // Natural recovery if all nominal
        if (healthDelta === 0 && next.oxygen > 30 && next.water > 30 && next.food > 30 && next.energy > 30 && next.health < 100) {
          healthDelta += 5; // Commander Chen morale boost
        }

        report.healthChange = healthDelta;
        next.health = Math.max(0, Math.min(100, next.health + healthDelta));

        return next;
      });

      // Passive science gain from active radar
      if (subsystems.scienceRadar) {
        setScienceScore(s => s + 3);
      }

      const nextDay = day + 1;
      setDay(nextDay);
      setScenarioResolvedToday(false);
      setRecentChoiceResult(null);
      setDailyReportModal(report);
      setActiveTab("dashboard");

      addAlert(`Day ${nextDay} initiated. Solar angle adjusted.`, "info");
      if (report.warnings.length > 0) {
        report.warnings.forEach(w => addAlert(w, "crit"));
        sound.warning();
      }
    };

    // Purchase an Upgrade
    const handleBuyUpgrade = (upgradeId, targetLevel) => {
      sound.click();
      const upDef = window.GAME_DATA.upgrades.find(u => u.id === upgradeId);
      if (!upDef) return;
      const levelDef = upDef.levels.find(l => l.level === targetLevel);
      if (!levelDef) return;

      // Check costs
      const cost = levelDef.cost;
      const canAfford = 
        (!cost.energy || resources.energy >= cost.energy) &&
        (!cost.water || resources.water >= cost.water) &&
        (!cost.food || resources.food >= cost.food);

      if (!canAfford) {
        sound.danger();
        addAlert("Insufficient resources for this engineering upgrade!", "warn");
        return;
      }

      // Deduct resources
      setResources(prev => ({
        ...prev,
        energy: cost.energy ? prev.energy - cost.energy : prev.energy,
        water: cost.water ? prev.water - cost.water : prev.water,
        food: cost.food ? prev.food - cost.food : prev.food,
        radiation: levelDef.bonus.radiationBoost ? Math.min(100, prev.radiation + levelDef.bonus.radiationBoost) : prev.radiation
      }));

      setUpgrades(prev => ({ ...prev, [upgradeId]: targetLevel }));
      sound.upgrade();
      addAlert(`Base Upgrade Completed: ${upDef.name} (Level ${targetLevel})!`, "success");
    };

    // Check if player died during day simulation
    useEffect(() => {
      if (screen === "dashboard" && resources.health <= 0) {
        sound.danger();
        setScreen("results");
      }
    }, [resources.health, screen]);

    // Active scenario definition
    const activeScenario = useMemo(() => {
      return window.GAME_DATA.scenarios.find(s => s.day === day) || window.GAME_DATA.scenarios[0];
    }, [day]);

    // Calculate final mission score & achievements for Screen 6
    const missionEvaluation = useMemo(() => {
      const daysSurvived = Math.min(10, day);
      const isAlive = resources.health > 0;
      
      const survivalPts = daysSurvived * 3; // up to 30
      const healthPts = Math.round(resources.health * 0.25); // up to 25
      const avgResources = Math.round((resources.oxygen + resources.water + resources.food + resources.energy + resources.radiation) / 5);
      const resourcePts = Math.round(avgResources * 0.20); // up to 20
      const sciencePts = Math.min(15, Math.round((scienceScore / 40) * 15)); // up to 15
      const totalUpgradesCount = Object.keys(upgrades).length;
      const upgradePts = Math.min(10, totalUpgradesCount * 2); // up to 10

      let finalScore = survivalPts + healthPts + resourcePts + sciencePts + upgradePts;
      if (!isAlive) finalScore = Math.min(45, Math.round(finalScore * 0.5));
      finalScore = Math.max(0, Math.min(100, finalScore));

      let rank = "Distinguished Commander";
      let status = "Full Mission Success";
      let badge = "🏆 Artemis Master Certification";
      let color = "var(--cyan-glow)";

      if (!isAlive || finalScore < 50) {
        rank = "Mission Aborted";
        status = "Base Evacuated / Catastrophic Failure";
        badge = "⚠️ Emergency Capsule Return";
        color = "var(--red-alert)";
      } else if (finalScore < 70) {
        rank = "Junior Commander";
        status = "Marginal Survival";
        badge = "🥉 Bronze Mission Ribbon";
        color = "var(--yellow-warn)";
      } else if (finalScore < 85) {
        rank = "Senior Station Commander";
        status = "Mission Success";
        badge = "🥈 Silver Exploration Award";
        color = "var(--purple-neon)";
      }

      // Check achievements
      const stateObj = {
        day,
        health: resources.health,
        water: resources.water,
        energy: resources.energy,
        food: resources.food,
        scienceScore,
        upgrades
      };

      const unlockedAchievements = window.GAME_DATA.achievements.filter(ach => ach.check(stateObj));

      return {
        score: finalScore,
        rank,
        status,
        badge,
        color,
        isAlive,
        daysSurvived,
        survivalPts,
        healthPts,
        resourcePts,
        sciencePts,
        upgradePts,
        unlockedAchievements
      };
    }, [day, resources, scienceScore, upgrades]);

    return h("div", { className: "app-container" },
      // Top Navigation Header
      h(TopHeader, {
        screen,
        setScreen,
        day,
        isMuted,
        toggleAudio,
        onOpenTutorial: () => { sound.click(); setTutorialOpen(true); },
        onOpenScienceLog: () => { sound.click(); setScienceLogOpen(true); },
        onRestartMission: () => {
          sound.click();
          if (confirm("Abort current mission and return to base selection?")) {
            setScreen("setup");
          }
        }
      }),

      // Screen Router
      screen === "welcome" && h(ScreenWelcome, {
        onStart: () => { sound.click(); setScreen("setup"); },
        onHowToPlay: () => { sound.click(); setTutorialOpen(true); }
      }),

      screen === "setup" && h(ScreenSetup, {
        bases: window.GAME_DATA.bases,
        crew: window.GAME_DATA.crew,
        selectedBase,
        setSelectedBase: (b) => { sound.click(); setSelectedBase(b); },
        onLaunch: () => handleStartNewMission(selectedBase),
        onBack: () => { sound.click(); setScreen("welcome"); }
      }),

      screen === "dashboard" && h(ScreenDashboard, {
        day,
        resources,
        selectedBase,
        subsystems,
        onToggleSubsystem: handleToggleSubsystem,
        energyCalculations,
        upgrades,
        onBuyUpgrade: handleBuyUpgrade,
        alerts,
        activeTab,
        setActiveTab: (t) => { sound.click(); setActiveTab(t); },
        scenarioResolvedToday,
        activeScenario,
        onOpenDecision: () => { sound.click(); setScreen("decision"); },
        onAdvanceDay: handleAdvanceDay,
        scienceScore
      }),

      screen === "decision" && h(ScreenDecision, {
        day,
        scenario: activeScenario,
        scenarioResolvedToday,
        recentChoiceResult,
        onMakeChoice: handleMakeDecision,
        onBackToDashboard: () => { sound.click(); setScreen("dashboard"); },
        onAdvanceDay: handleAdvanceDay
      }),

      screen === "upgrades" && h(ScreenUpgrades, {
        resources,
        upgrades,
        upgradeDefs: window.GAME_DATA.upgrades,
        onBuyUpgrade: handleBuyUpgrade,
        onBackToDashboard: () => { sound.click(); setScreen("dashboard"); }
      }),

      screen === "results" && h(ScreenResults, {
        evaluation: missionEvaluation,
        decisionsHistory,
        resources,
        scienceScore,
        selectedBase,
        onPlayAgain: () => { sound.click(); setScreen("setup"); }
      }),

      // Interactive Modals
      tutorialOpen && h(ModalTutorial, {
        onClose: () => { sound.click(); setTutorialOpen(false); }
      }),

      scienceLogOpen && h(ModalScienceLog, {
        decisionsHistory,
        onClose: () => { sound.click(); setScienceLogOpen(false); }
      }),

      dailyReportModal && h(ModalDailyReport, {
        report: dailyReportModal,
        onClose: () => { sound.click(); setDailyReportModal(null); }
      })
    );
  }

  // TOP HEADER COMPONENT
  function TopHeader(props) {
    const { screen, setScreen, day, isMuted, toggleAudio, onOpenTutorial, onOpenScienceLog, onRestartMission } = props;

    return h("header", { className: "top-header" },
      h("div", { className: "brand-wrapper", onClick: () => { sound.click(); if (screen !== "dashboard") setScreen("welcome"); }, style: { cursor: "pointer" } },
        h("div", { className: "brand-logo-gem" }, "🚀"),
        h("div", null,
          h("div", { className: "brand-title" }, "ASTROBASE"),
          h("div", { className: "brand-sub" }, "Junior Astronaut Mission Trainer")
        )
      ),

      h("div", { className: "header-actions" },
        screen !== "welcome" && screen !== "setup" && h("div", { className: "chip chip-cyan", style: { marginRight: 6 } },
          `MISSION DAY ${day} OF 10`
        ),

        h("button", {
          className: "btn btn-ghost btn-sm",
          onClick: toggleAudio,
          title: isMuted ? "Unmute Sound" : "Mute Sound"
        }, isMuted ? "🔇 Audio OFF" : "🔊 Audio ON"),

        h("button", {
          className: "btn btn-ghost btn-sm",
          onClick: onOpenTutorial,
          title: "How to Play Guide"
        }, "📖 Tutorial"),

        h("button", {
          className: "btn btn-ghost btn-sm",
          onClick: onOpenScienceLog,
          title: "Science Notes & Concepts"
        }, "🧪 Science Log"),

        (screen === "dashboard" || screen === "decision" || screen === "upgrades") && h("button", {
          className: "btn btn-danger btn-sm",
          onClick: onRestartMission,
          title: "Abort and Restart Mission"
        }, "Abort")
      )
    );
  }

  // SCREEN 1: WELCOME PAGE
  function ScreenWelcome(props) {
    const { onStart, onHowToPlay } = props;

    return h("div", { className: "setup-container" },
      h("div", { className: "hud-card", style: { textAlign: "center", padding: "40px 24px", position: "relative" } },
        h("div", { className: "chip chip-purple", style: { marginBottom: 14 } }, "OFFICIAL SIMULATION TRAINING MODULE"),
        h("h1", { 
          style: { 
            fontFamily: "var(--font-display)", 
            fontSize: "2.6rem", 
            letterSpacing: "3px", 
            fontWeight: 800,
            background: "linear-gradient(90deg, #ffffff 0%, #38bdf8 50%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8
          } 
        }, "ASTROBASE"),
        h("h3", { 
          style: { 
            fontFamily: "var(--font-display)", 
            fontSize: "1.15rem", 
            letterSpacing: "2px", 
            color: "var(--cyan-glow)", 
            marginBottom: 20, 
            fontWeight: 600 
          } 
        }, "JUNIOR ASTRONAUT MISSION TRAINER"),
        h("p", { 
          style: { 
            fontSize: "1.2rem", 
            fontStyle: "italic", 
            color: "#e2e8f0", 
            marginBottom: 24, 
            maxWidth: 680, 
            marginLeft: "auto", 
            marginRight: "auto" 
          } 
        }, "“Think like an engineer. Decide like a commander. Survive like an astronaut.”"),
        
        h("p", { 
          style: { 
            maxWidth: 720, 
            margin: "0 auto 30px", 
            color: "var(--text-muted)", 
            fontSize: "1rem", 
            lineHeight: 1.6 
          } 
        }, "Welcome, Cadet! You have been appointed Flight Commander of humanity's lunar surface outpost. Over the next 10 mission days, you must manage vital life-support systems, balance the power grid, safeguard 4 specialist astronauts against cosmic radiation and extreme temperature swings, and resolve critical real-world engineering dilemmas."),

        h("div", { style: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" } },
          h("button", { className: "btn btn-cyan btn-lg", onClick: onStart }, "🚀 START MISSION"),
          h("button", { className: "btn btn-outline-cyan btn-lg", onClick: onHowToPlay }, "📖 HOW TO PLAY")
        )
      ),

      // Learning Objectives Section
      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "🎓 Mission Learning Objectives & Curriculum Standards")
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 } },
          h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 14, borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--cyan-glow)" } },
            h("h4", { style: { fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--cyan-glow)", marginBottom: 6 } }, "1. Systems Thinking & ECLSS"),
            h("p", { style: { fontSize: "0.85rem", color: "var(--text-muted)" } }, "Understand how Closed-Loop Environmental Control and Life Support Systems balance oxygen consumption, water recycling, and metabolic waste reclamation in space.")
          ),
          h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 14, borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--purple-glow)" } },
            h("h4", { style: { fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--purple-neon)", marginBottom: 6 } }, "2. In-Situ Resource Utilization (ISRU)"),
            h("p", { style: { fontSize: "0.85rem", color: "var(--text-muted)" } }, "Explore extracting water ice from cold permanently shadowed craters, and chemically cracking breathable oxygen directly from lunar regolith minerals.")
          ),
          h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 14, borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--yellow-warn)" } },
            h("h4", { style: { fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--yellow-warn)", marginBottom: 6 } }, "3. Space Physics & Radiation Shielding"),
            h("p", { style: { fontSize: "0.85rem", color: "var(--text-muted)" } }, "Learn how galactic cosmic rays, solar flares, electrostatic dust levitation, and thermal swings (-130°C to +120°C) impact lunar habitats without an atmosphere.")
          ),
          h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 14, borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--green-safe)" } },
            h("h4", { style: { fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--green-safe)", marginBottom: 6 } }, "4. Real Engineering Trade-offs"),
            h("p", { style: { fontSize: "0.85rem", color: "var(--text-muted)" } }, "Make balanced decisions where every choice has physical consequences—balancing power generation, crew fatigue, thermal safety, and scientific yield.")
          )
        )
      )
    );
  }

  // SCREEN 2: MISSION SETUP
  function ScreenSetup(props) {
    const { bases, crew, selectedBase, setSelectedBase, onLaunch, onBack } = props;

    return h("div", { className: "setup-container" },
      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "📍 Step 1: Select Lunar Research Base Site"),
          h("span", { className: "chip chip-cyan" }, "10-DAY EXPEDITION")
        ),
        h("div", { className: "bases-selection-grid" },
          bases.map(b => {
            const isSel = selectedBase.id === b.id;
            return h("div", {
              key: b.id,
              className: `base-select-card ${isSel ? 'selected' : ''}`,
              onClick: () => setSelectedBase(b)
            },
              h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                h("div", null,
                  h("h3", { style: { fontFamily: "var(--font-display)", fontSize: "1rem", color: isSel ? "var(--cyan-glow)" : "#fff" } }, b.name),
                  h("div", { style: { fontSize: "0.74rem", color: "var(--cyan-subtle)", fontFamily: "var(--font-mono)" } }, b.location)
                ),
                h("span", { className: "chip chip-purple" }, b.badge)
              ),
              h("p", { style: { fontSize: "0.85rem", color: "var(--text-muted)" } }, b.description),
              h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 } },
                h("span", { style: { fontSize: "0.8rem", color: "var(--green-safe)", fontWeight: 600 } }, b.bonusText),
                h("span", { style: { fontSize: "0.72rem", color: "var(--text-dim)" } }, b.difficulty)
              )
            );
          })
        )
      ),

      // Crew Specialists
      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "🧑‍🚀 Step 2: Assigned Expedition Crew (4 Specialists)"),
          h("span", { className: "chip chip-green" }, "CREW READY FOR FLIGHT")
        ),
        h("div", { className: "crew-grid" },
          crew.map(c => h("div", { key: c.id, className: "crew-card" },
            h("div", { className: "crew-avatar" }, c.icon),
            h("div", { className: "crew-name" }, c.name),
            h("div", { className: "crew-role" }, c.role),
            h("p", { style: { fontSize: "0.75rem", color: "var(--text-muted)" } }, c.bio),
            h("div", { className: "crew-trait" }, c.trait)
          ))
        )
      ),

      // Starting Resource Supply Preview
      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "📦 Step 3: Starting Resource Supplies & Parameters"),
          h("span", { className: "chip chip-yellow" }, "Game Units - Simplified for Mission Simulation")
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 } },
          h(SupplyStat, { label: "Oxygen", val: 100 + (selectedBase.startingBonus.oxygen || 0), icon: "💨", color: "var(--cyan-glow)" }),
          h(SupplyStat, { label: "Water", val: 100 + (selectedBase.startingBonus.water || 0), icon: "💧", color: "var(--cyan-subtle)" }),
          h(SupplyStat, { label: "Food", val: 100 + (selectedBase.startingBonus.food || 0), icon: "🌱", color: "var(--green-safe)" }),
          h(SupplyStat, { label: "Energy", val: 100 + (selectedBase.startingBonus.energy || 0), icon: "⚡", color: "var(--yellow-warn)" }),
          h(SupplyStat, { label: "Radiation Shield", val: 80 + (selectedBase.startingBonus.radiation || 0), icon: "🛡️", color: "var(--purple-neon)" }),
          h(SupplyStat, { label: "Crew Health", val: 100, icon: "🩺", color: "var(--red-alert)" })
        ),
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 } },
          h("button", { className: "btn btn-ghost", onClick: onBack }, "← Back to Welcome"),
          h("button", { className: "btn btn-cyan btn-lg", onClick: onLaunch }, "🚀 LAUNCH 10-DAY LUNAR MISSION")
        )
      )
    );
  }

  function SupplyStat({ label, val, icon, color }) {
    return h("div", { style: { background: "rgba(0,0,0,0.35)", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.08)" } },
      h("div", { style: { fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase" } }, `${icon} ${label}`),
      h("div", { style: { fontSize: "1.2rem", fontWeight: 700, fontFamily: "var(--font-mono)", color } }, `${val} units`)
    );
  }

  // SCREEN 3: MISSION CONTROL DASHBOARD
  function ScreenDashboard(props) {
    const {
      day,
      resources,
      selectedBase,
      subsystems,
      onToggleSubsystem,
      energyCalculations,
      upgrades,
      alerts,
      activeTab,
      setActiveTab,
      scenarioResolvedToday,
      activeScenario,
      onOpenDecision,
      onAdvanceDay,
      scienceScore
    } = props;

    return h("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
      // Top Navigation Tabs
      h("div", { className: "mission-tabs" },
        h("button", {
          className: `tab-btn ${activeTab === "dashboard" ? 'active' : ''}`,
          onClick: () => setActiveTab("dashboard")
        }, "🖥️ Control Dashboard"),
        h("button", {
          className: `tab-btn ${activeTab === "decision" ? 'active' : ''}`,
          onClick: () => { onOpenDecision(); }
        },
          "⚙️ Engineering Decisions",
          !scenarioResolvedToday && h("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--yellow-warn)", display: "inline-block", boxShadow: "0 0 8px var(--yellow-warn)" } })
        ),
        h("button", {
          className: `tab-btn ${activeTab === "upgrades" ? 'active' : ''}`,
          onClick: () => setActiveTab("upgrades")
        }, "🛠️ Base Upgrade Centre"),
        h("button", {
          className: `tab-btn ${activeTab === "crew" ? 'active' : ''}`,
          onClick: () => setActiveTab("crew")
        }, "🧑‍🚀 Crew & Subsystems")
      ),

      // Vital Resource Meters Grid (6 metrics)
      h("div", { className: "resources-grid" },
        h(ResourceMeter, { label: "Oxygen", value: resources.oxygen, max: 100, icon: "💨", barColor: "bar-cyan", note: "ECLSS Gas Loop" }),
        h(ResourceMeter, { label: "Water", value: resources.water, max: 100, icon: "💧", barColor: "bar-blue", note: "Catalytic Recycling" }),
        h(ResourceMeter, { label: "Food", value: resources.food, max: 100, icon: "🌱", barColor: "bar-green", note: "Aeroponic Pantry" }),
        h(ResourceMeter, { label: "Energy", value: resources.energy, max: 100, icon: "⚡", barColor: "bar-yellow", note: "Photovoltaic Grid" }),
        h(ResourceMeter, { label: "Radiation Shield", value: resources.radiation, max: 100, icon: "🛡️", barColor: "bar-purple", note: "Regolith & Coils" }),
        h(ResourceMeter, { label: "Astronaut Health", value: resources.health, max: 100, icon: "🩺", barColor: "bar-red", note: "4 Crew Vitality" })
      ),

      // Tab Content Router
      activeTab === "dashboard" && h(DashboardMainView, {
        day,
        resources,
        selectedBase,
        subsystems,
        onToggleSubsystem,
        energyCalculations,
        upgrades,
        alerts,
        scenarioResolvedToday,
        activeScenario,
        onOpenDecision,
        onAdvanceDay,
        scienceScore
      }),

      activeTab === "upgrades" && h(ScreenUpgradesContent, {
        resources,
        upgrades,
        upgradeDefs: window.GAME_DATA.upgrades,
        onBuyUpgrade: props.onBuyUpgrade || (() => {})
      }),

      activeTab === "crew" && h(CrewSubsystemsView, {
        crew: window.GAME_DATA.crew,
        subsystems,
        onToggleSubsystem,
        selectedBase,
        energyCalculations
      })
    );
  }

  // Dashboard Main View (Left Column: SVG & Grid, Right Column: Alerts & Decision)
  function DashboardMainView(props) {
    const {
      day,
      resources,
      selectedBase,
      subsystems,
      onToggleSubsystem,
      energyCalculations,
      upgrades,
      alerts,
      scenarioResolvedToday,
      activeScenario,
      onOpenDecision,
      onAdvanceDay,
      scienceScore
    } = props;

    // SVG string rendered safely
    const svgHtml = useMemo(() => {
      if (typeof window.renderLunarBaseSvg === "function") {
        return window.renderLunarBaseSvg({
          day,
          energy: resources.energy,
          radiation: resources.radiation,
          health: resources.health,
          subsystems,
          upgrades,
          baseId: selectedBase.id
        });
      }
      return "";
    }, [day, resources, subsystems, upgrades, selectedBase]);

    return h("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
      // Day Advancement Bar HUD
      h("div", { className: "day-advance-hud" },
        h("div", { className: "day-timeline" },
          h("div", { className: "day-indicator-text" }, `MISSION DAY ${day} OF 10: ${day <= 3 ? 'LUNAR DAWN' : (day <= 7 ? 'LUNAR MIDDAY' : 'LUNAR DUSK')}`),
          h("div", { className: "day-dots" },
            Array.from({ length: 10 }).map((_, idx) => {
              const dNum = idx + 1;
              let cls = "day-dot";
              if (dNum < day) cls += " past";
              if (dNum === day) cls += " current";
              return h("div", { key: dNum, className: cls, title: `Day ${dNum}` });
            })
          )
        ),

        h("div", { style: { display: "flex", gap: 12, alignItems: "center" } },
          h("div", { className: "chip chip-purple" }, `🔬 Science Score: ${scienceScore} pts`),
          h("button", {
            className: `btn ${scenarioResolvedToday ? 'btn-cyan' : 'btn-outline-cyan'} btn-lg`,
            onClick: onAdvanceDay,
            title: scenarioResolvedToday ? "Simulate daily consumption and proceed" : "You can advance now or resolve today's dilemma first"
          }, day >= 10 ? "🏁 COMPLETE MISSION" : "⏭️ NEXT MISSION DAY")
        )
      ),

      // Multi-Column HUD Grid
      h("div", { className: "dashboard-grid" },
        // Left Column: Visual Base Illustration & Subsystems Grid
        h("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
          h("div", { className: "hud-card", style: { padding: 0 } },
            h("div", { 
              className: "base-illustration-wrap",
              dangerouslySetInnerHTML: { __html: svgHtml }
            }),
            h("div", { className: "base-overlay-stats" },
              h("span", null, `📍 ${selectedBase.name}`),
              h("span", null, `⚡ Solar Array Yield: ${energyCalculations.efficiency}%`),
              h("span", null, `🛡️ Base Hull: ${resources.radiation >= 50 ? 'Pressurized Nominal' : 'Vulnerable'}`)
            )
          ),

          // Subsystems Energy Management Card
          h("div", { className: "hud-card" },
            h("div", { className: "hud-card-header" },
              h("span", { className: "card-title" }, "⚡ Base Energy Management & Subsystems Grid"),
              h("div", { style: { fontSize: "0.78rem", fontFamily: "var(--font-mono)" } },
                `Net Power: `,
                h("span", { 
                  style: { 
                    color: energyCalculations.net >= 0 ? "var(--green-safe)" : "var(--red-alert)", 
                    fontWeight: 700 
                  } 
                }, `${energyCalculations.net >= 0 ? '+' : ''}${energyCalculations.net} units/day`)
              )
            ),
            h("div", { className: "subsystems-list" },
              h(SubsystemToggleItem, {
                title: "ECLSS Oxygen Electrolysis & Sabatier Reactor",
                drainText: "-14 Energy / day | Produces cabin breathable gas",
                active: subsystems.oxygenGen,
                onToggle: () => onToggleSubsystem("oxygenGen"),
                critical: true
              }),
              h(SubsystemToggleItem, {
                title: "Catalytic Wastewater Recovery Distillation",
                drainText: "-10 Energy / day | Closes the water loop to 95%",
                active: subsystems.waterRecycler,
                onToggle: () => onToggleSubsystem("waterRecycler"),
                critical: true
              }),
              h(SubsystemToggleItem, {
                title: "Vertical Hydroponics & Aeroponic Grow Lamps",
                drainText: "-12 Energy / day | Yields fresh crops & fresh vitamins",
                active: subsystems.hydroponics,
                onToggle: () => onToggleSubsystem("hydroponics")
              }),
              h(SubsystemToggleItem, {
                title: "Thermal Radiator Heat Pumps & Loop Cooling",
                drainText: "-8 Energy / day | Prevents habitat thermal swings",
                active: subsystems.thermalRadiators,
                onToggle: () => onToggleSubsystem("thermalRadiators")
              }),
              h(SubsystemToggleItem, {
                title: "High-Frequency Science Radar & Telemetry Dish",
                drainText: "-6 Energy / day | Unlocks +3 Science Points daily",
                active: subsystems.scienceRadar,
                onToggle: () => onToggleSubsystem("scienceRadar")
              }),
              h(SubsystemToggleItem, {
                title: "Auxiliary Active Radiation Deflector Grid",
                drainText: "-16 Energy / day | Blocks radiation decay completely",
                active: subsystems.auxShield,
                onToggle: () => onToggleSubsystem("auxShield")
              })
            )
          )
        ),

        // Right Column: Today's Dilemma & Emergency Alerts Feed
        h("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
          // Today's Decision Status Card
          h("div", { className: "hud-card" },
            h("div", { className: "hud-card-header" },
              h("span", { className: "card-title" }, `⚠️ Day ${day} Engineering Dilemma`),
              h("span", { className: scenarioResolvedToday ? "chip chip-green" : "chip chip-yellow" },
                scenarioResolvedToday ? "RESOLVED TODAY" : "DECISION PENDING"
              )
            ),
            h("h4", { style: { fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", marginBottom: 8 } }, activeScenario.title),
            h("p", { style: { fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 14 } },
              activeScenario.problem.length > 140 ? activeScenario.problem.slice(0, 140) + "..." : activeScenario.problem
            ),
            h("button", {
              className: `btn ${scenarioResolvedToday ? 'btn-outline-cyan' : 'btn-purple'} btn-block`,
              style: { width: "100%" },
              onClick: onOpenDecision
            }, scenarioResolvedToday ? "Review Dilemma & Science Notes" : "⚙️ Open Decision Centre")
          ),

          // Emergency Alerts Log Card
          h("div", { className: "hud-card" },
            h("div", { className: "hud-card-header" },
              h("span", { className: "card-title" }, "📡 Mission Control Emergency Alerts"),
              h("span", { className: "chip" }, `${alerts.length} LOGGED`)
            ),
            h("div", { className: "alerts-container" },
              alerts.map(a => h("div", { key: a.id, className: `alert-item ${a.type}` },
                h("span", { style: { fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--cyan-subtle)" } }, `[D${a.day}]`),
                h("span", null, a.text)
              ))
            )
          )
        )
      )
    );
  }

  // RESOURCE METER WIDGET
  function ResourceMeter({ label, value, max, icon, barColor, note }) {
    const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
    let statusClass = "meter-nominal";
    let statusLabel = "NOMINAL";
    let statusColor = "var(--green-safe)";

    if (pct < 20) {
      statusClass = "meter-critical";
      statusLabel = "CRITICAL";
      statusColor = "var(--red-alert)";
    } else if (pct < 40) {
      statusClass = "meter-warning";
      statusLabel = "WARNING";
      statusColor = "var(--yellow-warn)";
    }

    return h("div", { className: `resource-meter ${statusClass}`, title: `${label}: ${value}/${max} units (${statusLabel})` },
      h("div", { className: "meter-top" },
        h("div", { className: "meter-icon-name" },
          h("span", null, icon),
          h("span", null, label)
        ),
        h("div", { className: "meter-value", style: { color: statusColor } }, value)
      ),
      h("div", { className: "bar-container" },
        h("div", { className: `bar-fill ${barColor}`, style: { width: `${pct}%` } })
      ),
      h("div", { className: "meter-status-text" },
        h("span", null, note),
        h("span", { style: { color: statusColor, fontWeight: 700 } }, statusLabel)
      )
    );
  }

  // SUBSYSTEM TOGGLE ITEM
  function SubsystemToggleItem({ title, drainText, active, onToggle, critical }) {
    return h("div", { className: "subsystem-item" },
      h("div", { className: "subsystem-info" },
        h("div", { className: "subsystem-name" },
          title,
          critical && h("span", { className: "chip chip-yellow", style: { fontSize: "0.65rem", padding: "1px 6px" } }, "VITAL")
        ),
        h("div", { className: "subsystem-drain" }, drainText)
      ),
      h("label", { className: "switch" },
        h("input", { type: "checkbox", checked: active, onChange: onToggle }),
        h("span", { className: "slider" })
      )
    );
  }

  // SCREEN 4: ENGINEERING DECISION CENTRE
  function ScreenDecision(props) {
    const { day, scenario, scenarioResolvedToday, recentChoiceResult, onMakeChoice, onBackToDashboard, onAdvanceDay } = props;

    return h("div", { className: "decision-scenario-card" },
      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
            h("span", { className: "card-title" }, `⚙️ Engineering Decision Centre`),
            h("span", { className: "chip chip-cyan" }, `DAY ${day} SCENARIO`)
          ),
          h("button", { className: "btn btn-ghost btn-sm", onClick: onBackToDashboard }, "← Return to Dashboard")
        ),

        h("h2", { style: { fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#ffffff", marginBottom: 12 } }, scenario.title),
        h("div", { className: "scenario-story" }, scenario.problem)
      ),

      // Choices or Results
      !scenarioResolvedToday ? h("div", { className: "choices-grid" },
        scenario.choices.map((choice, idx) => {
          const letter = ["A", "B", "C"][idx] || "•";
          return h("div", {
            key: choice.id,
            className: "choice-card",
            onClick: () => onMakeChoice(choice)
          },
            h("div", { className: "choice-header" },
              h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                h("span", { className: "choice-letter" }, letter),
                h("span", { className: "chip" }, "Option")
              ),
              h("h4", { className: "choice-title" }, choice.label)
            ),
            h("div", { className: "choice-impacts" },
              h("div", { className: "impact-cost" }, `⚠️ Impact: ${choice.costText}`),
              h("div", { className: "impact-benefit" }, `✅ Result: ${choice.benefitText}`)
            ),
            h("button", { className: "btn btn-cyan btn-sm", style: { width: "100%", marginTop: 6 } }, `Execute Decision ${letter}`)
          );
        })
      ) : h("div", { className: "decision-result-panel" },
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          h("h3", { style: { fontFamily: "var(--font-display)", color: "var(--cyan-glow)", fontSize: "1.1rem" } },
            `✅ Decision Logged: ${recentChoiceResult ? recentChoiceResult.choice.label : "Resolved"}`
          ),
          h("span", { className: "chip chip-green" }, "SYSTEM UPDATED")
        ),
        h("p", { style: { fontSize: "0.95rem", color: "#f8fafc", lineHeight: 1.6 } },
          recentChoiceResult ? recentChoiceResult.choice.feedback : "The station responded to your commands."
        ),

        // Science Explainer Card
        h("div", { className: "science-explainer-card" },
          h("p", { className: "science-explainer-text" },
            recentChoiceResult ? recentChoiceResult.choice.scienceFact : "Lunar science note recorded."
          )
        ),

        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, flexWrap: "wrap", gap: 10 } },
          h("button", { className: "btn btn-ghost", onClick: onBackToDashboard }, "← View Control Dashboard"),
          h("button", { className: "btn btn-cyan btn-lg", onClick: onAdvanceDay }, day >= 10 ? "🏁 COMPLETE MISSION" : "⏭️ PROCEED TO NEXT DAY")
        )
      )
    );
  }

  // SCREEN 5: BASE UPGRADE CENTRE
  function ScreenUpgrades(props) {
    const { resources, upgrades, upgradeDefs, onBuyUpgrade, onBackToDashboard } = props;

    return h("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "🛠️ Base Engineering & Upgrade Centre"),
          h("button", { className: "btn btn-ghost btn-sm", onClick: onBackToDashboard }, "← Return to Dashboard")
        ),
        h("p", { style: { fontSize: "0.9rem", color: "var(--text-muted)" } },
          "Invest limited base resources to permanently enhance your habitat's survivability, power output, closed-loop water recovery, and radiation shielding."
        )
      ),

      h(ScreenUpgradesContent, { resources, upgrades, upgradeDefs, onBuyUpgrade })
    );
  }

  function ScreenUpgradesContent({ resources, upgrades, upgradeDefs, onBuyUpgrade }) {
    return h("div", { className: "upgrades-grid" },
      upgradeDefs.map(u => {
        const curLevel = upgrades[u.id] || 0;
        const nextLevelDef = u.levels.find(l => l.level === curLevel + 1);
        const isMax = curLevel >= u.levels.length;

        // Check if player can afford next level
        let canAfford = false;
        if (nextLevelDef) {
          const cost = nextLevelDef.cost;
          canAfford = 
            (!cost.energy || resources.energy >= cost.energy) &&
            (!cost.water || resources.water >= cost.water) &&
            (!cost.food || resources.food >= cost.food);
        }

        return h("div", { key: u.id, className: "upgrade-card" },
          h("div", { className: "upgrade-card-top" },
            h("div", { className: "upgrade-icon-box" }, u.icon),
            h("div", { className: "upgrade-details" },
              h("div", { className: "upgrade-category" }, u.category),
              h("h4", null, u.name),
              h("span", { className: curLevel > 0 ? "chip chip-green" : "chip" }, `Level ${curLevel} of ${u.levels.length}`)
            )
          ),

          h("p", { style: { fontSize: "0.82rem", color: "var(--text-muted)", margin: "4px 0" } }, u.description),

          h("div", { className: "upgrade-levels-flow" },
            u.levels.map(lvl => {
              const unlocked = curLevel >= lvl.level;
              return h("div", { key: lvl.level, className: "level-row", style: { opacity: unlocked ? 1 : 0.7 } },
                h("span", { className: "level-name" }, `${unlocked ? '✅' : '🔒'} Lv ${lvl.level}: ${lvl.name}`),
                h("span", { className: "level-cost-badge" },
                  unlocked ? "INSTALLED" : Object.entries(lvl.cost).map(([k, v]) => `${v} ${k}`).join(", ")
                )
              );
            })
          ),

          !isMax && nextLevelDef ? h("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 4 } },
            h("div", { style: { fontSize: "0.76rem", color: "var(--cyan-subtle)" } }, `Next: ${nextLevelDef.effect}`),
            h("button", {
              className: `btn ${canAfford ? 'btn-purple' : 'btn-ghost'} btn-sm`,
              disabled: !canAfford,
              onClick: () => onBuyUpgrade(u.id, nextLevelDef.level)
            }, canAfford ? `Upgrade to Level ${nextLevelDef.level}` : "Insufficient Resources")
          ) : h("div", { className: "chip chip-cyan", style: { alignSelf: "flex-start", marginTop: 6 } }, "MAX LEVEL REACHED")
        );
      })
    );
  }

  // CREW & SUBSYSTEMS DETAILED VIEW
  function CrewSubsystemsView({ crew, subsystems, onToggleSubsystem, selectedBase, energyCalculations }) {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "🧑‍🚀 Expedition 1 Crew Specialists"),
          h("span", { className: "chip chip-green" }, "ALL ACTIVE")
        ),
        h("div", { className: "crew-grid" },
          crew.map(c => h("div", { key: c.id, className: "crew-card" },
            h("div", { className: "crew-avatar" }, c.icon),
            h("div", { className: "crew-name" }, c.name),
            h("div", { className: "crew-role" }, c.role),
            h("p", { style: { fontSize: "0.78rem", color: "var(--text-muted)" } }, c.bio),
            h("div", { className: "crew-trait" }, c.trait)
          ))
        )
      ),

      h("div", { className: "hud-card" },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "📍 Lunar Geological Site Analysis"),
          h("span", { className: "chip chip-purple" }, selectedBase.badge)
        ),
        h("h3", { style: { fontFamily: "var(--font-display)", color: "#ffffff", marginBottom: 6 } }, selectedBase.name),
        h("p", { style: { fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: 12 } }, selectedBase.description),
        h("div", { className: "chip chip-cyan" }, `Active Site Trait: ${selectedBase.bonusText}`)
      )
    );
  }

  // SCREEN 6: MISSION RESULTS & DEBRIEFING
  function ScreenResults(props) {
    const { evaluation, decisionsHistory, resources, scienceScore, selectedBase, onPlayAgain } = props;

    return h("div", { className: "results-container" },
      h("div", { className: "results-banner" },
        h("span", { className: "chip chip-purple" }, evaluation.badge),
        h("h1", { 
          style: { 
            fontFamily: "var(--font-display)", 
            fontSize: "2rem", 
            letterSpacing: "2px", 
            color: evaluation.color 
          } 
        }, evaluation.status),
        h("h3", { style: { fontSize: "1.1rem", color: "#cbd5e1", fontWeight: 500 } }, evaluation.rank),

        // Score circle
        h("div", { className: "results-score-circle", style: { borderColor: evaluation.color } },
          h("span", { className: "score-num" }, evaluation.score),
          h("span", { className: "score-sub" }, "OUT OF 100")
        ),

        // Score Breakdown
        h("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" } },
          h("span", null, `Survival: ${evaluation.survivalPts}/30`),
          h("span", null, `Crew Health: ${evaluation.healthPts}/25`),
          h("span", null, `Resources: ${evaluation.resourcePts}/20`),
          h("span", null, `Science: ${evaluation.sciencePts}/15`),
          h("span", null, `Upgrades: ${evaluation.upgradePts}/10`)
        ),

        h("button", { className: "btn btn-cyan btn-lg", onClick: onPlayAgain, style: { marginTop: 10 } }, "🔄 PLAY AGAIN (NEW MISSION)")
      ),

      // Final Mission Statistics
      h("div", { className: "hud-card", style: { width: "100%", maxWidth: 800 } },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "📊 Final Habitat Telemetry & Remaining Stores")
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, textAlign: "center" } },
          h(ResultMetric, { label: "Days Completed", val: `${evaluation.daysSurvived} / 10`, color: "var(--cyan-glow)" }),
          h(ResultMetric, { label: "Final Health", val: `${resources.health}%`, color: resources.health > 50 ? "var(--green-safe)" : "var(--red-alert)" }),
          h(ResultMetric, { label: "Oxygen Left", val: `${resources.oxygen}u`, color: "var(--cyan-glow)" }),
          h(ResultMetric, { label: "Water Left", val: `${resources.water}u`, color: "var(--cyan-subtle)" }),
          h(ResultMetric, { label: "Food Left", val: `${resources.food}u`, color: "var(--green-safe)" }),
          h(ResultMetric, { label: "Energy Left", val: `${resources.energy}u`, color: "var(--yellow-warn)" }),
          h(ResultMetric, { label: "Radiation Shield", val: `${resources.radiation}u`, color: "var(--purple-neon)" })
        )
      ),

      // Unlocked Scientific Achievements
      h("div", { className: "hud-card", style: { width: "100%", maxWidth: 800 } },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "🏆 Scientific Achievements & Medals"),
          h("span", { className: "chip" }, `${evaluation.unlockedAchievements.length} of ${window.GAME_DATA.achievements.length} UNLOCKED`)
        ),
        h("div", { className: "achievements-grid" },
          window.GAME_DATA.achievements.map(ach => {
            const unlocked = evaluation.unlockedAchievements.some(u => u.id === ach.id);
            return h("div", { key: ach.id, className: `achievement-card ${unlocked ? 'unlocked' : ''}` },
              h("div", { className: "achieve-icon" }, ach.icon),
              h("div", { className: "achieve-text" },
                h("h5", null, ach.name),
                h("p", null, ach.description)
              )
            );
          })
        )
      ),

      // Educational Lessons Learned Section
      h("div", { className: "hud-card", style: { width: "100%", maxWidth: 800 } },
        h("div", { className: "hud-card-header" },
          h("span", { className: "card-title" }, "🧪 Mission Lessons Learned in Lunar Space Science")
        ),
        h("div", { style: { display: "flex", flexDirection: "column", gap: 12, fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.6 } },
          h("p", null, "• ", h("strong", null, "Closed-Loop Life Support:"), " In space, supply chains from Earth are months or years apart. Recycling water vapor from crew breath, urine, and exhaled CO2 through catalytic oxidation is mandatory for long-duration extraterrestrial settlement."),
          h("p", null, "• ", h("strong", null, "The Moon is Not Earth or Mars:"), " Unlike Mars, the Moon has absolutely no atmosphere to slow down micrometeorites or insulate against thermal extremes (+120°C in sunlight to -130°C in shadow). Lunar dust is sharp, un-weathered, and electrostatically charged."),
          h("p", null, "• ", h("strong", null, "In-Situ Resource Utilization (ISRU):"), " Sintering lunar regolith using microwaves creates thick protective radiation shielding without launching concrete from Earth, while polar ice cold traps provide life-sustaining drinking water and liquid hydrogen rocket propellant.")
        )
      )
    );
  }

  function ResultMetric({ label, val, color }) {
    return h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.06)" } },
      h("div", { style: { fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" } }, label),
      h("div", { style: { fontSize: "1.1rem", fontFamily: "var(--font-mono)", fontWeight: 700, color } }, val)
    );
  }

  // MODAL: HOW TO PLAY / TUTORIAL
  function ModalTutorial({ onClose }) {
    const [tab, setTab] = useState(1);

    return h("div", { className: "modal-overlay", onClick: onClose },
      h("div", { className: "modal-content", onClick: (e) => e.stopPropagation() },
        h("div", { className: "modal-header" },
          h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
            h("span", { style: { fontSize: 22 } }, "📖"),
            h("h3", { style: { fontFamily: "var(--font-display)", color: "var(--cyan-glow)" } }, "ASTROBASE: Junior Astronaut Manual")
          ),
          h("button", { className: "modal-close-btn", onClick: onClose }, "×")
        ),

        h("div", { style: { display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 } },
          h("button", { className: `btn btn-sm ${tab === 1 ? 'btn-cyan' : 'btn-ghost'}`, onClick: () => setTab(1) }, "1. Mission Overview"),
          h("button", { className: `btn btn-sm ${tab === 2 ? 'btn-cyan' : 'btn-ghost'}`, onClick: () => setTab(2) }, "2. The 6 Resources"),
          h("button", { className: `btn btn-sm ${tab === 3 ? 'btn-cyan' : 'btn-ghost'}`, onClick: () => setTab(3) }, "3. Energy Management"),
          h("button", { className: `btn btn-sm ${tab === 4 ? 'btn-cyan' : 'btn-ghost'}`, onClick: () => setTab(4) }, "4. Upgrades & Science")
        ),

        h("div", { style: { minHeight: 220, fontSize: "0.92rem", lineHeight: 1.6, color: "#e2e8f0" } },
          tab === 1 && h("div", null,
            h("h4", { style: { color: "var(--cyan-glow)", marginBottom: 8 } }, "Your 10-Day Lunar Command"),
            h("p", { style: { marginBottom: 10 } }, "You command a 4-person scientific outpost on the Moon. Each mission day, your astronauts breathe oxygen, drink water, consume food, and draw electrical power from the solar arrays."),
            h("p", null, "Your goal is to survive all 10 days, protect your crew's health, resolve daily engineering anomalies, and unlock scientific breakthroughs to earn high honors at Earth Mission Control!")
          ),

          tab === 2 && h("div", null,
            h("h4", { style: { color: "var(--cyan-glow)", marginBottom: 8 } }, "Managing the 6 Vital Indicators"),
            h("ul", { style: { paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 } },
              h("li", null, h("strong", { style: { color: "var(--cyan-glow)" } }, "Oxygen:"), " Breathing gas. If it hits 0, severe hypoxia damages astronaut health (-25 health/day)."),
              h("li", null, h("strong", { style: { color: "var(--cyan-subtle)" } }, "Water:"), " Essential for hydration and thermal buffering. Dehydration causes -18 health/day."),
              h("li", null, h("strong", { style: { color: "var(--green-safe)" } }, "Food:"), " Caloric nourishment. Depleted food causes -12 health/day."),
              h("li", null, h("strong", { style: { color: "var(--yellow-warn)" } }, "Energy:"), " Powers life-support pumps and heaters. Blackouts cause habitat freezing (-10 health/day)."),
              h("li", null, h("strong", { style: { color: "var(--purple-neon)" } }, "Radiation Shield:"), " Protects against cosmic rays. Drops below 20 cause acute radiation sickness (-8 health/day)."),
              h("li", null, h("strong", { style: { color: "var(--red-alert)" } }, "Astronaut Health:"), " The vitality of your 4 astronauts. If health hits 0, the mission fails immediately!")
            )
          ),

          tab === 3 && h("div", null,
            h("h4", { style: { color: "var(--cyan-glow)", marginBottom: 8 } }, "Power Grid & Subsystems"),
            h("p", { style: { marginBottom: 10 } }, "On the Dashboard, you have power switches for non-critical base modules. When battery reserves run low, you can power down Science Radars or dim Hydroponic lamps to ensure life-support oxygen pumps keep running."),
            h("p", null, "Watch the Net Energy indicator: positive net power charges batteries; negative net power drains them!")
          ),

          tab === 4 && h("div", null,
            h("h4", { style: { color: "var(--cyan-glow)", marginBottom: 8 } }, "Engineering Decisions & Upgrades"),
            h("p", { style: { marginBottom: 10 } }, "Each day brings a real-world dilemma—like lunar dust adhering to solar panels or a water filter biofilm clog. Weigh the trade-offs: spending power vs risking crew stamina vs conserving supplies."),
            h("p", null, "Invest in the Base Upgrade Centre to install high-efficiency solar trackers, regolith sintering armor, and aeroponic vertical farming!")
          )
        ),

        h("div", { style: { display: "flex", justifyContent: "flex-end" } },
          h("button", { className: "btn btn-cyan btn-sm", onClick: onClose }, "Acknowledge & Close")
        )
      )
    );
  }

  // MODAL: SCIENCE LOG
  function ModalScienceLog({ decisionsHistory, onClose }) {
    return h("div", { className: "modal-overlay", onClick: onClose },
      h("div", { className: "modal-content", onClick: (e) => e.stopPropagation() },
        h("div", { className: "modal-header" },
          h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
            h("span", { style: { fontSize: 22 } }, "🧪"),
            h("h3", { style: { fontFamily: "var(--font-display)", color: "var(--purple-neon)" } }, "Space Science Curriculum Log")
          ),
          h("button", { className: "modal-close-btn", onClick: onClose }, "×")
        ),

        h("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
          decisionsHistory.length === 0 ? h("p", { style: { color: "var(--text-muted)", fontStyle: "italic" } },
            "No engineering decisions logged yet. Resolve mission dilemmas to unlock real space science curriculum notes!"
          ) : decisionsHistory.map((d, i) => h("div", {
            key: i,
            style: { background: "rgba(0,0,0,0.3)", padding: 14, borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--purple-glow)" }
          },
            h("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } },
              h("h5", { style: { color: "#ffffff", fontFamily: "var(--font-display)" } }, `Day ${d.day}: ${d.scenarioTitle}`),
              h("span", { className: "chip chip-cyan" }, d.chosenLabel)
            ),
            h("p", { style: { fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.5 } }, d.scienceFact)
          ))
        ),

        h("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 8 } },
          h("button", { className: "btn btn-ghost btn-sm", onClick: onClose }, "Close Log")
        )
      )
    );
  }

  // MODAL: DAILY REPORT
  function ModalDailyReport({ report, onClose }) {
    return h("div", { className: "modal-overlay", onClick: onClose },
      h("div", { className: "modal-content", onClick: (e) => e.stopPropagation() },
        h("div", { className: "modal-header" },
          h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
            h("span", { style: { fontSize: 22 } }, "📋"),
            h("h3", { style: { fontFamily: "var(--font-display)", color: "var(--cyan-glow)" } },
              `Day ${report.prevDay} Summary → Day ${report.nextDay} Initialized`
            )
          ),
          h("button", { className: "modal-close-btn", onClick: onClose }, "×")
        ),

        h("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, fontSize: "0.88rem", fontFamily: "var(--font-mono)" } },
            h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: "var(--radius-sm)" } }, `💨 Oxygen Consumed: -${report.o2Consumed}u`),
            h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: "var(--radius-sm)" } }, `💧 Water Consumed: -${report.waterConsumed}u`),
            h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: "var(--radius-sm)" } }, `🌱 Net Food Harvest: ${report.foodNet >= 0 ? '+' : ''}${report.foodNet}u`),
            h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: "var(--radius-sm)" } }, `⚡ Net Energy Draw: ${report.energyNet >= 0 ? '+' : ''}${report.energyNet}u`),
            h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: "var(--radius-sm)" } }, `🛡️ Radiation Shield: -${report.radiationDecay}u`),
            h("div", { style: { background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: "var(--radius-sm)", color: report.healthChange >= 0 ? "var(--green-safe)" : "var(--red-alert)" } },
              `🩺 Crew Health Impact: ${report.healthChange >= 0 ? '+' : ''}${report.healthChange}%`
            )
          ),

          report.warnings.length > 0 && h("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 6 } },
            h("h5", { style: { color: "var(--red-alert)", fontFamily: "var(--font-display)", fontSize: "0.82rem" } }, "⚠️ CRITICAL SYSTEM ALERTS:"),
            report.warnings.map((w, idx) => h("div", {
              key: idx,
              style: { background: "rgba(239,68,68,0.15)", borderLeft: "3px solid var(--red-alert)", padding: "6px 10px", fontSize: "0.82rem", color: "#fca5a5" }
            }, w))
          )
        ),

        h("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 8 } },
          h("button", { className: "btn btn-cyan btn-sm", onClick: onClose }, "Acknowledge & Proceed")
        )
      )
    );
  }

  // Mount Application to DOM
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = window.ReactDOM.createRoot(rootElement);
    root.render(h(App));
  }
})();
