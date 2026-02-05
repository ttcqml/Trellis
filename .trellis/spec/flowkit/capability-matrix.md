# FlowKit Capability Matrix

> Node type capabilities for events, conditions, actions, and behaviors.

---

## Node Types Overview

| Node Type | Description | Base Class |
|-----------|-------------|------------|
| System | Global game events | - |
| Entity | Game objects with behaviors | Role |
| FCharacter | Player character | Entity |
| CharacterBody2D | Physics body | Godot built-in |

---

## Events Capability Matrix

| Event | Entity | System | CharacterBody2D | Behavior Required |
|-------|--------|--------|-----------------|-------------------|
| on_process | ✓ | ✓ | - | - |
| on_process_physics | ✓ | ✓ | - | - |
| on_ready | ✓ | ✓ | - | - |
| on_scene_ready | - | ✓ | - | - |
| on_area2d_collision | ✓ | - | - | area2d |
| on_characterbody2d_collision | ✓ | - | ✓ | characterbody2d_collision |
| on_health_changed | ✓ | - | - | health |
| on_health_decreased | ✓ | - | - | health |
| on_health_increased | ✓ | - | - | health |
| on_action_down | - | ✓ | - | - |
| on_action_pressed | - | ✓ | - | - |
| on_action_released | - | ✓ | - | - |
| on_key_pressed | - | ✓ | - | - |
| on_key_released | - | ✓ | - | - |
| on_mouse_button_pressed | - | ✓ | - | - |
| on_mouse_button_released | - | ✓ | - | - |
| on_paused | - | ✓ | - | - |
| on_unpaused | - | ✓ | - | - |
| on_pause_state_changed | - | ✓ | - | - |
| on_time_scale_changed | - | ✓ | - | - |
| on_physics_process | - | ✓ | - | - |
| on_window_focus_changed | - | ✓ | - | - |
| on_window_focus_gained | - | ✓ | - | - |
| on_window_focus_lost | - | ✓ | - | - |
| on_custom_signal | - | ✓ | - | - |
| on_enemy_count_changed | - | ✓ | - | - |

---

## Conditions Capability Matrix

| Condition | Entity | System | CharacterBody2D | Behavior Required |
|-----------|--------|--------|-----------------|-------------------|
| compare_node_variable | ✓ | - | - | - |
| compare_variable | - | ✓ | - | - |
| compare_faction | ✓ | - | - | faction |
| compare_health | ✓ | - | - | health |
| compare_enemy_count | - | ✓ | - | - |
| is_action_released | - | ✓ | - | - |
| is_key_pressed | - | ✓ | - | - |
| is_mouse_button_pressed | - | ✓ | - | - |
| is_paused | - | ✓ | - | - |
| is_fast_forward | - | ✓ | - | - |
| is_slow_motion | - | ✓ | - | - |
| is_elapsed_time_greater | - | ✓ | - | - |
| is_debug_build | - | ✓ | - | - |
| is_platform | - | ✓ | - | - |
| is_mobile | - | ✓ | - | - |
| is_fps_above | - | ✓ | - | - |
| is_fps_below | - | ✓ | - | - |
| is_audio_bus_muted | - | ✓ | - | - |
| is_window_focused | - | ✓ | - | - |
| is_window_fullscreen | - | ✓ | - | - |
| is_mouse_visible | - | ✓ | - | - |
| is_mouse_captured | - | ✓ | - | - |
| only_once_when_looped | - | ✓ | - | - |

---

## Actions Capability Matrix

