# Scene Quality Guidelines

> Standards for ensuring high-quality game scenes.

---

## Quality Checklist

### Before Creating Scene

- [ ] Identified scene type (Level/UI/Test)
- [ ] Selected appropriate template
- [ ] Planned entity composition
- [ ] Designed FlowKit event logic
- [ ] Determined victory/progression conditions

### After Creating Scene

- [ ] All entities instantiated correctly
- [ ] Entity positions are appropriate
- [ ] FlowKit events work as expected
- [ ] Scene loads without errors
- [ ] Scene transitions work correctly
- [ ] Performance is acceptable

---

## Scene Structure Standards

### Required Elements

| Element | Purpose | Check |
|---------|---------|-------|
| System node | FlowKit events | Auto-created |
| Player spawn | Player start position | Position set |
| Entity containers | Organization | Created as needed |

### Node Naming

```
✅ Good:
- Player
- Enemies
- Boss_SlimeKing
- SpawnPoint_North

❌ Bad:
- Node2D
- @@123
- New Node
- asdf
```

---

## Performance Standards

### Entity Limits

| Scene Type | Entities | Particles | Notes |
|------------|----------|-----------|-------|
| Normal Level | 30-50 | 10-20 | Standard gameplay |
| Boss Arena | 5-10 | 20-30 | Focus on boss |
| Swarm Mode | 50-100 | 5-10 | Optimized entities |

### Load Time

| Scene Complexity | Target Load Time |
|------------------|------------------|
| Simple | < 0.5s |
| Medium | < 1s |
| Complex | < 2s |

### Frame Rate

| Platform | Target FPS |
|----------|------------|
| Desktop | 60 FPS |
| Mobile | 30-60 FPS |

---

## Testing Requirements

### Functional Testing

1. **Scene Load**: Scene loads without errors
2. **Entity Spawn**: All entities appear correctly
3. **Collision**: Player-enemy collision works
4. **Events**: FlowKit events trigger properly
5. **Transitions**: Scene changes work correctly

### Edge Case Testing

1. **Empty scene**: What if no enemies?
2. **Maximum load**: Test with max entities
3. **Rapid transitions**: Fast scene switching
4. **Pause/Resume**: Pause mid-action

---

## Event Logic Standards

### Event Complexity

| Complexity | Events | Conditions per Event | Actions per Event |
|------------|--------|---------------------|-------------------|
| Simple | 1-3 | 0-1 | 1-2 |
| Medium | 4-8 | 1-2 | 2-4 |
| Complex | 8+ | 2+ | 4+ |

### Event Organization

```
Good: Logical grouping
- Scene initialization events
- Input handling events
- Game state events

Bad: Random order
- Mixed unrelated events
- Duplicate event handlers
- Circular triggers
```

---

## Documentation Requirements

### Scene Header Comment

```gdscript
# Scene: [SceneName]
# Type: [Level/UI/Test]
# Purpose: [Brief description]
# Entities: [List of instantiated entities]
# Events: [Key FlowKit events]
# Created: [Date]
```

### FlowKit Event Documentation

```
Event: on_enemy_count_changed
Purpose: Trigger next wave when all enemies defeated
Conditions: enemy_count == 0
Actions: emit_custom_signal "spawn_next_wave"
```

---

## Forbidden Patterns

### Structure Issues

1. **No loose nodes** - Every node should have purpose
2. **No orphan entities** - All entities in containers
3. **No magic positions** - Document spawn points

### Logic Issues

1. **No infinite loops** - Circular event triggers
2. **No unguarded actions** - Missing conditions
3. **No hardcoded references** - Use relative paths

### Performance Issues

1. **No per-frame heavy operations** - Cache calculations
2. **No excessive instantiation** - Use pooling
3. **No unbounded growth** - Cleanup deleted nodes

---

## Common Mistakes

### Entity Issues

```
Problem: Entity doesn't appear
Causes:
- Wrong instantiation path
- Entity outside visible area
- Node disabled by default
Fix: Verify path, position, and enabled state
```

### Event Issues

```
Problem: Event doesn't trigger
Causes:
- Missing required behavior
- Wrong target node path
- Condition never met
Fix: Check dependencies and conditions
```

### Transition Issues

```
Problem: Scene change fails
Causes:
- Invalid scene path
- Scene not in project
- Circular scene loading
Fix: Verify scene path and avoid loops
```

---

## Review Checklist

Before finalizing a scene:

1. [ ] Template: Using correct base template
2. [ ] Structure: Organized node hierarchy
3. [ ] Entities: All entities placed and configured
4. [ ] Events: FlowKit logic tested
5. [ ] Conditions: Victory/defeat implemented
6. [ ] Transitions: Scene flow works
7. [ ] Performance: Acceptable frame rate
8. [ ] Testing: Edge cases covered
9. [ ] Naming: Following conventions
10. [ ] Documentation: Key elements documented

---

## Scene Maintenance

### Version Control

- Commit scene and all referenced resources
- Document breaking changes
- Keep backup of working versions

### Updates

- Test after any entity template changes
- Verify events after FlowKit updates
- Check compatibility with new entities
