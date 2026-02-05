# Cross-System Thinking Guide

> **Purpose**: Think through Entity-Scene-Skill-AI relationships before implementing.

---

## The Problem

**Most bugs happen at system boundaries**, not within systems.

Common cross-system bugs:
- FlowKit event expects behavior that isn't added
- Beehave tree reads blackboard key that's never set
- Skill references entity without required components
- Scene assumes entity has specific structure

---

## Godot Game Systems Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Scene                             │
│  ┌─────────────────────────────────────────────────────┐│
│  │                 System (FlowKit)                     ││
│  │  • Input events                                      ││
│  │  • Game state events                                 ││
│  │  • Global variables                                  ││
│  └─────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────┐│
│  │                    Entities                          ││
│  │  ┌─────────────────┐  ┌─────────────────┐           ││
│  │  │     Player      │  │     Monster     │           ││
│  │  │  • Behaviors    │  │  • Behaviors    │           ││
│  │  │  • FlowKit      │  │  • Beehave      │           ││
│  │  │  • Skills       │  │  • Skills       │           ││
│  │  └─────────────────┘  └─────────────────┘           ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## Before Implementing Cross-System Features

### Step 1: Map the Data Flow

Draw out how data moves between systems:

```
Player Input → FlowKit Event → Skill Trigger → Damage Calculation → Enemy Health → Death Event
```

For each arrow, ask:
- What data format is expected?
- What behaviors/components are required?
- Who is responsible for validation?

### Step 2: Identify System Boundaries

| Boundary | Common Issues |
|----------|---------------|
| Entity ↔ FlowKit | Behavior not added, wrong NodePath |
| FlowKit ↔ Beehave | Blackboard key mismatch |
| Entity ↔ Skill | Missing SkillBoxComponent |
| Scene ↔ Entity | Entity structure assumptions |

### Step 3: Define Contracts

For each boundary:
- What behaviors must exist?
- What signals/events are expected?
- What data format is passed?

---

## Common Cross-System Mistakes

### Mistake 1: Missing Behavior Dependencies

**Bad**: Adding health event without health behavior
```python
# This fails - no health behavior
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_changed",
    NodePath(".")
)
```

**Good**: Add behavior first
```python
# First add required behavior
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path, ".", "health", {"最大血量": 100}, False
)

# Then add event
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_changed",
    NodePath(".")
)
```

### Mistake 2: Blackboard Key Mismatch

**Bad**: Different keys in condition and action
```gdscript
# Condition sets "target"
blackboard.set_value("target", enemy)

# Action reads "attack_target" - WRONG!
var target = blackboard.get_value("attack_target")
```

**Good**: Use consistent keys
```gdscript
# Define blackboard keys in one place
const BLACKBOARD_KEYS = {
    "TARGET": "attack_target",
    "MOVE_DIR": "move_direction"
}
```

### Mistake 3: Entity Structure Assumptions

**Bad**: Assuming child node names
```gdscript
# Fragile - assumes specific structure
var sprite = entity.get_node("AnimatedSprite2D")
```

**Good**: Use behaviors or meta
```gdscript
# Robust - uses behavior system
var has_animation = entity.has_meta("flowkit_animated_sprite2d")
```

---

## System Integration Patterns

### Pattern 1: FlowKit → Beehave

```python
# Add behavior_tree behavior to entity
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path, ".",
    "behavior_tree",
    {"default_tree_scene": "res://AI/MonsterBrain.tscn"},
    False
)

# FlowKit can still add events alongside AI
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_decreased",
    NodePath(".")
)
```

### Pattern 2: Entity → Scene Communication

```python
# Entity emits signal on death
FlowKitSheetCreatorStatic.AddEvent("on_health_changed", NodePath("."))
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "compare_health", NodePath("."),
    {"血量类型": "current", "比较运算符": "<=", "值": 0}, False
)
FlowKitSheetCreatorStatic.AddActionToEvent(
    "emit_custom_signal", NodePath("System"),
    {"信号名": "enemy_died"}
)

# Scene listens for signal
FlowKitSheetCreatorStatic.AddEvent(
    "on_custom_signal", NodePath("System"),
    {"信号名": "enemy_died"}
)
```

### Pattern 3: Skill → Entity Integration

```gdscript
# Entity needs skill_box behavior
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path, ".",
    "skill_box",
    {
        "init_attack_skill_datas": [attack_skill_res],
        "init_skill_datas": [ability_skill_res]
    },
    False
)
```

---

## Checklist for Cross-System Features

Before implementation:
- [ ] Mapped the complete data flow
- [ ] Identified all system boundaries
- [ ] Verified required behaviors exist
- [ ] Defined signal/event names
- [ ] Checked blackboard key consistency

After implementation:
- [ ] Tested with missing behaviors (graceful failure)
- [ ] Verified signals reach listeners
- [ ] Checked entity works in different scenes
- [ ] Tested with edge cases (death, respawn)

---

## When to Create Flow Documentation

Create detailed flow docs when:
- Feature spans 3+ systems
- Multiple entities interact
- Data format is complex
- Feature has caused bugs before

Example documentation:

```markdown
## Enemy Death Flow

1. Player attacks enemy
2. skill_box triggers damage
3. health behavior reduces HP
4. FlowKit: on_health_changed fires
5. Condition: health <= 0
6. Action: emit_custom_signal("enemy_died")
7. Scene: on_custom_signal receives
8. Action: add_to_variable("kill_count", 1)
```

---

## System Responsibility Matrix

| Responsibility | Entity | Scene | FlowKit | Beehave |
|----------------|--------|-------|---------|---------|
| Movement logic | - | - | - | ✓ |
| Input handling | - | - | ✓ (System) | - |
| Health tracking | ✓ (behavior) | - | ✓ (events) | - |
| Death handling | ✓ | ✓ (cleanup) | ✓ (events) | ✓ (DieAction) |
| Scene transitions | - | ✓ | ✓ (load_scene) | - |
| Skill execution | ✓ (skill_box) | - | - | ✓ (AttackAction) |
