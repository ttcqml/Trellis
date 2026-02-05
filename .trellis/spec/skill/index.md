# Skill System Guidelines

> Best practices for skill and ability development in this Godot project.

---

## Overview

This directory contains guidelines for developing skills, abilities, and combat mechanics using SkillData resources and the SkillBoxComponent system.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [SkillData Guidelines](./skill-data-guidelines.md) | SkillData resource structure | Done |
| [Attack Skill Patterns](./attack-skill-patterns.md) | Attack skill configuration | Done |
| [Buff Skill Patterns](./buff-skill-patterns.md) | Buff/passive skill patterns | Done |
| [Bullet Motion Patterns](./bullet-motion-patterns.md) | Projectile movement components | Done |
| [Skill Event Guidelines](./skill-event-guidelines.md) | AnimationEvent, FireEvent, etc. | Done |

---

## Skill System Architecture

```
SkillBoxComponent
├── init_attack_skill_datas    # Auto-fire attack skills
├── init_skill_datas           # Triggered normal skills
└── init_halo_skill_datas      # Passive aura skills
```

---

## Skill Categories

| Category | Behavior ID | Trigger | Example |
|----------|-------------|---------|---------|
| Attack | `attack` | Automatic | Basic attacks |
| Normal | `skill` | Input/Event | Special abilities |
| Halo | `halo` | Passive | Auras, buffs |

---

## Quick Reference: Skill Creation Triggers

### When to Create a New Skill

- [ ] New attack pattern needed
- [ ] New ability for entity
- [ ] Custom projectile behavior
- [ ] New buff/debuff effect

### When to Modify Existing Skill

- [ ] Adjusting damage/cooldown
- [ ] Changing projectile pattern
- [ ] Modifying buff duration

---

## Resource Locations

### SkillData Resources

```
Game_flowkit/Resources/SkillData/
├── Player/                  # Player skills
├── Monster/                 # Enemy skills
└── Shared/                  # Shared skills
```

### Bullet Scenes

```
Game_flowkit/Entity/Bullet/
└── [BulletType].tscn
```

---

## Core Principle

**Skills = SkillData + Events + Bullets**

Skills are data-driven. Combat logic is defined through:
1. SkillData resource (configuration)
2. Skill events (timing and triggers)
3. Bullet entities (projectiles)

---

**Language**: Documentation should be written in **English** with Chinese comments where helpful.
