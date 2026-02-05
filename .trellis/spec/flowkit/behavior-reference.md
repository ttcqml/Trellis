# FlowKit Behavior Reference

> Complete reference for all 13 FlowKit behaviors.

---

## Behavior Overview

Behaviors are reusable components that add functionality to Entity nodes. They create child nodes, manage state, and enable specific events/conditions/actions.

---

## Behavior Categories

| Category | Behaviors | Description |
|----------|-----------|-------------|
| Visual | 3 | Rendering and animation |
| Collision | 2 | Physics and collision detection |
| Combat | 3 | Health, faction, and skills |
| AI | 1 | Behavior tree integration |
| Utility | 4 | Camera, speed, effects, signals |

---

## Visual Behaviors

### animated_sprite2d

**ID**: `animated_sprite2d`
**Node Types**: Entity

Creates an AnimatedSprite2D child node with animation management.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"sprite_frames"` | Resource | - | SpriteFrames resource |
| `"初始动画"` | String | "" | Initial animation name |
| `"ZIndex"` | int | 0 | Render order (higher = front) |

**Enables**:
- Action: `change_animation`

```python
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://scene.tscn",
    ".",
    "animated_sprite2d",
    {
        "sprite_frames": "res://sprites/player.tres",
        "初始动画": "idle",
        "ZIndex": 10
    },
    false
)
```

### sprite2d

**ID**: `sprite2d`
**Node Types**: Entity

Creates a Sprite2D child node for static images.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"texture"` | Texture2D | - | Sprite texture |
| `"ZIndex"` | int | 0 | Render order |

### hp_bar

**ID**: `hp_bar`
**Node Types**: Entity
**Requires**: `health` behavior

Creates a visual health bar display.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"offset_y"` | float | -20.0 | Vertical offset from entity |
| `"width"` | float | 32.0 | Bar width |
| `"height"` | float | 4.0 | Bar height |

---

## Collision Behaviors

### area2d

**ID**: `area2d`
**Node Types**: Entity

Creates an Area2D with CollisionShape2D for overlap detection.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"shape_size_x"` | float | 32.0 | Collision width |
| `"shape_size_y"` | float | 32.0 | Collision height |
| `"collision_layer"` | int | 1 | Layer bitmask |
| `"collision_mask"` | int | 1 | Mask bitmask |

**Enables**:
- Event: `on_area2d_collision`
- Action: `print_collision_body_name`
- Action: `damage_fcharacter_on_collision`

**Collision Layer Reference**:
| Layer | Value | Name |
|-------|-------|------|
| 1 | 1 | 角色 (Player) |
| 2 | 2 | 怪物 (Monster) |
| 3 | 4 | 中立 (Neutral) |
| 4 | 8 | 子弹 (Bullet) |
| 5 | 16 | 道具 (Item) |
| 6 | 32 | 阻挡 (Block) |
| 7 | 64 | 坑洞 (Pit) |

```python
# Player collision setup
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://player.tscn",
    ".",
    "area2d",
    {
        "shape_size_x": 24.0,
        "shape_size_y": 32.0,
        "collision_layer": 1,   # Player layer
        "collision_mask": 2 | 8  # Detect monsters and bullets
    },
    false
)
```

### characterbody2d_collision

**ID**: `characterbody2d_collision`
**Node Types**: Entity, CharacterBody2D

Creates CollisionShape2D for CharacterBody2D physics.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"shape_size_x"` | float | 32.0 | Collision width |
| `"shape_size_y"` | float | 32.0 | Collision height |
| `"collision_layer"` | int | 1 | Layer bitmask |
| `"collision_mask"` | int | 1 | Mask bitmask |
| `"emit_each_physics_frame"` | bool | true | Continuous vs first-frame detection |

**Enables**:
- Event: `on_characterbody2d_collision`
- Action: `printerr_last_collider_name`

---

## Combat Behaviors

### health

**ID**: `health`
**Node Types**: Entity

Manages HP values and health change events.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"最大血量"` | int | 100 | Maximum health |
| `"当前血量"` | int | 100 | Current health |
| `"碰到敌人伤害冷却时间"` | float | 5.0 | Collision damage cooldown |

**Enables**:
- Event: `on_health_changed`
- Event: `on_health_decreased`
- Event: `on_health_increased`
- Condition: `compare_health`
- Action: `change_health`

```python
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://player.tscn",
    ".",
    "health",
    {
        "最大血量": 150,
        "当前血量": 150,
        "碰到敌人伤害冷却时间": 1.0
    },
    false
)
```

### faction

**ID**: `faction`
**Node Types**: Entity

