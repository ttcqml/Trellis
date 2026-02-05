# Role Class Guidelines

> Standards for using the Role class and its derivatives.

---

## Role Hierarchy

```
Entity (Base)
└── Role (Game character base)
    ├── FCharacter (Player characters)
    └── FMonster (Enemy characters)
```

---

## Role Class Properties

### Exported Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `is_boss` | bool | Mark as boss enemy |
| `is_boss_split` | bool | Mark as boss split (minion) |
| `alert_range` | float | Detection range for AI |
| `dead_time` | float | Death animation duration |
| `hit_time` | float | Hit stun duration |
| `move_type` | String | Movement pattern type |
| `alive_time` | float | Lifetime duration |
| `hide_bar` | bool | Hide health bar |
| `templete_id` | int | Template identifier |
| `role_index` | int | Role index in scene |
| `role_type` | BattleEnum.ERoleType | Character type |
| `role_faction` | BattleEnum.EFaction | Team faction |
| `role_collision_damage` | int | Collision damage value |

### Skill Arrays

| Parameter | Type | Description |
|-----------|------|-------------|
| `attack` | Array[SkillData] | Attack skills |
| `skill` | Array[SkillData] | Normal skills |
| `halo` | Array[SkillData] | Aura/passive skills |
| `buff` | Array[BuffData] | Active buffs |
| `passive` | Array[PassiveData] | Passive abilities |

---

## Role Types (BattleEnum.ERoleType)

| Type | Value | Usage |
|------|-------|-------|
| Player | 0 | Playable characters |
| Monster | 1 | Enemy NPCs |
| Pet | 2 | Companion entities |
| NPC | 3 | Non-combat NPCs |

---

## Faction System (BattleEnum.EFaction)

| Faction | Value | Collides With |
|---------|-------|---------------|
| 玩家 (Player) | 0 | 敌人 (Enemy) |
| 敌人 (Enemy) | 1 | 玩家 (Player) |
| 中立 (Neutral) | 2 | None by default |

---

## FCharacter (Player) Specifics

```gdscript
# Player character inherits from Role
# Typically uses:
# - Collision layer 1 (角色)
# - Collision mask 2 (怪物)
# - faction = "玩家"
```

### Required Behaviors

- `animated_sprite2d` - Visual representation
- `characterbody2d_collision` - Physics collision
- `health` - Health system
- `area2d` - Trigger detection
- `signal_broadcaster` - Event communication
- `behavior_tree` - AI/Input handling
- `skill_box` - Skill system
- `speed` - Movement speed

### Recommended Behaviors

- `faction` - Team identification
- `hp_bar` - Health display
- `death_effect` - Death animation

---

## FMonster (Enemy) Specifics

```gdscript
# Monster character inherits from Role
# Typically uses:
# - Collision layer 2 (怪物)
# - Collision mask 1 (角色)
# - faction = "敌人"
```

### Required Behaviors

- `animated_sprite2d` - Visual representation
- `characterbody2d_collision` - Physics collision
- `health` - Health system
- `area2d` - Trigger detection
- `signal_broadcaster` - Event communication
- `behavior_tree` - AI logic
- `skill_box` - Attack system

### Recommended Behaviors

- `faction` - Team identification
- `hp_bar` - Health display
- `death_effect` - Death animation

---

## Creating Role Instances

### Using MCP Tools

```python
# 1. Copy template
# Copy base template to RequirementImp/[Type]/[Name].tscn

# 2. Open scene
await call_tool(ws, "OpenScene", {"scene_path": "res://RequirementImp/Player/MyPlayer.tscn"})

# 3. Update behaviors
await call_tool(ws, "UpdateBehaviorInputsInScene", {
    "scene_path": "res://RequirementImp/Player/MyPlayer.tscn",
    "node_path": ".",
    "behavior_id": "health",
    "inputs": {"最大血量": 150, "当前血量": 150}
})

# 4. Save
await call_tool(ws, "SaveScene", {"scene_path": "res://RequirementImp/Player/MyPlayer.tscn"})
```

---

## Forbidden Patterns

1. **Never** directly modify Role class source code
2. **Never** use hardcoded collision layers - use collision_guidelines.md values
3. **Never** skip required behaviors for entity type
4. **Never** set faction without collision mask alignment

---

## Best Practices

1. Always inherit from appropriate base class (FCharacter for players, FMonster for enemies)
2. Use FlowKit behaviors instead of custom scripts when possible
3. Set appropriate collision layers matching faction
4. Configure behavior tree for AI-controlled entities
5. Test entity in isolation before scene integration
