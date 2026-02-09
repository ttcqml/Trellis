---
name: godot-scene-builder
description: 创建游戏场景，组装多个实体（玩家、敌人、道具等）。当用户需求涉及两个及以上实体时使用此技能。如果用户需求中的角色具有自定义特征（如"血量150的玩家"、"速度300的敌人"），此技能会先调用godot-role-builder创建角色，然后将角色实例化到场景中。
---

# Godot Scene Builder

这是一个用于在Godot编辑器中创建游戏场景的专业技能。游戏场景是通过实例化和组装已创建的角色、敌人、道具等实体来构建的。此指南使用代码脚本编排使用MCP工具，以达到组装现有组件实现用户需求的目的。

## 核心理念
**场景构建 = 实体组装**
- 场景不是从零创建角色，而是实例化已有的角色场景文件
- 编写的脚本用来串联调用的工具，而不是直接写代码实现场景。
- 脚本中通过websocket连接mcp服务器（ws://127.0.0.1:18888）

## 参数设置
当用户的需求中包含相关参数时，使用用户需求中的参数。如果参数信息缺失，使用以下默认值并立即执行。

| 参数 | 说明 | 默认值 |
| :--- | :--- | :--- |
| **SceneName** | 场景名字 | `NewScene`，重复时后面添加数字以区分 |
| **ScenePath** | 场景存放路径 | `res://RequirementImp/Scenes` |
| **BaseSceneTemplate** | 基础场景模板 | `res://Game_flowkit/EntityTemplate/GameScene.tscn` |
| **EntityScenePath** | 要实例化的角色场景路径 | 根据用户需求选择，或使用预制模板 |
| **EntityName** | 实例化后的节点名称 | `NewPlayer`、`NewMonster`等，重复时添加序号 |
| **Position** | 实体位置 | `{"x": 100, "y": 200}` 或根据用户需求 |

## 工作流程
### Step 0: 角色准备（前置步骤）
**重要**：在创建场景之前，先分析用户需求，判断是否需要创建自定义角色。

**需要先创建角色的情况**（使用godot-role-builder）：
- 角色有自定义数值：如"血量150的玩家"、"速度300的敌人"、"攻击力50的Boss"
- 角色有自定义动画：如"使用火焰动画的法师"、"蓝色的怪物"
- 角色有特殊behaviors：如"会飞的敌人"、"带盾牌的战士"
- 用户明确说"创建...角色"：如"创建一个Warrior角色"

**对于需要自定义的角色**：
   - 使用 **godot-role-builder** skill创建角色
   - 记录创建的角色场景路径`res://RequirementImp/[Type]/[Name].tscn`，并在后续使用。

**可直接使用预制模板的情况**（无需创建角色）：
- 普通玩家角色：直接使用 `res://Game_flowkit/Entity/Player/FCharacterTest.tscn`
- 普通敌人/怪物：直接使用 `res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn`
- 通用角色：直接使用 `res://Game_flowkit/Entity/Role/FRole.tscn`
- 用户没有提到任何特殊特征

### 工作要求
- 对于以下工作步骤，必须编写python脚本，脚本代码必须先通过websocket连接mcp服务器（ws://127.0.0.1:18888）。连接方式示例如下：
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
            "commands":[
                        {
                        "name": "工具1",
                        "arguments": {}
                        },
                        {
                        "name": "工具2",
                        "arguments": {}
                        },...
                        {
                        "name": "工具n",
                        "arguments": {}
                        }
                        ]
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

- **何时使用单独调用 vs 批量执行**：
  - **使用单独 `call_tool()`**：需要查看中间结果时（如 `GetSceneTree`、调试时）
  - **使用批量 `batch_execute()`**：连续的配置操作（实例化、设置属性、保存场景等）

- 编写的脚本代码存放到`logs/runscripts/[script_name].py`。

### Step 1: 场景初始化
1. 使用文件系统复制基础场景模板
   - 复制 `res://Game_flowkit/EntityTemplate/GameScene.tscn`
   - 到目标路径：`[ScenePath]/[SceneName].tscn`

2. tool: `OpenScene`
   - args: `{"scene_path": "[ScenePath]/[SceneName].tscn"}`
   - 在编辑器中打开场景

3. tool: `SaveScene`
   - args: `{"scene_path": "[ScenePath]/[SceneName].tscn"}`

### Step 2: 实例化实体（循环操作）
对于每一个需要添加到场景的实体（玩家、敌人、道具等）：

**1. 确定要实例化的角色场景路径**
   - 用户提到的自定义角色: `res://RequirementImp/[Type]/[Name].tscn`
   - 预制玩家模板: `res://Game_flowkit/Entity/Player/FCharacterTest.tscn`
   - 预制敌人模板: `res://Game_flowkit/Entity/Enemy/FMonsterTest.tscn`
   - 预制通用模板: `res://Game_flowkit/Entity/Role/FRole.tscn`

**2. tool: `InstantiateScene`** - 实例化角色到场景
   - args: `{"scene_path": "[要实例化的角色场景路径]", "parent_path": "root"}`

**3. tool: `SetProperty`** - 设置属性，如位置等（可选）
   - args: `{"node_path": "root/[实例节点名称]", "properties": {"position": {"x": 100, "y": 200}}}`

**4. tool: `SaveScene`**
   - args: `{"scene_path": "[ScenePath]/[SceneName].tscn"}`

### Step 3: 调整属性（用户指定时）
如果用户要求修改场景中实体的特定属性：

1. tool: `SelectNode` - 选中实体节点
   - args: `{"node_path": "root/[EntityName]"}`

2. tool: `SetProperty` - 批量设置属性
   - args: `{"node_path": "root/[EntityName]", "properties": {"position": {"x": 100, "y": 200}, "scale": {"x": 1.5, "y": 1.5}}}`

3. tool: `SaveScene`

### Step 4: 覆盖实体的Behavior配置（用户指定时）
如需要，场景实例可以覆盖原始角色的behaviors配置。
1. tool: `UpdateBehaviorInputsInScene`
   - args: `{"scene_path": "[ScenePath]/[SceneName].tscn", "node_path": "[EntityName]", "behavior_id": "animated_sprite2d", "inputs": {"初始动画": "birth_down"}}`

2. tool: `SaveScene`

**注意**：只覆盖需要修改的behaviors，未指定的behaviors会继承原始场景配置。

### Step 5: 验证与保存
1. tool: `GetSceneTree` - 验证场景结构
   - args: `{}`
   - 检查所有实体是否正确添加

2. tool: `SaveScene` - 最终保存
   - args: `{"scene_path": "[ScenePath]/[SceneName].tscn"}`

## 运行脚本
运行上一步输出的代码脚本。
如运行失败，则修改代码！