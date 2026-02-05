# Component Guidelines

> Standards for using game components from `addons/godot_mcp/`.

---

## Component Categories

### Character Attributes

| Component | Description | Usage |
|-----------|-------------|-------|
| RoleAttrComponent | Character attribute system | Stats like ATK, DEF |
| CharacterStatsComponent | Character statistics | Runtime stat tracking |

### Skill System

| Component | Description | Usage |
|-----------|-------------|-------|
| SkillBoxComponent | Skill container and management | Managing attack/skill/halo arrays |
| RoleBuffComponent | Buff/status effect system | Applying temporary effects |
| RolePassiveComponent | Passive ability system | Permanent ability effects |

### Behavior System

| Component | Description | Usage |
|-----------|-------------|-------|
| BehaviorComponent | Behavior tree integration | AI logic management |

### Visual & Animation

| Component | Description | Usage |
|-----------|-------------|-------|
| SimpleAnimationComponent | Basic animation management | Playing sprite animations |
| CameraComponent | Camera control | Following player/focus |
| SoundEffectComponent | Audio effect system | Playing sounds |

### Physics & Collision

| Component | Description | Usage |
|-----------|-------------|-------|
| CharacterBodyComponent | Character physics body | Movement and collision |
| CollisionComponent | Collision handling | Detecting overlaps |
| OffscreenComponent | Off-screen detection | Cleanup/spawning |

### Other Systems

| Component | Description | Usage |
|-----------|-------------|-------|
| PetFollowComponent | Pet/follower behavior | Following player |
| SignalBroadcasterComponent | Signal broadcasting | Event communication |
| DropSystemUtil | Item drop system | Loot generation |
| ProgressView | Progress UI display | Loading bars |

---

## Component vs Behavior

### When to Use Components

- Complex logic requiring GDScript/C#
- Reusable across multiple entity types
- Need direct scene tree access
- Performance-critical operations

### When to Use FlowKit Behaviors

- Configuration-based functionality
- Visual editing in FlowKit panel
- Rapid prototyping
- Simple event-condition-action patterns

---

## SkillBoxComponent Usage

### Structure

```gdscript
# SkillBoxComponent manages three skill arrays:
# - init_attack_skill_datas: Attack skills (auto-fire)
# - init_skill_datas: Normal skills (triggered)
# - init_halo_skill_datas: Aura skills (passive effects)
```

### FlowKit Behavior Configuration

```python
# Via UpdateBehaviorInputsInScene
{
    "scene_path": "res://...",
    "node_path": ".",
    "behavior_id": "skill_box",
    "inputs": {
        "skill_box_scene": "res://Framework/Component/RoleComponent/SkillBoxComponent.tscn",
        "init_attack_skill_datas": [],  # Array[SkillData]
        "init_skill_datas": [],         # Array[SkillData]
        "init_halo_skill_datas": []     # Array[SkillData]
    }
}
```

---

## RoleBuffComponent Usage

### Buff Application

```gdscript
# Buffs are temporary effects with duration
# Applied via BuffData resources
```

### Common Buff Types

| Type | Effect | Duration |
|------|--------|----------|
| Attack Up | Increase ATK | Timed |
| Speed Up | Increase speed | Timed |
| Shield | Block damage | Hit-based |
| DoT | Damage over time | Timed |

---

## SignalBroadcasterComponent Usage

### Purpose

- Inter-entity communication
- Event-driven architecture
- Decoupled entity interactions

### FlowKit Integration

```python
# Enable via behavior
{
    "behavior_id": "signal_broadcaster",
    "inputs": {}  # No parameters needed
}
```

---

## BehaviorComponent Usage

### Managing Behavior Trees

```gdscript
# BehaviorComponent.trees dictionary:
# - Key: tree name (e.g., "default")
# - Value: PackedScene reference to .tscn behavior tree
```

### FlowKit Behavior Configuration

```python
{
    "behavior_id": "behavior_tree",
    "inputs": {
        "default_tree_scene": "res://Game_flowkit/BehaviorTree/MonsterAttackTree.tscn"
    }
}
```

---

## Component Dependencies

### Common Dependency Chains

```
SkillBoxComponent
├── Requires: Role entity
└── Used by: Attack actions, skill triggers

BehaviorComponent
├── Requires: Entity node
└── Used by: AI logic, player input

SignalBroadcasterComponent
├── Requires: Entity node
└── Used by: Event communication, FlowKit actions
```

---

## Forbidden Patterns

1. **Never** instantiate components directly - use FlowKit behaviors
2. **Never** modify component scripts in addons - create wrappers
3. **Never** skip null checks on component references
4. **Never** assume component initialization order

---

## Best Practices

1. Prefer FlowKit behaviors over manual component setup
2. Use component auto-discovery via `get_node_or_null()`
3. Cache component references in `_ready()`
4. Signal-based communication over direct references
5. Document component dependencies in entity templates
