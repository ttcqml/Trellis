---
name: godot-behavior-tree-builder
description: 为角色和敌人创建和管理Beehave行为树。当用户提到"行为树"、"AI行为"、"行为逻辑"、"创建行为树"等关键词时使用此技能。此技能可为godot-role-builder创建的角色或现有角色添加复杂的行为树AI逻辑。
---

# Godot Behavior Tree Builder

这是一个用于在Godot编辑器中创建和管理Beehave行为树的专业技能。支持创建复杂的AI行为树、添加组合节点、条件节点和动作节点，帮助用户实现高级的AI逻辑。此指南使用代码脚本编排调用MCP工具，以达到创建行为树的目的。此技能创建的行为树可被godot-role-builder引用。

## 前置条件
**CRITICAL - 必须满足以下条件才能使用此技能**:
1. Godot 编辑器必须正在运行
2. godot_mcp 插件必须已启用
3. MCP 服务器必须已连接 (ws://127.0.0.1:18888)
4. 工作目录必须处于godot编辑器中的项目
5. Beehave 插件必须已启用

## 核心概念：Beehave行为树
### 1. 组合节点 (Composite Nodes)
组合节点控制子节点的执行顺序和逻辑：
| 节点类型 | 说明 | 返回值 | 使用场景 |
|---------|------|-------|---------|
| **Selector** | 普通选择器 - 按顺序执行子节点，直到一个成功返回 | 第一个成功的子节点 | 多个备选行为，依次尝试 |
| **SelectorReactive** | 响应式选择器 - 每帧重新评估所有子节点，失败时切换分支 | 动态切换分支 | 优先级行为（如：死亡 > 攻击 > 移动） |
| **Sequence** | 顺序执行 - 按顺序执行所有子节点，任一失败则整体失败 | 全部成功时返回成功 | 条件判断 + 动作执行组合 |
| **SequenceReactive** | 响应式顺序执行 - 每帧重新评估所有子节点 | 全部成功时返回成功 | 需要持续监控的组合行为 |

### 2. 条件节点 (ConditionLeaf)
条件节点用于判断某些条件是否满足（返回成功或失败）：
**项目自定义条件**：
- `AttackCondition` - 判断是否应该攻击 (res://Framework/Scripts/Beehave/Condition/AttackCondition.gd)
- `BornCondition` - 判断是否在出生阶段 (res://Framework/Scripts/Beehave/Condition/BornCondition.gd)
- `DieCondition` - 判断是否已死亡 (res://Framework/Scripts/Beehave/Condition/DieCondition.gd)
- `PetsAttackCondition` - 判断宠物是否应该攻击 (res://Framework/Scripts/Beehave/Condition/PetsAttackCondition.gd)
- `PlayerMoveCondition` - 判断玩家是否有移动输入 (res://Framework/Scripts/Beehave/Condition/PlayerMoveCondition.gd)

### 3. 动作节点 (ActionLeaf)
动作节点执行具体的游戏逻辑（移动、攻击、死亡等）：
**项目自定义动作**：
- `AttackAction` - 执行攻击动作 (res://Framework/Scripts/Beehave/Action/AttackAction.gd)
- `BornAction` - 执行出生逻辑 (res://Framework/Scripts/Beehave/Action/BornAction.gd)
- `DieAction` - 执行死亡逻辑 (res://Framework/Scripts/Beehave/Action/DieAction.gd)
- `HitAction` - 执行被击中逻辑 (res://Framework/Scripts/Beehave/Action/HitAction.gd)
- `PetsAttackAction` - 执行宠物攻击逻辑 (res://Framework/Scripts/Beehave/Action/PetsAttackAction.gd)
- `PlayerMoveAction` - 执行玩家移动逻辑 (res://Framework/Scripts/Beehave/Action/PlayerMoveAction.gd)
- `SkillAction` - 执行技能逻辑 (res://Framework/Scripts/Beehave/Action/SkillAction.gd)

## 参数设置
当用户请求创建行为树时，使用用户需求中的参数。如果参数信息缺失，**使用默认值并立即执行**：
| 参数 | 说明 | 默认值 |
| :--- | :--- | :--- |
| **TreeName** | 行为树名称 | `NewBehaviorTree`，根据树的用途可以是`PlayerAttackTree`、`MonsterAttackTree`等 |
| **TreePath** | 行为树文件路径 | `res://RequirementImp/BehaviorTree/[TreeName].tscn` |
| **RootNodeType** | 根节点类型 | `SelectorReactive`（推荐用于优先级控制） |
| **TreeStructure** | 行为树的层次结构 | 根据AI逻辑需求定义（见下面的预设模板） |

## 行为树模板
### 模板1：怪物战斗行为树（MonsterAttackTree）
```
SelectorReactive (根节点)
├── Sequence (born)
│   ├── BornCondition
│   └── BornAction
├── Sequence (die)
│   ├── DieCondition
│   └── DieAction
├── Sequence (attack)
│   ├── AttackCondition
│   └── AttackAction
└── Sequence (move)
    ├── MonsterMoveCondition
    └── MonsterMoveAction
```

**说明**：
- 响应式选择器每帧重新评估所有分支
- 出生 > 死亡 > 攻击 > 移动，按优先级执行
- 这是最常见的敌人AI模式

### 模板2：玩家控制行为树（PlayerAttackTree）
```
SelectorReactive (根节点)
├── Sequence (death)
│   ├── DieCondition
│   └── DieAction
├── Sequence (skill)
│   ├── SkillCondition
│   └── SkillAction
└── Sequence (move)
    ├── PlayerMoveCondition
    └── PlayerMoveAction
```

**说明**：
- 玩家行为树相对简洁
- 优先级：死亡 > 技能 > 移动

### 模板3：宠物行为树（PetBehaviorTree）
```
SelectorReactive (根节点)
├── Sequence (death)
│   ├── DieCondition
│   └── DieAction
├── Sequence (attack)
│   ├── PetsAttackCondition
│   └── PetsAttackAction
└── Sequence (follow)
    ├── FollowCondition
    └── FollowAction
```

## 工作流程
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

- **何时使用单独调用 vs 批量执行**：
  - **使用单独 `call_tool()`**：需要获取返回值（如AddBeehaveComposite/Condition/Action返回的node_path）来构建树的层级关系时
  - **使用批量 `batch_execute()`**：连续的操作且不需要中间结果时（如创建树、添加节点、保存等）

- 编写的脚本代码存放到`logs/runscripts/[script_name].py`。

### Step 1: 创建行为树场景
1. tool: `CreateBeehaveTree` - 创建新的行为树场景
   - args: `{"scene_path": "[TreePath]/[TreeName].tscn", "tree_name": "[TreeName]"}`
   - 返回值包含树的基本信息

### Step 2: 添加根节点
1. tool: `AddBeehaveComposite` - 添加根节点（通常是SelectorReactive）
   - args: `{"scene_path": "[TreePath]/[TreeName].tscn", "node_type": "SelectorReactive", "node_name": "SelectorReactiveComposite"}`
   - 返回值中的 `node_path` 用于后续子节点的父节点路径

### Step 3: 添加行为分支（循环操作）
对于每个行为分支（如"出生"、"死亡"、"攻击"、"移动"）：

**1. 添加Sequence节点作为分支**
   - tool: `AddBeehaveComposite`
   - args: `{"scene_path": "[TreePath]/[TreeName].tscn", "node_type": "Sequence", "node_name": "[分支名]", "parent_path": "SelectorReactiveComposite"}`
   - 例如：`{"node_name": "born", "parent_path": "SelectorReactiveComposite"}`

**2. 添加条件节点**
   - tool: `AddBeehaveCondition`
   - args: `{"scene_path": "[TreePath]/[TreeName].tscn", "condition_script_path": "[条件脚本路径]", "node_name": "[条件名]", "parent_path": "SelectorReactiveComposite/[分支名]"}`
   - 例如：`{"condition_script_path": "res://Framework/Scripts/Beehave/Condition/DieCondition.gd", "node_name": "DieCondition", "parent_path": "SelectorReactiveComposite/die"}`

**3. 添加动作节点**
   - tool: `AddBeehaveAction`
   - args: `{"scene_path": "[TreePath]/[TreeName].tscn", "action_script_path": "[动作脚本路径]", "node_name": "[动作名]", "properties": {...}, "parent_path": "SelectorReactiveComposite/[分支名]"}`
   - 例如：`{"action_script_path": "res://Framework/Scripts/Beehave/Action/DieAction.gd", "node_name": "DieAction", "properties": {"duration": 0.25}, "parent_path": "SelectorReactiveComposite/die"}`

### Step 4: 保存行为树
1. tool: `SaveBeehaveTree` - 保存行为树场景到文件
   - args: `{"scene_path": "[TreePath]/[TreeName].tscn"}`
   - 保存后会自动刷新编辑器文件系统

### Step 5: 将行为树关联到角色（可选）

如果需要将行为树关联到角色：
1. tool: `UpdateBehaviorInputsInScene`
   - args: `{"scene_path": "[角色路径].tscn", "node_path": ".", "behavior_id": "behavior_tree", "inputs": {"default_tree_scene": "[TreePath]/[TreeName].tscn"}}`
   - 这样角色就会使用指定的行为树

## 常见使用场景

### 场景1：创建怪物攻击行为树

**用户需求示例**：
> "为怪物创建一个行为树，支持出生动画、死亡、攻击和移动"

**执行步骤**：
1. 创建行为树场景 (MonsterAttackTree.tscn)
2. 添加SelectorReactive根节点
3. 添加4个Sequence分支：born, die, attack, move
4. 为每个分支添加相应的条件和动作
5. 保存行为树

### 场景2：创建玩家控制行为树

**用户需求示例**：
> "为玩家创建行为树，支持死亡检测、技能施放和移动控制"

**执行步骤**：
1. 创建行为树场景 (PlayerAttackTree.tscn)
2. 添加SelectorReactive根节点
3. 添加3个Sequence分支：death, skill, move
4. 为每个分支添加条件和动作
5. 保存并关联到玩家角色

### 场景3：修改现有行为树

**用户需求示例**：
> "修改MonsterAttackTree，添加一个新的技能施放分支"

**执行步骤**：
1. 打开现有行为树 (OpenScene)
2. 获取场景树结构 (GetSceneTree)
3. 添加新的Sequence分支和对应的条件/动作
4. 保存行为树

## 节点路径规则

- **根节点**：`SelectorReactiveComposite` (或其他根节点名称)
- **一级分支**：`SelectorReactiveComposite/[分支名]`（如 `SelectorReactiveComposite/attack`）
- **二级节点**：`SelectorReactiveComposite/[分支名]/[节点名]`（如 `SelectorReactiveComposite/attack/AttackCondition`）

## 行为树调试建议

1. **使用合理的节点命名**：
   - 组合节点：`[分支功能]` (如 `attack`, `move`, `death`)
   - 条件节点：`[功能]Condition` (如 `AttackCondition`)
   - 动作节点：`[功能]Action` (如 `AttackAction`)

2. **优先级设计**：
   - 将高优先级行为放在SelectorReactive的前面
   - 常见优先级：出生 > 死亡 > 特殊行为 > 常规行为

3. **条件和动作的配对**：
   - 确保条件节点和动作节点在同一Sequence分支中
   - 条件失败时，该分支的动作不会执行

## 运行脚本

运行生成的python脚本。
```bash
python res://logs/runscripts/[script_name].py
```

如运行失败，则修改代码！
