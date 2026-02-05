# Beehave Framework Guidelines

> Standards for using Beehave behavior trees.

---

## Beehave Overview

Beehave is a behavior tree plugin for Godot. It provides:
- Visual tree editing in Godot editor
- Built-in composite nodes
- Easy custom node creation
- Blackboard for data sharing

---

## Composite Nodes

### Selector

Tries each child in order until one succeeds.

```gdscript
# Usage: "Try options until one works"
# Example: Try attack, else try flee, else idle
```

| Child Result | Selector Behavior |
|--------------|-------------------|
| SUCCESS | Stop, return SUCCESS |
| FAILURE | Try next child |
| RUNNING | Stop, return RUNNING |
| All FAILURE | Return FAILURE |

### Sequence

Runs each child in order; stops if any fails.

```gdscript
# Usage: "Do all steps in order"
# Example: Check condition, then perform action
```

| Child Result | Sequence Behavior |
|--------------|-------------------|
| SUCCESS | Continue to next |
| FAILURE | Stop, return FAILURE |
| RUNNING | Stop, return RUNNING |
| All SUCCESS | Return SUCCESS |

### SelectorReactive

Like Selector, but re-evaluates higher-priority children each tick.

```gdscript
# Usage: "Always check priorities"
# Example: Die check always runs before attack
```

### SequenceReactive

Like Sequence, but re-evaluates from start each tick.

```gdscript
# Usage: "Verify conditions each frame"
# Example: Ensure enemy still in range while attacking
```

---

## Creating Behavior Trees

### Via BeehaveTreeCreatorStatic

```python
import asyncio
import websockets
import json

async def create_tree():
    async with websockets.connect("ws://127.0.0.1:18888") as ws:
        scene_path = "res://RequirementImp/BehaviorTree/CustomTree.tscn"

        # Create tree
        BeehaveTreeCreatorStatic.create_tree(scene_path, "CustomTree")

        # Add root selector
        BeehaveTreeCreatorStatic.add_composite(
            scene_path, "SelectorReactive", "SelectorReactiveComposite"
        )

        # Add sequence for behavior
        BeehaveTreeCreatorStatic.add_composite(
            scene_path, "Sequence", "attack",
            NodePath("SelectorReactiveComposite")
        )

        # Add condition
        BeehaveTreeCreatorStatic.add_condition(
            scene_path,
            "res://Framework/Scripts/Beehave/Condition/AttackCondition.gd",
            "AttackCondition",
            NodePath("SelectorReactiveComposite/attack")
        )

        # Add action
        BeehaveTreeCreatorStatic.add_action(
            scene_path,
            "res://Framework/Scripts/Beehave/Action/AttackAction.gd",
            "AttackAction",
            {},
            NodePath("SelectorReactiveComposite/attack")
        )

        # Save
        BeehaveTreeCreatorStatic.save_tree(scene_path)
```

---

## Custom Condition Nodes

### Template

```gdscript
extends ConditionLeaf
class_name MyCondition

func tick(actor: Node, blackboard: Blackboard) -> int:
    # Check condition
    if condition_met:
        return SUCCESS
    else:
        return FAILURE
```

### Example: Health Check

```gdscript
extends ConditionLeaf
class_name LowHealthCondition

@export var threshold: float = 0.3

func tick(actor: Node, blackboard: Blackboard) -> int:
    var health_component = actor.get_node_or_null("HealthComponent")
    if health_component:
        var health_ratio = health_component.current / health_component.max
        if health_ratio < threshold:
            return SUCCESS
    return FAILURE
```

---

## Custom Action Nodes

### Template

```gdscript
extends ActionLeaf
class_name MyAction

func tick(actor: Node, blackboard: Blackboard) -> int:
    # Perform action
    do_something()

    # Return status
    if completed:
        return SUCCESS
    elif failed:
        return FAILURE
    else:
        return RUNNING
```

### Example: Move to Target

```gdscript
extends ActionLeaf
class_name MoveToTargetAction

@export var speed: float = 100.0
@export var arrival_distance: float = 10.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    var target = blackboard.get_value("target")
    if not target:
        return FAILURE

    var direction = (target.global_position - actor.global_position).normalized()
    var distance = actor.global_position.distance_to(target.global_position)

    if distance < arrival_distance:
        return SUCCESS

    actor.velocity = direction * speed
    actor.move_and_slide()
    return RUNNING
```

---

## Blackboard Usage

### Setting Values

```gdscript
# In condition or action
blackboard.set_value("target", enemy_node)
blackboard.set_value("move_direction", Vector2.RIGHT)
```

### Getting Values

```gdscript
# In condition or action
var target = blackboard.get_value("target")
var direction = blackboard.get_value("move_direction", Vector2.ZERO)  # with default
```

### Common Blackboard Keys

| Key | Type | Usage |
|-----|------|-------|
| `target` | Node2D | Current attack target |
| `move_direction` | Vector2 | Movement input |
| `spawn_complete` | bool | Birth animation done |
| `is_dying` | bool | Death in progress |
| `attack_target` | Node2D | Specific attack target |

---

## Tree Structure Patterns

### Standard Entity Tree

```
SelectorReactiveComposite (root)
├── Sequence: born
│   ├── BornCondition (check if just spawned)
│   └── BornAction (play spawn animation)
├── Sequence: die
│   ├── DieCondition (check if health <= 0)
│   └── DieAction (play death, cleanup)
├── Sequence: hit
│   ├── HitCondition (check if just damaged)
│   └── HitAction (play hit reaction)
├── Sequence: attack
│   ├── AttackCondition (check if can attack)
│   └── AttackAction (perform attack)
└── Sequence: move
    ├── MoveCondition (check if should move)
    └── MoveAction (move entity)
```

### Priority Ordering

1. **born** - Handle spawn (highest priority)
2. **die** - Handle death
3. **hit** - React to damage
4. **special** - Special abilities
5. **attack** - Combat
6. **move** - Movement (lowest priority)

---

## Attaching to Entities

### Via FlowKit Behavior

```python
await call_tool(ws, "UpdateBehaviorInputsInScene", {
    "scene_path": "res://RequirementImp/Monster/Boss.tscn",
    "node_path": ".",
    "behavior_id": "behavior_tree",
    "inputs": {
        "default_tree_scene": "res://RequirementImp/BehaviorTree/BossTree.tscn"
    }
})
```

---

## Debugging

### Enable Beehave Debugger

1. Open Beehave debugger panel in Godot
2. Select entity with behavior tree
3. Watch tree execution in real-time

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Tree never ticks | Tree not attached | Check behavior_tree behavior |
| Always same branch | Condition always true/false | Debug condition logic |
| Action never completes | Returning RUNNING indefinitely | Add completion condition |
| Blackboard empty | Not setting values | Verify set_value calls |

---

## Forbidden Patterns

1. **Never** return SUCCESS from long-running actions prematurely
2. **Never** modify tree structure at runtime
3. **Never** create infinite RUNNING loops
4. **Never** access nodes outside actor without null checks
5. **Never** use Selector when Sequence is needed (and vice versa)

---

## Best Practices

1. Use reactive composites for priority-based behavior
2. Keep conditions simple and fast
3. Use blackboard for inter-node communication
4. Test each branch independently
5. Document custom nodes thoroughly
6. Follow naming conventions for nodes
