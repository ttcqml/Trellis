# FlowKit API Usage Guidelines

> Guidelines for using FlowKitSheetCreatorStatic and related APIs.

---

## Overview

FlowKit provides three main APIs for programmatic scene manipulation:

| API | Purpose |
|-----|---------|
| `FlowKitSheetCreatorStatic` | Create/modify event sheets |
| `FlowKitBehaviorTool` | Add/remove behaviors |
| `FlowKitVariableExtractor` | Extract custom variables |

---

## FlowKitSheetCreatorStatic

### Basic Workflow

```python
# 1. Open a scene for editing
FlowKitSheetCreatorStatic.OpenScene("res://Game_flowkit/Scenes/Level1.tscn")

# 2. Add event blocks
FlowKitSheetCreatorStatic.AddEvent(...)
FlowKitSheetCreatorStatic.AddConditionToEvent(...)
FlowKitSheetCreatorStatic.AddActionToEvent(...)

# 3. Save changes
FlowKitSheetCreatorStatic.SaveEventSheet()
```

---

## Adding Events

### AddEvent

```python
FlowKitSheetCreatorStatic.AddEvent(
    event_id,      # String: Event type ID
    target_node,   # NodePath: Target node
    inputs         # Dictionary: Event parameters (optional)
)
```

**Examples**:

```python
# Entity lifecycle event
FlowKitSheetCreatorStatic.AddEvent(
    "on_ready",
    NodePath(".")
)

# System input event
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath("System"),
    {"action": "attack"}
)

# Entity collision event
FlowKitSheetCreatorStatic.AddEvent(
    "on_area2d_collision",
    NodePath("."),
    {"碰撞类型": "body"}
)
```

---

## Adding Conditions

### AddConditionToEvent

```python
FlowKitSheetCreatorStatic.AddConditionToEvent(
    condition_id,  # String: Condition type ID
    target_node,   # NodePath: Target node
    inputs,        # Dictionary: Condition parameters
    negated        # bool: True to invert condition
)
```

**Examples**:

```python
# Health check
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "compare_health",
    NodePath("."),
    {"血量类型": "current", "比较运算符": "<=", "值": 0},
    False
)

# NOT is_paused (game running)
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "is_paused",
    NodePath("System"),
    {},
    True  # Negated
)

# Faction check
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "compare_faction",
    NodePath("."),
    {"比较运算符": "==", "阵营": "敌人"},
    False
)
```

---

## Adding Actions

### AddActionToEvent

```python
FlowKitSheetCreatorStatic.AddActionToEvent(
    action_id,     # String: Action type ID
    target_node,   # NodePath: Target node
    inputs         # Dictionary: Action parameters
)
```

**Examples**:

```python
# Change health
FlowKitSheetCreatorStatic.AddActionToEvent(
    "change_health",
    NodePath("."),
    {"血量变化": -20}
)

# Play animation
FlowKitSheetCreatorStatic.AddActionToEvent(
    "change_animation",
    NodePath("."),
    {"动画名": "attack"}
)

# Emit signal
FlowKitSheetCreatorStatic.AddActionToEvent(
    "emit_custom_signal",
    NodePath("System"),
    {"信号名": "enemy_died", "信号数据": 1}
)
```

---

## Target Node Patterns

### NodePath Types

| Pattern | Usage | Example |
|---------|-------|---------|
| `NodePath("System")` | System-level events/actions | Input, game state |
| `NodePath(".")` | Current entity | Self-referencing |
| `NodePath("ChildName")` | Specific child node | Named entity |

### When to Use Each

```python
# System events - global game logic
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath("System"),  # Always "System"
    {"action": "pause"}
)

# Entity events - specific node
FlowKitSheetCreatorStatic.AddEvent(
    "on_ready",
    NodePath(".")  # Current node
)

# Target another entity
FlowKitSheetCreatorStatic.AddActionToEvent(
    "change_health",
    NodePath("Player"),  # Named child node
    {"血量变化": 10}
)
```

---

## Complete Event Block Example

```python
# Death handling event block
# Event: When health drops to 0
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_changed",
    NodePath(".")
)

# Condition: Health <= 0
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "compare_health",
    NodePath("."),
    {"血量类型": "current", "比较运算符": "<=", "值": 0},
    False
)

# Action: Play death animation
FlowKitSheetCreatorStatic.AddActionToEvent(
    "change_animation",
    NodePath("."),
    {"动画名": "death"}
)

# Action: Delete self after delay
FlowKitSheetCreatorStatic.AddActionToEvent(
    "delete_self",
    NodePath("."),
    {}
)
```

