import * as THREE from 'three';
import { FighterAction, FighterInstance } from '../types/game';

export class FighterController {
  private keys: Record<string, boolean> = {};
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private direction: THREE.Vector3 = new THREE.Vector3();
  private moveSpeed: number = 6.5;
  private turnSpeed: number = 10.0;

  // External input support for virtual controls
  private externalMoveDir: THREE.Vector2 = new THREE.Vector2(0, 0);

  constructor(public fighter: FighterInstance, private mesh: THREE.Group) {
    this.bindInputs();
  }

  private bindInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.handleCombatInput(e.key.toLowerCase());
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  // Public API for Virtual HUD
  public setMoveDirection(x: number, y: number) {
    this.externalMoveDir.set(x, y);
  }

  public triggerCombatAction(type: 'attack_light' | 'attack_heavy' | 'block') {
    if (this.fighter.state === 'hit_stun' || this.fighter.state === 'ko') return;

    if (type === 'block') {
      this.fighter.state = 'block';
      this.fighter.stateTime = 0;
      this.keys['l'] = true; // Simulate key for block persistence
    } else {
      this.setAttack(type);
    }
  }

  public stopBlock() {
    if (this.fighter.state === 'block') {
      this.fighter.state = 'idle';
      this.keys['l'] = false;
    }
  }

  private handleCombatInput(key: string) {
    if (this.fighter.state === 'hit_stun' || this.fighter.state === 'ko') return;

    if (key === 'j') {
      this.setAttack('attack_light');
    } else if (key === 'k') {
      this.setAttack('attack_heavy');
    } else if (key === 'l') {
      this.fighter.state = 'block';
      this.fighter.stateTime = 0;
    }
  }

  private setAttack(type: FighterAction) {
    if (this.fighter.state === 'idle' || this.fighter.state === 'move') {
      this.fighter.state = type;
      this.fighter.stateTime = 0;
    }
  }

  public update(dt: number, terrainHeight: number) {
    if (this.fighter.state === 'ko') return;

    // State Time Management
    this.fighter.stateTime += dt;

    // Reset combat states if animation finished
    if (this.fighter.state === 'attack_light' && this.fighter.stateTime > 0.4) {
      this.fighter.state = 'idle';
    } else if (this.fighter.state === 'attack_heavy' && this.fighter.stateTime > 0.6) {
      this.fighter.state = 'idle';
    } else if (this.fighter.state === 'hit_stun' && this.fighter.stateTime > 0.5) {
      this.fighter.state = 'idle';
    } else if (this.fighter.state === 'block' && !this.keys['l']) {
      this.fighter.state = 'idle';
    }

    // Movement Logic
    if (this.fighter.state === 'idle' || this.fighter.state === 'move') {
      this.direction.set(0, 0, 0);

      // Combine Keyboard and External (Joystick) Input
      if (this.keys['w'] || this.keys['arrowup']) this.direction.z -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) this.direction.z += 1;
      if (this.keys['a'] || this.keys['arrowleft']) this.direction.x -= 1;
      if (this.keys['d'] || this.keys['arrowright']) this.direction.x += 1;

      // Add virtual joystick influence
      if (this.externalMoveDir.lengthSq() > 0.01) {
        this.direction.x += this.externalMoveDir.x;
        this.direction.z += this.externalMoveDir.y;
      }

      if (this.direction.lengthSq() > 0.01) {
        this.direction.normalize();
        this.fighter.state = 'move';
        
        // Update rotation
        const targetRotation = Math.atan2(this.direction.x, this.direction.z);
        this.fighter.rotation = THREE.MathUtils.lerp(
          this.fighter.rotation,
          targetRotation,
          this.turnSpeed * dt
        );

        // Update position
        this.fighter.x += this.direction.x * this.moveSpeed * dt;
        this.fighter.z += this.direction.z * this.moveSpeed * dt;
      } else {
        this.fighter.state = 'idle';
      }
    }

    // Grounding
    this.fighter.y = terrainHeight;
    this.mesh.position.set(this.fighter.x, this.fighter.y, this.fighter.z);
    this.mesh.rotation.y = this.fighter.rotation;

    // Visual Animation Logic
    if (this.fighter.state === 'move') {
      const wobble = Math.sin(performance.now() * 0.015) * 0.05;
      this.mesh.scale.set(1, 1 + wobble, 1);
    } else if (this.fighter.state === 'attack_light') {
      this.mesh.scale.set(1.2, 0.8, 1.2);
    } else if (this.fighter.state === 'attack_heavy') {
      this.mesh.scale.set(0.8, 1.3, 0.8);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }
  }

  public takeDamage(amount: number) {
    if (this.fighter.state === 'block') {
      this.fighter.hp -= amount * 0.15;
    } else {
      this.fighter.hp -= amount;
      this.fighter.state = 'hit_stun';
      this.fighter.stateTime = 0;
    }

    if (this.fighter.hp <= 0) {
      this.fighter.hp = 0;
      this.fighter.state = 'ko';
    }
  }
}
