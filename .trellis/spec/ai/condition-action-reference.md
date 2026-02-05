# Beehave Condition and Action Reference

> Complete reference for custom Beehave nodes in the project.

---

## Composite Nodes

### Available Composites

| Node Type | Script Path | Description |
|-----------|-------------|-------------|
| `SelectorReactive` | `addons/beehave/nodes/composites/selector_reactive.gd` | Reactive selector |
| `Sequence` | `addons/beehave/nodes/composites/sequence.gd` | Sequential execution |
| `SequenceReactive` | `addons/beehave/nodes/composites/sequence_reactive.gd` | Reactive sequence |
| `Selector` | `addons/beehave/nodes/composites/selector.gd` | Basic selector |

### Usage

```python
BeehaveTreeCreatorStatic.add_composite(
    scene_path,
    "SelectorReactive",  # node_type
    "RootSelector",      # node_name
    NodePath("")         # parent_path (empty for root)
)
```

---

## Custom Conditions

### BornCondition

**Purpose**: Check if entity just spawned and needs initialization.

**Script**: `Framework/Scripts/Beehave/Condition/BornCondition.gd`

**Returns**:
- `SUCCESS`: Entity needs spawn initialization
- `FAILURE`: Spawn already complete

**Usage**:
```python
BeehaveTreeCreatorStatic.add_condition(
    scene_path,
    "res://Framework/Scripts/Beehave/Condition/BornCondition.gd",
    "BornCondition",
    NodePath("SelectorReactiveComposite/born")
)
```

---

### DieCondition

**Purpose**: Check if entity should die (health <= 0).

**Script**: `Framework/Scripts/Beehave/Condition/DieCondition.gd`

**Returns**:
- `SUCCESS`: Entity should die
- `FAILURE`: Entity still alive

**Usage**:
```python
BeehaveTreeCreatorStatic.add_condition(
    scene_path,
    "res://Framework/Scripts/Beehave/Condition/DieCondition.gd",
    "DieCondition",
    NodePath("SelectorReactiveComposite/die")
)
```

---

### AttackCondition

**Purpose**: Check if entity can/should attack.

**Script**: `Framework/Scripts/Beehave/Condition/AttackCondition.gd`

**Returns**:
- `SUCCESS`: Attack conditions met
- `FAILURE`: Cannot attack

**Notes**: Typically checks cooldown, target presence, range.

---

### PlayerMoveCondition

**Purpose**: Check for player movement input.

**Script**: `Framework/Scripts/Beehave/Condition/PlayerMoveCondition.gd`

**Returns**:
- `SUCCESS`: Movement input detected
- `FAILURE`: No movement input

**Blackboard Output**:
- `move_direction`: Vector2 - Normalized movement direction

**Notes**: Directly checks Input system for movement actions.

---

### PetsAttackCondition

**Purpose**: Check if pet should attack a nearby enemy.

**Script**: `Framework/Scripts/Beehave/Condition/PetsAttackCondition.gd`

**Returns**:
- `SUCCESS`: Valid target found
- `FAILURE`: No valid target

**Blackboard Output**:
- `attack_target`: Node2D - Target enemy

---

## Custom Actions

### BornAction

**Purpose**: Handle entity spawn initialization.

**Script**: `Framework/Scripts/Beehave/Action/BornAction.gd`

**Returns**:
- `SUCCESS`: Spawn complete
- `RUNNING`: Spawn animation in progress

**Effects**:
- Plays spawn animation
- Sets `spawn_complete` in blackboard

**Usage**:
```python
BeehaveTreeCreatorStatic.add_action(
    scene_path,
    "res://Framework/Scripts/Beehave/Action/BornAction.gd",
    "BornAction",
    {},  # properties
    NodePath("SelectorReactiveComposite/born")
)
```

---

### DieAction

**Purpose**: Handle entity death.

**Script**: `Framework/Scripts/Beehave/Action/DieAction.gd`

**Properties**:
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `duration` | float | 0.25 | Death animation duration |

**Returns**:
- `SUCCESS`: Death complete (entity freed)
- `RUNNING`: Death animation in progress

**Usage**:
```python
BeehaveTreeCreatorStatic.add_action(
    scene_path,
    "res://Framework/Scripts/Beehave/Action/DieAction.gd",
    "DieAction",
    {"duration": 0.25},
    NodePath("SelectorReactiveComposite/die")
)
```

---

### AttackAction

**Purpose**: Execute entity attack.

**Script**: `Framework/Scripts/Beehave/Action/AttackAction.gd`