| Action | Entity | System | CharacterBody2D | FCharacter | Behavior Required |
|--------|--------|--------|-----------------|------------|-------------------|
| set_position_x | ✓ | - | - | - | - |
| set_position_y | ✓ | - | - | - | - |
| set_rotation | ✓ | - | - | - | - |
| teleport_to_node | ✓ | - | - | - | - |
| instantiate_entity_at_position | ✓ | - | - | - | - |
| instantiate_entity_random_position | ✓ | - | - | - | - |
| delete_self | ✓ | - | - | - | - |
| set_node_enabled | ✓ | ✓ | - | - | - |
| set_node_variable | ✓ | - | - | - | - |
| change_animation | ✓ | - | - | - | animated_sprite2d |
| change_health | ✓ | - | - | - | health |
| damage_fcharacter_on_collision | - | - | - | ✓ | area2d, health |
| print_collision_body_name | ✓ | - | - | - | area2d |
| printerr_last_collider_name | ✓ | - | ✓ | - | characterbody2d_collision |
| create_node_timer | ✓ | - | - | - | - |
| bind_node_timer | ✓ | - | - | - | - |
| set_variable | - | ✓ | - | - | - |
| add_to_variable | - | ✓ | - | - | - |
| define_function | - | ✓ | - | - | - |
| call_function | - | ✓ | - | - | - |
| emit_custom_signal | - | ✓ | - | - | - |
| load_scene | - | ✓ | - | - | - |
| replace_game_scene | - | ✓ | - | - | - |
| reload_scene | - | ✓ | - | - | - |
| action_press | - | ✓ | - | - | - |
| action_release | - | ✓ | - | - | - |
| pause_game | - | ✓ | - | - | - |
| unpause_game | - | ✓ | - | - | - |
| toggle_pause | - | ✓ | - | - | - |
| close_game | - | ✓ | - | - | - |
| set_time_scale | - | ✓ | - | - | - |
| set_audio_bus_mute | - | ✓ | - | - | - |
| set_audio_bus_volume | - | ✓ | - | - | - |
| set_window_mode | - | ✓ | - | - | - |
| set_window_size | - | ✓ | - | - | - |
| set_window_position | - | ✓ | - | - | - |
| set_window_title | - | ✓ | - | - | - |
| center_window | - | ✓ | - | - | - |
| set_vsync | - | ✓ | - | - | - |
| set_max_fps | - | ✓ | - | - | - |
| set_mouse_visible | - | ✓ | - | - | - |
| set_mouse_captured | - | ✓ | - | - | - |
| set_mouse_cursor | - | ✓ | - | - | - |
| warp_mouse | - | ✓ | - | - | - |
| print | - | ✓ | - | - | - |
| printerr | - | ✓ | - | - | - |
| open_url | - | ✓ | - | - | - |
| set_clipboard | - | ✓ | - | - | - |
| vibrate | - | ✓ | - | - | - |

---

## Behaviors Capability Matrix

| Behavior | Entity | System | CharacterBody2D | FCharacter |
|----------|--------|--------|-----------------|------------|
| animated_sprite2d | ✓ | - | - | - |
| sprite2d | ✓ | - | - | - |
| area2d | ✓ | - | - | - |
| characterbody2d_collision | ✓ | - | ✓ | - |
| health | ✓ | - | - | - |
| faction | ✓ | - | - | - |
| skill_box | ✓ | - | - | - |
| behavior_tree | ✓ | - | - | - |
| camera2d | ✓ | - | - | - |
| speed | ✓ | - | - | - |
| death_effect | ✓ | - | - | - |
| hp_bar | ✓ | - | - | - |
| signal_broadcaster | ✓ | - | - | - |

---

## Capability by Use Case

### Player Entity

| Feature | Events | Conditions | Actions | Behaviors |
|---------|--------|------------|---------|-----------|
| Movement | on_process | - | set_position_x/y | speed |
| Combat | on_health_decreased | compare_health | change_health | health, skill_box |
| Animation | - | - | change_animation | animated_sprite2d |
| Input | on_action_down | is_key_pressed | - | - |
| Collision | on_area2d_collision | compare_faction | damage_fcharacter_on_collision | area2d, faction |

### Enemy Entity

| Feature | Events | Conditions | Actions | Behaviors |
|---------|--------|------------|---------|-----------|
| AI | on_process | compare_health | - | behavior_tree |
| Combat | on_health_changed | compare_health | change_health | health, faction |
| Death | on_health_decreased | compare_health <= 0 | delete_self | death_effect |
| Collision | on_characterbody2d_collision | - | - | characterbody2d_collision |

### Game System

| Feature | Events | Conditions | Actions | Behaviors |
|---------|--------|------------|---------|-----------|
| Pause | on_action_down (pause) | is_paused | toggle_pause | - |
| Wave | on_enemy_count_changed | compare_enemy_count == 0 | emit_custom_signal | - |
| Scene | on_scene_ready | - | load_scene | - |
| Audio | - | is_audio_bus_muted | set_audio_bus_volume | - |

---

## Quick Reference

### Entity-Only Features
- Health events (on_health_*)
- Collision events (on_area2d_collision)
- Transform actions (set_position_*, teleport_*)
- All behaviors

### System-Only Features
- Input events (on_action_*, on_key_*, on_mouse_*)
- Window events (on_window_*)
- Game state events (on_paused, on_time_scale_changed)
- Scene management (load_scene, replace_game_scene)
- Global variables (set_variable, compare_variable)

### Shared Features
- Lifecycle (on_process, on_ready)
- Node enable (set_node_enabled)
