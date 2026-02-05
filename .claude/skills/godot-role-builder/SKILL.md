---
name: godot-role-builder
description: 创建单个角色实体（玩家、敌人、NPC、宠物）。当用户明确说"创建角色"，或角色需要自定义特征（血量、速度、动画等）时使用此技能。此技能创建的角色可被godot-scene-builder实例化到场景中。
---
# Godot Role Builder
这是一个用于在Godot编辑器中创建角色的专业技能，支持创建玩家角色、敌人、NPC 和宠物。此技能基于FlowKit Behavior系统，使用代码脚本编排调用MCP工具，以达到创建角色的目的。

## 触发条件
当用户请求以下内容时使用此技能：
- 创建新的游戏角色（玩家、敌人、NPC、宠物）
- 生成角色场景和配置
- 配置角色属性、行为和能力
- 快速搭建角色原型

## 前置条件
**CRITICAL - 必须满足以下条件才能使用此技能**:
1. Godot 编辑器必须正在运行
2. godot_mcp 插件必须已启用
3. MCP 服务器必须已连接（ws://127.0.0.1:18888）
4. 工作目录必须处于godot编辑器中的项目

## 参数设置
当用户请求创建角色时，使用用户需求中的参数。如果参数信息缺失，**使用默认值并立即执行**：

| 参数 | 说明 | 默认值 |
| :--- | :--- | :--- |
| **Type** | 角色类型 | `Player` (Player/Monster/NPC/Pet) |
| **Name** | 角色名称 | `NewPlayer`，根据角色类型，还可以是`NewMonster`、`NewNPC`、`NewPet`等，当有多个重复角色类型，用序号区分，比如`NewMonster1`|
| **Path** | 场景文件路径 | `res://RequirementImp/[Type]/[Name].tscn` |
| **BaseScene** | 基础场景模板 | Player: `res://Game_flowkit/Entity/Player/FCharacterTest.tscn`，Monster: `res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn`，其他: `res://Game_flowkit/Entity/Role/FRole.tscn` |
| **SpriteFrames** | 动画精灵帧 | Player: `res://Game_flowkit/Resources/SpriteFrames/ArcherPlayer.tres`<br>Monster: `res://Game_flowkit/Resources/SpriteFrames/Slime.tres`<br>其他: `res://Game_flowkit/Resources/SpriteFrames/Pumpkin.tres` |
| **Speed** | 移动速度 | `50.0` |
| **MaxHealth** | 最大血量 | `100` |
| **collision_layer** | 碰撞层 | 玩家默认1，怪物默认2 |

## 核心概念：FlowKit Behavior系统
角色功能通过Behavior元数据配置，存储在节点的`flowkit_behaviors` meta中。角色类型为Entity + CharacterBody2D，可以使用Entity类型的behaviors。

### 关键说明
1. **阵营系统**：使用`faction` behavior，可选值："玩家"、"敌人"、"中立"
2. **碰撞配置**：
   - `area2d`: 触发器碰撞，用于检测接触（如技能命中）
   - `characterbody2d_collision`: 物理碰撞，用于实体阻挡
   - 玩家通常使用collision_layer=1, collision_mask=2（检测敌人）
   - 敌人通常使用collision_layer=2, collision_mask=1或2
3. **血量系统**：`health` behavior，包含最大血量、当前血量和伤害冷却时间
4. **技能系统**：`skill_box` behavior，支持三类技能：attack（攻击）、skill（普通）、halo（光环）
5. **血条显示**：`hp_bar` behavior，需指定血条场景和显示位置偏移
6. **行为树**：`behavior_tree` behavior，用于AI逻辑，通过default_tree_scene指定行为树文件

### Entity Behaviors（12个）- 基础角色能力

