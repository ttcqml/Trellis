# Scene Development Guidelines

> Best practices for game scene development in this Godot project.

---

## Overview

This directory contains guidelines for developing game scenes that compose multiple entities together. Scenes are the playable levels, UI screens, and game environments.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Scene folder organization | Done |
| [Level Guidelines](./level-guidelines.md) | Level scene design patterns | Done |
| [UI Guidelines](./ui-guidelines.md) | UI scene design patterns | Done |
| [Entity Composition](./entity-composition.md) | Entity assembly patterns | Done |
| [FlowKit Scene Patterns](./flowkit-scene-patterns.md) | System events/conditions/actions | Done |
| [Quality Guidelines](./quality-guidelines.md) | Scene quality standards | Done |

---

## Scene Types

| Type | Purpose | Template |
|------|---------|----------|
| Game Scene | Playable levels | `Game_flowkit/EntityTemplate/GameScene.tscn` |
| Stage Scene | Combat encounters | `Game_flowkit/Scenes/Stage/` |
| UI Scene | User interfaces | `Game_flowkit/UI/` |
| Test Scene | Development testing | `RequirementImp/Scenes/` |

---

## Quick Reference: Scene Creation Triggers

### When to Create a New Scene

- [ ] New level or area needed
- [ ] New UI screen required
- [ ] Testing entity combinations
- [ ] Specific game mode setup

-> Use `godot-scene-builder` skill or read [Level Guidelines](./level-guidelines.md)

### When to Modify Existing Scene

- [ ] Adding entities to existing level
- [ ] Adjusting entity positions
- [ ] Changing scene logic (FlowKit events)

-> Read [Entity Composition](./entity-composition.md)

---

## Core Principle

**Scene = Entity Assembly + System Logic**

Scenes don't create entities from scratch - they instantiate existing entity scenes and configure them through FlowKit System events.

---

## How to Fill These Guidelines

For each guideline file:

1. Document your project's **actual conventions**
2. Include **scene structure examples**
3. List **forbidden patterns** and why
4. Add **common mistakes** your team has made

---

**Language**: Documentation should be written in **English** with Chinese comments where helpful.
