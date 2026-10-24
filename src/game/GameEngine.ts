import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  FighterAction,
  FighterInstance,
  GameStats,
  GeographicInfo,
  HistoricalEraId,
  TacticalNotification,
  TerrainDeformationDelta,
} from '../types/game';
import { sound } from './audio';
import {
  createAcaciaTreeMesh,
  createRockClusterMesh,
  createYemeniFighterMesh,
} from './proceduralModels';
import { YemenTerrainSystem } from './terrainSystem';
import { FighterController } from './FighterController';

export class GameEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public terrainSystem: YemenTerrainSystem;

  // Fighter Entities
  public fighters: Map<string, FighterInstance> = new Map();
  private fighterControllers: Map<string, FighterController> = new Map();
  private fighterMeshes: Map<string, THREE.Group> = new Map();

  // Raycaster & Interaction
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer: THREE.Vector2 = new THREE.Vector2();

  // Selection State (Legacy RTS but keeping for now)
  public activeTool: string = 'select';
  public currentHoveredGeo: GeographicInfo | null = null;

  // Stats & Callbacks
  public stats: GameStats = {
    unitsKilled: 0,
    buildingsDestroyed: 0,
    terrainDeformedCount: 0,
    trenchesDug: 0,
    resourcesHarvested: 0,
    combosMax: 0,
    knockouts: 0,
  };
  public selectedEra: HistoricalEraId = 'modern_tactical';
  public onNotification?: (notification: TacticalNotification) => void;
  public onStateChange?: () => void;
  public onMultiplayerDelta?: (delta: TerrainDeformationDelta) => void;

  // Camera Control State
  private cameraTarget: THREE.Vector3 = new THREE.Vector3(0, 1.8, 0);
  public cameraSpherical: { radius: number; phi: number; theta: number } = {
    radius: 25,
    phi: Math.PI / 2.8,
    theta: 0,
  };
  public cameraShake: number = 0;
  public menuMode: boolean = true;

  // Animation Loop & Timing
  private lastTime: number = 0;
  private animationFrameId: number = 0;
  private isDestroyed: boolean = false;

  constructor(private container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd2be9e); // Warm Yemeni arid sky
    this.scene.fog = new THREE.FogExp2(0xd2be9e, 0.0038);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 1000);
    this.updateCameraPosition();

    // Check software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Environment lighting
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const ambientLight = new THREE.HemisphereLight(0xffecd0, 0x5a4835, 0.85);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6dd, 1.4);
    sunLight.position.set(45, 65, 35);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 2048;
    this.scene.add(sunLight);

    // Terrain
    this.terrainSystem = new YemenTerrainSystem();
    this.scene.add(this.terrainSystem.mesh);

    // Populate environmental props
    this.populateNatureProps();

    // Spawn initial fighters
    this.spawnFighter('player', -5, 5);
    this.spawnFighter('enemy', 5, -5);

    // Start render loop
    this.lastTime = performance.now();
    this.tick();

    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private updateCameraPosition() {
    const { radius, phi, theta } = this.cameraSpherical;
    const x = this.cameraTarget.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = this.cameraTarget.y + radius * Math.cos(phi);
    const z = this.cameraTarget.z + radius * Math.sin(phi) * Math.cos(theta);

    let shakeX = 0;
    let shakeY = 0;
    if (this.cameraShake > 0.01) {
      shakeX = (Math.random() - 0.5) * this.cameraShake;
      shakeY = (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake *= 0.9;
    }

    this.camera.position.set(x + shakeX, y + shakeY, z);
    this.camera.lookAt(this.cameraTarget);
  }

  private populateNatureProps() {
    for (let i = 0; i < 20; i++) {
      const rx = (Math.random() - 0.5) * 80;
      const rz = (Math.random() - 0.5) * 80;
      const ry = this.terrainSystem.getHeightAt(rx, rz);
      const tree = createAcaciaTreeMesh();
      tree.position.set(rx, ry, rz);
      this.scene.add(tree);
    }
    for (let i = 0; i < 30; i++) {
      const rx = (Math.random() - 0.5) * 100;
      const rz = (Math.random() - 0.5) * 100;
      const ry = this.terrainSystem.getHeightAt(rx, rz);
      const rocks = createRockClusterMesh();
      rocks.position.set(rx, ry, rz);
      this.scene.add(rocks);
    }
  }

  public spawnFighter(faction: 'player' | 'enemy', x: number, z: number): FighterInstance {
    const id = `fighter_${faction}_${Date.now()}`;
    const mesh = createYemeniFighterMesh(faction);
    const y = this.terrainSystem.getHeightAt(x, z);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    this.fighterMeshes.set(id, mesh);

    const fighter: FighterInstance = {
      id,
      nameAr: faction === 'player' ? 'صقر اليمن' : 'المنافس',
      faction,
      x,
      z,
      y,
      rotation: 0,
      hp: 1000,
      maxHp: 1000,
      energy: 100,
      maxEnergy: 100,
      state: 'idle',
      stateTime: 0,
      score: 0,
      comboCount: 0,
    };

    this.fighters.set(id, fighter);
    
    if (faction === 'player') {
      const controller = new FighterController(fighter, mesh);
      this.fighterControllers.set(id, controller);
    }

    return fighter;
  }

  private tick = () => {
    if (this.isDestroyed) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    if (this.menuMode) {
      // Cinematic Sweep
      this.cameraSpherical.theta += dt * 0.1;
      this.cameraSpherical.radius = 35 + Math.sin(now * 0.0005) * 5;
      this.cameraTarget.set(0, 5, 0);
      this.updateCameraPosition();
    }

    // Fighter Logic
    this.fighterControllers.forEach((ctrl) => {
      const h = this.terrainSystem.getHeightAt(ctrl.fighter.x, ctrl.fighter.z);
      ctrl.update(dt, h);

      // Camera Follow Player
      if (ctrl.fighter.faction === 'player' && !this.menuMode) {
        this.cameraTarget.lerp(new THREE.Vector3(ctrl.fighter.x, ctrl.fighter.y + 1.8, ctrl.fighter.z), 0.15);
        this.cameraSpherical.radius = THREE.MathUtils.lerp(this.cameraSpherical.radius, 10, 0.05);
        this.cameraSpherical.phi = THREE.MathUtils.lerp(this.cameraSpherical.phi, Math.PI / 2.3, 0.05);
        this.updateCameraPosition();
      }
    });

    // Enemy AI (Basic)
    this.fighters.forEach((f) => {
      if (f.faction === 'enemy' && f.state !== 'ko') {
        const player = Array.from(this.fighters.values()).find(p => p.faction === 'player');
        if (player) {
          const dx = player.x - f.x;
          const dz = player.z - f.z;
          const dist = Math.hypot(dx, dz);
          if (dist > 1.8) {
            f.x += (dx / dist) * 3.5 * dt;
            f.z += (dz / dist) * 3.5 * dt;
            f.rotation = Math.atan2(dx, dz);
            f.state = 'move';
          } else {
            f.state = 'idle';
            if (Math.random() < 0.01) {
               const pCtrl = Array.from(this.fighterControllers.values()).find(c => c.fighter.faction === 'player');
               if (pCtrl) pCtrl.takeDamage(12);
            }
          }
          f.y = this.terrainSystem.getHeightAt(f.x, f.z);
          const mesh = this.fighterMeshes.get(f.id);
          if (mesh) {
            mesh.position.set(f.x, f.y, f.z);
            mesh.rotation.y = f.rotation;
          }
        }
      }
    });

    // Collision Check (Player attacks Enemy)
    const playerFighter = Array.from(this.fighters.values()).find(f => f.faction === 'player');
    if (playerFighter && (playerFighter.state === 'attack_light' || playerFighter.state === 'attack_heavy')) {
      this.fighters.forEach((enemy) => {
        if (enemy.faction === 'enemy' && enemy.state !== 'ko' && enemy.state !== 'hit_stun') {
          const dist = Math.hypot(playerFighter.x - enemy.x, playerFighter.z - enemy.z);
          if (dist < 2.0) {
            const damage = playerFighter.state === 'attack_light' ? 50 : 120;
            enemy.hp -= damage;
            enemy.state = 'hit_stun';
            enemy.stateTime = 0;
            this.cameraShake = 0.6;
            if (enemy.hp <= 0) {
              enemy.hp = 0;
              enemy.state = 'ko';
              this.stats.knockouts++;
            }
            if (this.onStateChange) this.onStateChange();
          }
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public setMenuMode(active: boolean) {
    this.menuMode = active;
    if (active) {
      this.cameraSpherical.radius = 35;
    }
  }

  public setPlayerMoveDir(x: number, z: number) {
    const pCtrl = Array.from(this.fighterControllers.values()).find(c => c.fighter.faction === 'player');
    if (pCtrl) pCtrl.setMoveDirection(x, z);
  }

  public triggerPlayerCombatAction(type: 'attack_light' | 'attack_heavy' | 'block') {
    const pCtrl = Array.from(this.fighterControllers.values()).find(c => c.fighter.faction === 'player');
    if (pCtrl) pCtrl.triggerCombatAction(type);
  }

  public triggerMilitarySkill(skillType: 'light_weapon' | 'heavy_weapon' | 'tank_support' | 'airstrike') {
    const player = Array.from(this.fighters.values()).find(f => f.faction === 'player');
    const enemy = Array.from(this.fighters.values()).find(f => f.faction === 'enemy');
    if (!player || !enemy || enemy.state === 'ko') return;

    let damage = 0;
    let skillNameAr = '';

    switch (skillType) {
      case 'light_weapon':
        damage = 90;
        skillNameAr = 'إطلاق رشاش خفيف مكثف';
        break;
      case 'heavy_weapon':
        damage = 180;
        skillNameAr = 'قذيفة آر بي جي ثقيلة مضادة للدروع';
        break;
      case 'tank_support':
        damage = 320;
        skillNameAr = 'ضربة دعم دبابة مدرعة';
        break;
      case 'airstrike':
        damage = 500;
        skillNameAr = 'غارة جوية شاملة لطائرة حربية';
        break;
    }

    enemy.hp -= damage;
    enemy.state = 'hit_stun';
    enemy.stateTime = 0;
    this.cameraShake = skillType === 'airstrike' ? 1.8 : (skillType === 'tank_support' ? 1.2 : 0.6);

    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.state = 'ko';
      this.stats.knockouts++;
    }

    if (this.onNotification) {
      this.onNotification({
        id: `mil_${Date.now()}`,
        text: `تم تفعيل المهارة الحربية: ${skillNameAr}!`,
        type: 'success',
        timestamp: Date.now(),
      });
    }

    if (this.onStateChange) this.onStateChange();
  }

  public stopPlayerBlock() {
    const pCtrl = Array.from(this.fighterControllers.values()).find(c => c.fighter.faction === 'player');
    if (pCtrl) pCtrl.stopBlock();
  }

  public getFightersList(): FighterInstance[] {
    return Array.from(this.fighters.values());
  }

  public dispose() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
