---
name: godot-game-builder
description: 构建完整游戏场景的高层技能。当用户描述游戏玩法需求（如"做一个游戏demo"、"打怪开门进入下一关"、"收集道具过关"）时使用此技能。此技能会分析需求，然后协调调用godot-scene-builder（场景组装）和godot-event-builder（游戏逻辑）等底层Skill完成构建。
---

# Godot Game Builder

这是一个高层次的游戏构建技能，用于理解用户的游戏需求并协调底层Skill完成完整的游戏场景构建。此技能是一个"编排层"，不直接操作MCP工具，而是分析需求后调用其他专业Skill。

## 触发条件
当用户请求以下内容时使用此技能：
- 创建游戏Demo或游戏关卡
- 描述游戏玩法逻辑（如"打怪开门"、"收集道具过关"）
- 需要多个系统协作的游戏场景（角色+敌人+道具+事件逻辑）
- 关卡设计相关的需求

**关键词识别**：
- "游戏Demo"、"关卡"、"游戏场景"
- "打完...就..."、"消灭...后..."、"收集...触发..."
- "进入下一关"、"通关"、"过关条件"

## 核心理念
**游戏 = 场景结构 + 游戏逻辑**

```
用户需求
    ↓
[需求分析] → 提取：实体列表 + 事件逻辑
    ↓
[角色创建] → godot-role-builder (可选，需自定义角色时)
    输出 → 角色场景路径
    ↓
[场景构建] → godot-scene-builder
    输入 ← 场景名称 + 实体列表(名称/场景路径/位置)
    输出 → 场景文件路径 + 节点名列表
    ↓
[逻辑构建] → godot-event-builder
    输入 ← 场景路径 + 节点名列表 + 事件逻辑描述
    输出 → FlowKit事件表文件
    ↓
[验证检查] → GetFlowKitSheetStatus
    ↓
完整游戏场景
```

## 可调用的底层Skill

| Skill | 职责 | 何时调用 |
|-------|------|----------|
| **godot-scene-builder** | 创建场景，组装实体 | 需要创建游戏场景时 |
| **godot-role-builder** | 创建自定义角色 | 角色有自定义属性时 |
| **godot-event-builder** | 添加FlowKit事件逻辑 | 需要游戏逻辑时 |
| **godot-behavior-tree-builder** | 创建AI行为树 | 需要自定义AI时 |

## 工作流程

### Step 1: 需求分析
从用户描述中提取：

**1. 场景实体清单**
```
- 地图/背景
- 玩家角色（是否自定义属性？）
- 敌人/野怪（数量、是否自定义属性？）
- 道具/机关（门、宝箱、传送点等）
- 特殊点位（出生点、目标点等）
```

**2. 游戏逻辑清单**
```
- 触发条件（消灭所有敌人、收集道具、到达位置等）
- 触发结果（开门、过关、生成新敌人等）
- 状态变化（血量、计分、计时等）
```

**3. 示例分析**
用户需求："做一个游戏demo，有一个地图，然后有野怪，野怪消灭完成后上方的门打开，然后进入下一关"

| 类型 | 提取内容 |
|------|----------|
| 场景实体 | 地图、玩家、野怪(多个)、门、出生点 |
| 游戏逻辑 | 野怪全灭 → 门打开 → 进入下一关 |

### Step 2: 确定Skill调用顺序

**判断流程**：
```
1. 是否需要自定义角色？
   - 是 → 先调用 godot-role-builder
   - 否 → 使用预制模板

2. 是否需要自定义AI？
   - 是 → 调用 godot-behavior-tree-builder
   - 否 → 使用默认行为树

3. 创建场景结构
   → 调用 godot-scene-builder

4. 添加游戏逻辑
   → 调用 godot-event-builder
```

