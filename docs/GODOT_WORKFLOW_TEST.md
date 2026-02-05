# Trellis Godot 工作流测试文档

> 在 `roguelikegametemplate` 项目中执行以下测试，验证 Trellis 改造是否成功。

---

## 前置条件

1. 在 `roguelikegametemplate` 目录执行初始化：
   ```bash
   cd F:/godot-agent-dev/roguelikegametemplate
   trellis init --yes
   ```

2. 确认生成以下目录结构：
   ```
   .trellis/
   ├── spec/
   │   ├── entity/      # 实体规范
   │   ├── scene/       # 场景规范
   │   ├── skill/       # 技能规范
   │   ├── ai/          # AI规范
   │   ├── flowkit/     # FlowKit规范
   │   └── guides/      # 思考指南
   ├── workspace/
   └── scripts/

   .claude/
   ├── commands/trellis/  # 斜杠命令
   ├── agents/            # 代理定义
   ├── hooks/             # Hook脚本
   └── skills/            # AI技能
   ```

---

## 测试 1: 会话启动

**目标**: 验证 `/trellis:start` 命令正常工作

**步骤**:
1. 在 Claude Code 中打开 roguelikegametemplate 项目
2. 输入: `/trellis:start`

**预期结果**:
- 显示项目结构摘要
- 加载 entity/scene/skill/ai/flowkit 规范
- 准备开始开发会话

---

## 测试 2: 创建简单角色

**目标**: 验证 `godot-role-builder` 技能

**步骤**:
在 Claude Code 中输入:
```
创建一个史莱姆敌人，血量50，移动速度80
```

**预期结果**:
- 调用 `godot-role-builder` 技能
- 在 `Game_flowkit/Entity/Monster/` 创建 `Slime/` 目录
- 生成 `slime.tscn` 场景文件
- 生成 `slime.gd` 脚本（继承 FMonster）
- 配置 FlowKit behaviors

**验证命令**:
```bash
# 检查文件是否存在
ls Game_flowkit/Entity/Monster/Slime/
```

---

## 测试 3: 创建简单场景

**目标**: 验证 `godot-scene-builder` 技能

**步骤**:
在 Claude Code 中输入:
```
创建一个测试战斗场景，包含1个玩家和3个史莱姆敌人
```

**预期结果**:
- 调用 `godot-scene-builder` 技能
- 在 `Game_flowkit/Scenes/` 创建场景
- 实例化玩家和史莱姆
- 配置场景节点层级

**验证命令**:
```bash
ls Game_flowkit/Scenes/
```

---

## 测试 4: 添加 FlowKit 事件

**目标**: 验证 `godot-event-builder` 技能

**步骤**:
在 Claude Code 中输入:
```
给史莱姆添加逻辑：当死亡时掉落金币
```

**预期结果**:
- 调用 `godot-event-builder` 技能
- 在史莱姆的 flowkit_behaviors 中添加事件表
- 事件: `EntityDeadEvent`
- 动作: 掉落物品/金币

---

## 测试 5: 创建行为树

**目标**: 验证 `godot-behavior-tree-builder` 技能

**步骤**:
在 Claude Code 中输入:
```
给史莱姆创建AI行为树：追踪玩家，到达攻击范围后攻击
```

**预期结果**:
- 调用 `godot-behavior-tree-builder` 技能
- 创建 Beehave 行为树
- 包含追踪和攻击逻辑节点

---

## 测试 6: 规范检查命令

**目标**: 验证检查命令正常工作

**步骤**:
1. 输入: `/trellis:check-entity`
2. 输入: `/trellis:check-scene`
3. 输入: `/trellis:check-cross-system`

**预期结果**:
- 每个命令执行相应的质量检查
- 输出检查结果和建议

---

## 测试 7: 开发前规范读取

**目标**: 验证 before-dev 命令注入正确规范

**步骤**:
1. 输入: `/trellis:before-entity-dev`
2. 输入: `/trellis:before-scene-dev`
3. 输入: `/trellis:before-skill-dev`

**预期结果**:
- 加载对应的规范文件
- 显示开发指南摘要

---

## 测试 8: 完整工作流

**目标**: 验证端到端开发流程

**场景**: 创建一个完整的"蝙蝠怪"功能

**步骤**:

### 8.1 创建角色
```
创建蝙蝠敌人：
- 血量: 30
- 速度: 120（比史莱姆快）
- 飞行类型
```

### 8.2 添加技能
```
给蝙蝠添加冲撞技能：
- 冲向玩家
- 造成10点伤害
- 冷却时间2秒
```

