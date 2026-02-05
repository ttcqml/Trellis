# Monster AI Patterns

> Behavior tree patterns for enemy entities.

---

## Standard Monster Tree

```
SelectorReactiveComposite
├── born (spawn handling)
├── die (death handling)
├── attack (combat)
└── move (chase/patrol)
```

### Default Template

Location: `res://Game_flowkit/BehaviorTree/MonsterAttackTree.tscn`

---

## Basic Monster Behaviors

### Spawn Behavior

```gdscript
# BornCondition
func tick(actor, blackboard):
    if not blackboard.get_value("spawn_complete", false):
        return SUCCESS
    return FAILURE

# BornAction
func tick(actor, blackboard):
    # Play spawn animation
    actor.play_animation("birth_down")
    await actor.animation_finished
    blackboard.set_value("spawn_complete", true)
    return SUCCESS
```

### Death Behavior

```gdscript
# DieCondition
func tick(actor, blackboard):
    var health = actor.get_health()
    if health <= 0:
        return SUCCESS
    return FAILURE

# DieAction
@export var duration: float = 0.25

func tick(actor, blackboard):
    # Play death effect
    actor.play_death_animation()
    await get_tree().create_timer(duration).timeout
    actor.queue_free()
    return SUCCESS
```

---

## Combat AI Patterns

### Melee Attacker

```
Sequence: attack
├── AttackCondition (player in melee range)
└── AttackAction (swing attack)
```

```gdscript
# AttackCondition for melee
func tick(actor, blackboard):
    var player = get_player()
    if not player:
        return FAILURE

    var distance = actor.global_position.distance_to(player.global_position)
    if distance <= attack_range:
        blackboard.set_value("attack_target", player)
        return SUCCESS
    return FAILURE
```

### Ranged Attacker

```
Sequence: attack
├── AttackCondition (player in range, not too close)
└── AttackAction (fire projectile)
```

```gdscript
# AttackCondition for ranged
func tick(actor, blackboard):
    var player = get_player()
    if not player:
        return FAILURE

    var distance = actor.global_position.distance_to(player.global_position)
    # In range but not too close
    if distance >= min_range and distance <= max_range:
        blackboard.set_value("attack_target", player)
        return SUCCESS
    return FAILURE
```

### Mixed Attacker

```
SelectorReactiveComposite
├── Sequence: melee_attack (priority: close range)
│   ├── MeleeRangeCondition
│   └── MeleeAttackAction
├── Sequence: ranged_attack
│   ├── RangedRangeCondition
│   └── RangedAttackAction
└── Sequence: approach
    ├── OutOfRangeCondition
    └── ApproachAction
```

---

## Movement AI Patterns

### Chase Player

```gdscript
# MonsterMoveCondition
func tick(actor, blackboard):
    var player = get_player()
    if player:
        blackboard.set_value("move_target", player.global_position)
        return SUCCESS
    return FAILURE

# MonsterMoveAction
func tick(actor, blackboard):
    var target = blackboard.get_value("move_target")
    var direction = (target - actor.global_position).normalized()
    actor.velocity = direction * actor.speed
    actor.move_and_slide()
    actor.play_animation("walk_" + get_direction_name(direction))
    return SUCCESS  # Always succeeds, runs every frame
```

### Patrol Pattern

```gdscript
# PatrolCondition
func tick(actor, blackboard):
    var player = get_player()
    if not player or player.global_position.distance_to(actor.global_position) > alert_range:
        return SUCCESS  # No threat, patrol
    return FAILURE

# PatrolAction
var patrol_points: Array[Vector2]
var current_point: int = 0

func tick(actor, blackboard):
    var target = patrol_points[current_point]
    var distance = actor.global_position.distance_to(target)

    if distance < arrival_threshold:
        current_point = (current_point + 1) % patrol_points.size()
        return SUCCESS

    var direction = (target - actor.global_position).normalized()
    actor.velocity = direction * patrol_speed
    actor.move_and_slide()
    return RUNNING
```

### Flee Behavior

```gdscript
# FleeCondition
func tick(actor, blackboard):
    var health_ratio = actor.current_health / actor.max_health
    if health_ratio < flee_threshold:
        return SUCCESS
    return FAILURE

# FleeAction
func tick(actor, blackboard):
    var player = get_player()
    if player:
        var direction = (actor.global_position - player.global_position).normalized()
        actor.velocity = direction * flee_speed
        actor.move_and_slide()
    return RUNNING
```

---

## Boss AI Patterns

### Phase-Based Boss

```
SelectorReactiveComposite
├── Sequence: phase3 (health < 25%)
│   ├── Phase3Condition
│   └── Phase3Behavior (enrage)
├── Sequence: phase2 (health < 50%)
│   ├── Phase2Condition
│   └── Phase2Behavior (add abilities)
├── Sequence: phase1
│   └── Phase1Behavior (basic attacks)
```

### Attack Pattern Rotation

```gdscript
# BossAttackAction
var attack_patterns = ["slash", "spin", "projectile"]
var current_pattern: int = 0

func tick(actor, blackboard):
    perform_attack(attack_patterns[current_pattern])
    current_pattern = (current_pattern + 1) % attack_patterns.size()
    return SUCCESS
```

### Summon Minions

```
Sequence: summon
├── SummonCondition (cooldown ready, health threshold)
└── SummonAction (spawn minions)
```

---

## Advanced Patterns

### Telegraphed Attacks

```gdscript
# TelegraphedAttackAction
enum State { WINDUP, ATTACK, RECOVERY }
var state = State.WINDUP
var timer: float = 0.0

func tick(actor, blackboard):
    match state:
        State.WINDUP:
            actor.show_telegraph()
            timer += get_process_delta_time()
            if timer >= windup_time:
                state = State.ATTACK
                timer = 0.0
            return RUNNING

        State.ATTACK:
            actor.perform_attack()
            state = State.RECOVERY
            return RUNNING

        State.RECOVERY:
            timer += get_process_delta_time()
            if timer >= recovery_time:
                state = State.WINDUP
                timer = 0.0
                return SUCCESS
            return RUNNING
```

### Group Coordination

```gdscript
# GroupAttackCondition
func tick(actor, blackboard):
    var allies = get_nearby_allies()
    if allies.size() >= min_group_size:
        blackboard.set_value("group_attack", true)
        return SUCCESS
    return FAILURE
```

---

## Difficulty Scaling

### Easy

```gdscript
attack_cooldown = 2.0  # Slow attacks
move_speed = 50.0      # Slow movement
reaction_time = 0.5    # Delayed response
```

### Normal

```gdscript
attack_cooldown = 1.0
move_speed = 75.0
reaction_time = 0.2
```

### Hard

```gdscript
attack_cooldown = 0.5
move_speed = 100.0
reaction_time = 0.1
```

---

## Forbidden Patterns

1. **Never** make perfect-tracking AI (unfair)
2. **Never** skip telegraph for dangerous attacks
3. **Never** allow infinite attack spam
4. **Never** ignore spawn/death states
5. **Never** create unavoidable attacks

---

## Best Practices

1. Always provide visual feedback for AI state
2. Use telegraphs for powerful attacks
3. Balance aggression with vulnerability windows
4. Test AI at all difficulty levels
5. Ensure AI doesn't get stuck on geometry
