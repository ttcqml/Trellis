# Entity Directory Structure

> Organization of entity files in `Game_flowkit/Entity/`

---

## Directory Layout

```
Game_flowkit/Entity/
├── Player/                  # Player character entities
│   ├── FCharacter.tscn      # Base player template
│   ├── FCharacterTest.tscn  # Player with test configuration
│   └── [CustomPlayer].tscn  # Custom player variants
│
├── Enemy/                   # Enemy/Monster entities
│   ├── FMonster.tscn        # Base monster template
│   ├── FMonsterTest.tscn    # Monster with test configuration
│   └── [CustomMonster].tscn # Custom monster variants
│
├── Role/                    # Generic role entities (NPC, Pet)
│   ├── FRole.tscn           # Base role template
│   └── [CustomRole].tscn    # Custom role variants
│
└── Bullet/                  # Projectile entities
    └── [BulletType].tscn    # Various bullet types
```

---

## User-Created Entities

Custom entities should be placed in:

```
RequirementImp/
├── Player/                  # Custom player entities
│   └── [PlayerName].tscn
├── Monster/                 # Custom enemy entities
│   └── [MonsterName].tscn
├── NPC/                     # Custom NPC entities
│   └── [NPCName].tscn
├── Pet/                     # Custom pet entities
│   └── [PetName].tscn
└── BehaviorTree/            # Custom behavior trees
    └── [TreeName].tscn
```

---

## Naming Conventions

### Entity Scenes

| Type | Prefix | Example |
|------|--------|---------|
| Player | `F` or descriptive | `FCharacter.tscn`, `Warrior.tscn` |
| Monster | `F` or descriptive | `FMonster.tscn`, `Slime.tscn` |
| Role/NPC | `F` or descriptive | `FRole.tscn`, `Shopkeeper.tscn` |
| Pet | descriptive | `FireSpirit.tscn` |
| Bullet | descriptive | `FireBullet.tscn` |

### Node Names

- Root node: Same as scene file name (without `.tscn`)
- Child nodes: Descriptive, PascalCase (e.g., `AnimatedSprite2D`, `CollisionShape2D`)

---

## Resource Paths

### Sprite Frames

```
Game_flowkit/Resources/SpriteFrames/
├── ArcherPlayer.tres        # Player animations
├── Slime.tres               # Monster animations
├── Pumpkin.tres             # NPC/Pet animations
└── [CustomAnim].tres        # Custom animations
```

### Behavior Trees

```
Game_flowkit/BehaviorTree/
├── PlayerAttackTree.tscn    # Default player AI
├── MonsterAttackTree.tscn   # Default monster AI
└── [CustomTree].tscn        # Custom behavior trees
```

### Health Bars

```
Game_flowkit/UI/
└── HpBar.tscn               # Health bar UI component
```

---

## File Relationships

```
Entity Scene (.tscn)
├── References SpriteFrames (.tres)
├── References BehaviorTree (.tscn)
├── References SkillData (.tres)
└── Contains FlowKit Behaviors (meta)
```

---

## Forbidden Patterns

1. **Never** put custom entities in `Game_flowkit/` - use `RequirementImp/` instead
2. **Never** modify base templates directly - copy and customize
3. **Never** use absolute file paths - always use `res://` paths
4. **Never** duplicate existing entity types - extend from templates

---

## Common Mistakes

1. Creating entities in wrong directory
2. Forgetting to set up collision layers
3. Not including required behaviors (animated_sprite2d, collision)
4. Using wrong base template for entity type
