# Component Composition Guide

> **Purpose**: Compose behaviors and components effectively for entities.

---

## The Problem

**Poor component composition leads to:**
- Missing dependencies (behavior requires another)
- Duplicated setups (same behaviors added repeatedly)
- Tight coupling (components assume specific structures)
- Hard to maintain entities

---

## Composition Mental Model

```
Entity (Role/FCharacter/FMonster)
├── Core Behaviors (always needed)
│   └── characterbody2d_collision
├── Combat Behaviors (if combatant)
│   ├── health
│   ├── faction
│   └── skill_box
├── Visual Behaviors (if visible)
│   ├── animated_sprite2d
│   └── hp_bar
├── AI Behaviors (if autonomous)
│   └── behavior_tree
└── Utility Behaviors (as needed)
    ├── speed
    ├── camera2d
    └── death_effect
```

---

## Behavior Dependencies

Some behaviors depend on others:

| Behavior | Requires |
|----------|----------|
| hp_bar | health |
| damage_fcharacter_on_collision (action) | area2d + health |
| on_health_changed (event) | health |
| on_area2d_collision (event) | area2d |
| compare_faction (condition) | faction |
| change_animation (action) | animated_sprite2d |

### Always Add Dependencies First

```python
# Wrong order - hp_bar needs health
FlowKitBehaviorTool.AddBehaviorToScene(..., "hp_bar", ...)  # Error!
FlowKitBehaviorTool.AddBehaviorToScene(..., "health", ...)

# Correct order
FlowKitBehaviorTool.AddBehaviorToScene(..., "health", ...)
FlowKitBehaviorTool.AddBehaviorToScene(..., "hp_bar", ...)
```

---

## Entity Archetypes

### Player Entity

```python
# Core
behaviors = [
    ("characterbody2d_collision", {
        "shape_size_x": 24,
        "shape_size_y": 32,
        "collision_layer": 1,  # Player layer
        "collision_mask": 2 | 32  # Monster + Block
    }),

    # Combat
    ("health", {"最大血量": 100, "当前血量": 100}),
    ("faction", {"阵营": "玩家"}),
    ("skill_box", {"init_attack_skill_datas": [attack_skill]}),

    # Visual
    ("animated_sprite2d", {
        "sprite_frames": player_sprites,
        "初始动画": "idle"
    }),
    ("hp_bar", {}),

    # Utility
    ("speed", {"速度": 150.0}),
    ("camera2d", {"Zoom X": 2.0, "Zoom Y": 2.0})
]
```

### Monster Entity

```python
behaviors = [
    # Core
    ("characterbody2d_collision", {
        "collision_layer": 2,  # Monster layer
        "collision_mask": 1 | 2 | 32  # Player + Monster + Block
    }),

    # Combat
    ("health", {"最大血量": 50}),
    ("faction", {"阵营": "敌人"}),

    # Visual
    ("animated_sprite2d", {...}),
    ("hp_bar", {}),
    ("death_effect", {"effect_scene": death_particles}),

    # AI
    ("behavior_tree", {
        "default_tree_scene": "res://AI/MonsterBrain.tscn"
    }),

    # Utility
    ("speed", {"速度": 80.0})
]
```

### Projectile Entity

```python
behaviors = [
    # Collision only
    ("area2d", {
        "shape_size_x": 8,
        "shape_size_y": 8,
        "collision_layer": 8,  # Bullet layer
        "collision_mask": 1 | 2  # Player + Monster
    }),

    # Visual
    ("animated_sprite2d", {...}),

    # No health, no AI
]
```

### NPC Entity

```python
behaviors = [
    # Core
    ("characterbody2d_collision", {
        "collision_layer": 4,  # Neutral layer
        "collision_mask": 32   # Block only
    }),

    # No combat (optional health for story)
    ("faction", {"阵营": "中立"}),

    # Visual
    ("animated_sprite2d", {...}),

    # AI (dialogue, pathing)
    ("behavior_tree", {"default_tree_scene": "res://AI/NPCBrain.tscn"})
]
```

---

## Composition Patterns

### Pattern 1: Behavior Sets

Define common behavior combinations:

