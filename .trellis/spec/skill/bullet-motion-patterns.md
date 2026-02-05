# Bullet Motion Patterns

> Projectile movement components and configuration.

---

## Motion Component Overview

Bullet motion is controlled by motion components attached to projectile scenes. Available motion types:

| Motion Type | Description | Use Case |
|-------------|-------------|----------|
| LinearMotion | Straight line | Basic shots |
| SineMotion | Wave pattern | Wavy shots |
| ParabolicMotion | Arc trajectory | Grenades |
| MissileMotion | Homing | Seeking missiles |

---

## LinearMotion

### Description

Moves in a straight line at constant speed.

### Configuration

```gdscript
# Properties
speed: float = 200.0      # Pixels per second
direction: Vector2        # Movement direction
lifetime: float = 5.0     # Auto-destroy time
```

### Use Cases

- Basic projectiles (arrows, bullets)
- Laser beams
- Fast attacks

### Example

```gdscript
# Bullet scene setup
var motion = LinearMotion.new()
motion.speed = 300.0
motion.lifetime = 3.0
bullet.add_child(motion)
```

---

## SineMotion

### Description

Moves forward with sinusoidal (wave) perpendicular movement.

### Configuration

```gdscript
# Properties
speed: float = 150.0       # Forward speed
amplitude: float = 50.0    # Wave height
frequency: float = 2.0     # Wave frequency
lifetime: float = 5.0
```

### Use Cases

- Snake-like projectiles
- Magical attacks
- Dodge-challenging shots

### Example

```gdscript
# Wave bullet setup
var motion = SineMotion.new()
motion.speed = 150.0
motion.amplitude = 30.0
motion.frequency = 3.0
bullet.add_child(motion)
```

### Visualization

```
          *         *
        *   *     *   *
      *       * *       *
-----*---------*---------*--> direction
      *       * *       *
        *   *     *   *
          *         *
```

---

## ParabolicMotion

### Description

Moves in a parabolic arc (gravity-affected trajectory).

### Configuration

```gdscript
# Properties
initial_speed: float = 200.0   # Launch speed
launch_angle: float = 45.0     # Launch angle (degrees)
gravity: float = 400.0         # Gravity strength
lifetime: float = 10.0
```

### Use Cases

- Grenades
- Thrown objects
- Mortar attacks
- Jump attacks

### Example

```gdscript
# Grenade setup
var motion = ParabolicMotion.new()
motion.initial_speed = 250.0
motion.launch_angle = 60.0
motion.gravity = 500.0
bullet.add_child(motion)
```

### Visualization

```
           * *
         *     *
        *       *
       *         *
      *           *
     *             *
    *               *
---*-----------------*---
Start              Impact
```

---

## MissileMotion

### Description

Homes toward a target with turning rate.

### Configuration

```gdscript
# Properties
speed: float = 150.0           # Movement speed
turn_rate: float = 3.0         # Turning speed (radians/sec)
target: Node2D = null          # Target node
acquire_range: float = 500.0   # Target acquisition range
lifetime: float = 8.0
```

### Use Cases

- Homing missiles
- Seeking spells
- Smart projectiles
- Pet attacks

### Example

```gdscript
# Homing missile setup
var motion = MissileMotion.new()
motion.speed = 180.0
motion.turn_rate = 2.5
motion.acquire_range = 400.0
bullet.add_child(motion)
```

### Behavior

1. Missile launches in initial direction
2. Acquires nearest valid target within range
3. Turns toward target at turn_rate
4. Continues tracking until hit or timeout

---

## Custom Motion Patterns

### Spiral Motion

```gdscript
# Custom spiral pattern
class_name SpiralMotion extends Node

var speed: float = 100.0
var spiral_rate: float = 5.0
var radius_growth: float = 20.0
var time: float = 0.0

func _physics_process(delta):
    time += delta
    var radius = radius_growth * time
    var angle = spiral_rate * time
    var parent = get_parent()
    parent.position += Vector2(
        cos(angle) * radius,
        sin(angle) * radius
    ).normalized() * speed * delta
```

### Boomerang Motion

```gdscript
# Return-to-sender pattern
class_name BoomerangMotion extends Node

var speed: float = 200.0
var return_time: float = 1.0
var origin: Vector2
var returning: bool = false
var time: float = 0.0

func _ready():
    origin = get_parent().global_position

func _physics_process(delta):
    time += delta
    if time > return_time and not returning:
        returning = true

    var parent = get_parent()
    if returning:
        var dir = (origin - parent.global_position).normalized()
        parent.position += dir * speed * delta
    else:
        parent.position += parent.transform.x * speed * delta
```

---

## Combining Motion with SkillData

### SkillData Configuration

```gdscript
# Skill with specific bullet motion
skill_name = "Homing Fireball"
bullet_scene = preload("res://Bullets/HomingFireball.tscn")
# Motion type is defined in bullet scene
```

### Bullet Scene Structure

```
HomingFireball (Area2D)
├── Sprite2D
├── CollisionShape2D
├── MissileMotion
└── DestructionEffect
```

---

## Motion Parameters by Use Case

### Fast Attack

```gdscript
# LinearMotion
speed = 400-600
lifetime = 2-3 seconds
```

### Wave Attack

```gdscript
# SineMotion
speed = 150-250
amplitude = 20-50
frequency = 2-4
```

### Lobbed Attack

```gdscript
# ParabolicMotion
initial_speed = 200-300
launch_angle = 45-75
gravity = 300-600
```

### Seeking Attack

```gdscript
# MissileMotion
speed = 100-200
turn_rate = 1.5-4.0
acquire_range = 300-600
```

---

## Forbidden Patterns

1. **Never** set speed = 0 (stuck projectile)
2. **Never** set lifetime < 0.1 (instant despawn)
3. **Never** use infinite turn_rate (instant snapping)
4. **Never** forget to destroy on collision
5. **Never** create homing without target validation

---

## Best Practices

1. Match motion type to visual style
2. Test with multiple targets present
3. Ensure bullets can be dodged (fair gameplay)
4. Use lifetime to prevent orphan bullets
5. Pool frequently spawned bullet types
6. Add particle trails for visibility
