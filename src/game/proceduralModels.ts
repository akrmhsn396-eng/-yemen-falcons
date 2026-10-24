import * as THREE from 'three';

// Procedural textures generator
export function createGypsumPatternTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b38b6d';
  ctx.fillRect(0, 0, 128, 128);

  // White Yemeni geometric frieze & Qamariya window arches
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 8, 128, 12);
  ctx.fillRect(0, 48, 128, 10);

  // Triangles and arches
  ctx.beginPath();
  for (let x = 0; x < 128; x += 16) {
    ctx.moveTo(x, 20);
    ctx.lineTo(x + 8, 36);
    ctx.lineTo(x + 16, 20);
  }
  ctx.fill();

  // Arched windows
  ctx.fillStyle = '#221915';
  for (let x = 12; x < 128; x += 32) {
    ctx.beginPath();
    ctx.arc(x + 8, 75, 8, Math.PI, 0, false);
    ctx.rect(x, 75, 16, 22);
    ctx.fill();
    // Gypsum border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Stone pattern for Yemeni masonry
export function createStoneMasonryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8f7760';
  ctx.fillRect(0, 0, 256, 256);

  // Course lines
  ctx.strokeStyle = '#5a4635';
  ctx.lineWidth = 2;
  const rows = 16;
  const rowHeight = 256 / rows;

  for (let r = 0; r < rows; r++) {
    const y = r * rowHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();

    const blockWidth = 32 + (r % 3) * 8;
    const offset = (r % 2) * (blockWidth / 2);
    for (let x = offset; x < 256 + blockWidth; x += blockWidth) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowHeight);
      ctx.stroke();
    }
  }

  // Add subtle noise
  for (let i = 0; i < 400; i++) {
    const nx = Math.random() * 256;
    const ny = Math.random() * 256;
    const size = Math.random() * 3 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(nx, ny, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const stoneTexture = createStoneMasonryTexture();
const gypsumTexture = createGypsumPatternTexture();

// Reusable materials
const materials = {
  stoneWall: new THREE.MeshStandardMaterial({
    map: stoneTexture,
    roughness: 0.85,
    metalness: 0.1,
    color: 0x9e8369,
  }),
  gypsumCrown: new THREE.MeshStandardMaterial({
    map: gypsumTexture,
    roughness: 0.7,
    metalness: 0.05,
    color: 0xf5eedd,
  }),
  mudBrickDark: new THREE.MeshStandardMaterial({
    roughness: 0.9,
    metalness: 0.05,
    color: 0x6e523b,
  }),
  metalSteel: new THREE.MeshStandardMaterial({
    roughness: 0.35,
    metalness: 0.85,
    color: 0x3d4349,
  }),
  metalDark: new THREE.MeshStandardMaterial({
    roughness: 0.4,
    metalness: 0.9,
    color: 0x1f2326,
  }),
  desertVehicle: new THREE.MeshStandardMaterial({
    roughness: 0.65,
    metalness: 0.25,
    color: 0xc8a87b, // Sand desert tan
  }),
  enemyVehicle: new THREE.MeshStandardMaterial({
    roughness: 0.6,
    metalness: 0.3,
    color: 0x8a3a3a, // Crimson insurgent / enemy tone
  }),
  rubberBlack: new THREE.MeshStandardMaterial({
    roughness: 0.95,
    metalness: 0.05,
    color: 0x181818,
  }),
  waterShimmer: new THREE.MeshStandardMaterial({
    roughness: 0.1,
    metalness: 0.1,
    color: 0x2288aa,
    transparent: true,
    opacity: 0.85,
  }),
  glassCyan: new THREE.MeshStandardMaterial({
    roughness: 0.15,
    metalness: 0.9,
    color: 0x88ccee,
    transparent: true,
    opacity: 0.75,
  }),
  glowGreen: new THREE.MeshBasicMaterial({ color: 0x22ee66 }),
  glowRed: new THREE.MeshBasicMaterial({ color: 0xff3333 }),
  clothShemagh: new THREE.MeshStandardMaterial({
    roughness: 0.95,
    metalness: 0.0,
    color: 0xdd4433, // Red/white traditional shemagh
  }),
  clothUniform: new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.05,
    color: 0x7a6c53,
  }),
};

