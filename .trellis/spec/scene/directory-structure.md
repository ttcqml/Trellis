# Scene Directory Structure

> Organization of scene files in the project.

---

## Directory Layout

```
Game_flowkit/
├── Scenes/                  # Game scenes
│   ├── Stage/               # Combat/Level scenes
│   │   ├── Start.tscn       # Starting scene
│   │   └── [LevelName].tscn # Level scenes
│   └── [Category]/          # Other scene categories
│
├── EntityTemplate/          # Scene templates
│   └── GameScene.tscn       # Base game scene template
│
├── UI/                      # UI scenes and components
│   ├── HpBar.tscn           # Health bar component
│   └── [UIComponent].tscn   # Other UI components
│
└── Entity/                  # Entity templates (see entity spec)
    ├── Player/
    ├── Enemy/
    └── Role/
```

---

## User-Created Scenes

Custom scenes should be placed in:

```
RequirementImp/
├── Scenes/                  # Custom game scenes
│   └── [SceneName].tscn
├── UI/                      # Custom UI scenes
│   └── [UIName].tscn
└── [EntityType]/            # Custom entities (see entity spec)
```

---

## Scene File Naming

### Game Scenes

| Type | Naming Pattern | Example |
|------|----------------|---------|
| Level | `[AreaName][Number].tscn` | `Forest01.tscn` |
| Boss | `Boss[Name].tscn` | `BossSlimeKing.tscn` |
| Tutorial | `Tutorial[Topic].tscn` | `TutorialCombat.tscn` |
| Test | `Test[Feature].tscn` | `TestCombat.tscn` |

### UI Scenes

| Type | Naming Pattern | Example |
|------|----------------|---------|
| Screen | `[Name]Screen.tscn` | `MainMenuScreen.tscn` |
| Popup | `[Name]Popup.tscn` | `PausePopup.tscn` |
| Component | `[Name].tscn` | `HpBar.tscn` |

---

## Scene Node Structure

### Game Scene Template

```
GameScene (Node2D)
├── System                   # FlowKit System node (auto-created)
├── Player                   # Player entity instance
├── Enemies                  # Container for enemies
│   ├── Enemy1               # Enemy instances
│   └── Enemy2
├── Items                    # Container for items
├── Environment              # Background, decorations
└── UI                       # HUD elements
    └── HpBar
```

### UI Scene Template

```
UIScreen (Control)
├── Background               # Background panel
├── Content                  # Main content container
│   ├── Title
│   └── [Elements]
└── Buttons                  # Interactive elements
```

---

## Resource Paths

### Event Sheets

FlowKit event sheets are auto-saved to:
```
addons/flowkit/saved/event_sheet/{sceneUID}.tres
```

### Scene Dependencies

```
Scene (.tscn)
├── Instantiates Entity (.tscn)
├── References FlowKit EventSheet (.tres)
├── References UI Components (.tscn)
└── May reference SkillData (.tres)
```

---

## Organization Rules

### By Scene Type

```
Scenes/
├── Stage/          # Combat levels
├── Town/           # Safe zones
├── Dungeon/        # Exploration areas
└── Boss/           # Boss encounters
```

### By Game Area

```
Scenes/
├── Chapter1/       # Story chapter 1
│   ├── Forest/
│   └── Cave/
├── Chapter2/       # Story chapter 2
└── Shared/         # Reusable scenes
```

---

## Forbidden Patterns

1. **Never** put scenes directly in project root
2. **Never** mix entity and scene files in same directory
3. **Never** use generic names like `Scene1.tscn`
4. **Never** create scenes without System node
5. **Never** embed entity logic in scenes - use entity templates

---

## Common Mistakes

1. Forgetting to create System node for FlowKit events
2. Placing custom scenes in `Game_flowkit/` instead of `RequirementImp/`
3. Not organizing enemies/items into container nodes
4. Hardcoding entity paths instead of using instantiation