```python
# Reusable behavior sets
COMBAT_SET = ["health", "faction"]
VISUAL_SET = ["animated_sprite2d", "hp_bar"]
AI_SET = ["behavior_tree", "speed"]

def add_combat_entity(scene_path, health=100, faction="敌人"):
    """Add standard combat behaviors."""
    for behavior in COMBAT_SET:
        FlowKitBehaviorTool.AddBehaviorToScene(
            scene_path, ".", behavior,
            get_combat_params(behavior, health, faction),
            False
        )
```

### Pattern 2: Entity Templates

Create base scenes to inherit:

```
Entity/
├── Templates/
│   ├── CombatEntity.tscn      # Health + Faction + Collision
│   ├── VisualEntity.tscn      # AnimatedSprite + HPBar
│   └── AIEntity.tscn          # BehaviorTree + Speed
├── Player/
│   └── Player.tscn            # Inherits all templates
└── Monsters/
    └── Slime.tscn             # Inherits Combat + Visual + AI
```

### Pattern 3: Composition Over Inheritance

**Prefer**: Adding behaviors dynamically

```python
# Flexible - add behaviors based on config
if entity_config.has_combat:
    add_combat_behaviors(scene_path)
if entity_config.has_ai:
    add_ai_behaviors(scene_path)
```

**Avoid**: Deep inheritance hierarchies

```
# Brittle - changes cascade
BaseEntity
└── CombatEntity
    └── AIEntity
        └── BossEntity  # 4 levels deep!
```

---

## Collision Layer Strategy

| Layer | Bit | Name | Example |
|-------|-----|------|---------|
| 1 | 1 | 角色 | Player |
| 2 | 2 | 怪物 | Enemies |
| 3 | 4 | 中立 | NPCs |
| 4 | 8 | 子弹 | Projectiles |
| 5 | 16 | 道具 | Items, pickups |
| 6 | 32 | 阻挡 | Walls, obstacles |
| 7 | 64 | 坑洞 | Hazards |

### Typical Mask Patterns

```python
# Player: Hit by monsters, bullets; blocked by walls
collision_mask = 2 | 8 | 32  # Monster + Bullet + Block

# Monster: Hit by player bullets; blocked by walls
collision_mask = 8 | 32  # Bullet + Block

# Bullet: Hit player, monsters
collision_mask = 1 | 2  # Player + Monster

# Pickup: Only player can collect
collision_mask = 1  # Player only
```

---

## Common Mistakes

### Mistake 1: Forgetting Dependencies

```python
# hp_bar without health - invisible bar
FlowKitBehaviorTool.AddBehaviorToScene(..., "hp_bar", ...)
# Need health first!
```

### Mistake 2: Wrong Collision Layers

```python
# Enemy bullet hits other enemies
collision_mask = 1 | 2  # Wrong - includes monsters

# Fix: Only hit player
collision_mask = 1  # Player only
```

### Mistake 3: Over-Composing

```python
# Bullet doesn't need health, faction, skill_box, etc.
# Keep it minimal
behaviors = ["area2d", "animated_sprite2d"]
```

---

## Checklist for Entity Composition

Before adding behaviors:
- [ ] Identified entity archetype (player, enemy, NPC, etc.)
- [ ] Listed required features (combat, visual, AI)
- [ ] Checked behavior dependencies
- [ ] Planned collision layers

After composition:
- [ ] Tested entity in scene
- [ ] Verified behaviors interact correctly
- [ ] Checked collision detection works
- [ ] Tested edge cases (death, respawn)

---

## Entity Feature Matrix

| Feature | Player | Monster | NPC | Projectile | Pickup |
|---------|--------|---------|-----|------------|--------|
| characterbody2d_collision | ✓ | ✓ | ✓ | - | - |
| area2d | Optional | Optional | - | ✓ | ✓ |
| health | ✓ | ✓ | Optional | - | - |
| faction | ✓ | ✓ | ✓ | ✓ | - |
| skill_box | ✓ | Optional | - | - | - |
| animated_sprite2d | ✓ | ✓ | ✓ | ✓ | ✓ |
| hp_bar | ✓ | ✓ | Optional | - | - |
| behavior_tree | Optional | ✓ | ✓ | - | - |
| speed | ✓ | ✓ | ✓ | - | - |
| camera2d | ✓ | - | - | - | - |
| death_effect | Optional | ✓ | - | Optional | - |