### 8.3 添加AI行为
```
给蝙蝠创建行为树：
- 在玩家附近盘旋
- 每2秒冲撞一次
- 血量低于30%时逃跑
```

### 8.4 创建测试场景
```
创建蝙蝠洞穴场景：
- 1个玩家
- 5只蝙蝠
- 洞穴背景
```

### 8.5 完成工作
```
/trellis:finish-work
```

**预期结果**:
- 所有文件正确创建
- 跨系统检查通过
- 场景可在 Godot 中打开

---

## 测试 9: 任务系统

**目标**: 验证任务上下文注入

**步骤**:
1. 创建任务文件 `.trellis/tasks/test-entity.md`:
   ```markdown
   # 测试实体任务

   type: entity

   创建一个测试用的骷髅敌人
   ```

2. 在 Claude Code 中输入: `/trellis:start`

3. 选择该任务

**预期结果**:
- 任务被识别为 `entity` 类型
- 自动注入实体相关规范（role-guidelines, behavior-guidelines 等）

---

## 测试 10: Hook 功能

**目标**: 验证 Hook 脚本正常工作

### 10.1 Session Start Hook
- 启动新会话时自动加载规范

### 10.2 Subagent Context Injection
- 子代理收到正确的 Godot 上下文

### 10.3 Ralph Loop
- 验证循环检测使用 Godot 相关检查

---

## 问题排查

### 命令找不到
```bash
# 确认命令文件存在
ls .claude/commands/trellis/
```

### 技能不工作
```bash
# 确认技能目录存在
ls .claude/skills/
```

### 规范未加载
```bash
# 确认规范文件存在
ls .trellis/spec/entity/
ls .trellis/spec/scene/
```

### Hook 报错
```bash
# 查看 Hook 日志
cat .claude/hooks/*.py
```

---

## 测试结果记录

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 测试 1: 会话启动 | ⬜ | |
| 测试 2: 创建角色 | ⬜ | |
| 测试 3: 创建场景 | ⬜ | |
| 测试 4: FlowKit事件 | ⬜ | |
| 测试 5: 行为树 | ⬜ | |
| 测试 6: 检查命令 | ⬜ | |
| 测试 7: before-dev | ⬜ | |
| 测试 8: 完整流程 | ⬜ | |
| 测试 9: 任务系统 | ⬜ | |
| 测试 10: Hook | ⬜ | |

状态: ✅ 通过 | ❌ 失败 | ⬜ 未测试

---

## 快速测试脚本

在 roguelikegametemplate 目录执行：

```bash
#!/bin/bash
# quick-test.sh - 快速验证 Trellis 安装

echo "=== Trellis Godot 工作流验证 ==="

# 检查目录结构
echo -n "检查 .trellis/spec/entity/... "
[ -d ".trellis/spec/entity" ] && echo "✓" || echo "✗"

echo -n "检查 .trellis/spec/scene/... "
[ -d ".trellis/spec/scene" ] && echo "✓" || echo "✗"

echo -n "检查 .trellis/spec/skill/... "
[ -d ".trellis/spec/skill" ] && echo "✓" || echo "✗"

echo -n "检查 .trellis/spec/ai/... "
[ -d ".trellis/spec/ai" ] && echo "✓" || echo "✗"

echo -n "检查 .trellis/spec/flowkit/... "
[ -d ".trellis/spec/flowkit" ] && echo "✓" || echo "✗"

# 检查命令
echo -n "检查 commands/trellis/start.md... "
[ -f ".claude/commands/trellis/start.md" ] && echo "✓" || echo "✗"

echo -n "检查 commands/trellis/before-entity-dev.md... "
[ -f ".claude/commands/trellis/before-entity-dev.md" ] && echo "✓" || echo "✗"

# 检查技能
echo -n "检查 skills/godot-role-builder... "
[ -d ".claude/skills/godot-role-builder" ] && echo "✓" || echo "✗"

echo -n "检查 skills/godot-scene-builder... "
[ -d ".claude/skills/godot-scene-builder" ] && echo "✓" || echo "✗"

echo "=== 验证完成 ==="
```

---

## 下一步

测试通过后，可以：

1. **填充规范内容**: 根据 roguelikegametemplate 的实际结构填充 `.trellis/spec/` 下的规范文件
2. **自定义命令**: 根据项目需求调整 `.claude/commands/trellis/` 下的命令
3. **优化技能**: 根据测试反馈改进 `.claude/skills/` 下的技能提示词