---

## FlowKitBehaviorTool

### AddBehaviorToScene

```python
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path,      # String: Scene file path
    node_path,       # String: Target node path
    behavior_id,     # String: Behavior ID
    inputs,          # Dictionary: Behavior parameters
    force_overwrite  # bool: Replace existing behavior
)
```

**Example**:

```python
# Add health behavior
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://Game_flowkit/Entity/Monster.tscn",
    ".",
    "health",
    {
        "最大血量": 50,
        "当前血量": 50,
        "碰到敌人伤害冷却时间": 1.0
    },
    False
)

# Add collision with layers
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://Game_flowkit/Entity/Monster.tscn",
    ".",
    "area2d",
    {
        "shape_size_x": 32.0,
        "shape_size_y": 32.0,
        "collision_layer": 2,  # Monster layer
        "collision_mask": 1    # Detect player
    },
    False
)
```

---

## Parameter Key Reference

### Chinese Keys (Entity)

| Parameter | Chinese Key | Type |
|-----------|-------------|------|
| Health Type | `"血量类型"` | String |
| Comparison | `"比较运算符"` | String |
| Value | `"值"` | int/Variant |
| Variable Name | `"变量名"` | String |
| Faction | `"阵营"` | String |
| Collision Type | `"碰撞类型"` | String |
| Damage | `"伤害值"` | int |
| Health Change | `"血量变化"` | int |
| Animation Name | `"动画名"` | String |
| Signal Name | `"信号名"` | String |
| Speed | `"速度"` | float |
| Max Health | `"最大血量"` | int |
| Current Health | `"当前血量"` | int |

### English Keys (System)

| Parameter | Key | Type |
|-----------|-----|------|
| Action | `"action"` / `"Action"` | String |
| Key | `"key"` / `"Key"` | String |
| Button | `"button"` / `"Button"` | String |
| Name | `"Name"` | String |
| Value | `"Value"` | Variant |
| Comparison | `"Comparison"` | String |
| Platform | `"Platform"` | String |
| Threshold | `"Threshold"` | float |
| Seconds | `"Seconds"` | float |

---

## Comparison Operators

| Operator | Description |
|----------|-------------|
| `"=="` | Equal |
| `"!="` | Not equal |
| `"<"` | Less than |
| `">"` | Greater than |
| `"<="` | Less than or equal |
| `">="` | Greater than or equal |

---

## Best Practices

### 1. Always Open Scene First

```python
# Correct
FlowKitSheetCreatorStatic.OpenScene("res://scene.tscn")
FlowKitSheetCreatorStatic.AddEvent(...)

# Incorrect - no scene context
FlowKitSheetCreatorStatic.AddEvent(...)  # Error!
```

### 2. Match Target to Event Type

```python
# System events must target "System"
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath("System"),  # Correct
    {"action": "attack"}
)

# Entity events must target entity
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_changed",
    NodePath("."),  # Correct
)
```

### 3. Add Behaviors Before Events

```python
# First add required behaviors
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path, ".", "health", {...}, False
)

# Then add events that depend on them
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_changed",  # Requires health behavior
    NodePath(".")
)
```

### 4. Save After Modifications

```python
# Always save after modifications
FlowKitSheetCreatorStatic.AddEvent(...)
FlowKitSheetCreatorStatic.AddActionToEvent(...)
FlowKitSheetCreatorStatic.SaveEventSheet()  # Don't forget!
```

---

## Error Handling

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Behavior not found | Behavior not added | Add behavior first |
| Invalid target | Wrong NodePath | Check Entity vs System |
| Parameter error | Wrong key name | Check Chinese/English keys |
| Event not triggering | Condition failed | Verify condition parameters |

### Debugging

```python
# Add print action for debugging
FlowKitSheetCreatorStatic.AddActionToEvent(
    "print",
    NodePath("System"),
    {"Message": "Event triggered!"}
)
```

---

## Event Sheet Storage

Event sheets are automatically saved to:
```
addons/flowkit/saved/event_sheet/{scene_uid}.tres
```

Each scene has its own event sheet file identified by the scene's unique ID.
