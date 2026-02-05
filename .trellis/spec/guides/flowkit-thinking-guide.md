# FlowKit Thinking Guide

> **Purpose**: Design effective event-driven game logic with FlowKit.

---

## The Problem

**FlowKit is powerful but can lead to spaghetti logic** if not designed carefully.

Common FlowKit issues:
- Events never trigger (wrong target or missing behavior)
- Conditions block unexpectedly
- Actions execute in wrong order
- Entity vs System confusion

---

## FlowKit Mental Model

```
┌─────────────────────────────────────────┐
│              Event Block                 │
├─────────────────────────────────────────┤
│  EVENT: When does this trigger?          │
│    └── Target: Entity or System?         │
├─────────────────────────────────────────┤
│  CONDITIONS: Should actions run?         │
│    └── ALL must pass (AND logic)         │
│    └── Can be negated                    │
├─────────────────────────────────────────┤
│  ACTIONS: What happens?                  │
│    └── Execute in order                  │
│    └── Each has target node              │
└─────────────────────────────────────────┘
```

---

## Before Creating Event Blocks

### Step 1: Choose Event Target

| Use Entity Target | Use System Target |
|-------------------|-------------------|
| Health changes | Input events |
| Collision detection | Scene ready |
| Per-entity logic | Global game state |
| on_ready, on_process | Pause events |
| Behavior-dependent | Window events |

### Step 2: Check Required Behaviors

| Event | Required Behavior |
|-------|-------------------|
| on_health_changed | health |
| on_health_decreased | health |
| on_health_increased | health |
| on_area2d_collision | area2d |
| on_characterbody2d_collision | characterbody2d_collision |
| compare_faction | faction |

### Step 3: Design Condition Logic

```
Conditions are AND logic:
Condition1 AND Condition2 AND Condition3 = Actions run

Use negation for NOT:
is_paused (negated=True) = Game is NOT paused
```

---

## Common Patterns

### Pattern 1: Death Handling

```python
# Event: Health changed
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

# Action: Delete entity
FlowKitSheetCreatorStatic.AddActionToEvent(
    "delete_self",
    NodePath("."),
    {}
)
```

### Pattern 2: Input Handling

```python
# Event: Action pressed
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath("System"),
    {"action": "pause"}
)

# Condition: Game not already paused (optional)
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "is_paused",
    NodePath("System"),
    {},
    True  # Negated = NOT paused
)

# Action: Toggle pause
FlowKitSheetCreatorStatic.AddActionToEvent(
    "toggle_pause",
    NodePath("System"),
    {}
)
```

### Pattern 3: Collision Response

```python
# Event: Collision detected
FlowKitSheetCreatorStatic.AddEvent(
    "on_area2d_collision",
    NodePath("."),
    {"碰撞类型": "body"}
)

# Condition: Collided with enemy faction
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "compare_faction",
    NodePath("."),
    {"比较运算符": "==", "阵营": "敌人"},
    False
)

# Action: Take damage
FlowKitSheetCreatorStatic.AddActionToEvent(
    "change_health",
    NodePath("."),
    {"血量变化": -10}
)
```

### Pattern 4: Wave Complete Signal

```python
# Event: Enemy count changed
FlowKitSheetCreatorStatic.AddEvent(
    "on_enemy_count_changed",
    NodePath("System"),
    {"最小变化量": 1}
)

# Condition: No enemies remain
FlowKitSheetCreatorStatic.AddConditionToEvent(
    "compare_enemy_count",
    NodePath("System"),
    {"比较运算符": "==", "数量": 0},
    False
)

# Action: Emit wave complete signal
FlowKitSheetCreatorStatic.AddActionToEvent(
    "emit_custom_signal",
    NodePath("System"),
    {"信号名": "wave_complete"}
)
```

---

## Common Mistakes

### Mistake 1: Wrong Target Node

**Bad**:
```python
# System event with Entity target - WRONG
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath(".")  # Wrong! Should be "System"
)
```

**Good**:
```python
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath("System")  # Correct
)
```

### Mistake 2: Missing Behavior

**Bad**:
```python
# Health event without health behavior
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_changed",
    NodePath(".")
)
# Event will never fire!
```

**Good**:
```python
# Add behavior first
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path, ".", "health", {"最大血量": 100}, False
)

# Then add event
FlowKitSheetCreatorStatic.AddEvent(
    "on_health_changed",
    NodePath(".")
)
```

### Mistake 3: Condition Blocks Everything

**Problem**: on_process with only_once_when_looped blocks after first trigger

**Solution**: Understand condition semantics
```python
# only_once_when_looped resets when event stops triggering
# Good for: "Do X the first time Y happens"
# Bad for: Continuous effects in on_process
```

### Mistake 4: Action Order Matters

**Problem**: Actions that depend on previous actions
```python
# Delete self before emitting signal - signal never sent!
FlowKitSheetCreatorStatic.AddActionToEvent("delete_self", ...)
FlowKitSheetCreatorStatic.AddActionToEvent("emit_custom_signal", ...)
```

**Solution**: Order actions correctly
```python
# Emit signal first
FlowKitSheetCreatorStatic.AddActionToEvent("emit_custom_signal", ...)
# Then delete
FlowKitSheetCreatorStatic.AddActionToEvent("delete_self", ...)
```

---

## FlowKit vs Beehave Decision

| Use FlowKit | Use Beehave |
|-------------|-------------|
| Reactive events | Proactive AI |
| Simple conditions | Complex decision trees |
| Scene-level logic | Entity-level AI |
| Input handling | Movement/combat AI |
| One-shot responses | Continuous behavior |

**Combine them**: Use FlowKit for events, Beehave for AI
```python
# FlowKit handles death event
FlowKitSheetCreatorStatic.AddEvent("on_health_changed", ...)

# Beehave handles AI decisions
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path, ".", "behavior_tree",
    {"default_tree_scene": "res://AI/MonsterBrain.tscn"},
    False
)
```

---

## Checklist for FlowKit Events

Before creating event block:
- [ ] Chose correct target (Entity vs System)
- [ ] Required behaviors are added
- [ ] Conditions use correct logic (AND, negation)
- [ ] Actions are in correct order

After creating:
- [ ] Test event actually triggers
- [ ] Test conditions filter correctly
- [ ] Test actions produce expected result
- [ ] Test edge cases (death during action, etc.)

---

## Debugging FlowKit

### Event Not Triggering
1. Check target node exists
2. Check required behaviors added
3. Check event parameters correct

### Condition Blocking
1. Add print action before conditions
2. Check each condition individually
3. Verify comparison operators

### Action Not Working
1. Check target node for action
2. Verify required behaviors for action
3. Check parameter values

```python
# Debug: Add print to verify event fires
FlowKitSheetCreatorStatic.AddActionToEvent(
    "print",
    NodePath("System"),
    {"Message": "Event triggered!"}
)
```
