# Entity Development Guidelines

> Best practices for game entity development in this Godot project.

---

## Overview

This directory contains guidelines for developing game entities (players, enemies, NPCs, pets) using the FlowKit framework and Beehave behavior trees.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Entity folder organization | Done |
| [Role Guidelines](./role-guidelines.md) | Role class usage and configuration | Done |
| [Component Guidelines](./component-guidelines.md) | Component usage patterns | Done |
| [Behavior Guidelines](./behavior-guidelines.md) | FlowKit Behavior configuration | Done |
| [FlowKit Entity Patterns](./flowkit-entity-patterns.md) | Entity events/conditions/actions | Done |
| [Quality Guidelines](./quality-guidelines.md) | Entity quality standards | Done |
| [Collision Guidelines](./collision-guidelines.md) | Collision layer configuration | Done |

---

## Entity Types

| Type | Base Class | Description | Template |
|------|-----------|-------------|----------|
| Player | FCharacter | Playable character | `Game_flowkit/Entity/Player/FCharacter.tscn` |
| Monster | FMonster | Enemy entities | `Game_flowkit/Entity/Enemy/FMonster.tscn` |
| NPC | Role | Non-player characters | `Game_flowkit/Entity/Role/FRole.tscn` |
| Pet | Role | Companion entities | `Game_flowkit/Entity/Role/FRole.tscn` |

---

## Quick Reference: Entity Creation Triggers

### When to Create a New Entity

- [ ] New character type needed (player, enemy, NPC, pet)
- [ ] Custom behaviors required (special AI, unique abilities)
- [ ] Custom stats needed (health, speed, damage values)
- [ ] Specific collision configuration required

-> Use `godot-role-builder` skill or read [Role Guidelines](./role-guidelines.md)

### When to Modify Existing Entity

- [ ] Adjusting stats or behaviors on existing template
- [ ] Adding new FlowKit behaviors
- [ ] Changing collision layers

-> Read [Behavior Guidelines](./behavior-guidelines.md)

---

## How to Fill These Guidelines

For each guideline file:

1. Document your project's **actual conventions** (not ideals)
2. Include **GDScript examples** from your codebase
3. List **forbidden patterns** and why
4. Add **common mistakes** your team has made

---

**Language**: Documentation should be written in **English** with Chinese comments where helpful.
