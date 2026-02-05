# Player Behavior Patterns

> Behavior tree patterns for player-controlled entities.

---

## Player Tree Overview

Player behavior trees handle:
- Input processing (keyboard/controller)
- Animation state management
- Combat actions
- Movement execution

Unlike AI, player trees respond to input rather than making decisions.

---

## Standard Player Tree

```
SelectorReactiveComposite
├── born (spawn handling)
├── die (death handling)
├── attack (combat input)
└── move (movement input)
```

### Default Template

Location: `res://Game_flowkit/BehaviorTree/PlayerAttackTree.tscn`

---

## Input Handling

### Movement Input

```gdscript
# PlayerMoveCondition
extends ConditionLeaf

func tick(actor: Node, blackboard: Blackboard) -> int:
    var input_dir = Vector2.ZERO

    # Check movement inputs
    if Input.is_action_pressed("move_up"):
        input_dir.y -= 1
    if Input.is_action_pressed("move_down"):
        input_dir.y += 1
    if Input.is_action_pressed("move_left"):
        input_dir.x -= 1
    if Input.is_action_pressed("move_right"):
        input_dir.x += 1

    if input_dir != Vector2.ZERO:
        blackboard.set_value("move_direction", input_dir.normalized())
        return SUCCESS
    return FAILURE
```

### Movement Execution

```gdscript
# PlayerMoveAction
extends ActionLeaf

func tick(actor: Node, blackboard: Blackboard) -> int:
    var direction = blackboard.get_value("move_direction", Vector2.ZERO)

    if direction == Vector2.ZERO:
        return SUCCESS

    # Apply movement
    var speed = actor.get_meta("flowkit_speed", 100.0)
    actor.velocity = direction * speed
    actor.move_and_slide()

    # Update animation
    var anim_name = get_animation_name(direction)
    actor.play_animation(anim_name)

    return SUCCESS

func get_animation_name(direction: Vector2) -> String:
    if abs(direction.x) > abs(direction.y):
        return "walk_side"
    elif direction.y < 0:
        return "walk_up"
    else:
        return "walk_down"
```

---

## Combat Input

### Attack Input

```gdscript
# PlayerAttackCondition
extends ConditionLeaf

@export var attack_action: String = "attack"

func tick(actor: Node, blackboard: Blackboard) -> int:
    if Input.is_action_just_pressed(attack_action):
        return SUCCESS
    return FAILURE
```

### Attack Execution

```gdscript
# PlayerAttackAction
extends ActionLeaf

func tick(actor: Node, blackboard: Blackboard) -> int:
    # Trigger attack through skill system
    var skill_box = actor.get_node_or_null("SkillBoxComponent")
    if skill_box:
        skill_box.trigger_attack()

    return SUCCESS
```

### Skill Input

```gdscript
# SkillInputCondition
extends ConditionLeaf

@export var skill_action: String = "skill_1"
@export var skill_index: int = 0

func tick(actor: Node, blackboard: Blackboard) -> int:
    if Input.is_action_just_pressed(skill_action):
        blackboard.set_value("skill_to_use", skill_index)
        return SUCCESS
    return FAILURE

# SkillAction
extends ActionLeaf

func tick(actor: Node, blackboard: Blackboard) -> int:
    var skill_index = blackboard.get_value("skill_to_use", -1)
    if skill_index < 0:
        return FAILURE

    var skill_box = actor.get_node_or_null("SkillBoxComponent")
    if skill_box:
        skill_box.use_skill(skill_index)

    return SUCCESS
```

---

## Animation States

### State Machine Pattern

```gdscript
# Animation state tracking in blackboard
enum PlayerState { IDLE, WALK, ATTACK, HURT, DEATH }

# In movement action
if direction == Vector2.ZERO:
    blackboard.set_value("state", PlayerState.IDLE)
    actor.play_animation("idle")
else:
    blackboard.set_value("state", PlayerState.WALK)
    actor.play_animation("walk_" + facing)
```

### Animation Priorities

| State | Priority | Can Interrupt |
|-------|----------|---------------|
| DEATH | 5 | Nothing |
| HURT | 4 | Walk, Idle |
| ATTACK | 3 | Walk, Idle |
| WALK | 2 | Idle |
| IDLE | 1 | - |

