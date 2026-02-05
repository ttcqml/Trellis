# FlowKit Condition Reference

> Complete reference for all 23 FlowKit conditions.

---

## Condition Categories

| Category | Conditions | Node Types |
|----------|------------|------------|
| Variable | 2 | Entity, System |
| Entity State | 2 | Entity |
| Input | 3 | System |
| Game State | 6 | System |
| Platform | 2 | System |
| Performance | 3 | System |
| Audio | 1 | System |
| Window | 3 | System |
| Flow Control | 1 | System |

---

## Using Conditions

Conditions filter when actions execute. All conditions must pass for actions to run.

```python
# Add condition to current event
FlowKitSheetCreatorStatic.AddConditionToEvent(
    condition_id,      # e.g., "compare_health"
    target_node,       # e.g., NodePath(".")
    inputs,            # e.g., {"血量类型": "current", "比较运算符": "<=", "值": 50}
    negated            # False = normal, True = NOT condition
)
```

---

## Variable Conditions

### compare_node_variable

**ID**: `compare_node_variable`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"变量名"` | String | Variable name |
| `"比较运算符"` | String | ==, !=, <, >, <=, >= |
| `"值"` | Variant | Value to compare |

```python
{"变量名": "state", "比较运算符": "==", "值": "attacking"}
```

### compare_variable

**ID**: `compare_variable`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Name"` | String | Variable name |
| `"Comparison"` | String | ==, !=, <, >, <=, >= |
| `"Value"` | Variant | Value to compare |

---

## Entity State Conditions

### compare_faction

**ID**: `compare_faction`
**Target**: Entity
**Requires**: `faction` behavior

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"比较运算符"` | String | "==" | == or != |
| `"阵营"` | String | "中立" | 玩家, 敌人, 中立 |

```python
{"比较运算符": "==", "阵营": "敌人"}
```

### compare_health

**ID**: `compare_health`
**Target**: Entity
**Requires**: `health` behavior

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"血量类型"` | String | "current" | current or max |
| `"比较运算符"` | String | ">=" | Comparison operator |
| `"值"` | int | 0 | Value to compare |

```python
{"血量类型": "current", "比较运算符": "<=", "值": 0}
```

---

## Input Conditions

### is_action_released

**ID**: `is_action_released`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Action"` | String | Input action name |

### is_key_pressed

**ID**: `is_key_pressed`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Key"` | String | Key name (e.g., "W", "Space") |

### is_mouse_button_pressed

**ID**: `is_mouse_button_pressed`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Button"` | String | left, right, middle, wheel_up, wheel_down |

---

## Game State Conditions

### is_paused

**ID**: `is_paused`
**Target**: System
**Parameters**: None

Returns SUCCESS if game is paused.

### is_fast_forward

**ID**: `is_fast_forward`
**Target**: System
**Parameters**: None

Returns SUCCESS if time scale > 1.0.

### is_slow_motion

**ID**: `is_slow_motion`
**Target**: System
**Parameters**: None

Returns SUCCESS if time scale < 1.0.

### compare_enemy_count

**ID**: `compare_enemy_count`
**Target**: System

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"比较运算符"` | String | ">=" | Comparison operator |
| `"数量"` | int | 0 | Count to compare |

```python
{"比较运算符": "==", "数量": 0}  # No enemies remaining
```

### is_elapsed_time_greater

**ID**: `is_elapsed_time_greater`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Seconds"` | float | Time threshold |

### is_debug_build

**ID**: `is_debug_build`
**Target**: System
**Parameters**: None

Returns SUCCESS if running in debug mode.

---

## Platform Conditions

### is_platform

**ID**: `is_platform`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Platform"` | String | windows, linux, macos, android, ios, web |

### is_mobile

**ID**: `is_mobile`
**Target**: System
**Parameters**: None

Returns SUCCESS on Android or iOS.

---

## Performance Conditions

### is_fps_above

**ID**: `is_fps_above`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Threshold"` | float | FPS threshold |

### is_fps_below

**ID**: `is_fps_below`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Threshold"` | float | FPS threshold |

---

## Audio Conditions

### is_audio_bus_muted

**ID**: `is_audio_bus_muted`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"BusName"` | String | Audio bus name |

---

## Window Conditions

### is_window_focused

**ID**: `is_window_focused`
**Target**: System
**Parameters**: None

### is_window_fullscreen

**ID**: `is_window_fullscreen`
**Target**: System
**Parameters**: None

### is_mouse_visible

**ID**: `is_mouse_visible`
**Target**: System
**Parameters**: None

### is_mouse_captured

**ID**: `is_mouse_captured`
**Target**: System
**Parameters**: None

---

## Flow Control Conditions

### only_once_when_looped

**ID**: `only_once_when_looped`
**Target**: System
**Parameters**: None

Returns SUCCESS only once per loop iteration. Resets when event stops triggering.

Useful for:
- Preventing repeated triggers in on_process
- One-time initialization in loops

---

## Negating Conditions

Pass `True` as the `negated` parameter to invert:

```python
# NOT is_paused (game is running)
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "is_paused",
    NodePath("System"),
    {},
    True  # Negated
)
```

---

## Condition Summary Table

| Condition | Entity | System | Behavior |
|-----------|--------|--------|----------|
| compare_node_variable | ✓ | - | - |
| compare_variable | - | ✓ | - |
| compare_faction | ✓ | - | faction |
| compare_health | ✓ | - | health |
| is_action_released | - | ✓ | - |
| is_key_pressed | - | ✓ | - |
| is_mouse_button_pressed | - | ✓ | - |
| is_paused | - | ✓ | - |
| is_fast_forward | - | ✓ | - |
| is_slow_motion | - | ✓ | - |
| compare_enemy_count | - | ✓ | - |
| is_elapsed_time_greater | - | ✓ | - |
| is_debug_build | - | ✓ | - |
| is_platform | - | ✓ | - |
| is_mobile | - | ✓ | - |
| is_fps_above | - | ✓ | - |
| is_fps_below | - | ✓ | - |
| is_audio_bus_muted | - | ✓ | - |
| is_window_focused | - | ✓ | - |
| is_window_fullscreen | - | ✓ | - |
| is_mouse_visible | - | ✓ | - |
| is_mouse_captured | - | ✓ | - |
| only_once_when_looped | - | ✓ | - |
