# Pet AI Patterns

> Behavior tree patterns for pet and companion entities.

---

## Pet AI Overview

Pets are companion entities that:
- Follow the player
- Attack nearby enemies
- Provide support (buffs, healing)
- Act autonomously but stay near player

---

## Standard Pet Tree

```
SelectorReactiveComposite
├── born (spawn handling)
├── die (death handling)
├── attack (combat near player)
├── return (return to player if too far)
└── follow (stay near player)
```

---

## Follow Behavior

### Stay Near Player

```gdscript
# PetFollowCondition
extends ConditionLeaf

@export var follow_distance: float = 100.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if not player:
        return FAILURE

    var distance = actor.global_position.distance_to(player.global_position)
    if distance > follow_distance:
        blackboard.set_value("follow_target", player.global_position)
        return SUCCESS
    return FAILURE

# PetFollowAction
extends ActionLeaf

@export var follow_speed: float = 120.0
@export var stop_distance: float = 50.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    var target = blackboard.get_value("follow_target")
    if not target:
        return FAILURE

    var distance = actor.global_position.distance_to(target)
    if distance <= stop_distance:
        actor.velocity = Vector2.ZERO
        return SUCCESS

    var direction = (target - actor.global_position).normalized()
    actor.velocity = direction * follow_speed
    actor.move_and_slide()
    return RUNNING
```

### Orbit Player

```gdscript
# PetOrbitAction
extends ActionLeaf

@export var orbit_radius: float = 80.0
@export var orbit_speed: float = 2.0  # radians per second

var orbit_angle: float = 0.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if not player:
        return FAILURE

    orbit_angle += orbit_speed * get_physics_process_delta_time()

    var target_pos = player.global_position + Vector2(
        cos(orbit_angle) * orbit_radius,
        sin(orbit_angle) * orbit_radius
    )

    var direction = (target_pos - actor.global_position).normalized()
    actor.velocity = direction * 150.0
    actor.move_and_slide()

    return SUCCESS
```

---

## Combat Behavior

### Attack Nearby Enemies

```gdscript
# PetsAttackCondition
extends ConditionLeaf

@export var attack_range: float = 200.0
@export var max_distance_from_player: float = 300.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if not player:
        return FAILURE

    # Don't attack if too far from player
    var player_distance = actor.global_position.distance_to(player.global_position)
    if player_distance > max_distance_from_player:
        return FAILURE

    # Find nearest enemy
    var enemies = get_tree().get_nodes_in_group("enemy")
    var nearest_enemy: Node2D = null
    var nearest_distance = attack_range

    for enemy in enemies:
        var dist = actor.global_position.distance_to(enemy.global_position)
        if dist < nearest_distance:
            nearest_distance = dist
            nearest_enemy = enemy

    if nearest_enemy:
        blackboard.set_value("attack_target", nearest_enemy)
        return SUCCESS
    return FAILURE

# PetsAttackAction
extends ActionLeaf

func tick(actor: Node, blackboard: Blackboard) -> int:
    var target = blackboard.get_value("attack_target")
    if not target or not is_instance_valid(target):
        return FAILURE

    # Trigger attack through skill system
    var skill_box = actor.get_node_or_null("SkillBoxComponent")
    if skill_box:
        skill_box.trigger_attack()

    return SUCCESS
```

### Target Player's Target

```gdscript
# AssistAttackCondition
func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if not player:
        return FAILURE

    # Get player's current target
    var player_target = player.get_meta("current_target", null)
    if player_target and is_instance_valid(player_target):
        var distance = actor.global_position.distance_to(player_target.global_position)
        if distance <= attack_range:
            blackboard.set_value("attack_target", player_target)
            return SUCCESS
    return FAILURE
```

---

## Return to Player

### Teleport When Too Far

```gdscript
# ReturnCondition
extends ConditionLeaf

@export var max_distance: float = 500.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if not player:
        return FAILURE

    var distance = actor.global_position.distance_to(player.global_position)
    if distance > max_distance:
        return SUCCESS
    return FAILURE

# ReturnAction
extends ActionLeaf

@export var teleport_offset: float = 50.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if not player:
        return FAILURE

    # Teleport near player
    var offset = Vector2(randf_range(-1, 1), randf_range(-1, 1)).normalized() * teleport_offset
    actor.global_position = player.global_position + offset

    # Play teleport effect
    spawn_teleport_effect(actor.global_position)

    return SUCCESS
```

---

## Support Behaviors

### Healing Pet

```gdscript
# HealOwnerCondition
extends ConditionLeaf

@export var heal_threshold: float = 0.5  # Heal when below 50% HP

func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if not player:
        return FAILURE

    var health_ratio = player.current_health / player.max_health
    if health_ratio < heal_threshold:
        return SUCCESS
    return FAILURE

# HealOwnerAction
extends ActionLeaf

@export var heal_amount: int = 20
@export var heal_cooldown: float = 5.0

var cooldown_timer: float = 0.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    cooldown_timer -= get_process_delta_time()
    if cooldown_timer > 0:
        return FAILURE

    var player = get_player()
    if player:
        player.heal(heal_amount)
        cooldown_timer = heal_cooldown
        play_heal_effect(player.global_position)

    return SUCCESS
```

### Buff Aura Pet

```gdscript
# BuffAuraAction
extends ActionLeaf

@export var buff_radius: float = 150.0
@export var buff_effect: String = "attack_boost"

func tick(actor: Node, blackboard: Blackboard) -> int:
    var player = get_player()
    if player:
        var distance = actor.global_position.distance_to(player.global_position)
        if distance <= buff_radius:
            apply_buff_to_player(player, buff_effect)

    return SUCCESS
```

---

## Pet Types

### Aggressive Pet

```
SelectorReactiveComposite
├── die
├── attack (prioritize combat)
├── chase_enemy (pursue targets)
├── return
└── follow
```

### Defensive Pet

```
SelectorReactiveComposite
├── die
├── heal_owner (prioritize support)
├── buff_owner
├── attack (only nearby threats)
├── return
└── follow
```

### Balanced Pet

```
SelectorReactiveComposite
├── die
├── Sequence: support (heal if needed)
│   ├── HealCondition
│   └── HealAction
├── attack
├── return
└── follow
```

---

## Pet Spawning

### Spawn from Player

```gdscript
# In player's skill or ability
func spawn_pet():
    var pet_scene = preload("res://Entities/Pets/FireSpirit.tscn")
    var pet = pet_scene.instantiate()

    # Position near player
    pet.global_position = global_position + Vector2(50, 0)

    # Register owner
    pet.set_meta("owner", self)

    get_parent().add_child(pet)
```

### Pet Limit

```gdscript
# Manage maximum pets
const MAX_PETS = 3

func can_spawn_pet() -> bool:
    var current_pets = get_tree().get_nodes_in_group("player_pet")
    return current_pets.size() < MAX_PETS
```

---

## Forbidden Patterns

1. **Never** attack player's allies
2. **Never** stray infinitely from player
3. **Never** block player movement
4. **Never** steal player's kills (unless designed)
5. **Never** create pet without despawn mechanism

---

## Best Practices

1. Always maintain follow distance
2. Use smooth movement (no teleport snapping)
3. Show pet status to player
4. Allow pet commands (aggressive/passive)
5. Balance pet damage contribution
6. Test pet pathfinding around obstacles