// 1. Citadel HQ (حصن شبام وحراز الجبلي)
export function createCitadelMesh(faction: 'player' | 'enemy' = 'player'): THREE.Group {
  const group = new THREE.Group();

  // Base tier 1 (wide fortress foundation)
  const baseGeo = new THREE.BoxGeometry(4.2, 2.8, 4.2);
  const baseMesh = new THREE.Mesh(baseGeo, materials.stoneWall);
  baseMesh.position.y = 1.4;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Mid tier 2 (slender tower)
  const midGeo = new THREE.BoxGeometry(3.2, 3.2, 3.2);
  const midMesh = new THREE.Mesh(midGeo, materials.gypsumCrown);
  midMesh.position.y = 2.8 + 1.6;
  midMesh.castShadow = true;
  midMesh.receiveShadow = true;
  group.add(midMesh);

  // Top tier 3 (penthouse & battlements)
  const topGeo = new THREE.BoxGeometry(2.4, 2.0, 2.4);
  const topMesh = new THREE.Mesh(topGeo, materials.gypsumCrown);
  topMesh.position.y = 6.0 + 1.0;
  topMesh.castShadow = true;
  group.add(topMesh);

  // Corner watch crenellations / turrets (4 corners)
  const turretGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 6);
  const positions = [
    [-1.6, 2.8, -1.6],
    [1.6, 2.8, -1.6],
    [-1.6, 2.8, 1.6],
    [1.6, 2.8, 1.6],
  ];
  positions.forEach(([x, y, z]) => {
    const turret = new THREE.Mesh(turretGeo, materials.stoneWall);
    turret.position.set(x, y + 0.45, z);
    turret.castShadow = true;
    group.add(turret);
  });

  // Fortress main wooden gate with stone lintel
  const gateGeo = new THREE.BoxGeometry(1.2, 1.8, 0.4);
  const gateMesh = new THREE.Mesh(gateGeo, materials.mudBrickDark);
  gateMesh.position.set(0, 0.9, 2.15);
  group.add(gateMesh);

  // Comms Mast and Radar Dish on top
  const mastGeo = new THREE.CylinderGeometry(0.06, 0.08, 3.0, 6);
  const mastMesh = new THREE.Mesh(mastGeo, materials.metalSteel);
  mastMesh.position.set(0, 8.5, 0);
  mastMesh.castShadow = true;
  group.add(mastMesh);

  // Comms dish / antenna
  const dishGeo = new THREE.SphereGeometry(0.45, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const dishMesh = new THREE.Mesh(dishGeo, materials.metalSteel);
  dishMesh.position.set(0, 9.8, 0);
  dishMesh.rotation.x = Math.PI / 4;
  group.add(dishMesh);

  // Beacon light indicator
  const beaconGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const beaconMesh = new THREE.Mesh(beaconGeo, faction === 'player' ? materials.glowGreen : materials.glowRed);
  beaconMesh.position.set(0, 10.1, 0);
  group.add(beaconMesh);

  // Ground apron footprint
  const apronGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.2, 8);
  const apronMesh = new THREE.Mesh(apronGeo, materials.mudBrickDark);
  apronMesh.position.y = 0.1;
  apronMesh.receiveShadow = true;
  group.add(apronMesh);

  return group;
}