### Step 3: 构建场景结构
调用 **godot-scene-builder**，传递结构化参数：
```json
{
  "scene_name": "GameDemo",
  "scene_path": "res://RequirementImp/Scenes/GameDemo.tscn",
  "entities": [
    {"name": "Door", "scene": "res://Game_flowkit/Entity/Items/Door.tscn", "position": [-11, -935]},
    {"name": "FCharacterTest", "scene": "res://Game_flowkit/Entity/Player/FCharacterTest.tscn", "position": [-67, -103]},
    {"name": "BornPoint", "scene": "res://Game_flowkit/Entity/Items/BornPoint.tscn", "position": [-1, 728]},
    {"name": "Map1", "scene": "res://Game_flowkit/Entity/Map/Map2.tscn", "position": [0, 0]},
    {"name": "CanvasLayer", "scene": "res://Game_flowkit/EntityTemplate/CanvasLayer.tscn"},
    {"name": "Label", "scene": "res://Game_flowkit/EntityTemplate/Label.tscn", "parent": "CanvasLayer"},
    {"name": "FMonsterTest", "scene": "res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn", "position": [16, -7]},
    {"name": "FMonsterTest2", "scene": "res://Game_flowkit/Entity/Enemy/FMonsterTest2.tscn", "position": [2, -2]},
    {"name": "FMonsterTest3", "scene": "res://Game_flowkit/Entity/Enemy/FMonsterTest3.tscn"},
    {"name": "FMonsterTest4", "scene": "res://Game_flowkit/Entity/Enemy/FMonsterTest4.tscn"}
  ]
}
```
**输出**: 场景文件路径 + 场景中的节点名列表

### Step 4: 构建游戏逻辑
调用 **godot-event-builder**，传递结构化参数：
```json
{
  "scene_path": "res://RequirementImp/Scenes/GameDemo.tscn",
  "node_names": ["Door", "FCharacterTest", "BornPoint", "Map1", "CanvasLayer/Label", "FMonsterTest", "FMonsterTest2", "FMonsterTest3", "FMonsterTest4"],
  "events": [
    {
      "event_id": "on_ready", "target": "System",
      "actions": [
        {"action_id": "set_node_enabled", "target": "FMonsterTest", "inputs": {"启用": false}},
        {"action_id": "set_node_enabled", "target": "FMonsterTest2", "inputs": {"启用": false}},
        {"action_id": "set_node_enabled", "target": "FMonsterTest3", "inputs": {"启用": false}},
        {"action_id": "set_node_enabled", "target": "FMonsterTest4", "inputs": {"启用": false}}
      ]
    },
    {
      "event_id": "on_ready", "target": "System",
      "actions": [
        {"action_id": "set_variable", "target": "System", "inputs": {"Name": "stageLevel", "Value": "0"}}
      ]
    },
    {
      "event_id": "on_custom_signal", "target": "System", "inputs": {"信号名": "进入下一关"},
      "actions": [
        {"action_id": "teleport_to_node", "target": "FCharacterTest", "inputs": {"目标节点路径": "BornPoint"}},
        {"action_id": "set_variable", "target": "System", "inputs": {"Name": "stageLevel", "Value": "stageLevel + 1"}},
        {"action_id": "set_label_text", "target": "CanvasLayer/Label", "inputs": {"文本": "  \"第%d关\" % stageLevel"}}
      ]
    },
    {
      "event_id": "on_custom_signal", "target": "System", "inputs": {"信号名": "进入下一关"},
      "conditions": [{"condition_id": "compare_variable", "target": "System", "inputs": {"Name": "stageLevel", "Comparison": "==", "Value": "1"}}],
      "actions": [
        {"action_id": "instantiate_entity_random_position", "target": "FMonsterTest", "inputs": {"X 最小值": "-200", "X 最大值": "200", "Y 最小值": "-400", "Y 最大值": "400"}}
      ]
    }
  ]
}
```
**输入**: 场景路径 + 节点名列表（来自 Step 3 的输出） + 事件逻辑描述

### Step 5: 验证与检查
构建完成后，执行验证步骤：
1. 调用 `GetFlowKitSheetStatus` 验证事件表结构是否正确
2. 确认所有节点名引用与场景中的实际节点一致
3. 检查事件-动作的 target_node 是否正确指向预期节点

## 常见游戏逻辑模式

### 模式1: 清怪过关（门自动控制）
**需求**: 消灭所有敌人后门打开，有敌人时门关闭

**场景事件表 FlowKit实现**:
```
# 初始化：禁用所有怪物模板
事件: on_ready, target: "System"
动作1: set_node_enabled, target: "FMonsterTest", inputs: {"启用": false}
动作2: set_node_enabled, target: "FMonsterTest2", inputs: {"启用": false}  // 多种怪物时
...

# 收到"进入下一关"信号时：传送玩家+生成怪物
事件: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
动作1: teleport_to_node, target: "FCharacterTest", inputs: {"目标节点路径": "BornPoint"}
动作2: instantiate_entity_random_position, target: "FMonsterTest", inputs: {"X 最小值": "-200", ...}
```

