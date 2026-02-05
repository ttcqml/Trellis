# Thinking Guides

> **Purpose**: Expand your thinking to catch things you might not have considered.

---

## Why Thinking Guides?

**Most bugs and tech debt come from "didn't think of that"**, not from lack of skill:

- Didn't think about system interactions → Entity-FlowKit-AI integration bugs
- Didn't think about component composition → duplicated behaviors everywhere
- Didn't think about event flow → FlowKit events not triggering
- Didn't think about future maintainers → unreadable scenes

These guides help you **ask the right questions before coding**.

---

## Available Guides

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| [Code Reuse Thinking Guide](./code-reuse-thinking-guide.md) | Identify patterns and reduce duplication | When you notice repeated patterns |
| [Cross-System Thinking Guide](./cross-system-thinking-guide.md) | Think through Entity-Scene-Skill-AI relationships | Features spanning multiple systems |
| [FlowKit Thinking Guide](./flowkit-thinking-guide.md) | Design event-driven game logic | Creating FlowKit event blocks |
| [Component Composition Guide](./component-composition-guide.md) | Compose behaviors and components effectively | Building entities with multiple features |

---

## Quick Reference: Thinking Triggers

### When to Think About Cross-System Issues

- [ ] Feature touches 3+ systems (Entity, Scene, Skill, AI)
- [ ] Data flows between FlowKit events and Beehave trees
- [ ] Multiple entities need the same behavior
- [ ] You're not sure where to put some logic

→ Read [Cross-System Thinking Guide](./cross-system-thinking-guide.md)

### When to Think About FlowKit Design

- [ ] Creating new game logic with events
- [ ] Choosing between Entity and System events
- [ ] Designing condition/action combinations
- [ ] Connecting FlowKit to behavior trees

→ Read [FlowKit Thinking Guide](./flowkit-thinking-guide.md)

### When to Think About Component Composition

- [ ] Entity needs multiple behaviors
- [ ] Similar entities share common features
- [ ] Behavior dependencies are complex
- [ ] You're deciding between inheritance and composition

→ Read [Component Composition Guide](./component-composition-guide.md)

### When to Think About Code Reuse

- [ ] You're writing similar code to something that exists
- [ ] You see the same pattern repeated 3+ times
- [ ] You're adding a new field to multiple entities
- [ ] **You're modifying any constant or resource**
- [ ] **You're creating a new utility function** ← Search first!

→ Read [Code Reuse Thinking Guide](./code-reuse-thinking-guide.md)

---

## Pre-Modification Rule (CRITICAL)

> **Before changing ANY value, ALWAYS search first!**

```gdscript
# Search for the value you're about to change
# Use Glob/Grep tools or IDE search

# Example: Find all uses of a constant
grep -r "MAX_HEALTH" .

# Example: Find all uses of a behavior
grep -r "health" *.tscn
```

This single habit prevents most "forgot to update X" bugs.

---

## How to Use This Directory

1. **Before coding**: Skim the relevant thinking guide
2. **During coding**: If something feels repetitive or complex, check the guides
3. **After bugs**: Add new insights to the relevant guide (learn from mistakes)

---

## Godot-Specific Considerations

### System Relationships

```
Entity → has Behaviors → enables Events/Conditions/Actions
Scene → contains Entities → orchestrates with System events
Skills → attached to Entities → executed via FlowKit or AI
AI (Beehave) → controls Entity → reads/writes Blackboard
```

### Common Integration Points

| From | To | Integration |
|------|-----|-------------|
| FlowKit | Beehave | behavior_tree behavior |
| Entity | Scene | Entity composition |
| Skill | Entity | skill_box behavior |
| Health | UI | hp_bar behavior |

---

## Contributing

Found a new "didn't think of that" moment? Add it to the relevant guide.

---

**Core Principle**: 30 minutes of thinking saves 3 hours of debugging.