// 2. Water Well & Cistern (بئر وسقاية صهريج جبلية)
export function createWaterWellMesh(): THREE.Group {
  const group = new THREE.Group();

  // Stone cistern ring wall
  const ringGeo = new THREE.CylinderGeometry(2.2, 2.4, 1.2, 12, 1, true);
  const ringMesh = new THREE.Mesh(ringGeo, materials.stoneWall);
  ringMesh.position.y = 0.6;
  ringMesh.castShadow = true;
  ringMesh.receiveShadow = true;
  group.add(ringMesh);

  // Water pool inside
  const waterGeo = new THREE.CircleGeometry(2.1, 16);
  const waterMesh = new THREE.Mesh(waterGeo, materials.waterShimmer);
  waterMesh.position.y = 0.75;
  waterMesh.rotation.x = -Math.PI / 2;
  group.add(waterMesh);

  // Pumping rig / tower
  const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 4);
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(legGeo, materials.metalSteel);
    leg.position.set(Math.cos(angle) * 1.4, 1.6, Math.sin(angle) * 1.4);
    leg.rotation.z = Math.cos(angle) * -0.15;
    leg.rotation.x = Math.sin(angle) * 0.15;
    leg.castShadow = true;
    group.add(leg);
  }

  // Pump mechanism head & pipes
  const pumpGeo = new THREE.BoxGeometry(0.8, 0.7, 0.8);
  const pumpMesh = new THREE.Mesh(pumpGeo, materials.metalDark);
  pumpMesh.position.set(0, 3.2, 0);
  group.add(pumpMesh);

  // Windmill / solar generator blades for the pump
  const bladeGeo = new THREE.BoxGeometry(2.4, 0.3, 0.05);
  const blade1 = new THREE.Mesh(bladeGeo, materials.metalSteel);
  blade1.position.set(0, 3.4, 0.5);
  group.add(blade1);

  const blade2 = new THREE.Mesh(bladeGeo, materials.metalSteel);
  blade2.position.set(0, 3.4, 0.5);
  blade2.rotation.z = Math.PI / 2;
  group.add(blade2);

  return group;
}

// 3. Stone Quarry & Fortifications Workshop (محجر الصخور والتحصينات)
export function createStoneQuarryMesh(): THREE.Group {
  const group = new THREE.Group();

  // Crane gantry structure
  const postGeo = new THREE.BoxGeometry(0.3, 3.6, 0.3);
  const p1 = new THREE.Mesh(postGeo, materials.metalDark);
  p1.position.set(-1.6, 1.8, -1.2);
  const p2 = new THREE.Mesh(postGeo, materials.metalDark);
  p2.position.set(1.6, 1.8, -1.2);
  group.add(p1, p2);

  const crossGeo = new THREE.BoxGeometry(3.6, 0.3, 0.3);
  const cross = new THREE.Mesh(crossGeo, materials.metalSteel);
  cross.position.set(0, 3.6, -1.2);
  group.add(cross);

  // Crane hoist arm extending forward
  const armGeo = new THREE.BoxGeometry(0.3, 0.3, 2.8);
  const arm = new THREE.Mesh(armGeo, materials.metalSteel);
  arm.position.set(0, 3.6, 0.2);
  group.add(arm);

  // Stone block stack
  const blockGeo = new THREE.BoxGeometry(1.2, 0.8, 1.0);
  const b1 = new THREE.Mesh(blockGeo, materials.stoneWall);
  b1.position.set(-0.8, 0.4, 0.6);
  b1.castShadow = true;
  const b2 = new THREE.Mesh(blockGeo, materials.stoneWall);
  b2.position.set(0.6, 0.4, 0.8);
  b2.castShadow = true;
  const b3 = new THREE.Mesh(blockGeo, materials.stoneWall);
  b3.position.set(-0.2, 1.2, 0.7);
  b3.castShadow = true;
  group.add(b1, b2, b3);

  // Rock cutting saw table
  const tableGeo = new THREE.BoxGeometry(1.4, 0.8, 1.2);
  const table = new THREE.Mesh(tableGeo, materials.metalDark);
  table.position.set(1.4, 0.4, -0.2);
  group.add(table);

  return group;
}

