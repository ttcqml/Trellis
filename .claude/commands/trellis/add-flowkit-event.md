Add FlowKit event logic to an entity or scene.

This command launches the godot-event-builder skill to guide you through event creation.

---

## Before Starting

Read the FlowKit guidelines:
```
cat .trellis/spec/flowkit/index.md
```

## Event Creation Process

The skill will guide you through:

1. **Target Selection**
   - Entity (for entity-specific logic)
   - System (for scene-level logic)

2. **Event Type**
   - Lifecycle (on_ready, on_process)
   - Health (on_health_changed, on_health_decreased)
   - Collision (on_area2d_collision)
   - Input (on_action_down, on_key_pressed)
   - Custom (on_custom_signal)

3. **Conditions** (optional)
   - Health checks (compare_health)
   - State checks (compare_variable)
   - Input checks (is_key_pressed)

4. **Actions**
   - Health modification (change_health)
   - Animation (change_animation)
   - Signals (emit_custom_signal)
   - Scene changes (load_scene)

---

## Usage

Invoke the skill:
```
/godot-event-builder
```

Or describe what you need:
```
When the player's health reaches zero, play death animation and delete the entity
```

The skill will:
- Add required behaviors (if missing)
- Create event block
- Add conditions
- Add actions in correct order

---

## Common Patterns

**Death Handling**:
```
Event: on_health_changed
Condition: compare_health <= 0
Actions: change_animation("death"), delete_self
```

**Damage on Collision**:
```
Event: on_area2d_collision
Condition: compare_faction == "敌人"
Action: change_health(-10)
```

**Wave Complete**:
```
Event: on_enemy_count_changed
Condition: compare_enemy_count == 0
Action: emit_custom_signal("wave_complete")
```

---

## After Creation

Verify with:
```
/trellis:check-entity
```
or
```
/trellis:check-scene
```