| Behavior ID | 功能 | 输入参数示例 | 必需性 |
| :--- | :--- | :--- | :--- |
| **animated_sprite2d** | 2D动画精灵组件 | `sprite_frames` (Resource), `初始动画` (String) | 推荐 |
| **area2d** | Area2D碰撞区域（触发器） | `shape_size_x` (float, 默认32.0), `shape_size_y` (float, 默认32.0), `collision_layer` (int, 默认1), `collision_mask` (int, 默认1) | 战斗角色推荐 |
| **behavior_tree** | 行为树组件，用于实现复杂的AI行为逻辑 | `default_tree_scene` (Resource, 可选) - 用于覆盖 BehaviorComponent.trees 中 name=='default' 的行为树场景 | AI角色可选，只有角色仅显示无任何移动、技能等情况下不配备，其他情况均需要配备 |
| **characterbody2d_collision** | CharacterBody2D碰撞检测 | `shape_size_x` (float, 默认32.0), `shape_size_y` (float, 默认32.0), `collision_layer` (int, 默认1), `collision_mask` (int, 默认1), `emit_each_physics_frame` (bool, 默认true) | 需要碰撞事件时 |
| **death_effect** | 死亡特效组件 | `effect_scene` (Resource), `offset_x` (float, 默认0.0), `offset_y` (float, 默认0.0) | 可选 |
| **faction** | 阵营组件 | `阵营` (String: "玩家"/"敌人"/"中立", 默认"中立") | 战斗系统推荐 |
| **health** | 血量组件 | `最大血量` (int, 默认100), `当前血量` (int, 默认100), `碰到敌人伤害冷却时间` (float, 默认5.0) | 玩家必需 |
| **hp_bar** | 血条组件，自动挂载血条UI | `hp_bar_scene` (Resource, 默认空), `pos_x` (float, 默认0.0), `pos_y` (float, 默认0.0) | 需要显示血条时 |
| **signal_broadcaster** | 信号广播组件，用于节点之间的信号通信和事件广播 | 无参数 | 需要信号通信时 |
| **skill_box** | 技能盒子组件，管理角色技能系统 | `skill_box_scene` (Resource, 默认res://Framework/Component/RoleComponent/SkillBoxComponent.tscn), `init_attack_skill_datas` (Array[Resource], 默认[]) - 攻击技能数据数组, `init_skill_datas` (Array[Resource], 默认[]) - 普通技能数据数组, `init_halo_skill_datas` (Array[Resource], 默认[]) - 光环技能数据数组 | 需要技能系统时 |
| **speed** | 速度组件，记录节点速度值 | `速度` (float, 默认50.0) | 需要移动时推荐 |


### 角色类型推荐配置
#### 基础角色
```
必需: animated_sprite2d, characterbody2d_collision, signal_broadcaster
用途: 只需要显示，无战斗功能
```

#### 玩家角色（FCharacter）
```
必需: animated_sprite2d, characterbody2d_collision, health, area2d, signal_broadcaster, behavior_tree, skill_box, speed
推荐: faction, hp_bar, death_effect
场景参考: res://Game_flowkit/Entity/Player/FCharacterTest.tscn
```

#### 敌人角色（FMonster）
```
必需: animated_sprite2d, characterbody2d_collision, health, area2d, signal_broadcaster, behavior_tree, skill_box
推荐: faction, hp_bar, death_effect
场景参考: res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn
```

## 工作流程
### Step 0: 行为树准备（前置步骤）
**重要**：在配置角色之前，先分析用户需求，判断是否需要创建自定义行为树。

**需要先创建行为树的情况**（使用 godot-behavior-tree-builder）：
- 角色需要自定义AI逻辑：如"巡逻后攻击的敌人"、"追踪玩家的Boss"、"自动跟随的宠物"
- 角色有特殊行为优先级：如"先治疗再攻击"、"血量低于50%时逃跑"
- 角色需要多个行为分支：如"待机→巡逻→警戒→追击→攻击"
- 用户明确说"创建行为树"或"AI行为"：如"为敌人创建巡逻AI"

**对于需要自定义行为树的角色**：
   - 使用 **godot-behavior-tree-builder** skill 创建行为树
   - 记录创建的行为树场景路径 ``res://RequirementImp/BehaviorTree/[TreeName].tscn`
   - 在后续 Step 3 中，通过 `UpdateBehaviorInputsInScene` 将行为树关联到角色的 `behavior_tree` behavior

**可直接使用预制行为树的情况**（无需创建行为树）：
- 普通玩家角色：直接使用 `res://Game_flowkit/BehaviorTree/PlayerAttackTree.tscn`
- 普通敌人/怪物：直接使用 `res://Game_flowkit/BehaviorTree/MonsterAttackTree.tscn`
- 用户没有提到任何特殊AI需求

### 工作要求
- 必须编写python脚本，脚本代码必须先通过websocket连接mcp服务器（ws://127.0.0.1:18888）。连接方式示例如下：
```python
async def call_tool(ws, tool_name, args):
    """调用单个MCP工具"""
    request = {
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": args
        },
        "id": 1
    }

    print(f"\n[+] 调用工具: {tool_name}")
    print(f"    参数: {json.dumps(args, indent=2, ensure_ascii=False)}")

    await ws.send(json.dumps(request, ensure_ascii=False))
    response = await ws.recv()
    result = json.loads(response)

    if "error" in result:
        print(f"[-] 错误: {result['error']}")
        return None

    print(f"[OK] 成功")
    return result.get("result", {})

async def batch_execute(ws, commands):
    """批量执行MCP工具 - 提高性能，减少网络请求"""
    request = {
        "jsonrpc": "2.0",
        "method": "tools/batchExecute",
        "params": {
            "commands": commands
        },
        "id": 1
    }

    print(f"\n[+] 批量执行 {len(commands)} 个工具")
    for i, cmd in enumerate(commands, 1):
        print(f"    {i}. {cmd['name']}")

    await ws.send(json.dumps(request, ensure_ascii=False))
    response = await ws.recv()
    result = json.loads(response)

    if "error" in result:
        print(f"[-] 批量执行错误: {result['error']}")
        return None

    print(f"[OK] 批量执行成功 ({len(commands)} 个工具)")
    return result.get("result", {})

async with websockets.connect("ws://127.0.0.1:18888") as ws:
    print("✓ 已连接到MCP服务器")
```

- **重要：优先使用批量执行来提高性能**
  - 对于可以串行执行且不需要中间查看结果的工具调用，应该使用 `batch_execute()` 批量执行
  - 批量执行采用 Fail-Fast 策略：如果任何命令失败，整个批次立即停止
  - 批量执行可显著减少网络请求次数和序列化开销

- **批量执行示例**：
```python
# 示例1: 打开场景并获取场景树
commands = [
    {"name": "OpenScene", "arguments": {"scene_path": target_path}},
    {"name": "GetSceneTree", "arguments": {}}
]
await batch_execute(ws, commands)

# 示例2: 更新多个behaviors并保存
commands = [
    {
        "name": "UpdateBehaviorInputsInScene",
        "arguments": {
            "scene_path": target_path,
            "node_path": ".",
            "behavior_id": "health",
            "inputs": {"最大血量": 200, "当前血量": 200}
        }
    },
    {
        "name": "UpdateBehaviorInputsInScene",
        "arguments": {
            "scene_path": target_path,
            "node_path": ".",
            "behavior_id": "speed",
            "inputs": {"速度": 50.0}
        }
    },
    {"name": "SaveScene", "arguments": {"scene_path": target_path}}
]
await batch_execute(ws, commands)
```

- **何时使用单独调用 vs 批量执行**：
  - **使用单独 `call_tool()`**：需要查看中间结果时（如 `GetBehaviorsFromScene`）
  - **使用批量 `batch_execute()`**：连续的配置操作（打开场景、更新属性、保存场景等）

- 编写的脚本代码存放到`logs/runscripts/[script_name].py`。

### Step 1: 使用文件系统复制模板
根据角色类型选择基础模板：
- Player → 复制 `res://Game_flowkit/Entity/Player/FCharacter.tscn`
- Monster → 复制 `res://Game_flowkit/Entity/Enemy/FMonster.tscn`
- 其他 → 复制 `res://Game_flowkit/Entity/Role/FRole.tscn`

目标路径：`res://RequirementImp/[Type]/[Name].tscn`

### Step 2: 打开并检查场景
1. tool: `OpenScene`
   - args: `{"scene_path": "res://RequirementImp/[Type]/[Name].tscn"}`

2. tool: `GetSceneTree`
   - args: `{}`
   - 验证场景结构

3. tool: `GetBehaviorsFromScene`
   - args: `{"scene_path": "res://RequirementImp/[Type]/[Name].tscn"}`
   - 检查现有behaviors配置

### Step 3: 添加/修改Behaviors（根据需求）
**注意**：behaviour必须先添加后更新！
1. tool: `AddBehaviorToScene` - 新增behaviour
   - args: `{"scene_path": "res://RequirementImp/[Type]/[Name].tscn", "node_path": ".", "behavior_id": "需要新增的behavior的id", "inputs": "behaviour需要的参数字典"}` 

2. tool: `UpdateBehaviorInputsInScene` - 更新现有的behaviour的参数
   - args: `{"scene_path": "res://RequirementImp/[Type]/[Name].tscn", "node_path": ".", "behavior_id": "需要新增的behavior的id", "inputs": "behaviour需要的参数字典"}` 

3. tool: `SaveScene`
   - args: `{"scene_path": "res://RequirementImp/[Type]/[Name].tscn"}`

### Step 4: 验证
1. tool: `GetBehaviorsFromScene`
   - args: `{"scene_path": "res://RequirementImp/[Type]/[Name].tscn"}`
   - 确认所有behaviors已正确配置

2. tool: `GetSceneTree`
   - args: `{}`
   - 最终验证场景结构

### 通用操作：属性调整
当用户要求修改特定属性时：
1. tool: `SetProperty` - 批量设置节点属性，属性的名称和值从用户需求中获取。
   - args: `{"node_path": "root", "properties": {"position": {"x": 100, "y": 200}, "scale": {"x": 1.5, "y": 1.5}}}`

2. tool: `UpdateBehaviorInputsInScene` - 更新Behavior参数
   - args: `{"scene_path": "[Path].tscn", "node_path": ".", "behavior_id": "direction_movement", "inputs": {"speed": 300.0}}`

3. tool: `SaveScene`

## 运行脚本
运行上一步输出的代码脚本。python `res://logs/runscripts/[script_name].py`。
如运行失败，则修改代码！