// 4. Fuel Depot & Generator (مستودع الوقود ومولد الطاقة)
export function createFuelDepotMesh(): THREE.Group {
  const group = new THREE.Group();

  // Concrete spill berm
  const bermGeo = new THREE.BoxGeometry(4.0, 0.4, 3.2);
  const berm = new THREE.Mesh(bermGeo, materials.mudBrickDark);
  berm.position.y = 0.2;
  berm.receiveShadow = true;
  group.add(berm);

  // Twin cylindrical fuel tanks
  const tankGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.6, 12);
  const tank1 = new THREE.Mesh(tankGeo, materials.metalSteel);
  tank1.rotation.z = Math.PI / 2;
  tank1.position.set(0, 1.1, -0.6);
  tank1.castShadow = true;
  group.add(tank1);

  const tank2 = new THREE.Mesh(tankGeo, materials.metalSteel);
  tank2.rotation.z = Math.PI / 2;
  tank2.position.set(0, 1.1, 0.6);
  tank2.castShadow = true;
  group.add(tank2);

  // Diesel Generator block
  const genGeo = new THREE.BoxGeometry(1.2, 1.4, 1.6);
  const gen = new THREE.Mesh(genGeo, materials.metalDark);
  gen.position.set(-1.8, 0.9, 0);
  gen.castShadow = true;
  group.add(gen);

  // Exhaust pipe
  const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6);
  const exhaust = new THREE.Mesh(exhaustGeo, materials.metalDark);
  exhaust.position.set(-1.8, 2.0, 0.4);
  group.add(exhaust);

  // Solar backup panel
  const panelGeo = new THREE.BoxGeometry(1.8, 0.08, 1.2);
  const panel = new THREE.Mesh(panelGeo, materials.glassCyan);
  panel.position.set(1.5, 1.2, 0);
  panel.rotation.x = 0.4;
  group.add(panel);

  return group;
}

// 5. Armory & Munitions Depot (مسبك الذخائر والعتاد)
export function createArmoryMesh(): THREE.Group {
  const group = new THREE.Group();

  // Reinforced bunker body
  const bodyGeo = new THREE.BoxGeometry(3.6, 1.8, 3.2);
  const body = new THREE.Mesh(bodyGeo, materials.stoneWall);
  body.position.y = 0.9;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Reinforced steel vault blast door
  const doorGeo = new THREE.BoxGeometry(1.4, 1.3, 0.2);
  const door = new THREE.Mesh(doorGeo, materials.metalDark);
  door.position.set(0, 0.65, 1.65);
  group.add(door);

  // Roof observation / ventilator dome
  const domeGeo = new THREE.SphereGeometry(0.8, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, materials.metalSteel);
  dome.position.set(0, 1.8, 0);
  group.add(dome);

  // Munition crates stacked outside
  const crateGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
  for (let i = 0; i < 4; i++) {
    const crate = new THREE.Mesh(crateGeo, materials.mudBrickDark);
    crate.position.set(1.8 + (i % 2) * 0.7, 0.25 + Math.floor(i / 2) * 0.5, -0.4 + (i % 2) * 0.5);
    crate.castShadow = true;
    group.add(crate);
  }

  return group;
}

// 6. Mountain Watchtower & Air Defense (برج مراقبة ودفاع جوي)
export function createWatchtowerMesh(faction: 'player' | 'enemy' = 'player'): THREE.Group {
  const group = new THREE.Group();

  // Octagonal stone tower
  const towerGeo = new THREE.CylinderGeometry(1.2, 1.6, 5.5, 8);
  const tower = new THREE.Mesh(towerGeo, materials.stoneWall);
  tower.position.y = 2.75;
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  // Top observation platform
  const deckGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.4, 8);
  const deck = new THREE.Mesh(deckGeo, materials.mudBrickDark);
  deck.position.y = 5.7;
  group.add(deck);

  // Parapet railing
  const railGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.7, 8, 1, true);
  const rail = new THREE.Mesh(railGeo, materials.metalSteel);
  rail.position.y = 6.25;
  group.add(rail);

  // Twin anti-air autocannons
  const cannonGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 6);
  const c1 = new THREE.Mesh(cannonGeo, materials.metalDark);
  c1.rotation.x = Math.PI / 3;
  c1.position.set(-0.35, 6.7, 0.4);
  const c2 = new THREE.Mesh(cannonGeo, materials.metalDark);
  c2.rotation.x = Math.PI / 3;
  c2.position.set(0.35, 6.7, 0.4);
  group.add(c1, c2);

  // Searchlight / optical tracker
  const lampGeo = new THREE.SphereGeometry(0.3, 8, 8);
  const lamp = new THREE.Mesh(lampGeo, faction === 'player' ? materials.glowGreen : materials.glowRed);
  lamp.position.set(0, 6.6, -0.7);
  group.add(lamp);

  return group;
}

