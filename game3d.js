// ASTROBASE: Junior Astronaut Mission Trainer
// Core 3D Simulation Engine using Three.js
// Features: Cinematic Main Menu, Full 3D Lunar Environment, Playable Astronaut,
// 1/6th Lunar Gravity Physics, Interactive Base Stations, Day/Night Lighting

class Astrobase3D {
  constructor(canvasContainerId, onInteractionTrigger, onHudUpdate) {
    this.container = document.getElementById(canvasContainerId);
    this.onInteractionTrigger = onInteractionTrigger || (() => {});
    this.onHudUpdate = onHudUpdate || (() => {});

    // State
    this.mode = 'menu'; // 'menu' | 'gameplay' | 'paused'
    this.cameraMode = 'third_person'; // 'third_person' | 'first_person'
    this.day = 1;
    this.sunAngle = 0.3; // radians
    this.mouseSensitivity = 1.0;
    this.graphicsQuality = 'high'; // 'low' | 'medium' | 'high'
    
    // Physics & Controls
    this.keys = {
      w: false, a: false, s: false, d: false,
      space: false, shift: false, e: false
    };
    this.mouse = { x: 0, y: 0, dx: 0, dy: 0, isLocked: false };
    this.pitch = 0.2;
    this.yaw = 0;
    this.camDistance = 6.0;

    // Astronaut Physics
    this.player = {
      pos: new THREE.Vector3(0, 0, 15),
      vel: new THREE.Vector3(0, 0, 0),
      rotY: 0,
      isGrounded: true,
      walkSpeed: 7.0,
      sprintSpeed: 12.0,
      jumpVelocity: 7.5, // 1/6th gravity makes this float high!
      gravity: -9.8 / 6.0, // Authentic 1/6th lunar gravity: ~1.63 m/s^2
      mesh: null,
      limbs: {}
    };

    // Interactive Stations
    this.stations = [];
    this.activeStation = null;

    // Environmental entities
    this.dustParticles = null;
    this.earthMesh = null;
    this.solarPanels = [];
    this.commsDish = null;
    this.greenhouseLight = null;
    this.roverMesh = null;

    // Clock
    this.clock = new THREE.Clock();
    this.menuAngle = 0;

    // Initialize Three.js scene
    this.initScene();
    this.initControls();
    this.animate();
  }

  initScene() {
    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    // In space there is no atmospheric fog, but subtle black depth cut looks gorgeous
    this.scene.fog = new THREE.FogExp2(0x02040a, 0.0035);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 15, 45);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    
    // Clear existing children in container
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting (Harsh direct sunlight + subtle earthshine in shadows)
    this.ambientLight = new THREE.AmbientLight(0x182438, 0.55); // deep space earthshine
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    this.sunLight.position.set(120, 140, 80);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 400;
    this.sunLight.shadow.camera.left = -90;
    this.sunLight.shadow.camera.right = 90;
    this.sunLight.shadow.camera.top = 90;
    this.sunLight.shadow.camera.bottom = -90;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Secondary soft blue fill light from Earth
    this.earthFillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    this.earthFillLight.position.set(-150, 200, -200);
    this.scene.add(this.earthFillLight);

    // 5. Environment
    this.createStarfield();
    this.createEarth();
    this.createLunarTerrain();
    this.createDustParticles();

    // 6. Base Structures
    this.createLunarBase();

    // 7. Astronaut Character
    this.createAstronaut();

