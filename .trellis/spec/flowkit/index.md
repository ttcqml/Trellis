# FlowKit Event System Guidelines

> Comprehensive guide to the FlowKit visual scripting framework.

---

## Overview

FlowKit is an event-driven visual scripting system for Godot. It enables game logic through declarative Event-Condition-Action patterns without writing code.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Event Reference](./event-reference.md) | 30+ events reference | Done |
| [Condition Reference](./condition-reference.md) | 23 conditions reference | Done |
| [Action Reference](./action-reference.md) | 51 actions reference | Done |
| [Behavior Reference](./behavior-reference.md) | 13 behaviors reference | Done |
| [API Usage Guidelines](./api-usage-guidelines.md) | FlowKitSheetCreatorStatic | Done |
| [Capability Matrix](./capability-matrix.md) | Node type capabilities | Done |

---

## FlowKit Architecture

```
Scene (.tscn)
├── System Node              # Global system events
├── Entity Nodes             # Entity-specific events
│   └── flowkit_behaviors    # Behavior meta
└── Event Sheet (.tres)      # Auto-saved to addons/flowkit/saved/
```

---

## Core Concepts

### Event Sheets

Event sheets are stored per-scene at:
```
addons/flowkit/saved/event_sheet/{scene_uid}.tres
```

### Event Blocks

Each event block contains:
- **Event**: Trigger condition (when)
- **Conditions**: Filter conditions (if)
- **Actions**: What to do (then)

### Node Types

| Type | Description | Behaviors |
|------|-------------|-----------|
| System | Global game events | None |
| Entity | Game object events | 13 available |
| FCharacter | Player entity | Inherits Entity |
| CharacterBody2D | Physics body | 1 available |

---

## Quick Reference

### Event Flow

```
Event Triggered
    ↓
All Conditions Checked
    ↓ (if all pass)
All Actions Executed
    ↓
Event Complete
```

### Target Node Types

| Target | Usage |
|--------|-------|
| `NodePath("System")` | System-level events |
| `NodePath(".")` | Current node |
| `NodePath("ChildName")` | Specific child node |

---

## Statistics

- **Events**: 30
- **Conditions**: 23
- **Actions**: 51
- **Behaviors**: 14

---

## FlowKit Tools

### FlowKitSheetCreatorStatic

Create and modify event sheets programmatically.

### FlowKitBehaviorTool

Manage behaviors on scene nodes.

### FlowKitVariableExtractor

Extract custom variables from scenes.

---

## Resource Paths

```
addons/flowkit/
├── events/           # Event scripts
│   ├── Entity/
│   └── System/
├── conditions/       # Condition scripts
│   ├── Entity/
│   └── System/
├── actions/          # Action scripts
│   ├── Entity/
│   └── System/
├── behaviors/        # Behavior scripts
└── saved/            # Auto-saved event sheets
    └── event_sheet/
```

---

**Language**: Documentation in **English** with Chinese parameter names where used in FlowKit.