// 7. Tactical Technical 4x4 (عربة شاص تكتيكية مسلحة)
export function createTechnicalMesh(faction: 'player' | 'enemy' = 'player'): THREE.Group {
  const group = new THREE.Group();
  const bodyMat = faction === 'player' ? materials.desertVehicle : materials.enemyVehicle;

  // Main chassis frame
  const chassisGeo = new THREE.BoxGeometry(1.4, 0.35, 2.8);
  const chassis = new THREE.Mesh(chassisGeo, materials.metalDark);
  chassis.position.y = 0.55;
  chassis.castShadow = true;
  group.add(chassis);

  // Cabin
  const cabinGeo = new THREE.BoxGeometry(1.3, 0.75, 1.2);
  const cabin = new THREE.Mesh(cabinGeo, bodyMat);
  cabin.position.set(0, 1.05, 0.3);
  cabin.castShadow = true;
  group.add(cabin);

  // Windshield
  const glassGeo = new THREE.BoxGeometry(1.15, 0.45, 0.1);
  const glass = new THREE.Mesh(glassGeo, materials.glassCyan);
  glass.position.set(0, 1.15, 0.9);
  glass.rotation.x = 0.25;
  group.add(glass);

  // Truck flatbed pickup back
  const bedGeo = new THREE.BoxGeometry(1.3, 0.45, 1.2);
  const bed = new THREE.Mesh(bedGeo, bodyMat);
  bed.position.set(0, 0.85, -0.8);
  bed.castShadow = true;
  group.add(bed);

  // 4 Rugged off-road tires
  const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.26, 12);
  const tirePositions = [
    [-0.72, 0.38, 0.85],
    [0.72, 0.38, 0.85],
    [-0.72, 0.38, -0.85],
    [0.72, 0.38, -0.85],
  ];
  tirePositions.forEach(([x, y, z]) => {
    const tire = new THREE.Mesh(tireGeo, materials.rubberBlack);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(x, y, z);
    tire.castShadow = true;
    group.add(tire);
  });

  // Heavy DShK Machine Gun on flatbed tripod
  const tripodGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 4);
  const tripod = new THREE.Mesh(tripodGeo, materials.metalDark);
  tripod.position.set(0, 1.35, -0.7);
  group.add(tripod);

  const gunBarrelGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6);
  const barrel = new THREE.Mesh(gunBarrelGeo, materials.metalSteel);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 1.75, -0.2);
  group.add(barrel);

  // Gunner head/torso silhouette in back
  const gunnerGeo = new THREE.BoxGeometry(0.35, 0.5, 0.3);
  const gunner = new THREE.Mesh(gunnerGeo, materials.clothUniform);
  gunner.position.set(0, 1.5, -0.9);
  group.add(gunner);

  return group;
}

// 8. Mountain Infantry / Pathfinders (مشاة وقناصة الجبال اليمانية)
export function createInfantryMesh(faction: 'player' | 'enemy' = 'player', isEngineer: boolean = false): THREE.Group {
  const group = new THREE.Group();

  const uniformColor = isEngineer 
    ? 0xcc8822 // Engineer orange-khaki
    : (faction === 'player' ? 0x75664d : 0x5a2d2d);

  const uniformMat = new THREE.MeshStandardMaterial({
    roughness: 0.9,
    metalness: 0.05,
    color: uniformColor,
  });

  // Legs
  const legGeo = new THREE.BoxGeometry(0.18, 0.5, 0.18);
  const leftLeg = new THREE.Mesh(legGeo, uniformMat);
  leftLeg.position.set(-0.12, 0.25, 0);
  leftLeg.castShadow = true;

  const rightLeg = new THREE.Mesh(legGeo, uniformMat);
  rightLeg.position.set(0.12, 0.25, 0);
  rightLeg.castShadow = true;
  group.add(leftLeg, rightLeg);

  // Torso / tactical combat vest
  const torsoGeo = new THREE.BoxGeometry(0.42, 0.52, 0.26);
  const torso = new THREE.Mesh(torsoGeo, uniformMat);
  torso.position.y = 0.76;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const headGeo = new THREE.SphereGeometry(0.16, 8, 8);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.8 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.15;
  group.add(head);

  // Shemagh / Turban (شماغ يمني تقليدي)
  const shemaghGeo = new THREE.TorusGeometry(0.18, 0.07, 6, 8);
  const shemagh = new THREE.Mesh(shemaghGeo, isEngineer ? materials.mudBrickDark : materials.clothShemagh);
  shemagh.rotation.x = Math.PI / 2;
  shemagh.position.y = 1.22;
  group.add(shemagh);

  // Weapon: Sniper / Assault Rifle
  const rifleGeo = new THREE.BoxGeometry(0.08, 0.1, 0.9);
  const rifle = new THREE.Mesh(rifleGeo, materials.metalDark);
  rifle.position.set(0.25, 0.75, 0.25);
  rifle.rotation.x = 0.2;
  rifle.castShadow = true;
  group.add(rifle);

  // Tactical backpack
  const packGeo = new THREE.BoxGeometry(0.32, 0.38, 0.18);
  const pack = new THREE.Mesh(packGeo, materials.mudBrickDark);
  pack.position.set(0, 0.78, -0.2);
  group.add(pack);

  return group;
}