---

## Full Player Tree Example

```
SelectorReactiveComposite
├── Sequence: born
│   ├── BornCondition
│   └── BornAction
├── Sequence: die
│   ├── DieCondition
│   └── DieAction
├── Sequence: hit_reaction
│   ├── HitCondition
│   └── HitAction
├── Sequence: skill_1
│   ├── Skill1InputCondition
│   └── SkillAction
├── Sequence: skill_2
│   ├── Skill2InputCondition
│   └── SkillAction
├── Sequence: attack
│   ├── AttackInputCondition
│   └── AttackAction
└── Sequence: move
    ├── PlayerMoveCondition
    └── PlayerMoveAction
```

---

## Input Configuration

### Project Input Map

| Action Name | Default Key | Purpose |
|-------------|-------------|---------|
| `move_up` | W / Up | Move up |
| `move_down` | S / Down | Move down |
| `move_left` | A / Left | Move left |
| `move_right` | D / Right | Move right |
| `attack` | Space / LMB | Primary attack |
| `skill_1` | Q / 1 | Skill slot 1 |
| `skill_2` | E / 2 | Skill slot 2 |
| `dodge` | Shift | Dodge roll |

### Controller Support

```gdscript
# Include controller input
var input_dir = Vector2.ZERO

# Keyboard
if Input.is_action_pressed("move_up"):
    input_dir.y -= 1

# Also check controller axis
var joy_x = Input.get_joy_axis(0, JOY_AXIS_LEFT_X)
var joy_y = Input.get_joy_axis(0, JOY_AXIS_LEFT_Y)
if abs(joy_x) > deadzone:
    input_dir.x = joy_x
if abs(joy_y) > deadzone:
    input_dir.y = joy_y
```

---

## Special Actions

### Dodge Roll

```gdscript
# DodgeCondition
func tick(actor, blackboard):
    if Input.is_action_just_pressed("dodge"):
        if can_dodge(actor):
            return SUCCESS
    return FAILURE

# DodgeAction
func tick(actor, blackboard):
    var direction = blackboard.get_value("move_direction", actor.facing)
    actor.start_dodge(direction)
    return RUNNING  # Wait for dodge to complete
```

### Interaction

```gdscript
# InteractCondition
func tick(actor, blackboard):
    if Input.is_action_just_pressed("interact"):
        var interactable = find_nearby_interactable(actor)
        if interactable:
            blackboard.set_value("interact_target", interactable)
            return SUCCESS
    return FAILURE

# InteractAction
func tick(actor, blackboard):
    var target = blackboard.get_value("interact_target")
    if target:
        target.interact(actor)
    return SUCCESS
```

---

## Feedback and Polish

### Input Buffering

```gdscript
# Buffer attack input during cooldown
var attack_buffered: bool = false
var buffer_time: float = 0.2
var buffer_timer: float = 0.0

func tick(actor, blackboard):
    # Check for new input
    if Input.is_action_just_pressed("attack"):
        if can_attack(actor):
            perform_attack(actor)
            attack_buffered = false
        else:
            attack_buffered = true
            buffer_timer = buffer_time

    # Process buffered input
    if attack_buffered:
        buffer_timer -= delta
        if buffer_timer <= 0:
            attack_buffered = false
        elif can_attack(actor):
            perform_attack(actor)
            attack_buffered = false
```

### Visual Feedback

```gdscript
# In movement action
if direction != Vector2.ZERO:
    # Movement dust particles
    emit_dust_particles(actor)

# In attack action
# Screen shake for impacts
Camera.shake(0.1, 5)
```

---

## Forbidden Patterns

1. **Never** process input during death state
2. **Never** allow action during stun/disabled
3. **Never** ignore input buffering for combat
4. **Never** hardcode input actions (use InputMap)
5. **Never** mix input processing with AI logic

---

## Best Practices

1. Always provide input feedback (audio/visual)
2. Support both keyboard and controller
3. Use input buffering for responsive combat
4. Test with different input devices
5. Allow input remapping
6. Handle edge cases (multiple inputs, rapid inputs)