**Returns**:
- `SUCCESS`: Attack executed
- `FAILURE`: Cannot attack

**Effects**:
- Triggers skill box attack
- Plays attack animation

---

### HitAction

**Purpose**: Handle hit reaction when entity takes damage.

**Script**: `Framework/Scripts/Beehave/Action/HitAction.gd`

**Returns**:
- `SUCCESS`: Hit reaction complete
- `RUNNING`: Hit stun in progress

**Effects**:
- Plays hit animation
- Applies hit stun

---

### PlayerMoveAction

**Purpose**: Execute player movement based on input.

**Script**: `Framework/Scripts/Beehave/Action/PlayerMoveAction.gd`

**Returns**:
- `SUCCESS`: Movement executed

**Blackboard Input**:
- `move_direction`: Vector2 - Movement direction

**Effects**:
- Moves entity using velocity
- Updates animation based on direction

---

### PetsAttackAction

**Purpose**: Execute pet attack on target.

**Script**: `Framework/Scripts/Beehave/Action/PetsAttackAction.gd`

**Returns**:
- `SUCCESS`: Attack executed
- `FAILURE`: No valid target

**Blackboard Input**:
- `attack_target`: Node2D - Target to attack

---

### SkillAction

**Purpose**: Execute a specific skill.

**Script**: `Framework/Scripts/Beehave/Action/SkillAction.gd`

**Returns**:
- `SUCCESS`: Skill executed
- `FAILURE`: Cannot use skill (cooldown, etc.)

---

## Monster-Specific Nodes

### MonsterMoveCondition

**Purpose**: Check if monster should move (chase player).

**Script**: `Framework/Scripts/Beehave/Condition/Monster/MonsterMoveCondition.gd`

**Returns**:
- `SUCCESS`: Should move toward player
- `FAILURE`: No valid movement target

---

### MonsterMoveAction

**Purpose**: Execute monster movement toward target.

**Script**: `Framework/Scripts/Beehave/Action/monster/MonsterMoveAction.gd`

**Returns**:
- `SUCCESS`: Movement executed

**Effects**:
- Moves toward player
- Updates facing direction
- Plays walk animation

---

## Creating Custom Nodes

### Custom Condition Template

```gdscript
extends ConditionLeaf
class_name CustomCondition

@export var threshold: float = 1.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    # Check condition
    if check_condition(actor, threshold):
        return SUCCESS
    return FAILURE

func check_condition(actor: Node, threshold: float) -> bool:
    # Implementation
    return true
```

### Custom Action Template

```gdscript
extends ActionLeaf
class_name CustomAction

@export var duration: float = 1.0

var timer: float = 0.0

func tick(actor: Node, blackboard: Blackboard) -> int:
    timer += get_process_delta_time()

    if timer >= duration:
        timer = 0.0
        return SUCCESS

    # Do work
    perform_action(actor)

    return RUNNING

func perform_action(actor: Node):
    # Implementation
    pass
```

---

## BeehaveTreeCreatorStatic API

### create_tree

```python
BeehaveTreeCreatorStatic.create_tree(scene_path: String, tree_name: String)
# Creates new behavior tree scene
```

### add_composite

```python
BeehaveTreeCreatorStatic.add_composite(
    scene_path: String,
    node_type: String,      # "Selector", "Sequence", etc.
    node_name: String,
    parent_path: NodePath   # Optional
) -> Node
```

### add_condition

```python
BeehaveTreeCreatorStatic.add_condition(
    scene_path: String,
    condition_script_path: String,
    node_name: String,
    parent_path: NodePath   # Optional
) -> Node
```

### add_action

```python
BeehaveTreeCreatorStatic.add_action(
    scene_path: String,
    action_script_path: String,
    node_name: String,
    properties: Dictionary,  # e.g., {"duration": 0.25}
    parent_path: NodePath    # Optional
) -> Node
```

### save_tree

```python
BeehaveTreeCreatorStatic.save_tree(scene_path: String)
# Saves and refreshes editor
```

---

## Blackboard Keys Reference

| Key | Type | Set By | Used By |
|-----|------|--------|---------|
| `spawn_complete` | bool | BornAction | BornCondition |
| `is_dying` | bool | DieCondition | Various |
| `move_direction` | Vector2 | MoveCondition | MoveAction |
| `attack_target` | Node2D | AttackCondition | AttackAction |
| `target` | Node2D | Various | Various |
| `skill_to_use` | int | SkillCondition | SkillAction |
