# Entity Quality Guidelines

> Standards for ensuring high-quality game entities.

---

## Quality Checklist

### Before Creating Entity

- [ ] Identified correct entity type (Player/Monster/NPC/Pet)
- [ ] Selected appropriate base template
- [ ] Determined required behaviors
- [ ] Planned collision layer configuration
- [ ] Defined behavior tree requirements

### After Creating Entity

- [ ] All required behaviors configured
- [ ] Collision layers match faction
- [ ] Sprite frames resource assigned
- [ ] Health values are reasonable
- [ ] Speed values are balanced
- [ ] Entity saves without errors
- [ ] Entity loads correctly in test scene

---

## Configuration Standards

### Health Values

| Entity Type | Recommended Range | Notes |
|-------------|------------------|-------|
| Player | 100-500 | Main character should be durable |
| Boss | 500-2000 | Scale with player progression |
| Normal Enemy | 20-100 | Quick to defeat |
| Elite Enemy | 100-300 | Mini-boss level |
| NPC | 1-100 | Usually invincible or fragile |
| Pet | 50-150 | Balanced with player |

### Speed Values

| Entity Type | Recommended Range | Notes |
|-------------|------------------|-------|
| Player | 50-150 | Responsive movement |
| Fast Enemy | 75-120 | Challenging to escape |
| Normal Enemy | 30-75 | Easy to kite |
| Slow Enemy | 10-30 | Tank-type enemies |
| NPC | 20-50 | Slower than player |
| Pet | Player speed × 1.1 | Should keep up with player |

### Collision Shape Size

| Entity Type | Recommended Size | Notes |
|-------------|-----------------|-------|
| Small (Slime) | 16×16 to 24×24 | Easy to hit |
| Medium (Human) | 24×24 to 32×32 | Standard size |
| Large (Boss) | 48×48 to 64×64 | Imposing presence |
| Projectile | 8×8 to 16×16 | Small hitbox |

---

## Naming Conventions

### Scene Files

```
✅ Good:
- Slime.tscn
- FireMage.tscn
- ShopkeeperNPC.tscn

❌ Bad:
- enemy1.tscn
- new_monster.tscn
- untitled.tscn
```

### Node Names

```
✅ Good:
- Slime (root node)
- AnimatedSprite2D (child)
- CollisionShape2D (child)

❌ Bad:
- Node2D (generic)
- CharacterBody2D (type as name)
- Sprite (abbreviated)
```

### Variable Names (in FlowKit)

```
✅ Good:
- is_attacking
- target_position
- spawn_count

❌ Bad:
- var1
- temp
- x
```

---

## Performance Guidelines

### Behavior Optimization

1. **Minimize `on_process` usage** - Prefer event-driven patterns
2. **Use `on_process_physics` for movement** - Consistent with physics
3. **Batch behavior updates** - Reduce MCP calls
4. **Avoid complex conditions in every frame events**

### Memory Considerations

1. **Share SpriteFrames resources** - Don't duplicate per entity
2. **Reuse behavior tree scenes** - One tree for all same-type enemies
3. **Clean up deleted entities** - Avoid memory leaks
4. **Limit simultaneous entities** - Performance scaling

---

## Testing Requirements

### Unit Testing (Per Entity)

1. Entity loads without errors
2. All behaviors initialize correctly
3. Animations play as expected
4. Collision detection works
5. Health changes trigger events
6. Death cleanup is complete

### Integration Testing

1. Entity works in game scene
2. Player-enemy collision functions
3. Skill damage applies correctly
4. Behavior tree executes properly
5. No performance degradation with multiple entities

---

## Documentation Requirements

### For Custom Entities

Each custom entity should have a comment header:

```gdscript
# Entity: [Name]
# Type: [Player/Monster/NPC/Pet]
# Purpose: [Brief description]
# Required Behaviors: [List]
# Collision Layer: [Number and name]
# Created: [Date]
# Author: [Name or AI-generated]
```

---

## Forbidden Patterns

### Configuration Errors

1. **Missing required behaviors** - Entity won't function
2. **Mismatched collision layers** - Combat won't work
3. **Zero health on combat entity** - Instant death
4. **No sprite resource** - Invisible entity
5. **Invalid behavior tree path** - AI fails

### Code Smells

1. **Duplicate entity scenes** - Share templates instead
2. **Hardcoded values in behaviors** - Use variables
3. **Over-engineered entities** - Keep it simple
4. **Circular dependencies** - Clean architecture

---

## Common Mistakes

### Collision Issues

```
Problem: Player doesn't detect enemy collision
Cause: Wrong collision_mask on player's area2d
Fix: Set collision_mask to include enemy layer (2)
```

### Health Issues

```
Problem: Health events don't fire
Cause: health behavior not added
Fix: Add health behavior before adding events
```

### Animation Issues

```
Problem: Animation doesn't play
Cause: Wrong animation name or missing sprite_frames
Fix: Verify animation exists in SpriteFrames resource
```

### AI Issues

```
Problem: Enemy doesn't move
Cause: behavior_tree not configured or wrong tree
Fix: Verify behavior tree scene path and AI logic
```

---

## Review Checklist

Before finalizing an entity:

1. [ ] Template: Using correct base template
2. [ ] Behaviors: All required behaviors present
3. [ ] Collision: Layers match faction and purpose
4. [ ] Visual: Sprite frames assigned and working
5. [ ] Stats: Health and speed are balanced
6. [ ] AI: Behavior tree configured (if needed)
7. [ ] Events: FlowKit events have required behaviors
8. [ ] Testing: Entity tested in isolation
9. [ ] Naming: Following naming conventions
10. [ ] Save: Scene saves without warnings
