# UI Scene Guidelines

> Design patterns for user interface scenes.

---

## UI Scene Types

| Type | Purpose | Example |
|------|---------|---------|
| Screen | Full-screen UI | Main menu, Pause screen |
| HUD | In-game overlay | Health bar, Score display |
| Popup | Modal dialogs | Confirmation, Settings |
| Component | Reusable elements | Buttons, Panels |

---

## UI Node Hierarchy

### Screen Template

```
ScreenName (Control)
├── Background (ColorRect/TextureRect)
├── VBoxContainer
│   ├── Title (Label)
│   ├── Content (Container)
│   │   └── [Screen-specific content]
│   └── Buttons (HBoxContainer)
│       ├── Button1
│       └── Button2
└── CloseButton (optional)
```

### HUD Template

```
HUD (CanvasLayer)
├── TopBar (Control)
│   ├── HealthBar
│   └── ScoreLabel
├── BottomBar (Control)
│   └── SkillButtons
└── CenterOverlay (Control)
    └── [Dynamic elements]
```

### Popup Template

```
Popup (Control)
├── Overlay (ColorRect - semi-transparent)
├── Panel (PanelContainer)
│   ├── Title (Label)
│   ├── Message (RichTextLabel)
│   └── Buttons (HBoxContainer)
│       ├── ConfirmButton
│       └── CancelButton
└── CloseButton
```

---

## Common UI Components

### Health Bar (HpBar)

```
Location: res://Game_flowkit/UI/HpBar.tscn

Usage via FlowKit behavior:
{
    "behavior_id": "hp_bar",
    "inputs": {
        "hp_bar_scene": "res://Game_flowkit/UI/HpBar.tscn",
        "pos_x": 0,
        "pos_y": -30  # Above entity
    }
}
```

### Button Patterns

```gdscript
# Standard button signal connection
button.pressed.connect(_on_button_pressed)

# Via FlowKit (System events):
# Event: on_action_down with action "ui_accept"
# Condition: Check current UI state
# Action: Execute button function
```

---

## UI Layout Guidelines

### Anchoring

| Element | Anchor Preset | Notes |
|---------|---------------|-------|
| Full screen | Full Rect | Covers entire screen |
| Top bar | Top Wide | Fixed at top |
| Bottom bar | Bottom Wide | Fixed at bottom |
| Center popup | Center | Modal dialogs |
| Corner element | Custom | Use margins |

### Margins and Spacing

| Context | Recommended Value |
|---------|------------------|
| Screen padding | 16-32 px |
| Element spacing | 8-16 px |
| Button spacing | 8 px |
| Text padding | 4-8 px |

---

## UI and FlowKit Integration

### UI Visibility Control

```python
# System action to show/hide UI
FlowKitSheetCreatorStatic.AddActionToEvent(
    "set_node_enabled",
    NodePath("UI/PauseScreen"),
    {"启用": True}
)
```

### Input Handling

```python
# Detect UI input
FlowKitSheetCreatorStatic.AddEvent(
    "on_action_down",
    NodePath("System"),
    {"action": "ui_pause"}
)

# Toggle pause
FlowKitSheetCreatorStatic.AddActionToEvent(
    "toggle_pause",
    NodePath("System"),
    {}
)
```

---

## Responsive Design

### Resolution Handling

```
Project Settings → Display → Window:
- Viewport Width/Height: Base resolution
- Stretch Mode: canvas_items (recommended)
- Stretch Aspect: keep (recommended)
```

### Scaling Rules

| Element | Scale Behavior |
|---------|---------------|
| Text | Fixed size with minimum |
| Icons | Scale proportionally |
| Panels | Stretch to fill |
| Buttons | Minimum size with grow |

---

## UI Animation

### Recommended Transitions

| Transition | Duration | Easing |
|------------|----------|--------|
| Fade in/out | 0.2-0.3s | ease_out |
| Slide | 0.3-0.5s | ease_out |
| Scale pop | 0.2s | bounce |
| Color change | 0.1-0.2s | linear |

### Implementation

```gdscript
# Using Tween
var tween = create_tween()
tween.tween_property(node, "modulate:a", 1.0, 0.3)
```

---

## Theming

### Project Theme

```
Location: res://Game_flowkit/Resources/Theme/
- default_theme.tres (base theme)
- [custom_theme].tres (variations)
```

### Theme Components

| Component | Property | Notes |
|-----------|----------|-------|
| Font | base_font | Project default font |
| Colors | panel_bg | Background colors |
| Styles | panel_normal | Panel appearance |

---

## Forbidden Patterns

1. **Never** use hardcoded pixel positions for responsive UI
2. **Never** create UI without anchor configuration
3. **Never** embed game logic in UI scripts
4. **Never** use UI nodes for game entities
5. **Never** forget to handle UI input vs game input

---

## Quality Checklist

- [ ] UI responds to window resize
- [ ] All text is readable at minimum resolution
- [ ] Buttons have hover/pressed states
- [ ] Navigation works with keyboard/controller
- [ ] UI doesn't block game when inappropriate
- [ ] Consistent styling across screens
- [ ] Proper z-order for overlapping elements