Manages entity allegiance for friend/foe detection.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"阵营"` | String | "中立" | 玩家, 敌人, 中立 |

**Enables**:
- Condition: `compare_faction`

```python
# Enemy faction setup
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://monster.tscn",
    ".",
    "faction",
    {"阵营": "敌人"},
    false
)
```

### skill_box

**ID**: `skill_box`
**Node Types**: Entity

Manages SkillBoxComponent for skill execution.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"skill_box_scene"` | Resource | SkillBoxComponent.tscn | Component scene |
| `"init_attack_skill_datas"` | Array[Resource] | [] | Attack skills |
| `"init_skill_datas"` | Array[Resource] | [] | Normal skills |
| `"init_halo_skill_datas"` | Array[Resource] | [] | Aura skills |

```python
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://player.tscn",
    ".",
    "skill_box",
    {
        "init_attack_skill_datas": [
            "res://Skills/BasicAttack.tres"
        ]
    },
    false
)
```

---

## AI Behaviors

### behavior_tree

**ID**: `behavior_tree`
**Node Types**: Entity

Attaches a Beehave behavior tree scene.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"default_tree_scene"` | Resource | - | Behavior tree scene (.tscn) |

```python
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://monster.tscn",
    ".",
    "behavior_tree",
    {
        "default_tree_scene": "res://AI/MonsterBrain.tscn"
    },
    false
)
```

---

## Utility Behaviors

### camera2d

**ID**: `camera2d`
**Node Types**: Entity

Creates a Camera2D child for viewport control.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"Offset X"` | float | 0.0 | Camera offset X |
| `"Offset Y"` | float | 0.0 | Camera offset Y |
| `"Zoom X"` | float | 1.0 | Zoom factor X |
| `"Zoom Y"` | float | 1.0 | Zoom factor Y |
| `"ZIndex"` | int | 0 | Z index |
| `"Limit Left"` | int | 0 | Left boundary |
| `"Limit Right"` | int | 0 | Right boundary |
| `"Limit Top"` | int | 0 | Top boundary |
| `"Limit Bottom"` | int | 0 | Bottom boundary |

### speed

**ID**: `speed`
**Node Types**: Entity

Records entity speed value for use in conditions/actions.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"速度"` | float | 50.0 | Speed value (data only, no movement) |

### death_effect

**ID**: `death_effect`
**Node Types**: Entity

Spawns an effect scene on entity death.

**Parameters**:
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `"effect_scene"` | Resource | - | Effect scene (.tscn) |
| `"offset_x"` | float | 0.0 | Effect offset X |
| `"offset_y"` | float | 0.0 | Effect offset Y |

### signal_broadcaster

**ID**: `signal_broadcaster`
**Node Types**: Entity

Enables custom signal broadcasting from entity.

**Parameters**: None

---

## Behavior Dependencies

Some behaviors require other behaviors to function:

| Behavior | Requires |
|----------|----------|
| `hp_bar` | `health` |
| `damage_fcharacter_on_collision` (action) | `area2d`, `health` |

---

## Adding Behaviors via Code

### Python API

```python
FlowKitBehaviorTool.AddBehaviorToScene(
    scene_path,      # e.g., "res://entity.tscn"
    node_path,       # e.g., "." or "Role_flowkit"
    behavior_id,     # e.g., "health"
    inputs,          # Dictionary of parameters
    force_overwrite  # true to replace existing
)
```

### C# API

```csharp
FlowKitBehaviorTool.AddBehaviorToScene(
    "res://entity.tscn",
    ".",
    "health",
    new Dictionary {
        { "最大血量", 100 },
        { "当前血量", 100 }
    },
    false
);
```

---

## Behavior Summary Table

| Behavior | ID | Creates | Enables Events | Enables Conditions | Enables Actions |
|----------|----|---------|----------------|-------------------|-----------------|
| 2D动画精灵组件 | animated_sprite2d | AnimatedSprite2D | - | - | change_animation |
| 2D精灵组件 | sprite2d | Sprite2D | - | - | - |
| 血条组件 | hp_bar | HealthBar | - | - | - |
| Area2D碰撞区域 | area2d | Area2D | on_area2d_collision | - | print_collision_body_name, damage_fcharacter_on_collision |
| CharacterBody2D碰撞 | characterbody2d_collision | CollisionShape2D | on_characterbody2d_collision | - | printerr_last_collider_name |
| 血量组件 | health | - | on_health_changed, on_health_decreased, on_health_increased | compare_health | change_health |
| 阵营组件 | faction | - | - | compare_faction | - |
| 技能盒子组件 | skill_box | SkillBoxComponent | - | - | - |
| 行为树组件 | behavior_tree | BeehaveTree | - | - | - |
| 2D摄像机组件 | camera2d | Camera2D | - | - | - |
| 速度组件 | speed | - | - | - | - |
| 死亡特效 | death_effect | Effect Scene | - | - | - |
| 信号广播组件 | signal_broadcaster | - | - | - | - |
