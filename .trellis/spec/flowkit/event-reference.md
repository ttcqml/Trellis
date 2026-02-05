# FlowKit Event Reference

> Complete reference for all 30 FlowKit events.

---

## Event Categories

| Category | Events | Node Types |
|----------|--------|------------|
| Lifecycle | 4 | Entity, System |
| Collision | 2 | Entity |
| Health | 3 | Entity |
| Input | 7 | System |
| Game State | 5 | System |
| Window | 3 | System |
| Custom | 2 | System |

---

## Lifecycle Events

### on_process

**ID**: `on_process`
**Description**: Runs every frame
**Target**: Entity or System
**Parameters**: None

```python
FlowKitSheetCreatorStatic.AddEvent("on_process", NodePath("."))
```

### on_process_physics

**ID**: `on_process_physics`
**Description**: Runs every physics frame
**Target**: Entity or System
**Parameters**: None

### on_ready

**ID**: `on_ready`
**Description**: Runs when node enters scene
**Target**: Entity or System
**Parameters**: None

### on_scene_ready

**ID**: `on_scene_ready`
**Description**: Runs when scene fully loads
**Target**: System only
**Parameters**: None

---

## Collision Events

### on_area2d_collision

**ID**: `on_area2d_collision`
**Description**: Area2D collision detected
**Target**: Entity
**Requires**: `area2d` behavior

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"碰撞类型"` | String | `"body"` | `"body"` or `"area"` |

```python
FlowKitSheetCreatorStatic.AddEvent(
    "on_area2d_collision",
    NodePath("."),
    {"碰撞类型": "body"}
)
```

### on_characterbody2d_collision

**ID**: `on_characterbody2d_collision`
**Description**: CharacterBody2D collision via move_and_slide()
**Target**: Entity
**Requires**: `characterbody2d_collision` behavior
**Parameters**: None

---

## Health Events

### on_health_changed

**ID**: `on_health_changed`
**Description**: Health value changed (any direction)
**Target**: Entity
**Requires**: `health` behavior
**Parameters**: None

### on_health_decreased

**ID**: `on_health_decreased`
**Description**: Health decreased (damage taken)
**Target**: Entity
**Requires**: `health` behavior
**Parameters**: None

### on_health_increased

**ID**: `on_health_increased`
**Description**: Health increased (healing)
**Target**: Entity
**Requires**: `health` behavior
**Parameters**: None

---

## Input Events

### on_action_down

**ID**: `on_action_down`
**Description**: Input action just pressed (once)
**Target**: System only

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"action"` | String | Input action name |

```python
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath("System"),
    {"action": "attack"}
)
```

### on_action_pressed

**ID**: `on_action_pressed`
**Description**: Input action held down
**Target**: System only
**Parameters**: Same as on_action_down

### on_action_released

**ID**: `on_action_released`
**Description**: Input action released
**Target**: System only
**Parameters**: Same as on_action_down

### on_key_pressed

**ID**: `on_key_pressed`
**Description**: Keyboard key pressed
**Target**: System only

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"key"` | String | Key name (e.g., "W", "Space", "Escape") |

### on_key_released

**ID**: `on_key_released`
**Description**: Keyboard key released
**Target**: System only
**Parameters**: Same as on_key_pressed

### on_mouse_button_pressed

**ID**: `on_mouse_button_pressed`
**Description**: Mouse button pressed
**Target**: System only

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"button"` | String | "left", "right", "middle", "wheel_up", "wheel_down" |

### on_mouse_button_released

**ID**: `on_mouse_button_released`
**Description**: Mouse button released
**Target**: System only
**Parameters**: Same as on_mouse_button_pressed

---

## Game State Events

### on_paused

**ID**: `on_paused`
**Description**: Game paused
**Target**: System only
**Parameters**: None

### on_unpaused

**ID**: `on_unpaused`
**Description**: Game unpaused
**Target**: System only
**Parameters**: None

### on_pause_state_changed

**ID**: `on_pause_state_changed`
**Description**: Pause state toggled
**Target**: System only
**Parameters**: None

### on_time_scale_changed

**ID**: `on_time_scale_changed`
**Description**: Time scale modified
**Target**: System only
**Parameters**: None

### on_physics_process

**ID**: `on_physics_process`
**Description**: Physics frame (System version)
**Target**: System only
**Parameters**: None

---

## Window Events

### on_window_focus_changed

**ID**: `on_window_focus_changed`
**Description**: Window focus changed
**Target**: System only
**Parameters**: None

### on_window_focus_gained

**ID**: `on_window_focus_gained`
**Description**: Window gained focus
**Target**: System only
**Parameters**: None

### on_window_focus_lost

**ID**: `on_window_focus_lost`
**Description**: Window lost focus
**Target**: System only
**Parameters**: None

---

## Custom Events

### on_custom_signal

**ID**: `on_custom_signal`
**Description**: Custom signal received
**Target**: System only

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"信号名"` | String | Signal name to listen for |

```python
FlowKitSheetCreatorStatic.AddEvent(
    "on_custom_signal",
    NodePath("System"),
    {"信号名": "wave_complete"}
)
```

### on_enemy_count_changed

**ID**: `on_enemy_count_changed`
**Description**: Enemy group count changed
**Target**: System only

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"最小变化量"` | int | 1 | Minimum change to trigger |

```python
FlowKitSheetCreatorStatic.AddEvent(
    "on_enemy_count_changed",
    NodePath("System"),
    {"最小变化量": 1}
)
```

---

## Event Usage Summary

| Event | Entity | System | Behavior Required |
|-------|--------|--------|-------------------|
| on_process | ✓ | ✓ | - |
| on_process_physics | ✓ | ✓ | - |
| on_ready | ✓ | ✓ | - |
| on_scene_ready | - | ✓ | - |
| on_area2d_collision | ✓ | - | area2d |
| on_characterbody2d_collision | ✓ | - | characterbody2d_collision |
| on_health_changed | ✓ | - | health |
| on_health_decreased | ✓ | - | health |
| on_health_increased | ✓ | - | health |
| on_action_down | - | ✓ | - |
| on_action_pressed | - | ✓ | - |
| on_action_released | - | ✓ | - |
| on_key_pressed | - | ✓ | - |
| on_key_released | - | ✓ | - |
| on_mouse_button_pressed | - | ✓ | - |
| on_mouse_button_released | - | ✓ | - |
| on_paused | - | ✓ | - |
| on_unpaused | - | ✓ | - |
| on_pause_state_changed | - | ✓ | - |
| on_time_scale_changed | - | ✓ | - |
| on_physics_process | - | ✓ | - |
| on_window_focus_changed | - | ✓ | - |
| on_window_focus_gained | - | ✓ | - |
| on_window_focus_lost | - | ✓ | - |
| on_custom_signal | - | ✓ | - |
| on_enemy_count_changed | - | ✓ | - |
