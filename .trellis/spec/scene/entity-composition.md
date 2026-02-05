# Entity Composition Patterns

> Patterns for assembling entities into game scenes.

---

## Core Principle

**Don't create entities in scenes - instantiate them.**

Entity logic belongs in entity templates (.tscn in Entity/ directories).
Scenes compose these templates together.

---

## Instantiation Methods

### Via MCP Tool (Recommended)

```python
# Instantiate entity into scene
await call_tool(ws, "InstantiateScene", {
    "scene_path": "res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn",
    "parent_path": "root"  # or specific container
})
```

### Via GDScript

```gdscript
# Load and instantiate
var enemy_scene = preload("res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn")
var enemy = enemy_scene.instantiate()
add_child(enemy)
enemy.position = Vector2(100, 100)
```

### Via FlowKit Action

```python
# System action to load scene at runtime
FlowKitSheetCreatorStatic.AddActionToEvent(
    "load_scene",
    NodePath("System"),
    {
        "scene": "res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn",
        "position": Vector2(100, 100)
    }
)
```

---

## Entity Grouping

### Container Pattern

```
GameScene
├── Player
├── Enemies (Node2D)        # Group container
│   ├── FMonsterTest        # Enemy 1
│   ├── FMonsterTest2       # Enemy 2
│   └── FMonsterTest3       # Enemy 3
├── Items (Node2D)          # Group container
│   ├── HealthPotion
│   └── GoldCoin
└── NPCs (Node2D)           # Group container
    └── Shopkeeper
```

### Benefits

- Easy batch operations (get_children())
- Organized scene tree
- Simplified FlowKit targeting
- Performance optimization (disable container)

---

## Position Configuration

### Setting Position via MCP

```python
# After instantiation, set position
await call_tool(ws, "SetProperty", {
    "node_path": "root/FMonsterTest",
    "properties": {
        "position": {"x": 100, "y": 200}
    }
})
```

### Common Position Patterns

| Pattern | Description | Implementation |
|---------|-------------|----------------|
| Fixed | Known position | Direct coordinate |
| Relative | Offset from entity | Parent + offset |
| Random | Within area | Random range |
| Grid | Organized layout | Row/column calculation |

### Random Positioning

```python
import random

# Random position within bounds
x = random.uniform(-200, 200)
y = random.uniform(-100, 100)

await call_tool(ws, "SetProperty", {
    "node_path": f"root/{enemy_name}",
    "properties": {"position": {"x": x, "y": y}}
})
```

---

## Instance Configuration Override

### Overriding Entity Behaviors

Instantiated entities can have their behaviors customized per-instance:

```python
# Override health for specific instance
await call_tool(ws, "UpdateBehaviorInputsInScene", {
    "scene_path": "res://RequirementImp/Scenes/Level01.tscn",
    "node_path": "Enemies/BossSlime",  # Specific instance
    "behavior_id": "health",
    "inputs": {"最大血量": 500, "当前血量": 500}
})
```

### What Can Be Overridden

- Behavior inputs (health, speed, faction)
- Visual properties (scale, modulate)
- Position and rotation
- Initial animation state

### What Should NOT Be Overridden

- Core entity structure
- Required behaviors (add to template instead)
- Script attachments

---

## Multi-Entity Scenes

### Batch Instantiation

```python
# Create multiple enemies efficiently
enemies_to_create = [
    {"template": "FMonsterTest.tscn", "pos": (100, 0)},
    {"template": "FMonsterTest.tscn", "pos": (200, 0)},
    {"template": "FMonsterTest.tscn", "pos": (300, 0)},
]

commands = []
for i, enemy in enumerate(enemies_to_create):
    commands.append({
        "name": "InstantiateScene",
        "arguments": {
            "scene_path": f"res://Game_flowkit/Entity/Enemy/{enemy['template']}",
            "parent_path": "root/Enemies"
        }
    })

# Batch execute for performance
await batch_execute(ws, commands)
```

### Naming Instances

```python
# Unique names for multiple instances
for i in range(5):
    await call_tool(ws, "InstantiateScene", {...})
    # Godot auto-generates unique names: FMonsterTest, FMonsterTest2, FMonsterTest3...
```

---

## Entity Relationships

### Parent-Child

```
Player
└── Pet (child of player, follows automatically)
```

### Sibling

```
Enemies
├── LeaderEnemy (can reference siblings)
└── FollowerEnemy
```

### Reference by Path

```python
# In FlowKit events, reference other entities
target_node = NodePath("../Player")  # Relative path
target_node = NodePath("root/Player")  # Absolute from scene root
```

---

## Dynamic Entity Management

### Spawning at Runtime

```python
# FlowKit event to spawn enemy
# Event: on_custom_signal with signal "spawn_enemy"
# Action: load_scene with enemy template
```

### Destroying Entities

```python
# Entity self-deletion
FlowKitSheetCreatorStatic.AddActionToEvent(
    "delete_self",
    NodePath("."),
    {}
)
```

### Entity Pooling (Advanced)

For frequently spawned/destroyed entities:
1. Pre-instantiate pool of entities
2. Use `set_node_enabled` to activate/deactivate
3. Reposition instead of creating new

---

## Forbidden Patterns

1. **Never** duplicate entity logic in scenes
2. **Never** modify entity templates directly in scene
3. **Never** hardcode entity counts without testing
4. **Never** forget to save after instantiation changes
5. **Never** create circular entity references

---

## Best Practices

1. Use consistent naming for entity instances
2. Group related entities in containers
3. Override only what's necessary per instance
4. Use batch operations for multiple entities
5. Test with maximum expected entity count
6. Document custom instance configurations