**门事件表 FlowKit实现**（Door.tscn 自身的事件表）:
```
# 初始化：关闭门碰撞
事件: on_ready, target: "System"
动作: set_collision_enabled, target: ".", inputs: {"启用": false}

# 敌人清零时：开门
事件: on_enemy_count_zero, target: "System"
动作1: set_collision_enabled, target: ".", inputs: {"启用": false}  // 关闭碰撞让玩家通过
动作2: change_animation, target: ".", inputs: {"动画名": "open_down"}

# 有敌人时：关门
事件: on_enemy_count_nonzero, target: "System"
动作1: set_collision_enabled, target: ".", inputs: {"启用": true}   // 开启碰撞阻挡玩家
动作2: change_animation, target: ".", inputs: {"动画名": "close_down"}

# 碰到门时：检查是否可以进入下一关
事件: on_area2d_collision, target: ".", inputs: {"碰撞类型": "body"}
条件: compare_enemy_count, target: "System", inputs: {"比较运算符": "<=", "数量": "0"}
动作: emit_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
```

**注意**: 门的事件表是在 Door.tscn 实体自身上的，不是在游戏场景上。

### 模式2: 收集过关
**需求**: 收集N个道具后触发某事件

**FlowKit实现**:
```
事件: on_custom_signal, target: "System", inputs: {"信号名": "道具收集完成"}
动作: set_node_enabled, target: "Door", inputs: {"启用": true}
```

### 模式3: 到达目标点
**需求**: 玩家到达某位置触发事件

**FlowKit实现**:
```
事件: on_area2d_collision, target: ".", inputs: {"碰撞类型": "body"}
条件: compare_faction, target: ".", inputs: {"比较运算符": "==", "阵营": "玩家"}
动作: replace_game_scene, target: "System", inputs: {"scene": "res://RequirementImp/Scenes/NextLevel.tscn"}
```

### 模式4: 关卡递增波次生成
**需求**: 每关生成不同种类/数量的敌人，随关卡递增难度

**FlowKit实现**:
```
# 初始化关卡变量
事件: on_ready, target: "System"
动作: set_variable, target: "System", inputs: {"Name": "stageLevel", "Value": "0"}

# 通用逻辑：每次进入下一关时传送玩家 + 关卡+1 + 更新UI
事件: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
动作1: teleport_to_node, target: "FCharacterTest", inputs: {"目标节点路径": "BornPoint"}
动作2: set_variable, target: "System", inputs: {"Name": "stageLevel", "Value": "stageLevel + 1"}
动作3: set_label_text, target: "CanvasLayer/Label", inputs: {"文本": "  \"第%d关\" % stageLevel"}

# 关卡1：生成1种怪物
事件: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
条件: compare_variable, target: "System", inputs: {"Name": "stageLevel", "Comparison": "==", "Value": "1"}
动作: instantiate_entity_random_position, target: "FMonsterTest", inputs: {...}

# 关卡2：生成2种怪物
事件: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
条件: compare_variable, target: "System", inputs: {"Name": "stageLevel", "Comparison": "==", "Value": "2"}
动作1: instantiate_entity_random_position, target: "FMonsterTest", inputs: {...}
动作2: instantiate_entity_random_position, target: "FMonsterTest2", inputs: {...}

# 关卡3：生成3种怪物（类推）
# 关卡4+：生成4种怪物（使用 ">=" 条件处理后续所有关卡）
事件: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
条件: compare_variable, target: "System", inputs: {"Name": "stageLevel", "Comparison": ">=", "Value": "4"}
动作: instantiate 所有4种怪物
```

**关键要素**:
- `set_variable` / `compare_variable` 实现关卡状态管理
- 最后一个关卡用 `>=` 条件处理无限递增
- `set_label_text` 更新 UI 显示当前关卡

### 模式5: 门/机关控制
**需求**: 满足条件后开门

**FlowKit实现**:
```
事件: on_ready, target: "System", inputs: {}
动作: set_node_enabled, target: "FMonsterTest", inputs: {"启用": false}  // 禁用怪物模板

事件: on_custom_signal, target: "System", inputs: {"信号名": "开门条件满足"}
动作: set_node_enabled, target: "Door", inputs: {"启用": true}  // 打开门
```

## 预制资源参考