// 9. Mountain Mortar Artillery (راجمة وهاون جبلي)
export function createMortarMesh(faction: 'player' | 'enemy' = 'player'): THREE.Group {
  const group = new THREE.Group();

  // Base circular plate
  const plateGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.12, 8);
  const plate = new THREE.Mesh(plateGeo, materials.metalDark);
  plate.position.y = 0.06;
  plate.castShadow = true;
  group.add(plate);

  // Bipod legs
  const bipodGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 4);
  const b1 = new THREE.Mesh(bipodGeo, materials.metalSteel);
  b1.position.set(-0.25, 0.45, 0.25);
  b1.rotation.z = 0.3;
  const b2 = new THREE.Mesh(bipodGeo, materials.metalSteel);
  b2.position.set(0.25, 0.45, 0.25);
  b2.rotation.z = -0.3;
  group.add(b1, b2);

  // High-arc Mortar Tube
  const tubeGeo = new THREE.CylinderGeometry(0.12, 0.14, 1.3, 8);
  const tube = new THREE.Mesh(tubeGeo, faction === 'player' ? materials.metalSteel : materials.metalDark);
  tube.rotation.x = Math.PI / 3; // 60 degree steep angle
  tube.position.set(0, 0.6, -0.05);
  tube.castShadow = true;
  group.add(tube);

  // Ammo crate beside
  const crateGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
  const crate = new THREE.Mesh(crateGeo, materials.mudBrickDark);
  crate.position.set(0.6, 0.15, -0.2);
  group.add(crate);

  return group;
}

// 10. Recon Drone (طائرة استطلاع مسيرة)
export function createDroneMesh(faction: 'player' | 'enemy' = 'player'): THREE.Group {
  const group = new THREE.Group();

  // Central fuselage
  const bodyGeo = new THREE.BoxGeometry(0.6, 0.18, 0.9);
  const body = new THREE.Mesh(bodyGeo, faction === 'player' ? materials.desertVehicle : materials.enemyVehicle);
  body.castShadow = true;
  group.add(body);

  // Delta Wings
  const wingGeo = new THREE.BoxGeometry(2.0, 0.04, 0.45);
  const wing = new THREE.Mesh(wingGeo, materials.metalDark);
  wing.position.set(0, 0.05, 0);
  wing.castShadow = true;
  group.add(wing);

  // Twin tail fins
  const finGeo = new THREE.BoxGeometry(0.04, 0.35, 0.25);
  const fin1 = new THREE.Mesh(finGeo, materials.metalDark);
  fin1.position.set(-0.4, 0.2, -0.35);
  const fin2 = new THREE.Mesh(finGeo, materials.metalDark);
  fin2.position.set(0.4, 0.2, -0.35);
  group.add(fin1, fin2);

  // Optical gimbal sensor ball
  const ballGeo = new THREE.SphereGeometry(0.14, 8, 8);
  const ball = new THREE.Mesh(ballGeo, faction === 'player' ? materials.glowGreen : materials.glowRed);
  ball.position.set(0, -0.12, 0.35);
  group.add(ball);

  return group;
}

