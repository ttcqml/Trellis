# AI Behavior Tree Guidelines

> Best practices for AI development using Beehave behavior trees.

---

## Overview

This directory contains guidelines for developing AI behavior using the Beehave behavior tree system. Behavior trees define entity decision-making for players, enemies, pets, and NPCs.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Beehave Guidelines](./beehave-guidelines.md) | Beehave framework usage | Done |
| [Monster AI Patterns](./monster-ai-patterns.md) | Enemy AI patterns | Done |
| [Player Behavior Patterns](./player-behavior-patterns.md) | Player control patterns | Done |
| [Pet AI Patterns](./pet-ai-patterns.md) | Pet/companion AI | Done |
| [Condition Action Reference](./condition-action-reference.md) | Custom nodes reference | Done |

---

## Behavior Tree Architecture

```
BeehaveTree (root)
└── SelectorReactiveComposite
    ├── Sequence: born (initialization)
    │   ├── BornCondition
    │   └── BornAction
    ├── Sequence: die (death handling)
    │   ├── DieCondition
    │   └── DieAction
    ├── Sequence: attack (combat)
    │   ├── AttackCondition
    │   └── AttackAction
    └── Sequence: move (movement)
        ├── MoveCondition
        └── MoveAction
```

---

## Quick Reference: AI Creation Triggers

### When to Create Custom Behavior Tree

- [ ] Entity needs unique AI logic
- [ ] Different priority ordering required
- [ ] Special conditions/actions needed
- [ ] Boss or elite enemy behavior

-> Use `godot-behavior-tree-builder` skill

### When to Use Preset Trees

- [ ] Standard player control
- [ ] Basic enemy AI
- [ ] Simple NPC behavior

-> Use existing templates:
- Player: `Game_flowkit/BehaviorTree/PlayerAttackTree.tscn`
- Monster: `Game_flowkit/BehaviorTree/MonsterAttackTree.tscn`

---

## Core Concepts

### Behavior Tree Execution

1. **Tick**: Tree evaluates from root each frame
2. **Selector**: Tries children until one succeeds
3. **Sequence**: Runs children in order, fails if any fails
4. **Condition**: Returns SUCCESS or FAILURE
5. **Action**: Performs work, returns SUCCESS/RUNNING/FAILURE

### Node Return Values

| Value | Meaning | Selector Behavior | Sequence Behavior |
|-------|---------|-------------------|-------------------|
| SUCCESS | Completed | Stop, return SUCCESS | Continue next |
| FAILURE | Failed | Try next child | Stop, return FAILURE |
| RUNNING | In progress | Stop, return RUNNING | Stop, return RUNNING |

---

## Resource Locations

### Preset Trees

```
Game_flowkit/BehaviorTree/
├── PlayerAttackTree.tscn    # Player AI
└── MonsterAttackTree.tscn   # Monster AI
```

### Custom Conditions

```
Framework/Scripts/Beehave/Condition/
├── BornCondition.gd
├── DieCondition.gd
├── AttackCondition.gd
└── PlayerMoveCondition.gd
```

### Custom Actions

```
Framework/Scripts/Beehave/Action/
├── BornAction.gd
├── DieAction.gd
├── AttackAction.gd
├── PlayerMoveAction.gd
└── SkillAction.gd
```

---

**Language**: Documentation should be written in **English** with Chinese comments where helpful.
