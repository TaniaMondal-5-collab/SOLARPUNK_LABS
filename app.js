// ASTROBASE: Junior Astronaut Mission Trainer
// Professional PC-Quality 3D Space Simulator & Campaign Manager

(function () {
  const { createElement: h, useState, useEffect, useMemo, useRef } = window.React;

  const sound = window.astroAudio;

  function App() {
    // Top-level Application State
    const [screen, setScreen] = useState('menu'); // 'menu' | 'gameplay' | 'paused'
    const [modal, setModal] = useState(null); // null | 'setup' | 'mission_select' | 'settings' | 'science_log' | 'station' | 'results'

    // Mission Campaign State
    const [day, setDay] = useState(1);
    const [selectedBase, setSelectedBase] = useState(window.GAME_DATA.bases[0]);
    const [resources, setResources] = useState({
      oxygen: 100,
      water: 100,
      food: 100,
      energy: 100,
      radiation: 80,
      health: 100
    });
    const [scienceScore, setScienceScore] = useState(0);
    const [upgrades, setUpgrades] = useState({});
    const [decisionsHistory, setDecisionsHistory] = useState([]);
    const [dayObjectiveCompleted, setDayObjectiveCompleted] = useState(false);

    // Contextual interaction
    const [activeStation, setActiveStation] = useState(null);
    const [radioMessage, setRadioMessage] = useState({
      sender: "HOUSTON FLIGHT DYNAMICS",
      text: "Astrobase telemetry online. All 4 crew members accounted for on lunar surface."
    });

    // Settings
    const [settings, setSettings] = useState({
      masterVolume: 80,
      sfxVolume: 80,
      ambientVolume: 40,
      mouseSensitivity: 1.0,
      cameraMode: 'third_person',
      graphicsQuality: 'high'
    });

    // Save Game state
    const [hasSaveGame, setHasSaveGame] = useState(false);

    // 3D Engine Reference
    const astro3dRef = useRef(null);

    // Initialize 3D Engine on mount
    useEffect(() => {
      // Check for existing save
      const saved = localStorage.getItem('astrobase_save_v2');
      if (saved) {
        setHasSaveGame(true);
      }

      if (!astro3dRef.current && window.Astrobase3D) {
        const engine = new window.Astrobase3D(
          'canvas-3d',
          (station) => {
            // Callback when pressing E near a station
            handleOpenStationInteraction(station);
          },
          (hudData) => {
            setActiveStation(hudData.activeStation);
          }
        );
        astro3dRef.current = engine;
        window.astro3d = engine;
      }

      // Sync settings with audio
      sound.setMasterVolume(settings.masterVolume / 100);
      sound.setSfxVolume(settings.sfxVolume / 100);
      sound.setAmbientVolume(settings.ambientVolume / 100);
    }, []);

    // Synchronize 3D engine mode
    useEffect(() => {
      if (astro3dRef.current) {
        astro3dRef.current.setMode(screen);
        astro3dRef.current.setDay(day);
      }
    }, [screen, day]);

    // Passive EVA life-support consumption during gameplay
    useEffect(() => {
      if (screen !== 'gameplay') return;

      const timer = setInterval(() => {
        setResources(prev => {
          // Slow continuous oxygen and energy drain during EVA
          const next = { ...prev };
          next.oxygen = Math.max(0, +(next.oxygen - 0.15).toFixed(1));
          next.energy = Math.max(0, +(next.energy - 0.10).toFixed(1));

          // Oxygen warning
          if (next.oxygen <= 0) {
            next.health = Math.max(0, next.health - 2);
            triggerRadioMessage("SUIT TELEMETRY", "CRITICAL WARNING: PLSS OXYGEN SUPPLY EXHAUSTED! Return to airlock!");
          } else if (next.oxygen <= 20 && Math.random() < 0.2) {
            triggerRadioMessage("SUIT TELEMETRY", "WARNING: Oxygen reserves below 20%. Conserve respiration.");
            sound.warning();
          }

          if (next.health <= 0) {
            sound.danger();
            setScreen('paused');
            setModal('results');
          }

          return next;
        });
      }, 3000);

      return () => clearInterval(timer);
    }, [screen]);

    const triggerRadioMessage = (sender, text) => {
      sound.quindarTone();
      setRadioMessage({ sender, text });
    };

    // Save Game to LocalStorage
    const handleSaveGame = () => {
      const saveData = {
        day,
        selectedBase,
        resources,
        scienceScore,
        upgrades,
        decisionsHistory,
        timestamp: Date.now()
      };
      localStorage.setItem('astrobase_save_v2', JSON.stringify(saveData));
      setHasSaveGame(true);
      sound.success();
      triggerRadioMessage("SYSTEM NOTIFICATION", `Mission state saved locally for Day ${day}.`);
    };

    // Resume Saved Game
    const handleResumeMission = () => {
      const raw = localStorage.getItem('astrobase_save_v2');
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        setDay(data.day || 1);
        setSelectedBase(data.selectedBase || window.GAME_DATA.bases[0]);
        setResources(data.resources || { oxygen: 100, water: 100, food: 100, energy: 100, radiation: 80, health: 100 });
        setScienceScore(data.scienceScore || 0);
        setUpgrades(data.upgrades || {});
        setDecisionsHistory(data.decisionsHistory || []);
        setDayObjectiveCompleted(false);

        sound.success();
        setScreen('gameplay');
        setModal(null);
        triggerRadioMessage("HOUSTON FLIGHT CONTROL", `Welcome back, Commander. Resuming Day ${data.day} lunar operations.`);
      } catch (e) {
        console.error("Save load error:", e);
      }
    };

    // Launch Brand New Campaign
    const handleLaunchNewGame = (base) => {
      sound.dayAdvance();
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
      setUpgrades({});
      setDecisionsHistory([]);
      setDayObjectiveCompleted(false);

      setScreen('gameplay');
      setModal(null);
      triggerRadioMessage("HOUSTON COMMAND", `Touchdown confirmed at ${base.name}. 10-day lunar expedition begins. Check active objective.`);
    };

    // Handle pressing E at interactive station
    const handleOpenStationInteraction = (station) => {
      sound.interact();
      setModal('station');
      if (document.pointerLockElement) {
        document.exitPointerLock().catch(() => {});
      }
    };

    // Current Scenario
    const currentScenario = useMemo(() => {
      return window.GAME_DATA.scenarios.find(s => s.day === day) || window.GAME_DATA.scenarios[0];
    }, [day]);

    // Handle Player Decision at Station
    const handleExecuteDecision = (choice) => {
      sound.success();
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

      setDecisionsHistory(prev => [
        ...prev,
        {
          day,
          scenarioTitle: currentScenario.title,
          chosenLabel: choice.label,
          feedback: choice.feedback,
          scienceFact: choice.scienceFact
        }
      ]);

      setDayObjectiveCompleted(true);
      setModal(null);
      triggerRadioMessage("HOUSTON FLIGHT CONTROL", choice.feedback);
    };

    // Advance Campaign to Next Day
    const handleAdvanceDay = () => {
      sound.dayAdvance();
      if (day >= 10) {
        sound.gameComplete();
        setScreen('paused');
        setModal('results');
        return;
      }

      const nextDay = day + 1;
      setDay(nextDay);
      setDayObjectiveCompleted(false);

      // Night / Day turn calculations
      setResources(prev => ({
        ...prev,
        water: Math.max(0, prev.water - 8),
        food: Math.max(0, prev.food - 6),
        energy: Math.min(100, prev.energy + 20),
        radiation: Math.max(0, prev.radiation - 3)
      }));

      triggerRadioMessage("HOUSTON COMMAND", `Day ${nextDay} initialized. Sun elevation shifting. Check revised mission objective.`);
    };

    // Fullscreen toggle
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    };

    return h('div', { className: 'interactive-ui' },
      // 1. MAIN MENU SCREEN
      screen === 'menu' && h(MainMenuScreen, {
        hasSaveGame,
        onResume: handleResumeMission,
        onNewGame: () => { sound.click(); setModal('setup'); },
        onMissionSelect: () => { sound.click(); setModal('mission_select'); },
        onSettings: () => { sound.click(); setModal('settings'); },
        onScienceLog: () => { sound.click(); setModal('science_log'); },
        onExit: () => {
          sound.click();
          if (confirm("Reset current mission parameters?")) {
            localStorage.removeItem('astrobase_save_v2');
            setHasSaveGame(false);
          }
        }
      }),

      // 2. IN-GAME HUD
      screen === 'gameplay' && h(GameplayHUD, {
        day,
        resources,
        currentScenario,
        dayObjectiveCompleted,
        activeStation,
        radioMessage,
        onAdvanceDay: handleAdvanceDay,
        onOpenPause: () => { sound.click(); setScreen('paused'); }
      }),

      // 3. PAUSE MENU (ESC)
      screen === 'paused' && !modal && h(PauseMenuModal, {
        onResume: () => { sound.click(); setScreen('gameplay'); },
        onObjectives: () => { sound.click(); setModal('objectives'); },
        onScienceLog: () => { sound.click(); setModal('science_log'); },
        onSettings: () => { sound.click(); setModal('settings'); },
        onSave: handleSaveGame,
        onMainMenu: () => { sound.click(); setScreen('menu'); }
      }),

      // 4. MODALS
      modal === 'setup' && h(MissionSetupModal, {
        bases: window.GAME_DATA.bases,
        crew: window.GAME_DATA.crew,
        onLaunch: handleLaunchNewGame,
        onClose: () => { sound.click(); setModal(null); }
      }),

      modal === 'mission_select' && h(MissionSelectModal, {
        scenarios: window.GAME_DATA.scenarios,
        currentDay: day,
        onSelectDay: (dNum) => {
          sound.click();
          setDay(dNum);
          setDayObjectiveCompleted(false);
          setScreen('gameplay');
          setModal(null);
          triggerRadioMessage("HOUSTON COMMAND", `Simulating Day ${dNum}: ${window.GAME_DATA.scenarios[dNum - 1].title}`);
        },
        onClose: () => { sound.click(); setModal(null); }
      }),

      modal === 'settings' && h(SettingsModal, {
        settings,
        setSettings: (s) => {
          setSettings(s);
          sound.setMasterVolume(s.masterVolume / 100);
          sound.setSfxVolume(s.sfxVolume / 100);
          sound.setAmbientVolume(s.ambientVolume / 100);
          if (astro3dRef.current) {
            astro3dRef.current.mouseSensitivity = s.mouseSensitivity;
          }
        },
        onToggleFullscreen: toggleFullscreen,
        onClose: () => { sound.click(); setModal(null); }
      }),

      modal === 'science_log' && h(ScienceLogModal, {
        decisionsHistory,
        onClose: () => { sound.click(); setModal(null); }
      }),

      modal === 'station' && h(StationInteractionModal, {
        station: activeStation,
        scenario: currentScenario,
        day,
        onExecuteChoice: handleExecuteDecision,
        onClose: () => { sound.click(); setModal(null); }
      }),

      modal === 'results' && h(MissionResultsModal, {
        day,
        resources,
        scienceScore,
        decisionsHistory,
        onPlayAgain: () => {
          sound.click();
          setScreen('menu');
          setModal(null);
        }
      })
    );
  }

  // =========================================================================
  // SCREEN 1: PROFESSIONAL PC GAME MAIN MENU (RIGHT-ALIGNED MENU)
  // =========================================================================
  function MainMenuScreen({ hasSaveGame, onResume, onNewGame, onMissionSelect, onSettings, onScienceLog, onExit }) {
    return h('div', { className: 'menu-screen-overlay' },
      // Left Cinematic Branding & Tagline
      h('div', { className: 'menu-branding-left' },
        h('div', { className: 'menu-badge' }, '🚀 NASA Space Apps Challenge 2026 Special Edition'),
        h('h1', { className: 'menu-game-title' }, 'ASTROBASE'),
        h('div', { className: 'menu-game-subtitle' }, 'Junior Astronaut Mission Trainer'),
        h('p', { className: 'menu-tagline' }, '“Think like an engineer. Decide like a commander. Survive like an astronaut.”'),
        h('div', { className: 'menu-version-tag' }, 'REALISTIC 3D LUNAR SIMULATION ENGINE • BUILD 2026.4 • VERIFIED FLIGHT READY')
      ),

      // Right-Aligned Professional Vertical Action Menu
      h('div', { className: 'menu-actions-right' },
        h('button', {
          className: `menu-btn ${hasSaveGame ? 'primary-btn' : 'disabled'}`,
          onClick: onResume,
          onMouseEnter: () => sound.hover()
        },
          h('span', null, '1. RESUME MISSION'),
          h('span', { className: 'btn-arrow' }, '▶')
        ),

        h('button', {
          className: 'menu-btn primary-btn',
          onClick: onNewGame,
          onMouseEnter: () => sound.hover()
        },
          h('span', null, '2. NEW GAME'),
          h('span', { className: 'btn-arrow' }, '▶')
        ),

        h('button', {
          className: 'menu-btn',
          onClick: onMissionSelect,
          onMouseEnter: () => sound.hover()
        },
          h('span', null, '3. MISSION SELECT'),
          h('span', { className: 'btn-arrow' }, '▶')
        ),

        h('button', {
          className: 'menu-btn',
          onClick: onSettings,
          onMouseEnter: () => sound.hover()
        },
          h('span', null, '4. SETTINGS'),
          h('span', { className: 'btn-arrow' }, '▶')
        ),

        h('button', {
          className: 'menu-btn',
          onClick: onScienceLog,
          onMouseEnter: () => sound.hover()
        },
          h('span', null, '5. SCIENCE LOG'),
          h('span', { className: 'btn-arrow' }, '▶')
        ),

        h('button', {
          className: 'menu-btn',
          onClick: onExit,
          onMouseEnter: () => sound.hover()
        },
          h('span', null, '6. RESET / EXIT'),
          h('span', { className: 'btn-arrow' }, '▶')
        )
      )
    );
  }

  // =========================================================================
  // SCREEN 2: TACTICAL IN-GAME HUD
  // =========================================================================
  function GameplayHUD({ day, resources, currentScenario, dayObjectiveCompleted, activeStation, radioMessage, onAdvanceDay, onOpenPause }) {
    return h('div', { className: 'gameplay-hud-root' },
      // Top Bar
      h('div', { className: 'hud-top-bar' },
        // Top-Left: Minimalist Vital Meters
        h('div', { className: 'hud-vitals-panel' },
          h(VitalGauge, { name: 'O2 OXYGEN', val: resources.oxygen, fillClass: 'fill-cyan', unit: 'u' }),
          h(VitalGauge, { name: 'H2O WATER', val: resources.water, fillClass: 'fill-blue', unit: 'u' }),
          h(VitalGauge, { name: 'BIOMASS FOOD', val: resources.food, fillClass: 'fill-green', unit: 'u' }),
          h(VitalGauge, { name: 'POWER ENERGY', val: resources.energy, fillClass: 'fill-yellow', unit: 'u' }),
          h(VitalGauge, { name: 'RADIATION SHIELD', val: resources.radiation, fillClass: 'fill-purple', unit: 'u' }),
          h(VitalGauge, { name: 'CREW HEALTH', val: resources.health, fillClass: 'fill-red', unit: '%' })
        ),

        // Top-Center: Mission Day & Telemetry
        h('div', { className: 'hud-telemetry-center' },
          h('div', { className: 'hud-day-pill' }, `MISSION DAY ${day} OF 10: ${day <= 3 ? 'LUNAR DAWN' : (day <= 7 ? 'SOLAR ZENITH' : 'LUNAR DUSK')}`),
          h('div', { className: 'hud-env-stats' },
            h('span', null, 'SURFACE: -45°C'),
            h('span', null, 'GRAVITY: 1/6G (1.62 m/s²)'),
            h('span', null, 'VACUUM: NOMINAL')
          )
        ),

        // Top-Right: Active Objective Panel
        h('div', { className: 'hud-objective-panel' },
          h('div', { className: 'hud-obj-header' }, `DAY ${day} DIRECTIVE`),
          h('div', { className: 'hud-obj-title' }, currentScenario.title),
          h('div', { className: 'hud-obj-task' },
            h('span', null, dayObjectiveCompleted ? '✅' : '⏳'),
            h('span', null, dayObjectiveCompleted ? 'Operational Crisis Resolved!' : 'Walk to Base Stations and press [E] to investigate.')
          ),
          dayObjectiveCompleted && h('button', {
            className: 'pause-btn primary',
            style: { width: '100%', marginTop: 8, padding: '8px 12px', fontSize: '0.8rem' },
            onClick: onAdvanceDay
          }, day >= 10 ? '🏁 COMPLETE 10-DAY MISSION' : '⏭️ ADVANCE TO NEXT MISSION DAY')
        )
      ),

      // Center Reticle & Contextual Interaction Prompt
      h('div', { className: 'hud-center-reticle' },
        h('div', { className: 'reticle-dot' }),
        activeStation && h('div', { className: 'interaction-prompt-box' },
          h('span', { className: 'key-badge' }, 'E'),
          h('span', { className: 'prompt-text' }, activeStation.prompt || `INTERACT: ${activeStation.name}`)
        )
      ),

      // Bottom Bar
      h('div', { className: 'hud-bottom-bar' },
        h('div', { className: 'hud-controls-helper' },
          '[W,A,S,D] WALK | [SHIFT] SPRINT | [SPACE] LOW-G JUMP | [E] INTERACT | [V] VIEW | [ESC] PAUSE'
        ),

        radioMessage && h('div', { className: 'hud-radio-transmission' },
          h('div', { className: 'radio-sender' }, `📡 COMM LINK: ${radioMessage.sender}`),
          h('div', { className: 'radio-text' }, radioMessage.text)
        )
      )
    );
  }

  function VitalGauge({ name, val, fillClass, unit }) {
    const pct = Math.max(0, Math.min(100, Math.round(val)));
    return h('div', { className: 'vital-gauge' },
      h('div', { className: 'vital-info-row' },
        h('span', { className: 'vital-name' }, name),
        h('span', { className: 'vital-value' }, `${val}${unit}`)
      ),
      h('div', { className: 'vital-bar-track' },
        h('div', { className: `vital-bar-fill ${fillClass}`, style: { width: `${pct}%` } })
      )
    );
  }

  // =========================================================================
  // SCREEN 3: PAUSE MENU (ESC)
  // =========================================================================
  function PauseMenuModal({ onResume, onObjectives, onScienceLog, onSettings, onSave, onMainMenu }) {
    return h('div', { className: 'modal-backdrop' },
      h('div', { className: 'pause-panel' },
        h('h2', { className: 'pause-title' }, 'MISSION PAUSED'),

        h('button', { className: 'pause-btn primary', onClick: onResume }, 'Resume Mission'),
        h('button', { className: 'pause-btn', onClick: onSave }, '💾 Save Game State'),
        h('button', { className: 'pause-btn', onClick: onScienceLog }, '🧪 Science Curriculum Log'),
        h('button', { className: 'pause-btn', onClick: onSettings }, '⚙️ Game Settings'),
        h('button', { className: 'pause-btn', onClick: onMainMenu }, 'Exit to Main Menu')
      )
    );
  }

  // =========================================================================
  // STATION INTERACTION MODAL (Triggered by pressing E in 3D)
  // =========================================================================
  function StationInteractionModal({ station, scenario, day, onExecuteChoice, onClose }) {
    return h('div', { className: 'modal-backdrop', onClick: onClose },
      h('div', { className: 'station-dialog-card', onClick: (e) => e.stopPropagation() },
        h('div', { className: 'station-header' },
          h('div', null,
            h('div', { className: 'station-category' }, `${station ? station.category : 'Operations'} • Day ${day}`),
            h('h2', { className: 'station-title' }, station ? station.name : scenario.title)
          ),
          h('button', { className: 'pause-btn', style: { padding: '6px 14px' }, onClick: onClose }, '✕ ESC')
        ),

        h('div', { className: 'station-problem-box' }, scenario.problem),

        h('div', { style: { fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--cyan-primary)', letterSpacing: '1px' } },
          'COMMAND DIRECTIVE: CHOOSE AN ACTION (BALANCED TRADE-OFFS)'
        ),

        h('div', { className: 'station-choices-grid' },
          scenario.choices.map((choice, idx) => h('div', {
            key: choice.id,
            className: 'station-choice-card',
            onClick: () => onExecuteChoice(choice)
          },
            h('div', { className: 'choice-top-line' },
              h('span', { className: 'choice-label' }, `${['A', 'B', 'C'][idx]}. ${choice.label}`),
              h('span', { className: 'choice-cost-badge' }, choice.costText)
            ),
            h('div', { className: 'choice-benefit-badge' }, `Outcome: ${choice.benefitText}`)
          ))
        ),

        // Science Note
        h('div', { className: 'science-curriculum-box' },
          h('div', { className: 'science-curriculum-header' }, '🧪 NASA Space Apps Educational Concept'),
          h('p', null, scenario.choices[0].scienceFact)
        )
      )
    );
  }

  // =========================================================================
  // MISSION SETUP & DEPLOYMENT BRIEFING
  // =========================================================================
  function MissionSetupModal({ bases, crew, onLaunch, onClose }) {
    const [selBase, setSelBase] = useState(bases[0]);

    return h('div', { className: 'modal-backdrop', onClick: onClose },
      h('div', { className: 'station-dialog-card', style: { width: 840 }, onClick: (e) => e.stopPropagation() },
        h('div', { className: 'station-header' },
          h('h2', { className: 'station-title' }, 'MISSION DEPLOYMENT: 10-DAY EXPEDITION'),
          h('button', { className: 'pause-btn', style: { padding: '6px 14px' }, onClick: onClose }, '✕')
        ),

        h('p', { style: { color: 'var(--text-muted)', fontSize: '0.9rem' } },
          'Select your target lunar research site. Each location features distinct environmental advantages, mineral densities, and life-support logistics.'
        ),

        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 } },
          bases.map(b => {
            const isSel = selBase.id === b.id;
            return h('div', {
              key: b.id,
              className: 'station-choice-card',
              style: { borderColor: isSel ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.1)', background: isSel ? 'rgba(0,240,255,0.1)' : 'transparent' },
              onClick: () => setSelBase(b)
            },
              h('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, color: isSel ? 'var(--cyan-primary)' : '#fff' } }, b.name),
              h('div', { style: { fontSize: '0.75rem', color: 'var(--gold-accent)' } }, b.bonusText),
              h('p', { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }, b.description)
            );
          })
        ),

        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 } },
          h('button', { className: 'pause-btn', onClick: onClose }, 'Cancel'),
          h('button', { className: 'pause-btn primary', onClick: () => onLaunch(selBase) }, '🚀 DEPLOY ASTRONAUT CREW TO 3D BASE')
        )
      )
    );
  }

  // =========================================================================
  // MISSION SELECT MODAL (Day 1 to 10 Scenarios)
  // =========================================================================
  function MissionSelectModal({ scenarios, currentDay, onSelectDay, onClose }) {
    return h('div', { className: 'modal-backdrop', onClick: onClose },
      h('div', { className: 'station-dialog-card', style: { width: 780 }, onClick: (e) => e.stopPropagation() },
        h('div', { className: 'station-header' },
          h('h2', { className: 'station-title' }, 'CAMPAIGN MISSION SELECT (DAYS 1–10)'),
          h('button', { className: 'pause-btn', style: { padding: '6px 14px' }, onClick: onClose }, '✕')
        ),

        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          scenarios.map(sc => h('div', {
            key: sc.day,
            className: 'station-choice-card',
            onClick: () => onSelectDay(sc.day)
          },
            h('div', { className: 'choice-top-line' },
              h('span', { className: 'choice-label' }, `DAY ${sc.day}: ${sc.title}`),
              h('span', { className: 'choice-benefit-badge' }, sc.day === currentDay ? 'CURRENT DAY' : 'SIMULATE')
            ),
            h('div', { style: { fontSize: '0.82rem', color: 'var(--text-muted)' } },
              sc.problem.slice(0, 110) + '...'
            )
          ))
        )
      )
    );
  }

  // =========================================================================
  // SETTINGS MODAL (Audio Volume, Sensitivity, Graphics)
  // =========================================================================
  function SettingsModal({ settings, setSettings, onToggleFullscreen, onClose }) {
    return h('div', { className: 'modal-backdrop', onClick: onClose },
      h('div', { className: 'station-dialog-card', style: { width: 500 }, onClick: (e) => e.stopPropagation() },
        h('div', { className: 'station-header' },
          h('h2', { className: 'station-title' }, 'SIMULATOR SETTINGS'),
          h('button', { className: 'pause-btn', style: { padding: '6px 14px' }, onClick: onClose }, '✕')
        ),

        h('div', { className: 'settings-group' },
          h('div', { className: 'setting-row' },
            h('span', null, `Master Volume (${settings.masterVolume}%)`),
            h('input', {
              type: 'range', min: 0, max: 100,
              value: settings.masterVolume,
              className: 'setting-slider',
              onChange: (e) => setSettings({ ...settings, masterVolume: +e.target.value })
            })
          ),

          h('div', { className: 'setting-row' },
            h('span', null, `Sound FX Volume (${settings.sfxVolume}%)`),
            h('input', {
              type: 'range', min: 0, max: 100,
              value: settings.sfxVolume,
              className: 'setting-slider',
              onChange: (e) => setSettings({ ...settings, sfxVolume: +e.target.value })
            })
          ),

          h('div', { className: 'setting-row' },
            h('span', null, `Ambient Space Drone (${settings.ambientVolume}%)`),
            h('input', {
              type: 'range', min: 0, max: 100,
              value: settings.ambientVolume,
              className: 'setting-slider',
              onChange: (e) => setSettings({ ...settings, ambientVolume: +e.target.value })
            })
          ),

          h('div', { className: 'setting-row' },
            h('span', null, `Mouse Sensitivity (${settings.mouseSensitivity.toFixed(1)}x)`),
            h('input', {
              type: 'range', min: 5, max: 30,
              value: Math.round(settings.mouseSensitivity * 10),
              className: 'setting-slider',
              onChange: (e) => setSettings({ ...settings, mouseSensitivity: e.target.value / 10 })
            })
          ),

          h('div', { className: 'setting-row' },
            h('span', null, 'Display Mode'),
            h('button', { className: 'pause-btn', style: { padding: '6px 14px' }, onClick: onToggleFullscreen }, 'Toggle Fullscreen')
          )
        ),

        h('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 14 } },
          h('button', { className: 'pause-btn primary', onClick: onClose }, 'Save & Close')
        )
      )
    );
  }

  // =========================================================================
  // SCIENCE CURRICULUM LOG (NASA Educational Concepts)
  // =========================================================================
  function ScienceLogModal({ decisionsHistory, onClose }) {
    return h('div', { className: 'modal-backdrop', onClick: onClose },
      h('div', { className: 'station-dialog-card', style: { width: 780 }, onClick: (e) => e.stopPropagation() },
        h('div', { className: 'station-header' },
          h('h2', { className: 'station-title' }, '🧪 NASA SPACE SCIENCE LOG'),
          h('button', { className: 'pause-btn', style: { padding: '6px 14px' }, onClick: onClose }, '✕')
        ),

        h('p', { style: { color: 'var(--text-muted)', fontSize: '0.9rem' } },
          'Educational records grounded in lunar mission architecture, environmental control and life support systems (ECLSS), and space radiation physics.'
        ),

        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '60vh', overflowY: 'auto' } },
          decisionsHistory.length === 0 ? h('div', { className: 'station-problem-box' },
            'No operational dilemmas resolved yet. Walk to base structures in 3D, press [E] to investigate anomalies, and record genuine space science takeaways.'
          ) : decisionsHistory.map((d, i) => h('div', { key: i, className: 'science-curriculum-box' },
            h('div', { className: 'science-curriculum-header' }, `Day ${d.day}: ${d.scenarioTitle} • Action: ${d.chosenLabel}`),
            h('p', null, d.scienceFact)
          ))
        )
      )
    );
  }

  // =========================================================================
  // MISSION RESULTS & DEBRIEFING (10-Day Complete or Abort)
  // =========================================================================
  function MissionResultsModal({ day, resources, scienceScore, decisionsHistory, onPlayAgain }) {
    const isAlive = resources.health > 0;
    const score = Math.min(100, Math.round(day * 4 + (resources.health * 0.25) + (resources.oxygen * 0.1) + (scienceScore * 0.5)));

    return h('div', { className: 'modal-backdrop' },
      h('div', { className: 'station-dialog-card', style: { width: 720, textAlign: 'center' } },
        h('div', { style: { fontSize: '2.5rem', marginBottom: 8 } }, isAlive ? '🏆' : '⚠️'),
        h('h2', { className: 'station-title', style: { color: isAlive ? 'var(--cyan-primary)' : 'var(--red-alert)' } },
          isAlive ? '10-DAY LUNAR MISSION COMPLETED' : 'CRITICAL LIFE SUPPORT FAILURE'
        ),
        h('p', { style: { color: '#cbd5e1', fontSize: '1.1rem', margin: '8px 0 18px' } },
          isAlive ? 'Commander, your crew survived the expedition and qualified Astrobase for permanent settlement!' : 'Crew health reached zero due to critical life support depletions.'
        ),

        h('div', { style: { display: 'flex', justifyContent: 'center', gap: 20, margin: '14px 0' } },
          h('div', { className: 'station-problem-box', style: { width: 140 } },
            h('div', { style: { fontSize: '0.75rem', color: 'var(--text-dim)' } }, 'FINAL SCORE'),
            h('div', { style: { fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--cyan-primary)' } }, `${score}/100`)
          ),
          h('div', { className: 'station-problem-box', style: { width: 140 } },
            h('div', { style: { fontSize: '0.75rem', color: 'var(--text-dim)' } }, 'DAYS SURVIVED'),
            h('div', { style: { fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--gold-accent)' } }, `${day}/10`)
          ),
          h('div', { className: 'station-problem-box', style: { width: 140 } },
            h('div', { style: { fontSize: '0.75rem', color: 'var(--text-dim)' } }, 'CREW HEALTH'),
            h('div', { style: { fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--green-safe)' } }, `${Math.round(resources.health)}%`)
          )
        ),

        h('button', { className: 'pause-btn primary', style: { margin: '16px auto 0', width: 240 }, onClick: onPlayAgain },
          'Return to Main Menu'
        )
      )
    );
  }

  // Mount to DOM
  const rootEl = document.getElementById('ui-root');
  if (rootEl) {
    const root = window.ReactDOM.createRoot(rootEl);
    root.render(h(App));
  }
})();
