# Skill Event Guidelines

> Timing and triggers for skill execution.

---

## Skill Event System Overview

Skills execute through a timeline of events. Events control:
- Animation playback
- Projectile firing
- Sound effects
- Visual effects
- Damage timing

---

## Event Types

### AnimationEvent

Triggers animation playback on the entity.

```gdscript
{
    "type": "AnimationEvent",
    "time": 0.0,              # Seconds from skill start
    "animation": "attack_down" # Animation name
}
```

### FireEvent

Spawns projectile(s) at the specified time.

```gdscript
{
    "type": "FireEvent",
    "time": 0.3,              # Fire timing
    "fire_point": "BulletSpawn"  # Node path for spawn position (optional)
}
```

### SoundEvent

Plays sound effect.

```gdscript
{
    "type": "SoundEvent",
    "time": 0.2,
    "sound": "res://Audio/SFX/attack_swing.wav"
}
```

### EffectEvent

Spawns visual effect.

```gdscript
{
    "type": "EffectEvent",
    "time": 0.3,
    "effect": "res://Effects/Impact.tscn",
    "position": "local"  # or "target"
}
```

### DamageEvent

Applies direct damage (melee attacks).

```gdscript
{
    "type": "DamageEvent",
    "time": 0.3,
    "damage": 25,
    "range": 50
}
```

### BuffEvent

Applies buff to self or target.

```gdscript
{
    "type": "BuffEvent",
    "time": 0.0,
    "buff": "res://Buffs/AttackBoost.tres",
    "target": "self"  # or "enemy" or "ally"
}
```

---

## Event Timeline Examples

### Basic Melee Attack

```gdscript
events = [
    {"type": "AnimationEvent", "time": 0.0, "animation": "attack_windup"},
    {"type": "SoundEvent", "time": 0.1, "sound": "swing.wav"},
    {"type": "DamageEvent", "time": 0.25, "damage": 20, "range": 50},
    {"type": "EffectEvent", "time": 0.25, "effect": "SlashEffect.tscn"},
    {"type": "AnimationEvent", "time": 0.3, "animation": "attack_recovery"}
]
# Total duration: ~0.5s
```

### Ranged Projectile

```gdscript
events = [
    {"type": "AnimationEvent", "time": 0.0, "animation": "shoot_prepare"},
    {"type": "SoundEvent", "time": 0.2, "sound": "bowdraw.wav"},
    {"type": "AnimationEvent", "time": 0.25, "animation": "shoot_release"},
    {"type": "FireEvent", "time": 0.3},
    {"type": "SoundEvent", "time": 0.3, "sound": "arrow_release.wav"}
]
# Total duration: ~0.4s
```

### Multi-Shot Burst

```gdscript
events = [
    {"type": "AnimationEvent", "time": 0.0, "animation": "attack"},
    {"type": "FireEvent", "time": 0.1},
    {"type": "SoundEvent", "time": 0.1, "sound": "shot.wav"},
    {"type": "FireEvent", "time": 0.2},
    {"type": "SoundEvent", "time": 0.2, "sound": "shot.wav"},
    {"type": "FireEvent", "time": 0.3},
    {"type": "SoundEvent", "time": 0.3, "sound": "shot.wav"}
]
# 3 shots in 0.3s
```

### Charged Attack

```gdscript
events = [
    {"type": "AnimationEvent", "time": 0.0, "animation": "charge_start"},
    {"type": "SoundEvent", "time": 0.0, "sound": "charge_loop.wav"},
    {"type": "EffectEvent", "time": 0.0, "effect": "ChargeAura.tscn"},
    {"type": "AnimationEvent", "time": 1.0, "animation": "charge_release"},
    {"type": "FireEvent", "time": 1.1},
    {"type": "SoundEvent", "time": 1.1, "sound": "charge_release.wav"},
    {"type": "EffectEvent", "time": 1.1, "effect": "ChargeImpact.tscn"}
]
# 1 second charge time
```

### Self-Buff Skill

```gdscript
events = [
    {"type": "AnimationEvent", "time": 0.0, "animation": "cast"},
    {"type": "SoundEvent", "time": 0.2, "sound": "buff_activate.wav"},
    {"type": "EffectEvent", "time": 0.3, "effect": "BuffAura.tscn"},
    {"type": "BuffEvent", "time": 0.3, "buff": "AttackBoost.tres", "target": "self"},
    {"type": "AnimationEvent", "time": 0.5, "animation": "idle"}
]
```

---

## Timing Guidelines

### Attack Feel

| Attack Speed | Wind-up | Hit Frame | Recovery |
|--------------|---------|-----------|----------|
| Very Fast | 0.05s | 0.1s | 0.05s |
| Fast | 0.1s | 0.2s | 0.1s |
| Normal | 0.15s | 0.3s | 0.15s |
| Slow | 0.3s | 0.5s | 0.2s |
| Heavy | 0.5s | 0.8s | 0.3s |

### Ranged Timing

| Type | Prepare | Fire | Recovery |
|------|---------|------|----------|
| Quick shot | 0.1s | 0.15s | 0.05s |
| Aimed shot | 0.3s | 0.4s | 0.1s |
| Charged | 0.5-1.0s | +0.1s | 0.2s |

---

## Animation Coordination

### Animation States

```
idle → attack_windup → attack_active → attack_recovery → idle
```

### Animation Naming Convention

| Animation | Purpose |
|-----------|---------|
| `attack_down` | Attack facing down |
| `attack_up` | Attack facing up |
| `attack_side` | Attack facing sideways |
| `cast` | Spell casting |
| `charge` | Charging attack |
| `hurt` | Taking damage |
| `death` | Death animation |

### Directional Attacks

```gdscript
# Dynamic animation based on facing
func get_attack_animation():
    match facing_direction:
        Vector2.DOWN: return "attack_down"
        Vector2.UP: return "attack_up"
        Vector2.LEFT, Vector2.RIGHT: return "attack_side"
```

---

## Event Coordination

### Synchronizing Audio

```gdscript
# Audio should match visual impact
events = [
    {"type": "AnimationEvent", "time": 0.0, "animation": "attack"},
    # Sound slightly before visual for perceived sync
    {"type": "SoundEvent", "time": 0.25, "sound": "impact.wav"},
    {"type": "DamageEvent", "time": 0.3, "damage": 20}
]
```

### Effect Layering

```gdscript
# Multiple effects for polish
events = [
    {"type": "EffectEvent", "time": 0.0, "effect": "ChargeGlow.tscn"},
    {"type": "EffectEvent", "time": 0.3, "effect": "Impact.tscn"},
    {"type": "EffectEvent", "time": 0.35, "effect": "Dust.tscn"}
]
```

---

## Event Validation

### Required Checks

1. **Time ordering**: Events should be in chronological order
2. **Animation exists**: Referenced animations must exist
3. **Resource paths**: All paths must be valid
4. **Fire point**: Fire point node must exist if specified

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| No damage | Fire/Damage time too late | Adjust timing |
| Animation stuck | Missing recovery animation | Add recovery event |
| No sound | Invalid audio path | Verify resource path |
| Effect not visible | Wrong spawn position | Check position parameter |

---

## Forbidden Patterns

1. **Never** fire before animation wind-up
2. **Never** leave entity in attack animation indefinitely
3. **Never** overlap conflicting animations
4. **Never** use negative time values
5. **Never** forget recovery state

---

## Best Practices

1. Always return to idle state
2. Audio slightly precedes visual impact
3. Test at different game speeds
4. Use effect events for feedback
5. Keep total skill duration reasonable
6. Match event timing to animation frames