### 场景模板
| 模板 | 路径 | 用途 |
|------|------|------|
| GameScene | `res://Game_flowkit/EntityTemplate/GameScene.tscn` | 游戏场景基础模板 |

### 实体模板
| 实体 | 路径 | 说明 |
|------|------|------|
| 玩家 | `res://Game_flowkit/Entity/Player/FCharacterTest.tscn` | 预制玩家角色 |
| 怪物1 | `res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn` | 预制敌人角色（基础） |
| 怪物2 | `res://Game_flowkit/Entity/Enemy/FMonsterTest2.tscn` | 预制敌人角色（变种2） |
| 怪物3 | `res://Game_flowkit/Entity/Enemy/FMonsterTest3.tscn` | 预制敌人角色（变种3） |
| 怪物4 | `res://Game_flowkit/Entity/Enemy/FMonsterTest4.tscn` | 预制敌人角色（变种4） |
| 门 | `res://Game_flowkit/Entity/Items/Door.tscn` | 门实体（内置清怪开门逻辑） |
| 出生点 | `res://Game_flowkit/Entity/Items/BornPoint.tscn` | 玩家出生/重置点 |
| 地图1 | `res://Game_flowkit/Entity/Map/Map1.tscn` | 地图背景1 |
| 地图2 | `res://Game_flowkit/Entity/Map/Map2.tscn` | 地图背景2 |

### UI模板
| 实体 | 路径 | 说明 |
|------|------|------|
| CanvasLayer | `res://Game_flowkit/EntityTemplate/CanvasLayer.tscn` | UI容器层（固定在屏幕上） |
| Label | `res://Game_flowkit/EntityTemplate/Label.tscn` | 文本标签（放在CanvasLayer下） |

### 行为树模板
| 行为树 | 路径 | 用途 |
|--------|------|------|
| 玩家攻击 | `res://Game_flowkit/BehaviorTree/PlayerAttackTree.tscn` | 玩家默认行为 |
| 怪物攻击 | `res://Game_flowkit/BehaviorTree/MonsterAttackTree.tscn` | 怪物默认行为 |

## 输出目录约定
| 类型 | 路径 | 示例 |
|------|------|------|
| 自定义角色 | `res://RequirementImp/[Type]/` | `res://RequirementImp/Monster/Slime.tscn` |
| 游戏场景 | `res://RequirementImp/Scenes/` | `res://RequirementImp/Scenes/Level1.tscn` |
| 行为树 | `res://RequirementImp/BehaviorTree/` | `res://RequirementImp/BehaviorTree/BossAI.tscn` |

## 完整示例

### 用户需求
> "做一个游戏demo，有一个地图，然后有多种野怪，野怪消灭完成后上方的门打开，进入下一关，每关递增怪物种类，要显示当前关卡数"

### Step 1: 需求分析
**场景实体**:
- 地图背景 (Map1)
- 玩家角色 (FCharacterTest) - 完整配置（health, area2d, faction, skill_box等）
- 野怪模板 (FMonsterTest, FMonsterTest2, FMonsterTest3, FMonsterTest4) - 4种怪物
- 门 (Door) - 内置清怪开门逻辑
- 出生点 (BornPoint)
- UI层 (CanvasLayer + Label) - 显示关卡数

**游戏逻辑**:
1. 初始化：禁用所有野怪模板 + 初始化关卡变量 stageLevel=0
2. 门逻辑（Door自带）：敌人清零→开门，有敌人→关门，碰到门→发射"进入下一关"信号
3. 收到"进入下一关"信号时：传送玩家 + 关卡+1 + 更新UI
4. 条件分支：根据 stageLevel 生成不同数量的怪物种类

### Step 2: 调用Skill

**2.1 调用 godot-scene-builder**
```
创建场景 res://RequirementImp/Scenes/GameDemo.tscn
实体:
- Door 位置(-11, -935)
- FCharacterTest 位置(-67, -103) 带完整behavior配置
- BornPoint 位置(-1, 728)
- Map1(Map2) 地图背景
- CanvasLayer (UI容器)
  - Label 文本"第1关" (放在CanvasLayer下)
- FMonsterTest 位置(16, -7)
- FMonsterTest2 位置(2, -2)
- FMonsterTest3
- FMonsterTest4
```

