Create a new game scene (level, battle arena, UI, etc.)

This command launches the godot-scene-builder skill to guide you through scene creation.

---

## Before Starting

Read the scene guidelines:
```
cat .trellis/spec/scene/index.md
```

## Scene Creation Process

The skill will guide you through:

1. **Scene Type Selection**
   - Level/Game scene
   - UI scene
   - Test scene

2. **Scene Setup**
   - Name and save path
   - System node for FlowKit
   - TileMap/background setup

3. **Entity Composition**
   - Player spawn point
   - Enemy placements
   - NPC positions
   - Pickup/item locations

4. **FlowKit Events** (System level)
   - Input handling (pause, etc.)
   - Wave management
   - Win/lose conditions

---

## Usage

Invoke the skill:
```
/godot-scene-builder
```

Or describe what you need:
```
Create a battle arena with player, 5 slimes, and wave complete detection
```

The skill will:
- Create scene structure
- Instance required entities (creating them if needed)
- Add System FlowKit events
- Configure spawning logic

---

## After Creation

Verify with:
```
/trellis:check-scene
```
