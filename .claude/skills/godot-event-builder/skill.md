---
name: godot-event-builder
description: 为场景或角色添加游戏逻辑（FlowKit事件表：事件-条件-动作）。当用户提到"逻辑"、"行为"、"事件"、"碰撞时"、"死亡时"、"条件判断"等关键词时使用此技能。可为godot-scene-builder创建的场景或godot-role-builder创建的角色添加动态逻辑。
---

# Godot Event Builder
这是一个用于在Godot编辑器中使用FlowKit创建和管理事件表的专业技能。支持为场景添加事件、条件、动作,帮助用户实现可视化逻辑编程。此指南使用代码脚本编排使用MCP工具，以达到创建事件表的目的。

## 前置条件
**CRITICAL - 必须满足以下条件才能使用此技能**:
1. Godot 编辑器必须正在运行
2. godot_mcp 插件必须已启用
3. MCP 服务器必须已连接 (ws://127.0.0.1:18888)
4. 工作目录必须处于godot编辑器中的项目
5. FlowKit 插件必须已启用

## FlowKit 节点类型与能力参考
### 基础概念
**FlowKit 事件表** 由以下部分组成:
- **事件 (Event)**: 触发条件，如 `on_ready`、`on_process`、`on_action_down` 等
- **条件 (Condition)**: 事件触发时的判断条件，可选
- **动作 (Action)**: 条件满足后执行的操作
- **行为 (Behavior)**: 可附加到节点上的功能组件，为节点提供额外能力（如碰撞检测、血量系统、动画管理等）

**目标节点路径规则**:
| 类型 | 目标节点路径 | 示例 | 说明 |
|-----|-------------|------|------|
| System | `new NodePath("System")` | `"System"` | 固定路径，指向全局System节点 |
| 当前节点自身 | `new NodePath(".")` | `"."` | 事件表所属节点自身（Entity/FCharacter/CharacterBody2D） |
| 场景中其他节点 | `new NodePath("节点名")` | `"FMonsterTest"`, `"Door"` | 场景根节点下的同级节点。用于 `set_node_enabled`、`teleport_to_node`、`instantiate_entity_random_position` 等需要操作场景中其他实体的动作 |
| 当前节点的子节点 | `new NodePath("子节点名")` | `"Role_flowkit"` | 当前节点的直接子节点 |
| 嵌套子节点路径 | `new NodePath("父节点/子节点")` | `"CanvasLayer/Label"` | 场景中的嵌套节点路径，用于 UI 等多层结构 |

**target_node 使用示例**:
- `"."` → 操作事件表所属节点自身（如自身位置、变量、删除等）
- `"FMonsterTest"` → 操作场景根节点下名为 FMonsterTest 的节点（如禁用/启用、实例化）
- `"Door"` → 操作场景根节点下名为 Door 的节点（如开门/关门）
- `"FCharacterTest"` → 操作场景根节点下名为 FCharacterTest 的玩家节点（如传送）
- `"System"` → 操作全局系统节点（如打印日志、加载场景、设置变量等）
- `"CanvasLayer/Label"` → 操作嵌套节点（如设置标签文本、颜色等）

---

### 1. System（系统类型）
**定义**: 全局系统级节点，处理游戏的系统级逻辑
**目标节点**: `"System"` (固定路径)
**适用场景**: 游戏全局逻辑、输入处理、UI管理、场景过渡
**能力统计**: 20事件 / 18条件 / 44动作 / 0行为

#### 事件（17个）
**基础生命周期**:
- `on_ready` - 进入场景时
- `on_process` - 每帧更新时
- `on_process_physics` / `on_physics_process` - 物理帧更新时
- `on_scene_ready` - 场景加载完成时

**自定义信号**:
- `on_custom_signal` - 监听自定义信号触发
  - 参数: `{"信号名": "信号名称"}` （如 "敌人全灭"、"进入下一关"、"道具收集完成"）

**输入事件**:
- `on_action_down` - 点击按键时（单次触发）
- `on_action_pressed` - 按键持续按下
- `on_action_released` - 按键释放时
- `on_key_pressed` - 键盘按键按下
- `on_key_released` - 键盘按键释放
- `on_mouse_button_pressed` - 鼠标按钮按下
- `on_mouse_button_released` - 鼠标按钮释放

**游戏状态事件**:
- `on_paused` - 游戏暂停时
- `on_unpaused` - 游戏恢复时
- `on_pause_state_changed` - 暂停状态变化时
- `on_time_scale_changed` - 时间缩放变化时

**敌人数量事件**:
- `on_enemy_count_zero` - 敌人数量从 >0 变为 0 时触发（关卡结束、开门）
- `on_enemy_count_nonzero` - 敌人数量从 0 变为 >0 时触发（关卡开始、关门）
- `on_enemy_count_changed` - 敌人数量变化时触发
  - 参数: `{"最小变化量": 1}`

**窗口事件**:
- `on_window_focus_changed` - 窗口焦点变化
- `on_window_focus_gained` - 窗口获得焦点
- `on_window_focus_lost` - 窗口失去焦点

#### 条件（18个）
**变量比较**:
- `compare_variable` - 比较全局变量（==, !=, <, >, <=, >=）

**敌人数量**:
- `compare_enemy_count` - 比较场景中敌人数量
  - 参数: `{"比较运算符": "<=", "数量": 0}`

**输入检测**:
- `is_action_released` - 检查动作是否释放
- `is_key_pressed` - 检查键盘按键是否按下
- `is_mouse_button_pressed` - 检查鼠标按钮是否按下
- `is_mouse_captured` - 鼠标是否被捕获
- `is_mouse_visible` - 鼠标是否可见

**游戏状态**:
- `is_paused` - 游戏是否暂停
- `is_slow_motion` - 是否慢动作（time_scale < 1.0）
- `is_fast_forward` - 是否快进（time_scale > 1.0）
- `is_elapsed_time_greater` - 运行时间是否超过阈值
- `only_once_when_looped` - 循环中只运行一次

**系统信息**:
- `is_debug_build` - 是否调试版本
- `is_mobile` - 是否移动设备
- `is_platform` - 是否特定平台（Windows/Linux/macOS/Android/iOS/Web）
- `is_fps_above` / `is_fps_below` - FPS是否高于/低于阈值
- `is_audio_bus_muted` - 音频总线是否静音

**窗口状态**:
- `is_window_focused` - 窗口是否有焦点
- `is_window_fullscreen` - 窗口是否全屏

#### 动作（44个）
**日志输出**:
- `print` - 打印日志
- `printerr` - 打印错误日志

**信号**:
- `emit_custom_signal` - 发送自定义信号（可被 `on_custom_signal` 监听）
  - 参数: `{"信号名": "进入下一关", "信号数据": ""}`

**场景管理**:
- `load_scene` - 加载场景（实例化到当前场景）
- `replace_game_scene` - 替换游戏场景（切换主场景）
- `reload_scene` - 重载当前场景
- `close_game` - 关闭游戏

**变量管理**:
- `set_variable` - 设置全局变量
- `add_to_variable` - 给数值变量加上一个数值

**函数定义与调用**:
- `define_function` - 定义一个Function（将当前event块的所有action合并为一个function）
- `call_function` - 调用自定义的组合function

**输入模拟**:
- `action_press` - 模拟按键点击
- `action_release` - 模拟按键点击抬起

**游戏控制**:
- `pause_game` - 暂停游戏
- `unpause_game` - 恢复游戏
- `toggle_pause` - 切换暂停状态
- `set_time_scale` - 设置时间缩放（1.0=正常，0.5=慢动作，2.0=快进）

**窗口控制**:
- `set_window_mode` - 设置窗口模式（windowed/fullscreen/borderless/minimized/maximized）
- `set_window_size` - 设置窗口大小
- `set_window_position` - 设置窗口位置
- `set_window_title` - 设置窗口标题
- `center_window` - 将游戏窗口居中显示

**鼠标控制**:
- `set_mouse_visible` - 设置鼠标可见性
- `set_mouse_captured` - 捕获或释放鼠标光标
- `set_mouse_cursor` - 设置自定义鼠标光标
- `warp_mouse` - 传送鼠标到指定位置

**音频控制**:
- `set_audio_bus_mute` - 设置音频总线静音
- `set_audio_bus_volume` - 设置音频总线音量

**系统设置**:
- `set_max_fps` - 设置最大FPS限制（0=无限制）
- `set_vsync` - 启用或禁用垂直同步
- `set_clipboard` - 设置剪贴板文本
- `vibrate` - 移动设备震动
- `open_url` - 在浏览器中打开URL

---

### 2. Entity（实体类型）
**定义**: 游戏中的实体对象基类，代表角色、道具、敌人等具体对象
**目标节点**: `"."` (当前节点) 或 `"子节点名称"`
**适用场景**: 玩家角色、敌人、NPC、可交互物品、子弹、道具
**能力统计**: 8事件 / 3条件 / 12动作 / 11行为

#### 事件（8个）
**基础生命周期**:
- `on_ready` - 进入场景时
- `on_process` - 每帧更新时
- `on_process_physics` - 物理帧更新时

**碰撞事件** [需要对应behavior]:
- `on_area2d_collision` - Area2D碰撞时 **[需 area2d behavior]**
  - 参数: `{"碰撞类型": "body"}` 或 `{"碰撞类型": "area"}`
- `on_characterbody2d_collision` - CharacterBody2D碰撞时 **[需 characterbody2d_collision behavior]**

**血量事件** [需要health behavior]:
- `on_health_changed` - 血量变化时 **[需 health behavior]**
- `on_health_decreased` - 血量减少时 **[需 health behavior]**
- `on_health_increased` - 血量增加时 **[需 health behavior]**

#### 条件（3个）
- `compare_node_variable` - 比较节点变量
  - 参数: `{"变量名": "name", "比较运算符": "==", "值": value}`
  - 支持运算符: ==, !=, <, >, <=, >=
- `compare_health` - 比较血量（当前/最大） **[需 health behavior]**
  - 参数: `{"血量类型": "current", "比较运算符": ">=", "值": 0}`
- `compare_faction` - 比较阵营 **[需 faction behavior]**
  - 参数: `{"比较运算符": "==", "阵营": "玩家|敌人|中立"}`

#### 动作（14个）
**节点属性控制**:
- `set_node_variable` - 设置节点变量
- `set_position_x` / `set_position_y` - 设置X/Y轴坐标
- `set_rotation` - 设置旋转角度（弧度）
- `delete_self` - 删除当前节点（queue_free）
- `set_node_enabled` - 启用/禁用节点（控制 process、visibility 等）
  - 参数: `{"启用": false}` 或 `{"启用": true}`
  - target_node: 场景中的节点名（如 `"FMonsterTest"`, `"Door"`）

**实体实例化**:
- `instantiate_entity_random_position` - 在随机位置克隆实例化实体
  - 参数: `{"X 最小值": -100, "X 最大值": 100, "Y 最小值": -100, "Y 最大值": 100}`
  - target_node: 被克隆的实体节点名（如 `"FMonsterTest"`）
- `instantiate_entity_at_position` - 在指定位置克隆实例化实体
  - 参数: `{"X": 100.0, "Y": 200.0}`
  - target_node: 被克隆的实体节点名

**传送**:
- `teleport_to_node` - 将实体传送到指定节点位置
  - 参数: `{"目标节点路径": "BornPoint"}`
  - target_node: 被传送的实体节点名（如 `"FCharacterTest"`）

**计时器管理**:
- `create_node_timer` - 创建一个节点计时器
  - 参数: `{"Timer Name": "timer_name", "Value": 1.0}`
- `bind_node_timer` - 绑定一个节点计时器事件
  - 参数: `{"Timer Name": "timer_name", "callable": callable}`

**动画控制** [需要animated_sprite2d behavior]:
- `change_animation` - 切换实体动画
  - 参数: `{"动画名": "open_down"}`（动画名必须在 SpriteFrames 中存在）

**碰撞控制** [需要characterbody2d_collision behavior]:
- `set_collision_enabled` - 启用/禁用碰撞检测
  - 参数: `{"启用": true}` 或 `{"启用": false}`

**血量管理** [需要health behavior]:
- `change_health` - 改变血量（正数加血，负数减血）
  - 参数: `{"血量变化": 10}` 或 `{"血量变化": -20}`

**碰撞调试** [需要对应behavior]:
- `print_collision_body_name` - 打印Area2D碰撞物体名称 **[需 area2d behavior]**
  - 参数: `{"碰撞类型": "body"}` 或 `{"碰撞类型": "area"}`
- `printerr_last_collider_name` - 打印CharacterBody2D最近碰撞对象名称

#### Behaviors（11个）
Entity节点可以添加以下behaviors来增强功能：

| Behavior ID | 功能说明 | 关键参数 | 相关能力 |
|------------|---------|---------|---------|
| **animated_sprite2d** | 2D动画精灵组件 | sprite_frames, 初始动画 | 动画播放控制 |
| **area2d** | Area2D碰撞区域（触发器） | shape_size_x/y, collision_layer/mask | `on_area2d_collision` 事件, `print_collision_body_name` 动作 |
| **behavior_tree** | 行为树组件，用于AI逻辑 | default_tree_scene | AI行为控制 |
| **characterbody2d_collision** | CharacterBody2D碰撞检测 | shape_size_x/y, collision_layer/mask, emit_each_physics_frame | `on_characterbody2d_collision` 事件, `printerr_last_collider_name` 动作 |
| **death_effect** | 死亡特效组件 | effect_scene, offset_x/y | 死亡特效实例化 |
| **faction** | 阵营组件 | 阵营（玩家/敌人/中立） | `compare_faction` 条件 |
| **health** | 血量组件 | 最大血量, 当前血量, 碰到敌人伤害冷却时间 | `on_health_*` 事件, `compare_health` 条件, `change_health` 动作 |
| **hp_bar** | 血条UI组件 | hp_bar_scene, pos_x/y | 血条显示 |
| **signal_broadcaster** | 信号广播组件 | 无 | 节点间信号通信 |
| **skill_box** | 技能盒子组件 | skill_box_scene, init_*_skill_datas | 技能系统（攻击/普通/光环技能） |
| **speed** | 速度组件 | 速度 | 记录速度值到meta和FlowKitSystem |

**详细参数说明和C#代码示例**: 查看 `\reference\FlowKit_Capabilities_Reference.md` 中的"Behaviors 详细使用指南"章节

---

### 3. Label（标签类型）
**定义**: UI文本标签节点，用于在场景中显示文本信息（如关卡数、分数、提示等）
**目标节点**: 场景中 Label 节点的路径（如 `"CanvasLayer/Label"`）
**适用场景**: 关卡显示、分数显示、提示文本、状态信息
**能力统计**: 0事件 / 0条件 / 3动作 / 1行为

#### 动作（3个）
- `set_label_text` - 设置标签文本 **[需 label behavior]**
  - 参数: `{"文本": "第1关"}` 或 `{"文本": "  \"第%d关\" % stageLevel"}`（支持表达式）
  - target_node: Label 节点路径，如 `"CanvasLayer/Label"`
- `set_label_color` - 设置标签颜色 **[需 label behavior]**
  - 参数: `{"颜色": "Color(1, 0, 0, 1)"}`
- `set_label_font_size` - 设置标签字体大小 **[需 label behavior]**
  - 参数: `{"字体大小": 30}`

#### Behavior（1个）
| Behavior ID | 功能说明 | 关键参数 | 相关能力 |
|------------|---------|---------|---------|
| **label** | Label组件，管理文本、颜色、字体大小 | text, fontColor, fontSize, Anchors Preset, Position X/Y, ZIndex | `set_label_text`, `set_label_color`, `set_label_font_size` 动作 |

**注意**: Label 节点通常放在 CanvasLayer 下以实现 UI 固定显示。target_node 使用路径格式如 `"CanvasLayer/Label"`。

---

### 5. FCharacter（玩家/友方角色类型）
**定义**: 特殊的角色类型，继承自Entity，专门用于玩家或友方角色
**目标节点**: `"."` (当前节点) 或子节点路径
**适用场景**: 玩家角色、友方单位、需要特殊保护逻辑的角色
**能力统计**: 继承Entity所有能力 + 1专属动作

#### 继承能力
- **事件**: 继承Entity的全部8个事件
- **条件**: 继承Entity的全部3个条件
- **动作**: 继承Entity的全部8个动作
- **Behaviors**: 继承Entity的全部11个Behaviors

#### FCharacter专属动作（1个）
- `damage_fcharacter_on_collision` - 被Monster碰撞时掉血 **[需 area2d + health behavior]**
  - 参数: `{"伤害值": 20, "碰撞类型": "body"}`
  - 说明: 检查碰撞物体是否是Monster（FMonster），如果是则对当前FCharacter造成伤害
  - 应用场景: 玩家角色的被动受伤逻辑

**注意**: FCharacter可同时使用Entity和System的所有能力。

---

### 6. CharacterBody2D（物理角色体类型）
**定义**: Godot物理系统的角色体类型，用于需要物理移动和碰撞的实体
**目标节点**: `"."` (当前节点)
**适用场景**: 需要物理移动的角色（玩家控制、AI敌人）、需要与地形和其他物体发生物理碰撞的实体
**能力统计**: 继承Entity所有能力，重点使用characterbody2d_collision behavior

#### 继承能力
- **事件**: 继承Entity的全部事件（特别是 `on_characterbody2d_collision`）
- **条件**: 继承Entity的全部条件
- **动作**: 继承Entity的全部动作（特别是 `printerr_last_collider_name`）
- **Behaviors**: 继承Entity的全部Behaviors

#### 核心Behavior
**characterbody2d_collision** - CharacterBody2D碰撞检测组件
- **功能**: 管理CollisionShape2D子节点，提供move_and_slide()碰撞检测
- **关键参数**:
  - `shape_size_x` / `shape_size_y` - 碰撞形状大小（默认32.0）
  - `collision_layer` - 碰撞所在层（默认1）
  - `collision_mask` - 会与哪些层发生碰撞（默认1）
  - `emit_each_physics_frame` - 碰撞触发模式：
    - `true`: 每个物理帧只要存在碰撞就触发一次
    - `false`: 只在碰撞开始的第一帧触发（默认）
- **相关事件**: `on_characterbody2d_collision`
- **相关动作**: `printerr_last_collider_name`

**使用建议**:
1. 必须添加 `characterbody2d_collision` behavior 才能使用碰撞相关事件
2. 根据需求设置 `collision_layer` 和 `collision_mask` 来控制哪些对象会发生碰撞
3. 根据游戏需求选择 `emit_each_physics_frame` 的值（持续触发 vs 单次触发）

**注意**: CharacterBody2D可同时使用Entity和System的所有能力。

---

## 参考文档使用说明
**仅在以下情况查阅**：
1. 需要**详细参数说明**（参数名、类型、默认值、C#示例等）
2. 需要查找**所有可用能力的完整列表**
3. 需要了解**能力之间的依赖关系**

**参考文档**：
- **`\reference\FlowKit_Capabilities_Reference.md`** - FlowKit能力综合参考手册（推荐）
  - 包含所有节点类型（System、Entity、CharacterBody2D、FCharacter）的完整能力
  - 统一的表格格式，便于快速查找和对比
  - 包含使用说明、参数示例、依赖关系等详细信息

---

## 工作流程
### 限制与约束
1. **单一事件表**: 每个场景只能有一个活动的事件表
2. **事件索引**: 必须按顺序添加事件,使用返回的 `event_index`
3. **不支持嵌套**: 条件和动作不能嵌套,只能按顺序添加
4. **保存后清理**: `SaveFlowKitSheet` 后会清理事件表创建器实例,需要重新 `CreateFlowKitSheet` 才能添加新事件

### 工作要求
- 必须编写python脚本，脚本代码必须先通过websocket连接mcp服务器（ws://127.0.0.1:18888）。连接方式示例如下：
```python
import sys
# Windows 编码兼容：防止中文和 Unicode 字符输出时因 GBK 编码导致报错
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

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
# 示例1: 打开场景并创建事件表
commands = [
    {"name": "OpenScene", "arguments": {"scene_path": target_path}},
    {"name": "GetSceneTree", "arguments": {}},
    {"name": "CreateFlowKitSheet", "arguments": {"scene_path": target_path}}
]
await batch_execute(ws, commands)

# 示例2: 添加多个事件和动作（需要按顺序，因为后续操作依赖event_index）
# 注意：事件表操作通常需要单独调用以获取返回的event_index
commands = [
    {
        "name": "AddFlowKitEvent",
        "arguments": {"event_id": "on_ready", "target_node": ".", "inputs": {}}
    },
    {
        "name": "AddFlowKitAction",
        "arguments": {
            "event_index": 0,
            "action_id": "print",
            "target_node": "System",
            "inputs": {"Message": "Game Started"}
        }
    },
    {
        "name": "AddFlowKitEvent",
        "arguments": {"event_id": "on_process", "target_node": ".", "inputs": {}}
    },
    {
        "name": "SaveFlowKitSheet",
        "arguments": {}
    }
]
await batch_execute(ws, commands)
```

- **何时使用单独调用 vs 批量执行**：
  - **使用单独 `call_tool()`**：需要获取返回值（如 `CreateFlowKitSheet` 返回的 `scene_uid`）或需要查看中间结果时
  - **使用批量 `batch_execute()`**：连续的操作且不需要中间结果时（如打开场景、获取树、创建事件表）

- 编写的脚本代码存放到`logs/runscripts/[script_name].py`。

### Step 1: 场景分析与准备
1. tool: `OpenScene` - 打开目标场景
   - method: `"tools/call"`
   - params: `{"name": "OpenScene", "arguments": {"scene_path": "目标场景路径.tscn"}}`

2. tool: `GetSceneTree` - 获取场景树结构
   - method: `"tools/call"`
   - params: `{"name": "GetSceneTree", "arguments": {}}`

3. **分析场景节点类型**,确定可用的能力：
   - 所有场景都可以使用**System类型能力**（目标节点: `"System"`）
   - 如果是Entity/角色场景,可以使用**Entity类型能力**（目标节点: `"."` 或 `"./子节点"`）
   - 如果是CharacterBody2D,还可使用额外的物理碰撞能力

4. **参考上面的能力速查表**,选择需要的事件、条件、动作
   - 大多数情况下速查表已足够
   - 如需详细参数,再查阅reference文档

### Step 2: 创建事件表
1. tool: `CreateFlowKitSheet` - 为场景创建事件表
   - method: `"tools/call"`
   - params: `{"name": "CreateFlowKitSheet", "arguments": {"scene_path": "目标场景路径.tscn"}}`
   - 返回的 `scene_uid` 很重要,事件表将保存为 `{scene_uid}.tres`

### Step 3: 添加事件 (循环操作)
对于每个需要添加的事件:

1. tool: `AddFlowKitEvent` - 添加事件
   - method: `"tools/call"`
   - params: `{"name": "AddFlowKitEvent", "arguments": {"event_id": "事件ID", "target_node": "目标节点路径", "inputs": {...}}}`
   - 注意:
     - `target_node` 通常为 `"."` (当前节点) 或 `"System"` (系统节点)
     - 返回的 `event_index` 用于后续添加条件和动作
   - 示例参数: `{"event_id": "on_ready", "target_node": ".", "inputs": {}}`

2. (可选) tool: `AddFlowKitCondition` - 为事件添加条件
   - method: `"tools/call"`
   - params: `{"name": "AddFlowKitCondition", "arguments": {"event_index": 事件索引, "condition_id": "条件ID", "target_node": "目标节点", "inputs": {...}, "negated": false}}`
   - 注意: 可以为同一个事件添加多个条件(多条件会使用AND逻辑)
   - 示例参数: `{"event_index": 0, "condition_id": "compare_node_variable", "target_node": ".", "inputs": {"变量名": "health", "比较运算符": ">", "值": 0}, "negated": false}`

3. tool: `AddFlowKitAction` - 为事件添加动作
   - method: `"tools/call"`
   - params: `{"name": "AddFlowKitAction", "arguments": {"event_index": 事件索引, "action_id": "动作ID", "target_node": "目标节点", "inputs": {...}}}`
   - 注意: 可以为同一个事件添加多个动作(动作会按顺序执行)
   - 示例参数: `{"event_index": 0, "action_id": "print", "target_node": "System", "inputs": {"Message": "Hello World"}}`

4. (可选) tool: `GetFlowKitSheetStatus` - 检查当前事件表状态
   - method: `"tools/call"`
   - params: `{"name": "GetFlowKitSheetStatus", "arguments": {}}`
   - 用于验证事件是否正确添加

### Step 4: 保存事件表
1. tool: `SaveFlowKitSheet` - 保存事件表
   - method: `"tools/call"`
   - params: `{"name": "SaveFlowKitSheet", "arguments": {}}`
   - 事件表会自动保存到 `res://addons/flowkit/saved/event_sheet/{scene_uid}.tres`

### 批量执行示例
**推荐**: 使用 `tools/batchExecute` 一次性执行多个操作，提高性能：

## 运行脚本
运行上一步输出的代码脚本。python `res://logs/runscripts/[script_name].py`。
如运行失败，则修改代码！