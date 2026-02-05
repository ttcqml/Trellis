# FlowKit Scene Patterns

> System-level Event-Condition-Action patterns for game scenes.

---

## System Node Capabilities

System nodes support 21 events, 20 conditions, 34 actions, and 0 behaviors.

---

## Events (21)

### Lifecycle Events

| Event ID | Description |
|----------|-------------|
| `on_process` | Every frame update |
| `on_process_physics` | Every physics frame |
| `on_ready` | Scene enters tree |
| `on_scene_ready` | Scene fully loaded |

### Input Events

| Event ID | Description | Parameters |
|----------|-------------|------------|
| `on_action_down` | Input action pressed (once) | `action` |
| `on_action_pressed` | Input action held | `action` |
| `on_action_released` | Input action released | `action` |
| `on_key_pressed` | Keyboard key pressed | `key` |
| `on_key_released` | Keyboard key released | `key` |
| `on_mouse_button_pressed` | Mouse button pressed | `button` |
| `on_mouse_button_released` | Mouse button released | `button` |

### Game State Events

| Event ID | Description |
|----------|-------------|
| `on_paused` | Game paused |
| `on_unpaused` | Game unpaused |
| `on_pause_state_changed` | Pause state changed |
| `on_time_scale_changed` | Time scale modified |

### Custom Events

| Event ID | Description | Parameters |
|----------|-------------|------------|
| `on_custom_signal` | Custom signal received | `信号名` |
| `on_enemy_count_changed` | Enemy count changed | `最小变化量` |

### Window Events

| Event ID | Description |
|----------|-------------|
| `on_window_focus_changed` | Window focus changed |
| `on_window_focus_gained` | Window gained focus |
| `on_window_focus_lost` | Window lost focus |

---

## Conditions (20)

### Variable Conditions

| Condition ID | Description | Parameters |
|--------------|-------------|------------|
| `compare_variable` | Compare global variable | `Name`, `Comparison`, `Value` |
| `compare_enemy_count` | Compare enemy count | `比较运算符`, `数量` |

### Input Conditions

| Condition ID | Description | Parameters |
|--------------|-------------|------------|
| `is_action_released` | Check if action released | `Action` |
| `is_key_pressed` | Check if key pressed | `Key` |
| `is_mouse_button_pressed` | Check if mouse button pressed | `Button` |

### State Conditions

| Condition ID | Description |
|--------------|-------------|
| `is_paused` | Check if game paused |
| `is_fast_forward` | Check if time scale > 1 |
| `is_slow_motion` | Check if time scale < 1 |
| `only_once_when_looped` | Run once per loop |

### System Conditions

| Condition ID | Description | Parameters |
|--------------|-------------|------------|
| `is_platform` | Check platform | `Platform` |
| `is_mobile` | Check if mobile device | - |
| `is_debug_build` | Check if debug build | - |
| `is_fps_above` | Check FPS above threshold | `Threshold` |
| `is_fps_below` | Check FPS below threshold | `Threshold` |
| `is_elapsed_time_greater` | Check elapsed time | `Seconds` |

### Audio Conditions

| Condition ID | Description | Parameters |
|--------------|-------------|------------|
| `is_audio_bus_muted` | Check if bus muted | `BusName` |

### Window Conditions

| Condition ID | Description |
|--------------|-------------|
| `is_window_focused` | Check if window focused |
| `is_window_fullscreen` | Check if fullscreen |
| `is_mouse_visible` | Check if cursor visible |
| `is_mouse_captured` | Check if cursor captured |

---

## Actions (34)

### Scene Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `load_scene` | Load scene additively | `scene`, `position` |
| `replace_game_scene` | Replace current scene | `scene` |
| `reload_scene` | Reload current scene | - |

### Node Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `set_node_enabled` | Enable/disable node | `启用` |

### Variable Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `set_variable` | Set global variable | `Name`, `Value` |
| `add_to_variable` | Add to numeric variable | `Name`, `Value` |

### Function Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `define_function` | Define reusable function | `Name` |
| `call_function` | Call defined function | `Name` |

### Signal Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `emit_custom_signal` | Send custom signal | `信号名`, `信号数据` |

### Input Simulation

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `action_press` | Simulate action press | `按键名`, `力度` |
| `action_release` | Simulate action release | `Action` |

### Game Control

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `pause_game` | Pause game | - |
| `unpause_game` | Unpause game | - |
| `toggle_pause` | Toggle pause state | - |
| `set_time_scale` | Set game speed | `Scale` |
| `close_game` | Close application | - |