    // Resize listener
    window.addEventListener('resize', () => this.onWindowResize());
  }

  // DEEP SPACE STARFIELD (Thousands of stars in true vacuum)
  createStarfield() {
    const starCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Distribute on large hemisphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 900 + Math.random() * 200;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = Math.abs(r * Math.cos(phi)) + 10; // keep above horizon
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation: white, cyan, subtle purple, amber
      const type = Math.random();
      if (type > 0.8) {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1.0; // Cyan
      } else if (type > 0.65) {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1.0; // Purple
      } else if (type > 0.5) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.6; // Gold
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0; // White
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });

    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }

  // PHOTOREALISTIC EARTH IN LUNAR SKY
  createEarth() {
    const earthGroup = new THREE.Group();
    earthGroup.position.set(220, 260, -320);

    // Procedural Earth surface canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep ocean blue
    ctx.fillStyle = '#0a235c';
    ctx.fillRect(0, 0, 1024, 512);

    // Continents (Africa, Eurasia, Americas, Australia)
    ctx.fillStyle = '#1e6f42';
    // Africa / Europe
    ctx.beginPath();
    ctx.ellipse(540, 230, 90, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    // Asia
    ctx.beginPath();
    ctx.ellipse(720, 180, 150, 100, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // North America
    ctx.beginPath();
    ctx.ellipse(280, 170, 110, 80, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // South America
    ctx.beginPath();
    ctx.ellipse(360, 340, 75, 110, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Swirling white clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      const cx = (i * 37) % 1024;
      const cy = 60 + (i * 29) % 380;
      ctx.ellipse(cx, cy, 50 + (i % 25), 18 + (i % 12), (i % 5) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const earthTex = new THREE.CanvasTexture(canvas);

    // Earth Sphere
    const earthGeo = new THREE.SphereGeometry(38, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.65,
      metalness: 0.1
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(this.earthMesh);

    // Atmospheric Glow Halo
    const glowGeo = new THREE.SphereGeometry(40.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    earthGroup.add(glowMesh);

    this.scene.add(earthGroup);
  }

  // PROCEDURAL LUNAR TERRAIN & REGOLITH SURFACE
  createLunarTerrain() {
    const size = 600;
    const segments = 120;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    
    // Craters configuration {x, z, radius, depth}
    const craters = [
      { x: -60, z: -40, r: 35, d: 9 },
      { x: 90, z: -80, r: 45, d: 12 },
      { x: -110, z: 90, r: 50, d: 14 },
      { x: 130, z: 70, r: 38, d: 10 },
      { x: 15, z: 120, r: 30, d: 8 },
      { x: -20, z: -110, r: 40, d: 11 }
    ];

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      // Low rolling hills
      let vy = Math.sin(vx * 0.012) * Math.cos(vz * 0.012) * 5.0
             + Math.sin(vx * 0.028 + vz * 0.018) * 2.2;

      // Distant crater rim mountains
      const distFromCenter = Math.sqrt(vx * vx + vz * vz);
      if (distFromCenter > 180) {
        const rimFactor = (distFromCenter - 180) / 120;
        vy += Math.pow(rimFactor, 1.8) * 35.0;
      }

      // Smooth crater depressions with elevated rim walls
      craters.forEach(c => {
        const d = Math.sqrt((vx - c.x) * (vx - c.x) + (vz - c.z) * (vz - c.z));
        if (d < c.r * 1.5) {
          const normD = d / c.r;
          if (normD < 1.0) {
            // Inside crater bowl
            const bowl = Math.cos(normD * Math.PI * 0.5);
            vy -= bowl * c.d;
          } else {
            // Crater raised rim
            const rim = Math.sin((normD - 1.0) * Math.PI * 2.0);
            vy += Math.max(0, rim * (c.d * 0.28));
          }
        }
      });

      // Keep base center mostly flat for structures
      if (distFromCenter < 55) {
        vy *= (distFromCenter / 55);
      }

      pos.setY(i, vy);
    }

    geometry.computeVertexNormals();

    // Procedural Regolith Texture (Abrasive lunar basalt & dust)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#475161'; // Medium lunar gray
    ctx.fillRect(0, 0, 512, 512);

    // Micro-speckling for sharp mineral dust
    for (let i = 0; i < 15000; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      const shade = Math.floor(45 + Math.random() * 70);
      ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 6})`;
      ctx.fillRect(px, py, 1.5, 1.5);
    }

    // Micro-craters
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const cr = 2 + Math.random() * 6;
      ctx.fillStyle = 'rgba(20, 24, 32, 0.6)';
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    const groundTex = new THREE.CanvasTexture(canvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(16, 16);

    const material = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.92,
      metalness: 0.08
    });

    const ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Scatter 3D lunar rocks & boulders around
    this.createRockScatter();
  }

  createRockScatter() {
    const rockGeo = new THREE.DodecahedronGeometry(1, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x5a6578,
      roughness: 0.88
    });

    for (let i = 0; i < 75; i++) {
      const scale = 0.4 + Math.random() * 1.8;
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.scale.set(scale, scale * (0.6 + Math.random() * 0.6), scale);
      
      const angle = Math.random() * Math.PI * 2;
      const dist = 25 + Math.random() * 150;
      rock.position.set(
        Math.cos(angle) * dist,
        scale * 0.4,
        Math.sin(angle) * dist
      );
      rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.scene.add(rock);
    }
  }

  // SUSPENDED LUNAR DUST PARTICLES (Levitated by solar UV electrostatics)
  createDustParticles() {
    const pCount = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = 0.5 + Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd4d8e0,
      size: 0.22,
      transparent: true,
      opacity: 0.45
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dustParticles);
  }

  // FUTURISTIC 3D LUNAR BASE STRUCTURES
  createLunarBase() {
    // 1. MAIN HABITAT DOME (Geodesic Pressurized Complex)
    const habGroup = new THREE.Group();
    habGroup.position.set(0, 0, 0);

    // Central Geodesic Dome Shell
    const domeGeo = new THREE.SphereGeometry(14, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.65
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.castShadow = true;
    domeMesh.receiveShadow = true;
    habGroup.add(domeMesh);

    // Glowing Top Observation Cupola
    const cupolaGeo = new THREE.SphereGeometry(3.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cupolaMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const cupola = new THREE.Mesh(cupolaGeo, cupolaMat);
    cupola.position.y = 13.5;
    habGroup.add(cupola);

    // Airlock Module (Entrance)
    const airlockGeo = new THREE.BoxGeometry(6, 4.5, 7);
    const airlockMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.7
    });
    const airlock = new THREE.Mesh(airlockGeo, airlockMat);
    airlock.position.set(0, 2.25, 13);
    airlock.castShadow = true;
    airlock.receiveShadow = true;
    habGroup.add(airlock);

    // Airlock Door with Status LED (Cyan / Green nominal)
    const doorGeo = new THREE.PlaneGeometry(3.2, 3.4);
    const doorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2.2, 16.55);
    habGroup.add(door);

    this.scene.add(habGroup);

    // Register Hab Interaction Station
    this.registerStation({
      id: 'main_hab',
      name: 'Main Habitat & Airlock',
      category: 'Command & Health',
      pos: new THREE.Vector3(0, 0, 18),
      prompt: '[E] ENTER AIRLOCK / HABITAT STATUS'
    });

    // 2. BIFACIAL PHOTOVOLTAIC SOLAR FARM
    const solarFarmGroup = new THREE.Group();
    solarFarmGroup.position.set(-36, 0, -10);

    for (let i = 0; i < 4; i++) {
      const panelStand = new THREE.Group();
      panelStand.position.set((i % 2) * 16, 0, Math.floor(i / 2) * 16);

      // Support Pylon
      const mastGeo = new THREE.CylinderGeometry(0.3, 0.45, 6, 8);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 3;
      mast.castShadow = true;
      panelStand.add(mast);

      // Solar Panel Face (Bifacial Photovoltaic Cells)
      const panelGeo = new THREE.BoxGeometry(10, 0.2, 5.5);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        roughness: 0.2,
        metalness: 0.85
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(0, 6, 0);
      panel.rotation.x = -0.45; // Sun-tracking angle
      panel.castShadow = true;
      panelStand.add(panel);

      this.solarPanels.push(panel);
      solarFarmGroup.add(panelStand);
    }
    this.scene.add(solarFarmGroup);

    this.registerStation({
      id: 'solar_farm',
      name: 'Photovoltaic Solar Arrays',
      category: 'Power Generation',
      pos: new THREE.Vector3(-28, 0, -5),
      prompt: '[E] INSPECT & CLEAN SOLAR PANELS'
    });

    // 3. CLOSED-LOOP HYDROPONICS GREENHOUSE DOME
    const greenhouseGroup = new THREE.Group();
    greenhouseGroup.position.set(34, 0, 4);

    const ghDomeGeo = new THREE.SphereGeometry(9, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const ghDomeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.55
    });
    const ghDome = new THREE.Mesh(ghDomeGeo, ghDomeMat);
    ghDome.castShadow = true;
    greenhouseGroup.add(ghDome);

    // Internal Aeroponic Grow Light (Magenta/Green grow spectrum)
    this.greenhouseLight = new THREE.PointLight(0x22c55e, 2.5, 25);
    this.greenhouseLight.position.set(0, 4.5, 0);
    greenhouseGroup.add(this.greenhouseLight);

    // Vertical Aeroponic Plant Racks
    for (let r = 0; r < 4; r++) {
      const rackGeo = new THREE.CylinderGeometry(0.8, 0.8, 5, 8);
      const rackMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      const rack = new THREE.Mesh(rackGeo, rackMat);
      const ang = (r / 4) * Math.PI * 2;
      rack.position.set(Math.cos(ang) * 4.5, 2.5, Math.sin(ang) * 4.5);
      greenhouseGroup.add(rack);
    }

    // Tunnel connecting Hab to Greenhouse
    const tunnelGeo = new THREE.CylinderGeometry(1.8, 1.8, 22, 12);
    const tunnelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 });
    const tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
    tunnel.rotation.z = Math.PI * 0.5;
    tunnel.position.set(-11, 1.8, 0);
    tunnel.castShadow = true;
    greenhouseGroup.add(tunnel);

    this.scene.add(greenhouseGroup);

    this.registerStation({
      id: 'greenhouse',
      name: 'Aeroponics Greenhouse Bay',
      category: 'Food & O2 Production',
      pos: new THREE.Vector3(34, 0, 15),
      prompt: '[E] MANAGE AEROPONIC CROPS'
    });

    // 4. WATER DISTILLATION & CRYOGENIC TANKS
    const waterGroup = new THREE.Group();
    waterGroup.position.set(16, 0, -28);

    // 2 Cryogenic Storage Cylinders
    for (let c = 0; c < 2; c++) {
      const tankGeo = new THREE.CylinderGeometry(2.4, 2.4, 7, 16);
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.7 });
      const tank = new THREE.Mesh(tankGeo, tankMat);
      tank.position.set(c * 6.5, 3.5, 0);
      tank.castShadow = true;
      waterGroup.add(tank);
    }
    this.scene.add(waterGroup);

    this.registerStation({
      id: 'water_facility',
      name: 'ECLSS Water Recovery Distillation',
      category: 'Water Recycling',
      pos: new THREE.Vector3(19, 0, -22),
      prompt: '[E] INSPECT WATER CATALYST & RECOVERY'
    });

    // 5. OXYGEN ELECTROLYSIS & SABATIER UNIT
    const o2Group = new THREE.Group();
    o2Group.position.set(-18, 0, -28);

    const o2TankGeo = new THREE.CylinderGeometry(2.8, 2.8, 8, 16);
    const o2TankMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.35, metalness: 0.75 });
    const o2Tank = new THREE.Mesh(o2TankGeo, o2TankMat);
    o2Tank.position.set(0, 4, 0);
    o2Tank.castShadow = true;
    o2Group.add(o2Tank);
    this.scene.add(o2Group);

    this.registerStation({
      id: 'o2_facility',
      name: 'Oxygen Electrolysis / MOXIE Loop',
      category: 'Atmospheric Support',
      pos: new THREE.Vector3(-18, 0, -22),
      prompt: '[E] SERVICE O2 ELECTROLYSIS REACTOR'
    });

    // 6. DEEP SPACE NETWORK COMMUNICATIONS TOWER
    const commsGroup = new THREE.Group();
    commsGroup.position.set(50, 0, -35);

    // Lattice Tower
    const towerGeo = new THREE.CylinderGeometry(0.5, 1.8, 22, 4);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: false, metalness: 0.8 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 11;
    tower.castShadow = true;
    commsGroup.add(tower);

    // Parabolic High-Gain Dish
    const dishGeo = new THREE.SphereGeometry(3.6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.6, side: THREE.DoubleSide });
    this.commsDish = new THREE.Mesh(dishGeo, dishMat);
    this.commsDish.position.set(0, 22, 0);
    this.commsDish.rotation.x = 0.6; // points toward Earth in the sky
    this.commsDish.rotation.y = 0.8;
    this.commsDish.castShadow = true;
    commsGroup.add(this.commsDish);

    // Blinking Comms Beacon Light
    const beacon = new THREE.PointLight(0xef4444, 1.8, 20);
    beacon.position.set(0, 24, 0);
    commsGroup.add(beacon);

    this.scene.add(commsGroup);

    this.registerStation({
      id: 'comms_tower',
      name: 'Deep Space Network Antenna',
      category: 'Earth Communications',
      pos: new THREE.Vector3(45, 0, -28),
      prompt: '[E] ALIGN DEEP SPACE DISH'
    });

    // 7. LUNAR EXPLORATION ROVER
    const roverGroup = new THREE.Group();
    roverGroup.position.set(-15, 0, 16);
    roverGroup.rotation.y = 0.4;

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(4.2, 1.2, 2.6);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.5 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 1.4;
    chassis.castShadow = true;
    roverGroup.add(chassis);

    // 4 Mesh Wheels
    for (let w = 0; w < 4; w++) {
      const wheelGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.6, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI * 0.5;
      const wx = (w % 2 === 0 ? -1 : 1) * 2.0;
      const wz = (w < 2 ? -1 : 1) * 1.5;
      wheel.position.set(wx, 0.9, wz);
      wheel.castShadow = true;
      roverGroup.add(wheel);
    }

    // Rover Headlights
    const roverLight = new THREE.SpotLight(0xfef08a, 1.5, 30, Math.PI * 0.25, 0.4);
    roverLight.position.set(2.2, 1.6, 0);
    roverLight.target.position.set(10, 0, 0);
    roverGroup.add(roverLight);
    roverGroup.add(roverLight.target);

    this.roverMesh = roverGroup;
    this.scene.add(roverGroup);

    this.registerStation({
      id: 'rover',
      name: 'Lunar Exploration Rover',
      category: 'Geology & Ice Sampling',
      pos: new THREE.Vector3(-15, 0, 20),
      prompt: '[E] ACCESS ROVER ICE CORE DATA'
    });
  }

  registerStation(station) {
    this.stations.push(station);
  }

  // PLAYABLE 3D ASTRONAUT CHARACTER
  createAstronaut() {
    const group = new THREE.Group();

    // Spacesuit Materials
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
      metalness: 0.2
    });
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7
    });
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.1,
      metalness: 0.95 // Gleaming gold helmet visor
    });

    // 1. Torso
    const torsoGeo = new THREE.BoxGeometry(0.9, 1.1, 0.6);
    const torso = new THREE.Mesh(torsoGeo, suitMat);
    torso.position.y = 1.35;
    torso.castShadow = true;
    group.add(torso);

    // Chest Remote Control Unit (RCU display)
    const rcuGeo = new THREE.BoxGeometry(0.45, 0.35, 0.12);
    const rcuMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x00f0ff, emissiveIntensity: 0.5 });
    const rcu = new THREE.Mesh(rcuGeo, rcuMat);
    rcu.position.set(0, 1.45, 0.34);
    group.add(rcu);

    // 2. Life Support Backpack (PLSS)
    const plssGeo = new THREE.BoxGeometry(0.8, 1.2, 0.45);
    const plss = new THREE.Mesh(plssGeo, suitMat);
    plss.position.set(0, 1.4, -0.42);
    plss.castShadow = true;
    group.add(plss);

    // 3. Helmet & Gold Visor
    const helmetGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const helmet = new THREE.Mesh(helmetGeo, suitMat);
    helmet.position.y = 2.15;
    helmet.castShadow = true;
    group.add(helmet);

    const visorGeo = new THREE.SphereGeometry(0.38, 16, 16, 0, Math.PI, 0, Math.PI * 0.7);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 2.15, 0.1);
    visor.rotation.x = 0.2;
    group.add(visor);

    // 4. Limbs for walking animations
    // Left & Right Arms
    const armGeo = new THREE.BoxGeometry(0.28, 0.8, 0.28);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-0.62, 1.3, 0);
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(0.62, 1.3, 0);
    rightArm.castShadow = true;
    group.add(rightArm);

    // Left & Right Legs
    const legGeo = new THREE.BoxGeometry(0.34, 0.9, 0.34);
    const leftLeg = new THREE.Mesh(legGeo, suitMat);
    leftLeg.position.set(-0.25, 0.55, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, suitMat);
    rightLeg.position.set(0.25, 0.55, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    // Position player
    group.position.copy(this.player.pos);
    this.scene.add(group);

    this.player.mesh = group;
    this.player.limbs = { leftArm, rightArm, leftLeg, rightLeg };
  }

  // KEYBOARD & MOUSE CONTROLS (WASD, Mouse-look, Jump, Interact)
  initControls() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') this.keys.w = true;
      if (key === 'a' || key === 'arrowleft') this.keys.a = true;
      if (key === 's' || key === 'arrowdown') this.keys.s = true;
      if (key === 'd' || key === 'arrowright') this.keys.d = true;
      if (e.code === 'Space') {
        this.keys.space = true;
        e.preventDefault();
      }
      if (e.key === 'Shift') this.keys.shift = true;
      if (key === 'e') {
        this.keys.e = true;
        this.handleInteractionKey();
      }
      if (key === 'v') {
        // Toggle First-Person / Third-Person view!
        this.toggleCameraMode();
      }
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') this.keys.w = false;
      if (key === 'a' || key === 'arrowleft') this.keys.a = false;
      if (key === 's' || key === 'arrowdown') this.keys.s = false;
      if (key === 'd' || key === 'arrowright') this.keys.d = false;
      if (e.code === 'Space') this.keys.space = false;
      if (e.key === 'Shift') this.keys.shift = false;
      if (key === 'e') this.keys.e = false;
    });

    // Pointer Lock for PC FPS/Third-Person camera control
    const canvas = this.renderer.domElement;
    canvas.addEventListener('click', () => {
      if (this.mode === 'gameplay' && !document.pointerLockElement) {
        canvas.requestPointerLock().catch(() => {});
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.mouse.isLocked = (document.pointerLockElement === canvas);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mode !== 'gameplay') return;

      const sensitivity = 0.0022 * this.mouseSensitivity;
      if (this.mouse.isLocked) {
        this.yaw -= e.movementX * sensitivity;
        this.pitch -= e.movementY * sensitivity;
      } else if (e.buttons === 1) { // Drag to rotate fallback
        this.yaw -= e.movementX * sensitivity * 1.5;
        this.pitch -= e.movementY * sensitivity * 1.5;
      }

      // Clamp vertical pitch (-60 deg to +60 deg)
      this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch));
    });

    // Mouse wheel zoom
    window.addEventListener('wheel', (e) => {
      if (this.mode === 'gameplay') {
        this.camDistance = Math.max(2.5, Math.min(12.0, this.camDistance + e.deltaY * 0.005));
      }
    });
  }

  toggleCameraMode() {
    this.cameraMode = (this.cameraMode === 'third_person') ? 'first_person' : 'third_person';
    if (this.player.mesh) {
      // In first person, hide head to prevent clipping
      this.player.mesh.visible = (this.cameraMode === 'third_person');
    }
  }

  handleEscapeKey() {
    if (this.mode === 'gameplay') {
      this.setMode('paused');
    } else if (this.mode === 'paused') {
      this.setMode('gameplay');
    }
  }

  handleInteractionKey() {
    if (this.mode === 'gameplay' && this.activeStation) {
      if (window.astroAudio) window.astroAudio.interact();
      this.onInteractionTrigger(this.activeStation);
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    if (newMode === 'gameplay') {
      if (window.astroAudio) window.astroAudio.startAmbientDrone();
    } else if (newMode === 'menu' || newMode === 'paused') {
      if (document.pointerLockElement) {
        document.exitPointerLock().catch(() => {});
      }
    }
  }

  // MAIN SIMULATION UPDATE LOOP
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.mode === 'menu') {
      this.updateMenuCinematic(delta);
    } else if (this.mode === 'gameplay') {
      this.updateAstronautPhysics(delta);
      this.updateGameplayCamera(delta);
      this.checkStationInteractions();
    }

    // Environmental animations
    this.updateEnvironmentAnimations(delta);

    this.renderer.render(this.scene, this.camera);
  }

  // CINEMATIC MAIN MENU CAMERA (Slow majestic orbit showing Moon, Base, Earth)
  updateMenuCinematic(delta) {
    this.menuAngle += delta * 0.12;

    const orbitRadius = 45;
    const camX = Math.cos(this.menuAngle) * orbitRadius;
    const camZ = Math.sin(this.menuAngle) * orbitRadius;
    const camY = 12 + Math.sin(this.menuAngle * 0.5) * 4;

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(0, 4.5, 0); // Focus on central habitat dome
  }

  // 1/6th LUNAR GRAVITY ASTRONAUT PHYSICS & WASD MOVEMENT
  updateAstronautPhysics(delta) {
    if (!this.player.mesh) return;

    // Movement directions based on camera yaw
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (this.keys.w) moveDir.add(forward);
    if (this.keys.s) moveDir.sub(forward);
    if (this.keys.d) moveDir.add(right);
    if (this.keys.a) moveDir.sub(right);

    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) {
      moveDir.normalize();
      const speed = this.keys.shift ? this.player.sprintSpeed : this.player.walkSpeed;
      
      this.player.vel.x = moveDir.x * speed;
      this.player.vel.z = moveDir.z * speed;

      // Face player in movement direction
      this.player.rotY = Math.atan2(moveDir.x, moveDir.z);
      this.player.mesh.rotation.y = this.player.rotY;

      // Play footstep audio in lunar regolith
      if (this.player.isGrounded && Math.random() < delta * (this.keys.shift ? 4.5 : 2.5)) {
        if (window.astroAudio) window.astroAudio.footstep();
      }
    } else {
      // Gentle lunar inertia damping
      this.player.vel.x *= Math.pow(0.05, delta);
      this.player.vel.z *= Math.pow(0.05, delta);
    }

    // Lunar Low-Gravity Jump
    if (this.keys.space && this.player.isGrounded) {
      this.player.vel.y = this.player.jumpVelocity;
      this.player.isGrounded = false;
      if (window.astroAudio) window.astroAudio.jump();
    }

    // Apply Lunar Gravity (1.63 m/s^2)
    this.player.vel.y += this.player.gravity * delta;

    // Apply Velocity
    this.player.pos.x += this.player.vel.x * delta;
    this.player.pos.y += this.player.vel.y * delta;
    this.player.pos.z += this.player.vel.z * delta;

    // Ground Collision (Lunar surface floor = 0)
    if (this.player.pos.y <= 0) {
      this.player.pos.y = 0;
      this.player.vel.y = 0;
      this.player.isGrounded = true;
    }

    // Boundary constraints (stay within mission perimeter)
    const distSq = this.player.pos.x * this.player.pos.x + this.player.pos.z * this.player.pos.z;
    if (distSq > 160 * 160) {
      const angle = Math.atan2(this.player.pos.z, this.player.pos.x);
      this.player.pos.x = Math.cos(angle) * 160;
      this.player.pos.z = Math.sin(angle) * 160;
    }

    this.player.mesh.position.copy(this.player.pos);

    // Limb Walk Animation
    if (this.player.limbs.leftLeg) {
      const walkCycle = Math.sin(this.clock.getElapsedTime() * (this.keys.shift ? 12 : 7));
      const legAngle = isMoving && this.player.isGrounded ? walkCycle * 0.6 : 0;
      
      this.player.limbs.leftLeg.rotation.x = legAngle;
      this.player.limbs.rightLeg.rotation.x = -legAngle;
      this.player.limbs.leftArm.rotation.x = -legAngle * 0.8;
      this.player.limbs.rightArm.rotation.x = legAngle * 0.8;
    }
  }

  // THIRD-PERSON / FIRST-PERSON CAMERA UPDATE
  updateGameplayCamera(delta) {
    if (this.cameraMode === 'first_person') {
      // First-Person (Looking through astronaut's gold visor)
      this.camera.position.set(
        this.player.pos.x,
        this.player.pos.y + 2.15,
        this.player.pos.z
      );
      const lookTarget = new THREE.Vector3(
        this.camera.position.x - Math.sin(this.yaw) * Math.cos(this.pitch) * 10,
        this.camera.position.y + Math.sin(this.pitch) * 10,
        this.camera.position.z - Math.cos(this.yaw) * Math.cos(this.pitch) * 10
      );
      this.camera.lookAt(lookTarget);
    } else {
      // Third-Person Over-The-Shoulder
      const targetLook = new THREE.Vector3(
        this.player.pos.x,
        this.player.pos.y + 1.8,
        this.player.pos.z
      );

      const offsetX = Math.sin(this.yaw) * Math.cos(this.pitch) * this.camDistance;
      const offsetY = Math.sin(this.pitch) * this.camDistance + 1.2;
      const offsetZ = Math.cos(this.yaw) * Math.cos(this.pitch) * this.camDistance;

      const desiredCamPos = new THREE.Vector3(
        this.player.pos.x + offsetX,
        Math.max(1.0, this.player.pos.y + offsetY),
        this.player.pos.z + offsetZ
      );

      // Smooth camera interpolation
      this.camera.position.lerp(desiredCamPos, 0.25);
      this.camera.lookAt(targetLook);
    }
  }

  // CHECK PROXIMITY TO INTERACTION STATIONS
  checkStationInteractions() {
    let nearest = null;
    let minDist = 7.5; // Interaction radius (meters)

    for (const station of this.stations) {
      const d = this.player.pos.distanceTo(station.pos);
      if (d < minDist) {
        minDist = d;
        nearest = station;
      }
    }

    if (nearest !== this.activeStation) {
      this.activeStation = nearest;
      this.onHudUpdate({
        activeStation: nearest,
        playerPos: this.player.pos
      });
    }
  }

  // ENVIRONMENTAL ANIMATIONS (Earth rotation, dust drift, comms tracking)
  updateEnvironmentAnimations(delta) {
    // Earth slow axial rotation
    if (this.earthMesh) {
      this.earthMesh.rotation.y += delta * 0.02;
    }

    // Solar panels sun-tracking tilt
    if (this.solarPanels.length > 0) {
      const targetTilt = -0.35 + Math.sin(this.clock.getElapsedTime() * 0.1) * 0.08;
      this.solarPanels.forEach(p => {
        p.rotation.x = targetTilt;
      });
    }

    // Comms dish slow azimuth sweep
    if (this.commsDish) {
      this.commsDish.rotation.z = Math.sin(this.clock.getElapsedTime() * 0.2) * 0.12;
    }

    // Levitated regolith dust particles drifting under solar radiation pressure
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let py = pos.getY(i) + Math.sin(this.clock.getElapsedTime() + i) * 0.004;
        let px = pos.getX(i) + delta * 0.2;
        if (px > 60) px = -60;
        pos.setX(i, px);
        pos.setY(i, py);
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Set Sun elevation based on mission day
  setDay(dayNum) {
    this.day = dayNum;
    // Lunar sunrise to noon to sunset over 10 days
    this.sunAngle = (dayNum / 10) * Math.PI;
    const sunY = Math.sin(this.sunAngle) * 140 + 20;
    const sunX = Math.cos(this.sunAngle) * 160;
    this.sunLight.position.set(sunX, sunY, 80);
  }
}

window.Astrobase3D = Astrobase3D;
