import * as THREE from 'three';
import { GeographicInfo, GeographicZoneType, TerrainDeformationDelta } from '../types/game';

// Multi-octave Perlin-like pseudo noise generator
function pseudoNoise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;

  // Cubic Hermite curve
  const u = fx * fx * (3.0 - 2.0 * fx);
  const v = fy * fy * (3.0 - 2.0 * fy);

  const n00 = pseudoNoise2D(i, j);
  const n10 = pseudoNoise2D(i + 1, j);
  const n01 = pseudoNoise2D(i, j + 1);
  const n11 = pseudoNoise2D(i + 1, j + 1);

  return (
    n00 * (1 - u) * (1 - v) +
    n10 * u * (1 - v) +
    n01 * (1 - u) * v +
    n11 * u * v
  );
}

function fbm(x: number, y: number, octaves: number = 4): number {
  let val = 0;
  let freq = 1;
  let amp = 0.5;
  for (let o = 0; o < octaves; o++) {
    val += smoothNoise(x * freq, y * freq) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

export class YemenTerrainSystem {
  public mesh: THREE.Mesh;
  public geometry: THREE.PlaneGeometry;
  public material: THREE.MeshStandardMaterial;
  public size: number = 220;
  public segments: number = 110;
  private heightData: Float32Array;
  public onTerrainDeformed?: (delta: TerrainDeformationDelta) => void;

  constructor() {
    this.geometry = new THREE.PlaneGeometry(
      this.size,
      this.size,
      this.segments,
      this.segments
    );
    this.geometry.rotateX(-Math.PI / 2);

    const vertexCount = (this.segments + 1) * (this.segments + 1);
    this.heightData = new Float32Array(vertexCount);

    this.generateInitialYemenTopography();

    // Procedural terrain texture matching Yemeni geology
    const terrainTexture = this.generateProceduralTerrainTexture();
    this.material = new THREE.MeshStandardMaterial({
      map: terrainTexture,
      roughness: 0.9,
      metalness: 0.08,
      flatShading: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }

  // Generates Yemeni rugged mountains, wadis, terraces, and passes on a vast scale
  private generateInitialYemenTopography() {
    const pos = this.geometry.attributes.position;
    const count = pos.count;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Base mountainous elevation
      const nx = (x + this.size / 2) / this.size;
      const nz = (z + this.size / 2) / this.size;

      // Primary mountain range (جبال السروات وحراز)
      const mountainNoise = fbm(nx * 3.2, nz * 3.2, 5);
      let height = mountainNoise * 26;

      // Meandering deep Grand Wadi (وادي حضرموت الكبير والخوانق الوعرة)
      // Wadi center curve: x = sin(z * 0.035) * 36
      const wadiCenter = Math.sin(z * 0.035) * 36;
      const distToWadi = Math.abs(x - wadiCenter);
      const wadiWidth = 18;

      if (distToWadi < wadiWidth) {
        // Carve down deeply into canyon floor
        const wadiFactor = distToWadi / wadiWidth;
        const carve = (1.0 - Math.cos(wadiFactor * Math.PI)) * 0.5;
        height = height * carve * 0.32 + 1.2;
      } else {
        // Terraces on the mountain slopes (المدرجات الزراعية الحجرية)
        if (height > 7 && height < 20) {
          const stepSize = 2.0;
          height = Math.floor(height / stepSize) * stepSize + (height % stepSize) * 0.35;
        }
      }

      // Border cliffs to prevent units from falling off expansive map
      const edgeDist = Math.max(Math.abs(x), Math.abs(z));
      if (edgeDist > this.size * 0.43) {
        const edgeFactor = (edgeDist - this.size * 0.43) / (this.size * 0.07);
        height += edgeFactor * 20;
      }

      pos.setY(i, height);
      this.heightData[i] = height;
    }

    this.geometry.computeVertexNormals();
    pos.needsUpdate = true;
  }

  // Generates texture with basalt rocks, wadi sands, and mountain terraces
  private generateProceduralTerrainTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base Yemeni ochre mountain soil
    ctx.fillStyle = '#9b7c5b';
    ctx.fillRect(0, 0, 512, 512);

    // Terraced contour lines & rock strata
    for (let y = 0; y < 512; y += 16) {
      ctx.strokeStyle = y % 32 === 0 ? '#634b35' : '#bca282';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < 512; x += 32) {
        ctx.lineTo(x, y + Math.sin(x * 0.04) * 6);
      }
      ctx.stroke();
    }

    // Sandy wadi bed running through middle
    const gradient = ctx.createLinearGradient(160, 0, 350, 512);
    gradient.addColorStop(0, 'rgba(215, 185, 140, 0.45)');
    gradient.addColorStop(0.5, 'rgba(228, 205, 165, 0.65)');
    gradient.addColorStop(1, 'rgba(215, 185, 140, 0.45)');
    ctx.fillStyle = gradient;
    ctx.fillRect(140, 0, 220, 512);

    // Rock speckles and basalt noise
    for (let i = 0; i < 2000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const s = Math.random() * 2.5 + 1;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(50, 40, 35, 0.35)' : 'rgba(240, 230, 210, 0.3)';
      ctx.fillRect(rx, ry, s, s);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Bilinear interpolation for height at any (x, z)
  public getHeightAt(x: number, z: number): number {
    const half = this.size / 2;
    const gx = ((x + half) / this.size) * this.segments;
    const gz = ((z + half) / this.size) * this.segments;

    const ix = Math.floor(Math.max(0, Math.min(this.segments - 1, gx)));
    const iz = Math.floor(Math.max(0, Math.min(this.segments - 1, gz)));

    const fx = Math.max(0, Math.min(1, gx - ix));
    const fz = Math.max(0, Math.min(1, gz - iz));

    const stride = this.segments + 1;
    const h00 = this.heightData[iz * stride + ix];
    const h10 = this.heightData[iz * stride + (ix + 1)];
    const h01 = this.heightData[(iz + 1) * stride + ix];
    const h11 = this.heightData[(iz + 1) * stride + (ix + 1)];

    const top = h00 * (1 - fx) + h10 * fx;
    const btm = h01 * (1 - fx) + h11 * fx;
    return top * (1 - fz) + btm * fz;
  }

  // Calculate local slope angle in degrees
  public getSlopeAt(x: number, z: number): number {
    const delta = 1.0;
    const hL = this.getHeightAt(x - delta, z);
    const hR = this.getHeightAt(x + delta, z);
    const hU = this.getHeightAt(x, z - delta);
    const hD = this.getHeightAt(x, z + delta);

    const dx = (hR - hL) / (2 * delta);
    const dz = (hD - hU) / (2 * delta);
    const gradient = Math.sqrt(dx * dx + dz * dz);
    return Math.atan(gradient) * (180 / Math.PI);
  }

  // Geographic classification and tactical modifiers
  public getGeographicInfo(x: number, z: number): GeographicInfo {
    const elev = this.getHeightAt(x, z);
    const slope = this.getSlopeAt(x, z);

    let type: GeographicZoneType = 'plateau';
    let arabicName = 'هضبة صخرية منبسطة';
    let camouflageBonus = 0.1;
    let mobilityVehicleMultiplier = 1.0;
    let mobilityInfantryMultiplier = 1.0;
    let visionRangeMultiplier = 1.0;
    let description = 'أرض مفتوحة، سرعة عالية للمركبات ولكن مكشوفة تماماً للطيران والمدفعية.';

    if (elev < 4.5) {
      type = 'wadi_canyon';
      arabicName = 'بطن الوادي والخوانق الجبلية';
      camouflageBonus = 0.8; // High stealth against aerial/radar detection
      mobilityVehicleMultiplier = 1.15; // Fast along valley sand track
      mobilityInfantryMultiplier = 1.0;
      visionRangeMultiplier = 0.7; // Obstructed by canyon walls
      description = 'حماية قصوى من كشف الرادارات والدرونات، منطقة مثالية للكمائن المباغتة (+100% ضرر)، وضعف دفاعي تحت نيران القمم.';
    } else if (elev >= 14) {
      type = 'mountain_peak';
      arabicName = 'قمة جبلية شاهقة وحصن طبيعي';
      camouflageBonus = 0.6; // Rocky camouflage
      mobilityVehicleMultiplier = slope > 30 ? 0.15 : 0.45; // Heavy vehicles struggle
      mobilityInfantryMultiplier = 0.85; // Infantry can climb
      visionRangeMultiplier = 1.75; // Superior observation vantage point
      description = 'أفضلية استراتيجية عليا للرصد ومدى القنص والمدفعية (+75%)، وصعوبة بالغة في صعود الآليات الثقيلة.';
    } else if (slope > 18) {
      type = 'terrace';
      arabicName = 'مدرجات زراعية صخرية حجرية';
      camouflageBonus = 0.45;
      mobilityVehicleMultiplier = 0.55;
      mobilityInfantryMultiplier = 0.9;
      visionRangeMultiplier = 1.1;
      description = 'جدران استنادية حجرية توفر سواتر ممتازة للمشاة، وحركة متدرجة للمركبات.';
    }

    return {
      type,
      arabicName,
      elevation: Math.round(elev * 10) / 10,
      slope: Math.round(slope),
      camouflageBonus,
      mobilityVehicleMultiplier,
      mobilityInfantryMultiplier,
      visionRangeMultiplier,
      description,
    };
  }

  // Interactive terrain modification (dig trench, build barricade, flatten, artillery crater)
  public deformTerrain(
    centerX: number,
    centerZ: number,
    radius: number,
    deltaHeight: number,
    type: 'crater' | 'trench' | 'barricade' | 'flatten'
  ): TerrainDeformationDelta {
    const pos = this.geometry.attributes.position;
    const count = pos.count;
    const targetHeight = this.getHeightAt(centerX, centerZ);

    for (let i = 0; i < count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const dist = Math.hypot(vx - centerX, vz - centerZ);

      if (dist <= radius) {
        const factor = 1.0 - dist / radius; // Linear falloff
        const smoothFactor = factor * factor * (3.0 - 2.0 * factor); // Smooth bell curve
        const currentY = pos.getY(i);

        let newY = currentY;
        if (type === 'flatten') {
          newY = THREE.MathUtils.lerp(currentY, targetHeight, smoothFactor * 0.8);
        } else if (type === 'crater') {
          // Central bowl crater with slight raised rim
          if (factor > 0.3) {
            newY = currentY - Math.abs(deltaHeight) * (factor - 0.3) * 1.5;
          } else {
            newY = currentY + Math.abs(deltaHeight) * 0.25 * (1 - factor);
          }
        } else if (type === 'trench') {
          // Trench: deepen trench channel
          newY = currentY - Math.abs(deltaHeight) * smoothFactor;
        } else if (type === 'barricade') {
          // Barricade: elevate stone rampart
          newY = currentY + Math.abs(deltaHeight) * smoothFactor;
        }

        // Clamp minimum and maximum terrain heights
        newY = Math.max(0.2, Math.min(32, newY));
        pos.setY(i, newY);
        this.heightData[i] = newY;
      }
    }

    this.geometry.computeVertexNormals();
    pos.needsUpdate = true;

    const delta: TerrainDeformationDelta = {
      x: centerX,
      z: centerZ,
      radius,
      deltaHeight,
      type,
      timestamp: Date.now(),
    };

    if (this.onTerrainDeformed) {
      this.onTerrainDeformed(delta);
    }

    return delta;
  }
}
