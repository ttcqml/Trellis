# Code Reuse Thinking Guide

> **Purpose**: Stop and think before creating new code - does it already exist?

---

## The Problem

**Duplicated code is the #1 source of inconsistency bugs.**

When you copy-paste or rewrite existing logic:
- Bug fixes don't propagate
- Behavior diverges over time
- Codebase becomes harder to understand

---

## Before Writing New Code

### Step 1: Search First

```bash
# Search for similar function names
grep -r "functionName" .

# Search for similar logic
grep -r "keyword" .

# Search for similar behaviors
grep -r "behavior_id" *.tscn
```

### Step 2: Ask These Questions

| Question | If Yes... |
|----------|-----------|
| Does a similar function exist? | Use or extend it |
| Is this pattern used elsewhere? | Follow the existing pattern |
| Could this be a shared resource? | Create it in the right place |
| Am I copying code from another file? | **STOP** - extract to shared |

---

## Godot-Specific Reuse Patterns

### Pattern 1: Shared Behaviors

**Bad**: Adding the same behaviors to every entity manually

**Good**: Create entity templates or use consistent behavior sets
```python
# Define behavior presets
COMBAT_BEHAVIORS = ["health", "faction", "area2d"]
VISUAL_BEHAVIORS = ["animated_sprite2d", "hp_bar"]

for behavior in COMBAT_BEHAVIORS:
    FlowKitBehaviorTool.AddBehaviorToScene(...)
```

### Pattern 2: Resource Inheritance

**Bad**: Copying SkillData resources for similar skills

**Good**: Create base resources and extend
```gdscript
# Base attack skill
res://Skills/Base/BaseAttack.tres

# Variants extend base
res://Skills/FireAttack.tres  # Inherits BaseAttack
res://Skills/IceAttack.tres   # Inherits BaseAttack
```

### Pattern 3: Shared Event Patterns

**Bad**: Duplicating FlowKit event blocks
```python
# Same death logic in every entity - BAD
FlowKitSheetCreatorStatic.AddEvent("on_health_changed", ...)
FlowKitSheetCreatorStatic.AddConditionToEvent("compare_health", ...)
FlowKitSheetCreatorStatic.AddActionToEvent("delete_self", ...)
```

**Good**: Extract to reusable function
```python
def add_death_event(scene_path: str, node_path: str = "."):
    """Add standard death handling to an entity."""
    FlowKitSheetCreatorStatic.OpenScene(scene_path)
    FlowKitSheetCreatorStatic.AddEvent(
        "on_health_changed",
        NodePath(node_path)
    )
    FlowKitSheetCreatorStatic.AddConditionToEvent(
        "compare_health",
        NodePath(node_path),
        {"血量类型": "current", "比较运算符": "<=", "值": 0},
        False
    )
    FlowKitSheetCreatorStatic.AddActionToEvent(
        "delete_self",
        NodePath(node_path),
        {}
    )
```

### Pattern 4: Behavior Tree Reuse

**Bad**: Creating similar behavior trees for each enemy

**Good**: Create modular subtrees
```
AI/
├── Common/
│   ├── BornSequence.tscn     # Shared spawn logic
│   ├── DieSequence.tscn      # Shared death logic
│   └── ChaseTarget.tscn      # Shared chase logic
├── Monster/
│   └── MonsterBrain.tscn     # Composes common sequences
└── Boss/
    └── BossBrain.tscn        # Composes + custom logic
```

---

## Common Duplication Patterns

### Pattern 1: Copy-Paste Scripts

**Bad**: Copying a condition script to create a variant
```gdscript
# DieCondition.gd - copied and modified
# HalfHealthCondition.gd - mostly same code
```

**Good**: Parameterize the condition
```gdscript
# HealthThresholdCondition.gd
@export var threshold: float = 0.0
@export var comparison: String = "<="

func tick(actor: Node, blackboard: Blackboard) -> int:
    var health_ratio = actor.current_health / actor.max_health
    if compare(health_ratio, threshold, comparison):
        return SUCCESS
    return FAILURE
```

### Pattern 2: Similar Entities

**Bad**: Creating new scene for 80% similar entity

**Good**: Use scene inheritance or composition
```
Entity/
├── Base/
│   └── BaseMonster.tscn       # Common structure
├── Monsters/
│   ├── Slime.tscn             # Inherits BaseMonster
│   └── Goblin.tscn            # Inherits BaseMonster
```

### Pattern 3: Repeated Constants

**Bad**: Defining the same values in multiple scripts
```gdscript
# script1.gd
const MAX_HEALTH = 100

# script2.gd
const MAX_HEALTH = 100  # Duplicated!
```

**Good**: Single source of truth
```gdscript
# Constants.gd (autoload)
class_name GameConstants

const PLAYER_MAX_HEALTH = 100
const ENEMY_MAX_HEALTH = 50
const COLLISION_LAYERS = {
    "PLAYER": 1,
    "MONSTER": 2,
    "BULLET": 8
}
```

---

## When to Abstract

**Abstract when**:
- Same code appears 3+ times
- Logic is complex enough to have bugs
- Multiple entities/scenes need this
- Values might change together

**Don't abstract when**:
- Only used once
- Trivial one-liner
- Abstraction would be more complex than duplication

---

## After Batch Modifications

When you've made similar changes to multiple files:

1. **Review**: Did you catch all instances?
2. **Search**: Run grep to find any missed
3. **Consider**: Should this be abstracted?

```bash
# After adding a new behavior parameter
grep -r "behavior_id" *.tscn
grep -r "old_parameter_name" .
```

---

## Godot Reuse Hierarchy

Prefer reuse in this order:

1. **Resources** - SkillData, SpriteFrames, etc.
2. **Scenes** - Entity templates, UI components
3. **Scripts** - Shared functions, base classes
4. **Behaviors** - FlowKit behavior configurations
5. **Event Patterns** - Common FlowKit event blocks

---

## Checklist Before Commit

- [ ] Searched for existing similar code
- [ ] No copy-pasted logic that should be shared
- [ ] Constants defined in one place
- [ ] Similar patterns follow same structure
- [ ] Resources are inherited where appropriate
- [ ] Behavior sets are consistent across similar entities