### Window Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `set_window_mode` | Set window mode | `Mode` |
| `set_window_size` | Set window size | `Width`, `Height` |
| `set_window_position` | Set window position | `X`, `Y` |
| `set_window_title` | Set window title | `Title` |
| `center_window` | Center on screen | - |

### Mouse Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `set_mouse_visible` | Show/hide cursor | `Visible` |
| `set_mouse_captured` | Capture/release cursor | `Captured` |
| `set_mouse_cursor` | Set custom cursor | `CursorPath`, `HotspotX/Y` |
| `warp_mouse` | Move cursor position | `X`, `Y` |

### Audio Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `set_audio_bus_volume` | Set bus volume | `BusName`, `VolumeDb` |
| `set_audio_bus_mute` | Mute/unmute bus | `BusName`, `Muted` |

### System Actions

| Action ID | Description | Parameters |
|-----------|-------------|------------|
| `print` | Print to console | `Message` |
| `printerr` | Print error to console | `Message` |
| `set_clipboard` | Set clipboard text | `Text` |
| `open_url` | Open URL in browser | `URL` |
| `set_vsync` | Set VSync | `Enabled` |
| `set_max_fps` | Set FPS limit | `MaxFPS` |
| `vibrate` | Vibrate mobile device | `DurationMs` |

---

## Common Scene Patterns

### Scene Initialization

```python
# Event: Scene ready
FlowKitSheetCreatorStatic.AddEvent("on_scene_ready", NodePath("System"))

# Action: Print start message
FlowKitSheetCreatorStatic.AddActionToEvent("print", NodePath("System"),
    {"Message": "Scene loaded successfully"})

# Action: Set initial variable
FlowKitSheetCreatorStatic.AddActionToEvent("set_variable", NodePath("System"),
    {"Name": "wave_number", "Value": 1})
```

### Pause System

```python
# Event: Escape key pressed
FlowKitSheetCreatorStatic.AddEvent("on_key_pressed", NodePath("System"),
    {"key": "Escape"})

# Action: Toggle pause
FlowKitSheetCreatorStatic.AddActionToEvent("toggle_pause", NodePath("System"), {})
```

### Wave Spawning

```python
# Event: Enemy count changed
FlowKitSheetCreatorStatic.AddEvent("on_enemy_count_changed", NodePath("System"),
    {"最小变化量": 1})

# Condition: No enemies remain
FlowKitSheetCreatorStatic.AddConditionToEvent("compare_enemy_count", NodePath("System"),
    {"比较运算符": "==", "数量": 0}, False)

# Action: Send wave complete signal
FlowKitSheetCreatorStatic.AddActionToEvent("emit_custom_signal", NodePath("System"),
    {"信号名": "wave_complete"})
```

### Level Transition

```python
# Event: Custom signal "level_complete"
FlowKitSheetCreatorStatic.AddEvent("on_custom_signal", NodePath("System"),
    {"信号名": "level_complete"})

# Action: Replace scene
FlowKitSheetCreatorStatic.AddActionToEvent("replace_game_scene", NodePath("System"),
    {"scene": "res://Game_flowkit/Scenes/Stage/Level02.tscn"})
```

### Victory Condition

```python
# Event: Enemy count changed
FlowKitSheetCreatorStatic.AddEvent("on_enemy_count_changed", NodePath("System"),
    {"最小变化量": 1})

# Condition: All enemies defeated
FlowKitSheetCreatorStatic.AddConditionToEvent("compare_enemy_count", NodePath("System"),
    {"比较运算符": "==", "数量": 0}, False)

# Condition: Played for at least 10 seconds (not instant win)
FlowKitSheetCreatorStatic.AddConditionToEvent("is_elapsed_time_greater", NodePath("System"),
    {"Seconds": 10.0}, False)

# Action: Show victory
FlowKitSheetCreatorStatic.AddActionToEvent("emit_custom_signal", NodePath("System"),
    {"信号名": "victory"})
```

---

## Forbidden Patterns

1. **Never** use `on_process` for input - use input events
2. **Never** pause without unpause mechanism
3. **Never** close game without confirmation
4. **Never** use `reload_scene` in tight loops
5. **Never** modify time scale without restoring

---

## Best Practices

1. Initialize variables in `on_scene_ready`
2. Use custom signals for game events
3. Group related logic with `define_function`
4. Use conditions to guard dangerous actions
5. Test all input events with actual input
