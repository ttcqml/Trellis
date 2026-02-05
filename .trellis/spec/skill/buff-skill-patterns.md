# Buff and Passive Skill Patterns

> Configuration patterns for buff effects and passive abilities.

---

## Buff System Overview

Buffs are temporary effects that modify entity attributes. They use:
- **BuffData** resources for configuration
- **RoleBuffComponent** for application
- **Halo skills** for aura-based effects

---

## BuffData Structure

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `buff_name` | String | Display name |
| `buff_id` | int | Unique identifier |
| `buff_type` | BuffType | Effect category |
| `duration` | float | Effect duration (-1 = infinite) |
| `stack_count` | int | Maximum stacks |
| `value` | float | Effect magnitude |

### Buff Types

| Type | Effect | Example |
|------|--------|---------|
| `STAT_MODIFIER` | Modify stats | +10% ATK |
| `DOT` | Damage over time | Poison |
| `HOT` | Heal over time | Regeneration |
| `SHIELD` | Damage absorption | Barrier |
| `STUN` | Disable actions | Freeze |
| `SLOW` | Reduce speed | Chill |

---

## Buff Patterns

### Stat Buff

```gdscript
# Attack boost buff
buff_name = "Attack Up"
buff_type = BuffType.STAT_MODIFIER
duration = 10.0
value = 0.25  # +25% attack
stat_target = "attack"
```

### Speed Buff

```gdscript
# Movement speed buff
buff_name = "Haste"
buff_type = BuffType.STAT_MODIFIER
duration = 5.0
value = 0.5  # +50% speed
stat_target = "speed"
```

### Damage Over Time

```gdscript
# Poison debuff
buff_name = "Poison"
buff_type = BuffType.DOT
duration = 8.0
value = 5  # 5 damage per tick
tick_rate = 1.0  # Every second
```

### Shield Buff

```gdscript
# Damage shield
buff_name = "Barrier"
buff_type = BuffType.SHIELD
duration = 15.0
value = 50  # Absorbs 50 damage
```

---

## Passive Skill Patterns

### Passive Overview

Passives are permanent effects that don't require activation. They use:
- **PassiveData** resources
- **RolePassiveComponent** for management

### Common Passive Types

| Type | Effect | Example |
|------|--------|---------|
| `ON_HIT` | Trigger on dealing damage | Life steal |
| `ON_DAMAGED` | Trigger on receiving damage | Thorns |
| `ON_KILL` | Trigger on kill | Soul harvest |
| `AURA` | Constant area effect | Attack aura |
| `STAT_BONUS` | Permanent stat increase | +10 HP |

### Life Steal Passive

```gdscript
# Configuration
passive_name = "Vampirism"
passive_type = PassiveType.ON_HIT
trigger_chance = 1.0  # 100%
value = 0.1  # Heal 10% of damage dealt
```

### Thorns Passive

```gdscript
# Configuration
passive_name = "Thorns"
passive_type = PassiveType.ON_DAMAGED
trigger_chance = 1.0
value = 0.2  # Reflect 20% damage
```

### Kill Bonus Passive

```gdscript
# Configuration
passive_name = "Soul Harvest"
passive_type = PassiveType.ON_KILL
trigger_chance = 1.0
value = 5  # +5 HP per kill
max_stacks = 10
```

---

## Halo (Aura) Skill Patterns

### Halo Overview

Halo skills are passive area effects. They continuously affect:
- The caster (self buffs)
- Nearby allies (support auras)
- Nearby enemies (debuff auras)

### Self Buff Aura

```gdscript
# Configuration
skill_name = "Inner Fire"
skill_type = SkillType.HALO
range = 0  # Self only
duration = -1  # Permanent
effects = [
    {"type": "attack", "value": 0.1}  # +10% ATK
]
```

### Support Aura

```gdscript
# Configuration
skill_name = "Inspiring Presence"
skill_type = SkillType.HALO
range = 200
duration = -1
target_faction = "ally"
effects = [
    {"type": "defense", "value": 0.15}  # +15% DEF
]
```

### Debuff Aura

```gdscript
# Configuration
skill_name = "Weakening Aura"
skill_type = SkillType.HALO
range = 150
duration = -1
target_faction = "enemy"
effects = [
    {"type": "speed", "value": -0.2}  # -20% speed
]
```

### Damage Aura

```gdscript
# Configuration
skill_name = "Fire Aura"
skill_type = SkillType.HALO
range = 100
duration = -1
target_faction = "enemy"
tick_rate = 0.5
damage_per_tick = 3
```

---

## Applying Buffs and Passives

### Via FlowKit Behavior

```python
# Adding buff to entity
await call_tool(ws, "UpdateBehaviorInputsInScene", {
    "scene_path": "res://RequirementImp/Player/Hero.tscn",
    "node_path": ".",
    "behavior_id": "skill_box",
    "inputs": {
        "init_halo_skill_datas": [
            "res://SkillData/Player/Halo_AttackBoost.tres"
        ]
    }
})
```

### Via Role Properties

```gdscript
# Entity export properties
@export var buff: Array[BuffData] = []
@export var passive: Array[PassiveData] = []
```

---

## Buff Stacking Rules

### Stack Behavior

| Rule | Description | Example |
|------|-------------|---------|
| `REPLACE` | New buff replaces old | Higher rank buff |
| `REFRESH` | Reset duration | Same buff reapplied |
| `STACK` | Add stacks up to max | Poison stacks |
| `SEPARATE` | Independent instances | Multiple sources |

### Implementation

```gdscript
# Stack configuration
stack_behavior = StackBehavior.STACK
max_stacks = 5
value_per_stack = 0.05  # 5% per stack
# Maximum: 25% at 5 stacks
```

---

## Balancing Guidelines

### Buff Duration

| Buff Type | Recommended Duration |
|-----------|---------------------|
| Combat boost | 5-15 seconds |
| Defensive | 3-10 seconds |
| Movement | 3-8 seconds |
| Debuff | 2-5 seconds |
| DOT | 4-10 seconds |

### Buff Values

| Effect | Weak | Normal | Strong |
|--------|------|--------|--------|
| Stat % | 5-10% | 15-25% | 30-50% |
| DOT/tick | 2-5 | 5-15 | 15-30 |
| Shield | 20-50 | 50-100 | 100-200 |
| Slow | 10-20% | 25-40% | 50%+ |

---

## Forbidden Patterns

1. **Never** create infinite DOT without kill mechanism
2. **Never** stack debuffs without cap
3. **Never** allow buff abuse through rapid reapplication
4. **Never** forget to clear buffs on entity death
5. **Never** apply buffs to wrong faction

---

## Best Practices

1. Always show buff indicators to player
2. Use distinct visuals for buffs vs debuffs
3. Balance risk/reward for powerful buffs
4. Test buff interactions with all entities
5. Document buff formulas for balance tuning