// 11. Yemeni Mountain Acacia Tree (شجرة الطلح والسمر)
export function createAcaciaTreeMesh(): THREE.Group {
  const group = new THREE.Group();

  // Curved gnarly trunk
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.32, 2.8, 6);
  const trunk = new THREE.Mesh(trunkGeo, materials.mudBrickDark);
  trunk.position.y = 1.4;
  trunk.rotation.z = (Math.random() - 0.5) * 0.2;
  trunk.castShadow = true;
  group.add(trunk);

  // Flat parasol canopy (umbrella shape typical of Yemeni mountains)
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0x475e3a,
    roughness: 0.95,
  });

  const canopyGeo1 = new THREE.CylinderGeometry(1.8, 1.4, 0.45, 8);
  const canopy1 = new THREE.Mesh(canopyGeo1, canopyMat);
  canopy1.position.y = 2.9;
  canopy1.castShadow = true;
  group.add(canopy1);

  const canopyGeo2 = new THREE.CylinderGeometry(1.2, 0.9, 0.35, 7);
  const canopy2 = new THREE.Mesh(canopyGeo2, canopyMat);
  canopy2.position.set(0.4, 3.25, 0.2);
  canopy2.castShadow = true;
  group.add(canopy2);

  return group;
}

// 12. Yemeni Basalt / Granite Rock Boulder Cluster (صخور بركانية جبلية)
export function createRockClusterMesh(): THREE.Group {
  const group = new THREE.Group();
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x55483d,
    roughness: 0.9,
    metalness: 0.1,
  });

  const rGeo = new THREE.DodecahedronGeometry(0.9, 1);
  for (let i = 0; i < 3; i++) {
    const rock = new THREE.Mesh(rGeo, rockMat);
    rock.position.set((i - 1) * 0.7, 0.4 + i * 0.1, (Math.random() - 0.5) * 0.5);
    rock.scale.set(1 + Math.random() * 0.4, 0.7 + Math.random() * 0.3, 1 + Math.random() * 0.4);
    rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }

  return group;
}

// 13. Yemeni Street Fighter (مقاتل يمني معاصر)
export function createYemeniFighterMesh(faction: 'player' | 'enemy' = 'player'): THREE.Group {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.8 });
  const mawazMat = new THREE.MeshStandardMaterial({ 
    color: faction === 'player' ? 0x2244aa : 0x882222, 
    roughness: 0.9,
    // Simulate a basic pattern if needed, but solid for now
  });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 });
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x443322, roughness: 0.7 });

  // Legs (Mawaz / Sarong)
  const mawazGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.6, 8);
  const mawaz = new THREE.Mesh(mawazGeo, mawazMat);
  mawaz.position.y = 0.3;
  mawaz.castShadow = true;
  group.add(mawaz);

  // Torso (Shirt)
  const torsoGeo = new THREE.BoxGeometry(0.4, 0.5, 0.25);
  const torso = new THREE.Mesh(torsoGeo, shirtMat);
  torso.position.y = 0.85;
  torso.castShadow = true;
  group.add(torso);

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.06, 0.3, 4, 8);
  const leftArm = new THREE.Mesh(armGeo, shirtMat);
  leftArm.position.set(-0.25, 0.9, 0);
  leftArm.rotation.z = 0.2;
  const rightArm = new THREE.Mesh(armGeo, shirtMat);
  rightArm.position.set(0.25, 0.9, 0);
  rightArm.rotation.z = -0.2;
  group.add(leftArm, rightArm);

  // Head
  const headGeo = new THREE.SphereGeometry(0.16, 8, 8);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.2;
  group.add(head);

  // Shemagh / Turban
  const shemaghGeo = new THREE.TorusGeometry(0.18, 0.07, 6, 8);
  const shemagh = new THREE.Mesh(shemaghGeo, materials.clothShemagh);
  shemagh.rotation.x = Math.PI / 2;
  shemagh.position.y = 1.28;
  group.add(shemagh);

  // Belt with Janbiya (Traditional Dagger)
  const beltGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.15, 8);
  const belt = new THREE.Mesh(beltGeo, beltMat);
  belt.position.y = 0.6;
  group.add(belt);

  // Janbiya Handle
  const hiltGeo = new THREE.BoxGeometry(0.06, 0.15, 0.06);
  const hilt = new THREE.Mesh(hiltGeo, materials.metalSteel);
  hilt.position.set(0, 0.65, 0.28);
  hilt.rotation.x = -0.2;
  group.add(hilt);

  return group;
}