**2.2 调用 godot-event-builder（游戏场景事件表）**
```
场景: res://RequirementImp/Scenes/GameDemo.tscn
可用节点: Door, FCharacterTest, BornPoint, Map1, CanvasLayer/Label, FMonsterTest, FMonsterTest2, FMonsterTest3, FMonsterTest4

事件1: on_ready, target: "System"
  动作1: set_node_enabled, target: "FMonsterTest", inputs: {"启用": false}
  动作2: set_node_enabled, target: "FMonsterTest2", inputs: {"启用": false}
  动作3: set_node_enabled, target: "FMonsterTest3", inputs: {"启用": false}
  动作4: set_node_enabled, target: "FMonsterTest4", inputs: {"启用": false}

事件2: on_ready, target: "System"
  动作: set_variable, target: "System", inputs: {"Name": "stageLevel", "Value": "0"}

事件3: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
  动作1: teleport_to_node, target: "FCharacterTest", inputs: {"目标节点路径": "BornPoint"}
  动作2: set_variable, target: "System", inputs: {"Name": "stageLevel", "Value": "stageLevel + 1"}
  动作3: set_label_text, target: "CanvasLayer/Label", inputs: {"文本": "  \"第%d关\" % stageLevel"}

事件4: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
  条件: compare_variable, target: "System", inputs: {"Name": "stageLevel", "Comparison": "==", "Value": "1"}
  动作: instantiate_entity_random_position, target: "FMonsterTest", inputs: {"X 最小值": "-200", "X 最大值": "200", "Y 最小值": "-400", "Y 最大值": "400"}

事件5: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
  条件: compare_variable, target: "System", inputs: {"Name": "stageLevel", "Comparison": "==", "Value": "2"}
  动作1: instantiate_entity_random_position, target: "FMonsterTest", inputs: {...}
  动作2: instantiate_entity_random_position, target: "FMonsterTest2", inputs: {...}

事件6: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
  条件: compare_variable, target: "System", inputs: {"Name": "stageLevel", "Comparison": "==", "Value": "3"}
  动作1-3: instantiate FMonsterTest, FMonsterTest2, FMonsterTest3

事件7: on_custom_signal, target: "System", inputs: {"信号名": "进入下一关"}
  条件: compare_variable, target: "System", inputs: {"Name": "stageLevel", "Comparison": ">=", "Value": "4"}
  动作1-4: instantiate FMonsterTest, FMonsterTest2, FMonsterTest3, FMonsterTest4
```

**2.3 验证**
- 调用 `GetFlowKitSheetStatus` 确认事件表结构正确

### 最终结果
- 场景文件: `res://RequirementImp/Scenes/GameDemo.tscn`
- FlowKit事件表: 自动保存到 `res://addons/flowkit/saved/event_sheet/`
- 门的事件表: Door.tscn 自带（已内置清怪开门逻辑）

## 注意事项

1. **Skill调用顺序很重要**：
   - 先创建角色（如果需要自定义）
   - 再创建场景（组装角色）
   - 最后添加逻辑（FlowKit事件）

2. **实体命名一致性**：
   - FlowKit事件中引用的节点名必须与场景中的节点名一致
   - 建议使用有意义的名称（如FMonsterTest, FMonsterTest2而不是自动生成的名称）

3. **信号约定**：
   - 使用中文信号名便于理解（如"进入下一关"）
   - 信号可通过 `emit_custom_signal` 动作发射（如门碰撞时）
   - 信号通过 `on_custom_signal` 事件监听

4. **模板与实例**：
   - 作为实例化源的实体，初始应禁用（on_ready时set_node_enabled=false）
   - 这样它不会在场景中显示，但可以被instantiate_entity动作复制
   - 多种怪物时，每种怪物模板都需要单独禁用

5. **门的事件表是内置的**：
   - Door.tscn 自带事件表，包含清怪开门/关门逻辑
   - 门通过 `on_enemy_count_zero`/`on_enemy_count_nonzero` 自动控制开关
   - 门碰撞时通过 `emit_custom_signal` 发射"进入下一关"信号
   - 游戏场景只需监听"进入下一关"信号做后续逻辑

6. **关卡变量系统**：
   - 使用 `set_variable` 初始化和更新关卡变量
   - 使用 `compare_variable` 条件分支处理不同关卡
   - 使用 `set_label_text` 更新UI显示（target_node 用路径格式如 "CanvasLayer/Label"）

7. **UI层结构**：
   - CanvasLayer 作为UI容器（固定在屏幕上不随相机移动）
   - Label 放在 CanvasLayer 下显示文本信息
   - Label 需要 `label` behavior
