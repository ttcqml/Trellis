Create a new game entity (player, enemy, NPC, pet, etc.)

This command launches the godot-role-builder skill to guide you through entity creation.

---

## Before Starting

Read the entity guidelines:
```
cat .trellis/spec/entity/index.md
```

## Entity Creation Process

The skill will guide you through:

1. **Entity Type Selection**
   - FCharacter (player)
   - FMonster (enemy)
   - Role (generic entity)

2. **Core Configuration**
   - Name and save path
   - Base attributes (health, speed)
   - Faction (玩家, 敌人, 中立)

3. **Behavior Setup**
   - Visual behaviors (animated_sprite2d)
   - Combat behaviors (health, faction, skill_box)
   - Collision behaviors (area2d, characterbody2d_collision)
   - AI behaviors (behavior_tree)

4. **FlowKit Events** (optional)
   - Death handling
   - Collision responses
   - Health change reactions

---

## Usage

Invoke the skill:
```
/godot-role-builder
```

Or describe what you need:
```
Create a monster with 50 HP that chases the player
```

The skill will create:
- Entity scene (.tscn)
- Required behaviors
- Optional FlowKit events
- Optional behavior tree

---

## After Creation

Verify with:
```
/trellis:check-entity
```
