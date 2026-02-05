# FlowKit Action Reference

> Complete reference for all 51 FlowKit actions.

---

## Action Categories

| Category | Actions | Node Types |
|----------|---------|------------|
| Entity Transform | 6 | Entity |
| Entity Spawn | 2 | Entity |
| Entity State | 4 | Entity |
| Health | 2 | Entity |
| Collision | 2 | Entity |
| Timer | 2 | Entity |
| Animation | 1 | Entity |
| Variables | 3 | System |
| Functions | 2 | System |
| Signals | 1 | System |
| Scene | 3 | System |
| Input | 2 | System |
| Game State | 4 | System |
| Time | 1 | System |
| Audio | 2 | System |
| Window | 7 | System |
| Mouse | 4 | System |
| System | 4 | System |

---

## Entity Transform Actions

### set_position_x

**ID**: `set_position_x`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"X"` | float | X coordinate to set |

```python
{"X": 100.0}
```

### set_position_y

**ID**: `set_position_y`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Y"` | float | Y coordinate to set |

### set_rotation

**ID**: `set_rotation`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Rotation"` | float | Rotation in radians |

### teleport_to_node

**ID**: `teleport_to_node`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"目标节点路径"` | String | Target node path (relative to scene root) |

```python
{"目标节点路径": "FMonsterTest"}
```

---

## Entity Spawn Actions

### instantiate_entity_at_position

**ID**: `instantiate_entity_at_position`
**Target**: Entity

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"X"` | float | 0.0 | X coordinate |
| `"Y"` | float | 0.0 | Y coordinate |

```python
{"X": 100.0, "Y": 200.0}
```

### instantiate_entity_random_position

**ID**: `instantiate_entity_random_position`
**Target**: Entity

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"X 最小值"` | float | -100.0 | Minimum X |
| `"X 最大值"` | float | 100.0 | Maximum X |
| `"Y 最小值"` | float | -100.0 | Minimum Y |
| `"Y 最大值"` | float | 100.0 | Maximum Y |

---

## Entity State Actions

### delete_self

**ID**: `delete_self`
**Target**: Entity
**Parameters**: None

Calls `queue_free()` on the node.

### set_node_enabled

**ID**: `set_node_enabled`
**Target**: Entity or System

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"启用"` | bool | false | true = enable, false = disable |

Disables process, physics_process, input, and visibility.

### set_node_variable

**ID**: `set_node_variable`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"变量名"` | String | Variable name |
| `"值"` | String | Value to set |

```python
{"变量名": "state", "值": "attacking"}
```

---

## Health Actions

### change_health

**ID**: `change_health`
**Target**: Entity
**Requires**: `health` behavior

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"血量变化"` | int | 0 | Positive = heal, negative = damage |

```python
{"血量变化": -20}  # Deal 20 damage
{"血量变化": 10}   # Heal 10 HP
```

### damage_fcharacter_on_collision

**ID**: `damage_fcharacter_on_collision`
**Target**: Entity
**Requires**: `area2d` and `health` behaviors

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"伤害值"` | int | 20 | Damage amount |
| `"碰撞类型"` | String | "body" | "body" or "area" |

---

## Collision Actions

### print_collision_body_name

**ID**: `print_collision_body_name`
**Target**: Entity

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"碰撞类型"` | String | "body" | "body" or "area" |

### printerr_last_collider_name

**ID**: `printerr_last_collider_name`
**Target**: Entity
**Parameters**: None

Prints the last collider name from CharacterBody2D collision.

---

## Timer Actions

### create_node_timer

**ID**: `create_node_timer`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Timer Name"` | String | Timer identifier |
| `"Value"` | float | Timer duration in seconds |

### bind_node_timer

**ID**: `bind_node_timer`
**Target**: Entity

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Timer Name"` | String | Timer identifier |
| `"callable"` | Callable | Function to bind |

---

## Animation Actions

### change_animation

**ID**: `change_animation`
**Target**: Entity
**Requires**: `animated_sprite2d` behavior

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"动画名"` | String | "" | Animation name from SpriteFrames |

```python
{"动画名": "walk"}
```

---

## Variable Actions (System)

### set_variable

**ID**: `set_variable`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Name"` | String | Variable name |
| `"Value"` | Variant | Value to set |

### add_to_variable

**ID**: `add_to_variable`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Name"` | String | Variable name |
| `"Value"` | float | Value to add |

---

## Function Actions (System)

### define_function

**ID**: `define_function`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Name"` | String | Function name |

Combines all actions in current event block into a reusable function.

### call_function

**ID**: `call_function`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Name"` | String | Function name to call |

---

## Signal Actions

### emit_custom_signal

**ID**: `emit_custom_signal`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"信号名"` | String | Signal name |
| `"信号数据"` | Variant | Optional data to pass |

```python
{"信号名": "wave_complete", "信号数据": 5}
```

---

## Scene Actions

### load_scene

**ID**: `load_scene`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"scene"` | PackedScene | Scene to load |
| `"position"` | Vector2 | Spawn position |

### replace_game_scene

**ID**: `replace_game_scene`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"scene"` | PackedScene | Scene to load |
| `"position"` | Vector2 | Spawn position |

### reload_scene

**ID**: `reload_scene`
**Target**: System
**Parameters**: None

---

## Input Actions

### action_press

**ID**: `action_press`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"按键名"` | String | Input action name |
| `"力度"` | float | Strength (0.0 to 1.0) |

