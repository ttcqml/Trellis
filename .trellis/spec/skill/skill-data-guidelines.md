# SkillData Resource Guidelines

> Structure and configuration of SkillData resources.

---

## SkillData Resource Structure

SkillData is a Godot Resource that defines skill properties and behavior.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `skill_name` | String | Display name |
| `skill_id` | int | Unique identifier |
| `skill_type` | SkillType | Attack/Normal/Halo |
| `cooldown` | float | Seconds between uses |
| `damage` | int | Base damage value |
| `duration` | float | Effect duration |
| `range` | float | Skill range |

### Projectile Properties

| Property | Type | Description |
|----------|------|-------------|
| `bullet_scene` | PackedScene | Projectile scene |
| `bullet_count` | int | Projectiles per cast |
| `bullet_spread` | float | Spread angle |
| `bullet_speed` | float | Projectile speed |

### Event Properties

| Property | Type | Description |
|----------|------|-------------|
| `events` | Array[SkillEvent] | Skill timeline events |
| `animation` | String | Animation to play |

---

## Creating SkillData Resources

### Via GDScript

```gdscript
var skill = SkillData.new()
skill.skill_name = "Fireball"
skill.skill_id = 1001
skill.skill_type = SkillType.ATTACK
skill.cooldown = 1.0
skill.damage = 25
skill.bullet_scene = preload("res://Game_flowkit/Entity/Bullet/FireBullet.tscn")
skill.bullet_count = 1
skill.bullet_speed = 200.0
```

### Via Resource Editor

1. Create new `.tres` file
2. Set type to SkillData
3. Configure properties in Inspector
4. Save to appropriate directory

---

## Skill Types

### Attack Skills

```gdscript
# Auto-fire, no input required
skill_type = SkillType.ATTACK

# Configuration
cooldown = 0.5  # Attack rate
damage = 10     # Per hit
```

### Normal Skills

```gdscript
# Triggered by input or event
skill_type = SkillType.NORMAL

# Configuration
cooldown = 5.0  # Longer cooldown
damage = 50     # Higher damage
```

### Halo Skills

```gdscript
# Passive, always active
skill_type = SkillType.HALO

# Configuration
duration = -1   # Infinite
range = 100     # Effect radius
```

---

## Skill Configuration Examples

### Basic Melee Attack

```gdscript
skill_name = "Slash"
skill_type = SkillType.ATTACK
cooldown = 0.3
damage = 15
range = 50
animation = "attack"
# No bullet - melee range
```

### Ranged Projectile

```gdscript
skill_name = "Arrow Shot"
skill_type = SkillType.ATTACK
cooldown = 0.5
damage = 10
bullet_scene = "res://Game_flowkit/Entity/Bullet/Arrow.tscn"
bullet_count = 1
bullet_speed = 300.0
animation = "attack"
```

### Multi-Shot

```gdscript
skill_name = "Spread Shot"
skill_type = SkillType.ATTACK
cooldown = 1.0
damage = 8
bullet_scene = "res://Game_flowkit/Entity/Bullet/Arrow.tscn"
bullet_count = 3
bullet_spread = 30.0  # degrees
bullet_speed = 250.0
```

### AOE Skill

```gdscript
skill_name = "Explosion"
skill_type = SkillType.NORMAL
cooldown = 8.0
damage = 100
range = 150
animation = "cast"
# AOE logic in events
```

### Buff Aura

```gdscript
skill_name = "Attack Boost"
skill_type = SkillType.HALO
duration = -1
range = 200
# Buff application in events
```

---

## Resource Organization

### Naming Convention

```
[SkillType]_[EntityType]_[Name].tres

Examples:
- Attack_Player_BasicSlash.tres
- Normal_Player_Fireball.tres
- Halo_Player_HealAura.tres
- Attack_Monster_Bite.tres
```

### Directory Structure

```
SkillData/
├── Player/
│   ├── Attacks/
│   │   ├── Attack_Player_Slash.tres
│   │   └── Attack_Player_Shot.tres
│   ├── Skills/
│   │   └── Normal_Player_Fireball.tres
│   └── Halos/
│       └── Halo_Player_Shield.tres
├── Monster/
│   ├── Slime/
│   └── Boss/
└── Shared/
```

---

## Assigning Skills to Entities

### Via FlowKit Behavior

```python
await call_tool(ws, "UpdateBehaviorInputsInScene", {
    "scene_path": "res://RequirementImp/Player/Hero.tscn",
    "node_path": ".",
    "behavior_id": "skill_box",
    "inputs": {
        "init_attack_skill_datas": [
            "res://Game_flowkit/Resources/SkillData/Player/Attack_Slash.tres"
        ],
        "init_skill_datas": [
            "res://Game_flowkit/Resources/SkillData/Player/Normal_Fireball.tres"
        ],
        "init_halo_skill_datas": [
            "res://Game_flowkit/Resources/SkillData/Player/Halo_Shield.tres"
        ]
    }
})
```

---

## Balancing Guidelines

### Cooldown vs Damage

| Attack Speed | Cooldown | Damage Multiplier |
|--------------|----------|-------------------|
| Very Fast | 0.2-0.3s | 0.5x |
| Fast | 0.3-0.5s | 0.75x |
| Normal | 0.5-1.0s | 1.0x |
| Slow | 1.0-2.0s | 1.5x |
| Very Slow | 2.0s+ | 2.0x+ |

### Range vs Damage

| Range Type | Distance | Damage Adjustment |
|------------|----------|-------------------|
| Melee | 30-50 | Base |
| Short | 50-100 | -10% |
| Medium | 100-200 | -20% |
| Long | 200+ | -30% |

---

## Forbidden Patterns

1. **Never** set cooldown to 0 (infinite loop)
2. **Never** use negative damage (use heal system)
3. **Never** leave bullet_scene null for ranged skills
4. **Never** duplicate skill_id values
5. **Never** hardcode resource paths

---

## Best Practices

1. Start with base damage and adjust by cooldown
2. Test skills in isolation before integration
3. Use consistent naming conventions
4. Document skill purpose and usage
5. Version skill resources for balance changes
