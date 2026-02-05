Create a new Beehave behavior tree for AI-controlled entities.

This command launches the godot-behavior-tree-builder skill to guide you through behavior tree creation.

---

## Before Starting

Read the AI guidelines:
```
cat .trellis/spec/ai/index.md
```

## Behavior Tree Creation Process

The skill will guide you through:

1. **AI Type Selection**
   - Monster AI (chase, attack, die)
   - Player AI (input-driven)
   - Pet AI (follow, assist)
   - NPC AI (patrol, dialogue)

2. **Tree Structure**
   - Root composite (SelectorReactive recommended)
   - Priority branches (die > attack > move)
   - Condition/Action pairing

3. **Standard Branches**
   - Born sequence (spawn handling)
   - Die sequence (death handling)
   - Attack sequence (combat)
   - Move sequence (navigation)

4. **Blackboard Configuration**
   - Key definitions
   - Condition outputs
   - Action inputs

---

## Usage

Invoke the skill:
```
/godot-behavior-tree-builder
```

Or describe what you need:
```
Create a monster AI that spawns, chases player, attacks when close, and dies when health is zero
```

The skill will create:
- Behavior tree scene (.tscn)
- Required condition scripts
- Required action scripts
- Blackboard key documentation

---

## After Creation

Attach to entity via behavior_tree behavior:
```python
FlowKitBehaviorTool.AddBehaviorToScene(
    entity_path, ".",
    "behavior_tree",
    {"default_tree_scene": "res://AI/NewTree.tscn"},
    False
)
```

Verify with:
```
/trellis:check-cross-system
```
