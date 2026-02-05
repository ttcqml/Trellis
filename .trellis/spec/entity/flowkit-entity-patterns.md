# FlowKit Entity Patterns

> Event-Condition-Action patterns for Entity nodes.

---

## Entity Node Capabilities

Entity nodes support 8 events, 3 conditions, 15 actions, and 13 behaviors.

---

## Events (8)

### Lifecycle Events

| Event ID | Description | Target Node |
|----------|-------------|-------------|
| `on_process` | Every frame update | `.` or child node |
| `on_process_physics` | Every physics frame | `.` or child node |
| `on_ready` | Scene enters tree | `.` or child node |

### Collision Events

| Event ID | Description | Requires Behavior |
|----------|-------------|-------------------|
| `on_area2d_collision` | Area2D trigger collision | `area2d` |
| `on_characterbody2d_collision` | Physics body collision | `characterbody2d_collision` |

**Area2D Collision Parameters:**

```python
inputs = {
    "碰撞类型": "body"  # or "area"
}
```

### Health Events

| Event ID | Description | Requires Behavior |
|----------|-------------|-------------------|
| `on_health_changed` | Any health change | `health` |
| `on_health_decreased` | Health decreased | `health` |
| `on_health_increased` | Health increased | `health` |

---

## Conditions (3)

### Variable Comparison

| Condition ID | Description | Parameters |
|--------------|-------------|------------|
| `compare_node_variable` | Compare node variable | `变量名`, `比较运算符`, `值` |

```python
inputs = {
    "变量名": "state",
    "比较运算符": "==",  # ==, !=, <, >, <=, >=
    "值": "attacking"
}
```

### Faction Comparison

| Condition ID | Description | Parameters | Requires |
|--------------|-------------|------------|----------|
| `compare_faction` | Check entity faction | `比较运算符`, `阵营` | `faction` |

```python
inputs = {
    "比较运算符": "==",  # == or !=
    "阵营": "敌人"       # 玩家, 敌人, 中立
}
```

### Health Comparison

| Condition ID | Description | Parameters | Requires |
|--------------|-------------|------------|----------|
| `compare_health` | Check health value | `血量类型`, `比较运算符`, `值` | `health` |

```python
inputs = {
    "血量类型": "current",  # current or max
    "比较运算符": "<=",
    "值": 50
}
```

---

## Actions (15)

### Timer Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `create_node_timer` | Create a timer | `Timer Name`, `Value` |
| `bind_node_timer` | Bind event to timer | `Timer Name`, `callable` |

### Animation Actions

| Action ID | Description | Parameters | Requires |
|-----------|-------------|------------|----------|
| `change_animation` | Change sprite animation | `动画名` | `animated_sprite2d` |

```python
inputs = {
    "动画名": "walk_down"
}
```

### Node Control Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `delete_self` | Delete current node | (none) |
| `set_node_enabled` | Enable/disable node | `启用` (bool) |
| `set_node_variable` | Set node variable | `变量名`, `值` |

### Position Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `set_position_x` | Set X coordinate | `X` (float) |
| `set_position_y` | Set Y coordinate | `Y` (float) |
| `set_rotation` | Set rotation (radians) | `Rotation` (float) |
| `teleport_to_node` | Teleport to node position | `目标节点路径` |

### Instantiation Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `instantiate_entity_at_position` | Clone at position | `X`, `Y` |
| `instantiate_entity_random_position` | Clone at random position | `X 最小值`, `X 最大值`, `Y 最小值`, `Y 最大值` |

### Health Actions

| Action ID | Description | Parameters | Requires |
|-----------|-------------|------------|----------|
| `change_health` | Modify health | `血量变化` (int, +/-) | `health` |

### Debug Actions

| Action ID | Description | Parameters | Requires |
|-----------|-------------|------------|----------|
| `print_collision_body_name` | Print collision object | `碰撞类型` | `area2d` |
| `printerr_last_collider_name` | Print last collider | (none) | `characterbody2d_collision` |

---

## Common Patterns

### Enemy Damage on Collision

```python
# Event: Area2D collision
FlowKitSheetCreatorStatic.AddEvent("on_area2d_collision", NodePath("Enemy"), {"碰撞类型": "body"})

# Condition: Check if player faction
FlowKitSheetCreatorStatic.AddConditionToEvent("compare_faction", NodePath("Enemy"),
    {"比较运算符": "==", "阵营": "玩家"}, False)

# Action: Reduce health
FlowKitSheetCreatorStatic.AddActionToEvent("change_health", NodePath("Enemy"),
    {"血量变化": -10})
```

### Death on Zero Health

```python
# Event: Health decreased
FlowKitSheetCreatorStatic.AddEvent("on_health_decreased", NodePath("."))

# Condition: Health <= 0
FlowKitSheetCreatorStatic.AddConditionToEvent("compare_health", NodePath("."),
    {"血量类型": "current", "比较运算符": "<=", "值": 0}, False)

# Action: Delete self
FlowKitSheetCreatorStatic.AddActionToEvent("delete_self", NodePath("."), {})
```

### Animation Change on State

```python
# Event: Every frame
FlowKitSheetCreatorStatic.AddEvent("on_process", NodePath("."))

# Condition: Check state variable
FlowKitSheetCreatorStatic.AddConditionToEvent("compare_node_variable", NodePath("."),
    {"变量名": "is_moving", "比较运算符": "==", "值": True}, False)

# Action: Play walk animation
FlowKitSheetCreatorStatic.AddActionToEvent("change_animation", NodePath("."),
    {"动画名": "walk_down"})
```

### Spawn Clone on Timer

```python
# Event: Scene ready
FlowKitSheetCreatorStatic.AddEvent("on_ready", NodePath("."))

# Action: Create spawn timer
FlowKitSheetCreatorStatic.AddActionToEvent("create_node_timer", NodePath("."),
    {"Timer Name": "spawn_timer", "Value": 5.0})

# Action: Spawn clone at random position
FlowKitSheetCreatorStatic.AddActionToEvent("instantiate_entity_random_position", NodePath("."),
    {"X 最小值": -100, "X 最大值": 100, "Y 最小值": -100, "Y 最大值": 100})
```

---

## FlowKitSheetCreatorStatic Usage

### Creating Event Sheet

```csharp
// C# example
FlowKitSheetCreatorStatic.CreateSheet("res://Game_flowkit/Scenes/Stage/Start.tscn");
FlowKitSheetCreatorStatic.AddEvent("on_ready", new NodePath("."));
FlowKitSheetCreatorStatic.AddActionToEvent("print", new NodePath("System"),
    new Dictionary { { "Message", "Entity ready!" } });
FlowKitSheetCreatorStatic.SaveSheet();
```

### Reading Event Sheet

```csharp
// Get events with sub IDs
Array events = FlowKitSheetCreatorStatic.GetEventListWithSubIds(scenePath);

// Get conditions for an event
Array conditions = FlowKitSheetCreatorStatic.GetConditionsByEventSubId(scenePath, eventSubId);

// Get actions for an event
Array actions = FlowKitSheetCreatorStatic.GetActionsByEventSubId(scenePath, eventSubId);
```

---

## Forbidden Patterns

1. **Never** use health events without `health` behavior
2. **Never** use collision events without corresponding collision behavior
3. **Never** call `delete_self` without cleanup (can cause errors)
4. **Never** hardcode node paths - use relative paths

---

## Best Practices

1. Always check behavior dependencies before adding events
2. Use conditions to filter event triggers
3. Group related actions in the same event block
4. Use node variables for state management
5. Test event sheets in isolation before integration
