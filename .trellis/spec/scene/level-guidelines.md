# Level Scene Guidelines

> Design patterns for game level scenes.

---

## Level Scene Anatomy

### Required Components

| Component | Purpose | Node Type |
|-----------|---------|-----------|
| Root | Scene container | Node2D |
| System | FlowKit system events | (auto-created) |
| Player | Player spawn | FCharacter instance |
| Enemies | Enemy container | Node2D |
| Environment | Visual elements | Node2D |

### Optional Components

| Component | Purpose | When to Use |
|-----------|---------|-------------|
| Items | Collectibles container | Levels with pickups |
| NPCs | NPC container | Levels with interactions |
| Triggers | Event zones | Complex game logic |
| Camera | Camera control | Custom camera behavior |

---

## Level Creation Workflow

### Step 1: Copy Template

```python
# Copy GameScene.tscn to target location
# Source: res://Game_flowkit/EntityTemplate/GameScene.tscn
# Target: res://RequirementImp/Scenes/[SceneName].tscn
```

### Step 2: Open and Initialize

```python
await call_tool(ws, "OpenScene", {
    "scene_path": "res://RequirementImp/Scenes/MyLevel.tscn"
})
```

### Step 3: Add Player

```python
await call_tool(ws, "InstantiateScene", {
    "scene_path": "res://Game_flowkit/Entity/Player/FCharacterTest.tscn",
    "parent_path": "root"
})
```

### Step 4: Add Enemies

```python
# Add enemy container if needed
# Then instantiate enemies
await call_tool(ws, "InstantiateScene", {
    "scene_path": "res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn",
    "parent_path": "root"
})

# Position enemy
await call_tool(ws, "SetProperty", {
    "node_path": "root/FMonsterTest",
    "properties": {"position": {"x": 200, "y": 100}}
})
```

### Step 5: Configure Scene Logic

Add FlowKit events for scene-level behavior (see flowkit-scene-patterns.md).

### Step 6: Save

```python
await call_tool(ws, "SaveScene", {
    "scene_path": "res://RequirementImp/Scenes/MyLevel.tscn"
})
```

---

## Level Design Patterns

### Wave-Based Combat

```
Scene Structure:
├── Player (starting position)
├── SpawnPoints
│   ├── SpawnPoint1
│   └── SpawnPoint2
└── WaveManager (or System events)

FlowKit Events:
- on_scene_ready → Initialize wave counter
- on_enemy_count_changed (== 0) → Spawn next wave
```

### Exploration Level

```
Scene Structure:
├── Player
├── Environment
│   ├── Ground
│   ├── Walls
│   └── Decorations
├── NPCs
│   └── QuestGiver
├── Items
│   ├── Chest1
│   └── Chest2
└── Triggers
    ├── ExitZone
    └── SecretArea
```

### Boss Arena

```
Scene Structure:
├── Player
├── Boss
├── Arena
│   ├── Walls (collision)
│   └── Floor
├── Hazards
│   ├── Trap1
│   └── Trap2
└── UI
    └── BossHealthBar
```

---

## Entity Positioning

### Common Positions

| Position Type | X | Y | Notes |
|---------------|---|---|-------|
| Center | 0 | 0 | Default spawn |
| Left | -100 to -200 | 0 | Left side |
| Right | 100 to 200 | 0 | Right side |
| Top | 0 | -100 to -200 | Top side |
| Bottom | 0 | 100 to 200 | Bottom side |

### Grid-Based Positioning

```python
# For organized enemy placement
grid_size = 50
for i, enemy in enumerate(enemies):
    x = (i % 3) * grid_size - grid_size
    y = (i // 3) * grid_size
    position = {"x": x, "y": y}
```

---

## Level Progression

### Scene Transitions

```python
# FlowKit System action to change scene
FlowKitSheetCreatorStatic.AddActionToEvent(
    "replace_game_scene",
    NodePath("System"),
    {"scene": "res://Game_flowkit/Scenes/Stage/Level02.tscn"}
)
```

### Victory Conditions

```python
# Common pattern: All enemies defeated
# Event: Enemy count changed
# Condition: Enemy count == 0
# Action: Load next level or show victory
```

### Defeat Conditions

```python
# Common pattern: Player death
# Entity Event: Player health <= 0
# Action: Show game over or reload
```

---

## Performance Considerations

### Entity Limits

| Level Type | Max Enemies | Max Items | Notes |
|------------|-------------|-----------|-------|
| Normal | 10-20 | 20-30 | Balanced performance |
| Boss | 1-3 | 10 | Focus on boss |
| Swarm | 30-50 | 5 | Optimized enemies |

### Optimization Tips

1. Use `set_node_enabled` for off-screen entities
2. Batch enemy spawns across frames
3. Pool commonly spawned entities
4. Limit simultaneous particle effects

---

## Forbidden Patterns

1. **Never** place player outside playable area
2. **Never** spawn more enemies than tested limits
3. **Never** forget to save scene after changes
4. **Never** hardcode scene paths in FlowKit events
5. **Never** create levels without testing entity interactions

---

## Quality Checklist

- [ ] Player spawns at appropriate position
- [ ] All enemies are properly positioned
- [ ] Collision boundaries are set
- [ ] Scene logic (FlowKit events) works correctly
- [ ] Victory/defeat conditions trigger properly
- [ ] Scene loads without errors
- [ ] Performance is acceptable
