# Collision Layer Guidelines

> Configuration standards for 2D physics collision layers.

---

## Collision Layer Overview

Godot uses bitmask-based collision layers. Each layer corresponds to a power of 2:

| Layer | Bit Value | Binary |
|-------|-----------|--------|
| 1 | 1 | `00000001` |
| 2 | 2 | `00000010` |
| 3 | 4 | `00000100` |
| 4 | 8 | `00001000` |
| 5 | 16 | `00010000` |
| 6 | 32 | `00100000` |
| 7 | 64 | `01000000` |
| 8 | 128 | `10000000` |

---

## Project Collision Layers

| Layer | Bit Value | Name | Chinese | Purpose |
|-------|-----------|------|---------|---------|
| 1 | 1 | Player | 角色 | Player entities |
| 2 | 2 | Monster | 怪物 | Enemy entities |
| 3 | 4 | Neutral | 中立 | NPC, non-combat entities |
| 4 | 8 | Bullet | 子弹 | Projectiles |
| 5 | 16 | Item | 道具 | Pickups, collectibles |
| 6 | 32 | Block | 阻挡 | Walls, obstacles |
| 7 | 64 | Pit | 坑洞 | Hazard areas |

---

## Collision Configuration by Entity Type

### Player (FCharacter)

```python
{
    "collision_layer": 1,  # Layer 1 (角色)
    "collision_mask": 2    # Detect Layer 2 (怪物)
}
```

### Enemy/Monster (FMonster)

```python
{
    "collision_layer": 2,  # Layer 2 (怪物)
    "collision_mask": 1    # Detect Layer 1 (角色)
}
```

### NPC (Non-combat)

```python
{
    "collision_layer": 4,  # Layer 3 (中立)
    "collision_mask": 0    # No collision detection
}
```

### Player Bullet

```python
{
    "collision_layer": 8,  # Layer 4 (子弹)
    "collision_mask": 2    # Detect Layer 2 (怪物)
}
```

### Enemy Bullet

```python
{
    "collision_layer": 8,  # Layer 4 (子弹)
    "collision_mask": 1    # Detect Layer 1 (角色)
}
```

### Pickup Item

```python
{
    "collision_layer": 16, # Layer 5 (道具)
    "collision_mask": 1    # Detect Layer 1 (角色)
}
```

### Wall/Obstacle

```python
{
    "collision_layer": 32, # Layer 6 (阻挡)
    "collision_mask": 1 | 2  # Detect Player and Monster
}
```

---

## Combining Layers

To detect multiple layers, use bitwise OR (`|`):

```gdscript
# Detect both player (1) and monsters (2)
collision_mask = 1 | 2  # Result: 3

# Detect player (1), monsters (2), and neutral (4)
collision_mask = 1 | 2 | 4  # Result: 7
```

---

## Area2D vs CharacterBody2D Collision

### Area2D (Trigger Detection)

- Used for: Damage detection, pickup collection, trigger zones
- Does NOT block movement
- Fires `on_area2d_collision` event

```python
# FlowKit behavior configuration
{
    "behavior_id": "area2d",
    "inputs": {
        "shape_size_x": 32.0,
        "shape_size_y": 32.0,
        "collision_layer": 1,
        "collision_mask": 2
    }
}
```

### CharacterBody2D (Physics Collision)

- Used for: Movement blocking, physics interactions
- Blocks movement via `move_and_slide()`
- Fires `on_characterbody2d_collision` event

```python
# FlowKit behavior configuration
{
    "behavior_id": "characterbody2d_collision",
    "inputs": {
        "shape_size_x": 32.0,
        "shape_size_y": 32.0,
        "collision_layer": 1,
        "collision_mask": 32,  # Detect walls
        "emit_each_physics_frame": True
    }
}
```

---

## Common Collision Scenarios

### Player vs Enemy Combat

```
Player Area2D:
  layer: 1, mask: 2
  → Detects enemy bodies for damage

Enemy Area2D:
  layer: 2, mask: 1
  → Detects player body for damage
```

### Player Picking Up Items

```
Player Area2D:
  layer: 1, mask: 16
  → Detects item pickups

Item Area2D:
  layer: 16, mask: 1
  → Detects player for collection
```

### Bullet Hitting Enemy

```
Player Bullet Area2D:
  layer: 8, mask: 2
  → Detects enemy bodies

Enemy Health:
  Receives damage via FlowKit action
```

### Entity Blocked by Wall

```
Entity CharacterBody2D:
  layer: 1 (or 2), mask: 32
  → Blocked by wall collision

Wall StaticBody2D:
  layer: 32, mask: 0
  → Passive blocking
```

---

## Faction-Layer Alignment

| Faction | FlowKit Value | Recommended Layer |
|---------|--------------|-------------------|
| 玩家 (Player) | `"玩家"` | 1 |
| 敌人 (Enemy) | `"敌人"` | 2 |
| 中立 (Neutral) | `"中立"` | 4 |

**Rule**: Faction setting should align with collision layer for consistent behavior.

---

## Debugging Collision Issues

### Common Problems

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| No collision detected | Wrong mask | Verify mask includes target layer |
| Self-collision | Layer in own mask | Remove own layer from mask |
| Phantom collision | Wrong layer | Check entity's collision_layer |
| Collision works once | `emit_each_physics_frame` false | Set to true for continuous |

### Debug Steps

1. Verify collision_layer is set correctly
2. Verify collision_mask includes target
3. Check that both entities have collision shapes
4. Ensure collision shapes are not disabled
5. Test with Godot's debug collision display

---

## Forbidden Patterns

1. **Never** use layer 0 (undefined behavior)
2. **Never** set mask to include own layer (self-collision)
3. **Never** leave collision unconfigured (defaults may be wrong)
4. **Never** hardcode layer values - reference this document
5. **Never** mix Area2D and CharacterBody2D collision purposes

---

## Best Practices

1. Document collision configuration in entity
2. Use consistent layer assignments across all entities
3. Test collision in isolation before integration
4. Keep mask minimal (only what's needed)
5. Use separate Area2D for damage vs movement blocking
6. Align faction setting with collision layer
