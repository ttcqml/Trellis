# Attack Skill Patterns

> Configuration patterns for attack-type skills.

---

## Attack Skill Overview

Attack skills are auto-triggered combat abilities. They fire automatically when:
- Cooldown is complete
- Target is in range
- Entity is not in special state (stunned, etc.)

---

## Basic Attack Patterns

### Single Target Melee

```gdscript
# Configuration
skill_type = SkillType.ATTACK
cooldown = 0.5
damage = 15
range = 50
animation = "attack_down"

# No bullet - direct damage
bullet_scene = null
```

**Use case**: Basic enemy swipe, player sword slash

### Single Projectile

```gdscript
# Configuration
skill_type = SkillType.ATTACK
cooldown = 0.8
damage = 12
bullet_scene = preload("res://Game_flowkit/Entity/Bullet/BasicBullet.tscn")
bullet_count = 1
bullet_speed = 200.0
animation = "attack_down"
```

**Use case**: Archer arrows, enemy fireballs

### Spread Shot

```gdscript
# Configuration
skill_type = SkillType.ATTACK
cooldown = 1.2
damage = 8
bullet_scene = preload("res://Game_flowkit/Entity/Bullet/BasicBullet.tscn")
bullet_count = 3
bullet_spread = 30.0  # degrees total
bullet_speed = 180.0
```

**Use case**: Shotgun attacks, fan attacks

### Rapid Fire

```gdscript
# Configuration
skill_type = SkillType.ATTACK
cooldown = 0.1  # Very fast
damage = 3       # Low per hit
bullet_scene = preload("res://Game_flowkit/Entity/Bullet/SmallBullet.tscn")
bullet_count = 1
bullet_speed = 400.0
```

**Use case**: Machine gun, bullet hell enemies

---

## Advanced Attack Patterns

### Homing Projectile

```gdscript
# Configuration
skill_type = SkillType.ATTACK
cooldown = 2.0
damage = 25
bullet_scene = preload("res://Game_flowkit/Entity/Bullet/HomingBullet.tscn")
bullet_count = 1
bullet_speed = 150.0

# Homing logic in bullet scene (MissileMotion component)
```

### Circle Attack

```gdscript
# Configuration
skill_type = SkillType.ATTACK
cooldown = 3.0
damage = 15
bullet_scene = preload("res://Game_flowkit/Entity/Bullet/CircleBullet.tscn")
bullet_count = 8      # 8 directions
bullet_spread = 360   # Full circle
bullet_speed = 100.0
```

**Use case**: Boss radial attacks

### Wave Attack

```gdscript
# Configuration
skill_type = SkillType.ATTACK
cooldown = 1.5
damage = 20
bullet_scene = preload("res://Game_flowkit/Entity/Bullet/WaveBullet.tscn")
bullet_count = 5      # 5 wave sections
bullet_spread = 180   # Half circle forward
bullet_speed = 80.0

# Bullets use SineMotion for wave pattern
```

---

## Attack Timing with Events

### Basic Attack Event

```gdscript
# SkillEvent configuration
events = [
    {
        "type": "AnimationEvent",
        "time": 0.0,
        "animation": "attack_wind_up"
    },
    {
        "type": "FireEvent",
        "time": 0.3,  # Fire at wind-up peak
        "fire_point": "BulletSpawn"
    },
    {
        "type": "AnimationEvent",
        "time": 0.3,
        "animation": "attack_follow_through"
    }
]
```

### Multi-Fire Attack

```gdscript
# SkillEvent configuration for burst fire
events = [
    {
        "type": "AnimationEvent",
        "time": 0.0,
        "animation": "attack"
    },
    {
        "type": "FireEvent",
        "time": 0.1
    },
    {
        "type": "FireEvent",
        "time": 0.2
    },
    {
        "type": "FireEvent",
        "time": 0.3
    }
]
```

---

## Entity-Specific Patterns

### Player Attack Configuration

```gdscript
# Player typical setup
cooldown = 0.3-0.5  # Responsive
damage = 10-20      # Moderate
bullet_speed = 250+ # Fast projectiles

# Multiple attack skills possible
init_attack_skill_datas = [
    "res://SkillData/Player/Attack_Primary.tres",
    "res://SkillData/Player/Attack_Secondary.tres"
]
```

### Monster Attack Configuration

```gdscript
# Enemy typical setup
cooldown = 0.5-2.0  # Slower, predictable
damage = 5-15       # Lower than player
bullet_speed = 100-200  # Dodgeable

# Usually single attack
init_attack_skill_datas = [
    "res://SkillData/Monster/Attack_Basic.tres"
]
```

### Boss Attack Configuration

```gdscript
# Boss typical setup
cooldown = 1.0-3.0  # Varied timing
damage = 20-50      # High damage
bullet_count = 3-8  # Multiple projectiles

# Multiple attack phases
init_attack_skill_datas = [
    "res://SkillData/Boss/Attack_Phase1.tres",
    "res://SkillData/Boss/Attack_Phase2.tres"
]
```

---

## Collision and Damage

### Setting Bullet Collision

```gdscript
# Player bullet hits enemies
collision_layer = 8   # Bullet layer
collision_mask = 2    # Monster layer

# Enemy bullet hits player
collision_layer = 8   # Bullet layer
collision_mask = 1    # Player layer
```

### Damage Application

Damage is applied when bullet collides with valid target:
1. Bullet detects collision via Area2D
2. Bullet checks target faction
3. Damage is applied to target health
4. Bullet is destroyed (usually)

---

## Forbidden Patterns

1. **Never** set cooldown < 0.05 (causes performance issues)
2. **Never** use null bullet for ranged attacks
3. **Never** set bullet_count > 20 without optimization
4. **Never** forget to set bullet collision layers
5. **Never** apply damage directly (use damage system)

---

## Debugging Attack Skills

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No damage | Wrong collision mask | Check bullet collision |
| No projectile | Null bullet_scene | Assign bullet scene |
| Infinite attacks | Cooldown = 0 | Set positive cooldown |
| Hits self | Self in collision mask | Remove own layer |

### Testing Checklist

- [ ] Cooldown feels right
- [ ] Damage is balanced
- [ ] Projectiles reach intended range
- [ ] Collision detection works
- [ ] Animation timing matches
