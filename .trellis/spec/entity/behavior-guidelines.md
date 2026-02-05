# FlowKit Behavior Guidelines

> Configuration standards for FlowKit Behaviors on Entity nodes.

---

## Overview

FlowKit Behaviors are configured via the `flowkit_behaviors` node meta. They provide declarative, no-code functionality for entities.

---

## Available Entity Behaviors (13)

### Visual Behaviors

| Behavior ID | Description | Key Inputs |
|-------------|-------------|------------|
| `animated_sprite2d` | 2D animated sprite | `sprite_frames`, `初始动画`, `ZIndex` |
| `sprite2d` | Static 2D sprite | `Texture`, `Position X/Y`, `Scale X/Y`, `ZIndex` |
| `camera2d` | Camera component | `Offset X/Y`, `Zoom X/Y`, `Limit Left/Right/Top/Bottom` |
| `death_effect` | Death animation | `effect_scene`, `offset_x`, `offset_y` |
| `hp_bar` | Health bar UI | `hp_bar_scene`, `pos_x`, `pos_y` |

### Collision Behaviors

| Behavior ID | Description | Key Inputs |
|-------------|-------------|------------|
| `area2d` | Trigger collision (Area2D) | `shape_size_x/y`, `collision_layer`, `collision_mask` |
| `characterbody2d_collision` | Physics collision | `shape_size_x/y`, `collision_layer`, `collision_mask`, `emit_each_physics_frame` |

### Gameplay Behaviors

| Behavior ID | Description | Key Inputs |
|-------------|-------------|------------|
| `health` | Health system | `最大血量`, `当前血量`, `碰到敌人伤害冷却时间` |
| `faction` | Team/alignment | `阵营` ("玩家"/"敌人"/"中立") |
| `speed` | Movement speed | `速度` |
| `skill_box` | Skill management | `skill_box_scene`, `init_attack_skill_datas`, `init_skill_datas`, `init_halo_skill_datas` |

### System Behaviors

| Behavior ID | Description | Key Inputs |
|-------------|-------------|------------|
| `behavior_tree` | AI behavior tree | `default_tree_scene` |
| `signal_broadcaster` | Signal communication | (none) |

---

## Behavior Configuration via MCP

### Adding a New Behavior

```python
await call_tool(ws, "AddBehaviorToScene", {
    "scene_path": "res://RequirementImp/Monster/Slime.tscn",
    "node_path": ".",
    "behavior_id": "health",
    "inputs": {
        "最大血量": 100,
        "当前血量": 100,
        "碰到敌人伤害冷却时间": 5.0
    }
})
```

### Updating Existing Behavior

```python
await call_tool(ws, "UpdateBehaviorInputsInScene", {
    "scene_path": "res://RequirementImp/Monster/Slime.tscn",
    "node_path": ".",
    "behavior_id": "speed",
    "inputs": {
        "速度": 75.0
    }
})
```

### Getting Behaviors

```python
result = await call_tool(ws, "GetBehaviorsFromScene", {
    "scene_path": "res://RequirementImp/Monster/Slime.tscn"
})
```

---

## Role Type Recommended Behaviors

### Player (FCharacter)

```python
# Required
behaviors = [
    "animated_sprite2d",
    "characterbody2d_collision",
    "health",
    "area2d",
    "signal_broadcaster",
    "behavior_tree",
    "skill_box",
    "speed"
]

# Recommended
optional = ["faction", "hp_bar", "death_effect"]
```

### Enemy (FMonster)

```python
# Required
behaviors = [
    "animated_sprite2d",
    "characterbody2d_collision",
    "health",
    "area2d",
    "signal_broadcaster",
    "behavior_tree",
    "skill_box"
]

# Recommended
optional = ["faction", "hp_bar", "death_effect", "speed"]
```

### NPC

```python
# Required
behaviors = [
    "animated_sprite2d",
    "characterbody2d_collision",
    "signal_broadcaster"
]

# Optional based on NPC type
optional = ["faction", "behavior_tree"]
```

### Pet

```python
# Required
behaviors = [
    "animated_sprite2d",
    "characterbody2d_collision",
    "health",
    "signal_broadcaster",
    "behavior_tree",
    "speed"
]

# Recommended
optional = ["faction", "skill_box"]
```

---

## Behavior Dependencies

### Event Dependencies

| Behavior | Enables Events |
|----------|----------------|
| `area2d` | `on_area2d_collision` |
| `characterbody2d_collision` | `on_characterbody2d_collision` |
| `health` | `on_health_changed`, `on_health_decreased`, `on_health_increased` |

### Condition Dependencies

| Behavior | Enables Conditions |
|----------|-------------------|
| `faction` | `compare_faction` |
| `health` | `compare_health` |

### Action Dependencies

| Behavior | Enables Actions |
|----------|-----------------|
| `animated_sprite2d` | `change_animation` |
| `health` | `change_health` |
| `area2d` | `print_collision_body_name` |

---

## Common Configuration Patterns

### Combat Entity

```python
combat_behaviors = {
    "animated_sprite2d": {
        "sprite_frames": "res://Game_flowkit/Resources/SpriteFrames/Slime.tres",
        "初始动画": "idle_down"
    },
    "characterbody2d_collision": {
        "shape_size_x": 32.0,
        "shape_size_y": 32.0,
        "collision_layer": 2,  # Monster layer
        "collision_mask": 1    # Detect player
    },
    "area2d": {
        "shape_size_x": 32.0,
        "shape_size_y": 32.0,
        "collision_layer": 2,
        "collision_mask": 1
    },
    "health": {
        "最大血量": 100,
        "当前血量": 100
    },
    "faction": {
        "阵营": "敌人"
    }
}
```

### Non-Combat Entity

```python
npc_behaviors = {
    "animated_sprite2d": {
        "sprite_frames": "res://Game_flowkit/Resources/SpriteFrames/Pumpkin.tres"
    },
    "characterbody2d_collision": {
        "shape_size_x": 32.0,
        "shape_size_y": 32.0,
        "collision_layer": 4,  # Neutral layer
        "collision_mask": 0    # No collision detection
    }
}
```

---

## Forbidden Patterns

1. **Never** add behaviors without required inputs
2. **Never** mix collision layers incorrectly (see collision-guidelines.md)
3. **Never** add `health` events without `health` behavior
4. **Never** skip `signal_broadcaster` for entities with events
5. **Never** set `behavior_tree` without a valid tree scene

---

## Best Practices

1. Always add behaviors before updating them
2. Use batch execution for multiple behavior updates
3. Verify behavior configuration with `GetBehaviorsFromScene`
4. Match collision layers with faction
5. Save scene after all behavior changes