### action_release

**ID**: `action_release`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Action"` | String | Input action name |

---

## Game State Actions

### pause_game

**ID**: `pause_game`
**Target**: System
**Parameters**: None

### unpause_game

**ID**: `unpause_game`
**Target**: System
**Parameters**: None

### toggle_pause

**ID**: `toggle_pause`
**Target**: System
**Parameters**: None

### close_game

**ID**: `close_game`
**Target**: System
**Parameters**: None

---

## Time Actions

### set_time_scale

**ID**: `set_time_scale`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Scale"` | float | 1.0 = normal, 0.5 = half, 2.0 = double |

---

## Audio Actions

### set_audio_bus_mute

**ID**: `set_audio_bus_mute`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"BusName"` | String | Audio bus name |
| `"Muted"` | bool | Mute state |

### set_audio_bus_volume

**ID**: `set_audio_bus_volume`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"BusName"` | String | Audio bus name |
| `"VolumeDb"` | float | Volume in dB (0 = normal, -80 = silent) |

---

## Window Actions

### set_window_mode

**ID**: `set_window_mode`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Mode"` | String | windowed, fullscreen, borderless, minimized, maximized |

### set_window_size

**ID**: `set_window_size`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Width"` | int | Width in pixels |
| `"Height"` | int | Height in pixels |

### set_window_position

**ID**: `set_window_position`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"X"` | int | X position |
| `"Y"` | int | Y position |

### set_window_title

**ID**: `set_window_title`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Title"` | String | Window title |

### center_window

**ID**: `center_window`
**Target**: System
**Parameters**: None

### set_vsync

**ID**: `set_vsync`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Enabled"` | bool | VSync state |

### set_max_fps

**ID**: `set_max_fps`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"MaxFPS"` | int | FPS limit (0 = unlimited) |

---

## Mouse Actions

### set_mouse_visible

**ID**: `set_mouse_visible`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Visible"` | bool | Cursor visibility |

### set_mouse_captured

**ID**: `set_mouse_captured`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Captured"` | bool | Lock cursor to window center |

### set_mouse_cursor

**ID**: `set_mouse_cursor`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"CursorPath"` | String | Path to cursor texture |
| `"HotspotX"` | int | Hotspot X |
| `"HotspotY"` | int | Hotspot Y |

### warp_mouse

**ID**: `warp_mouse`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"X"` | float | Target X position |
| `"Y"` | float | Target Y position |

---

## System Actions

### print

**ID**: `print`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Message"` | String | Message to print |

### printerr

**ID**: `printerr`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Message"` | String | Error message to print |

### open_url

**ID**: `open_url`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"URL"` | String | URL to open in browser |

### set_clipboard

**ID**: `set_clipboard`
**Target**: System

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"Text"` | String | Text to copy |

### vibrate

**ID**: `vibrate`
**Target**: System (mobile only)

**Parameters**:
| Key | Type | Description |
|-----|------|-------------|
| `"DurationMs"` | int | Vibration duration in milliseconds |

---

## Action Summary Table

| Action | Entity | System | Behavior |
|--------|--------|--------|----------|
| set_position_x | ✓ | - | - |
| set_position_y | ✓ | - | - |
| set_rotation | ✓ | - | - |
| teleport_to_node | ✓ | - | - |
| instantiate_entity_at_position | ✓ | - | - |
| instantiate_entity_random_position | ✓ | - | - |
| delete_self | ✓ | - | - |
| set_node_enabled | ✓ | ✓ | - |
| set_node_variable | ✓ | - | - |
| change_health | ✓ | - | health |
| damage_fcharacter_on_collision | ✓ | - | area2d, health |
| change_animation | ✓ | - | animated_sprite2d |
| create_node_timer | ✓ | - | - |
| bind_node_timer | ✓ | - | - |
| print_collision_body_name | ✓ | - | area2d |
| printerr_last_collider_name | ✓ | - | characterbody2d_collision |
| set_variable | - | ✓ | - |
| add_to_variable | - | ✓ | - |
| define_function | - | ✓ | - |
| call_function | - | ✓ | - |
| emit_custom_signal | - | ✓ | - |
| load_scene | - | ✓ | - |
| replace_game_scene | - | ✓ | - |
| reload_scene | - | ✓ | - |
| action_press | - | ✓ | - |
| action_release | - | ✓ | - |
| pause_game | - | ✓ | - |
| unpause_game | - | ✓ | - |
| toggle_pause | - | ✓ | - |
| close_game | - | ✓ | - |
| set_time_scale | - | ✓ | - |
| set_audio_bus_mute | - | ✓ | - |
| set_audio_bus_volume | - | ✓ | - |
| set_window_mode | - | ✓ | - |
| set_window_size | - | ✓ | - |
| set_window_position | - | ✓ | - |
| set_window_title | - | ✓ | - |
| center_window | - | ✓ | - |
| set_vsync | - | ✓ | - |
| set_max_fps | - | ✓ | - |
| set_mouse_visible | - | ✓ | - |
| set_mouse_captured | - | ✓ | - |
| set_mouse_cursor | - | ✓ | - |
| warp_mouse | - | ✓ | - |
| print | - | ✓ | - |
| printerr | - | ✓ | - |
| open_url | - | ✓ | - |
| set_clipboard | - | ✓ | - |
| vibrate | - | ✓ | - |
