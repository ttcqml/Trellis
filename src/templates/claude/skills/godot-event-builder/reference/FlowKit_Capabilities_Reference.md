# FlowKit 事件表能力综合参考手册

**说明**：本文件汇总了 FlowKit 在不同节点类型（System、Entity、CharacterBody2D、FCharacter）上可用的所有事件（Event）、条件（Condition）、动作（Action）以及行为（Behavior）。使用本手册可以快速查找适用于各节点类型的能力。

---

## 目录
- [事件（Events）](#事件events)
- [条件（Conditions）](#条件conditions)
- [动作（Actions）](#动作actions)
- [行为（Behaviors）](#行为behaviors)

---

## 事件（Events）

| 事件名称 | ID | 适用节点类型 | 描述 | 参数 | 目标节点 | 脚本路径 |
|---------|----|-----------|----|------|---------|---------|
| 每帧更新时 | `on_process` | Entity, System | 每帧运行 | 无 | System: `new NodePath("System")`<br>Entity: `new NodePath(".")` 或子节点 | `res://addons/flowkit/events/Entity/on_process.gd` |
| 物理帧更新时 | `on_process_physics` | Entity, System | 每次物理计算时运行 | 无 | System: `new NodePath("System")`<br>Entity: `new NodePath(".")` 或子节点 | `res://addons/flowkit/events/Entity/on_process_physics.gd` |
| 进入场景时 | `on_ready` | Entity, System | 场景开始时运行 | 无 | System: `new NodePath("System")`<br>Entity: `new NodePath(".")` 或子节点 | `res://addons/flowkit/events/Entity/on_ready.gd` |
| Area2D 碰撞时 | `on_area2d_collision` | Entity | Area2D 碰撞时触发。依赖 area2d Behavior | `"碰撞类型"` (String): 'body' 或 'area' (默认: `body`) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/area2d/events/on_area2d_collision.gd` |
| CharacterBody2D 碰撞时 | `on_characterbody2d_collision` | Entity, CharacterBody2D | CharacterBody2D move_and_slide() 碰撞时触发。需要 characterbody2d_collision Behavior | 无 | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/characterbody2d_collision/events/on_characterbody2d_collision.gd` |
| 血量变化时 | `on_health_changed` | Entity | 当前血量变化时触发。需要 health Behavior | 无 | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/health/events/on_health_changed.gd` |
| 血量减少时 | `on_health_decreased` | Entity | 当前血量减少时触发。需要 health Behavior | 无 | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/health/events/on_health_decreased.gd` |
| 血量增加时 | `on_health_increased` | Entity | 当前血量增加时触发。需要 health Behavior | 无 | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/health/events/on_health_increased.gd` |
| 点击按键时 | `on_action_down` | System | 输入动作按下时触发（仅一次） | `"action"` (string): 输入动作名称 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_action_down.gd` |
| On Action Pressed | `on_action_pressed` | System | 输入动作按下时触发 | `"action"` (string): 输入动作名称 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_action_pressed.gd` |
| On Action Released | `on_action_released` | System | 输入动作释放时触发 | `"action"` (string): 输入动作名称 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_action_released.gd` |
| On Key Pressed | `on_key_pressed` | System | 键盘按键按下时触发 | `"key"` (string): 按键名称 (如 'W', 'Space') | `new NodePath("System")` | `res://addons/flowkit/events/System/on_key_pressed.gd` |
| On Key Released | `on_key_released` | System | 键盘按键释放时触发 | `"key"` (string): 按键名称 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_key_released.gd` |
| On Mouse Button Pressed | `on_mouse_button_pressed` | System | 鼠标按钮按下时触发 | `"button"` (string): 'left', 'right', 'middle', 'wheel_up', 'wheel_down' | `new NodePath("System")` | `res://addons/flowkit/events/System/on_mouse_button_pressed.gd` |
| On Mouse Button Released | `on_mouse_button_released` | System | 鼠标按钮释放时触发 | `"button"` (string): 'left', 'right', 'middle' | `new NodePath("System")` | `res://addons/flowkit/events/System/on_mouse_button_released.gd` |
| On Paused | `on_paused` | System | 游戏暂停时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_paused.gd` |
| On Pause State Changed | `on_pause_state_changed` | System | 暂停状态改变时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_pause_state_changed.gd` |
| On Physics Process | `on_physics_process` | System | 每个物理帧触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_physics_process.gd` |
| On Scene Ready | `on_scene_ready` | System | 场景加载完成时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_scene_ready.gd` |
| On Time Scale Changed | `on_time_scale_changed` | System | 时间缩放改变时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_time_scale_changed.gd` |
| On Unpaused | `on_unpaused` | System | 游戏恢复时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_unpaused.gd` |
| On Window Focus Changed | `on_window_focus_changed` | System | 窗口焦点改变时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_window_focus_changed.gd` |
| On Window Focus Gained | `on_window_focus_gained` | System | 窗口获得焦点时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_window_focus_gained.gd` |
| On Window Focus Lost | `on_window_focus_lost` | System | 窗口失去焦点时触发 | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_window_focus_lost.gd` |
| 自定义信号 | `on_custom_signal` | System | 监听自定义信号触发 | `"信号名"` (String): 信号名称 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_custom_signal.gd` |
| 敌人数量归零时 | `on_enemy_count_zero` | System | 敌人数量从 >0 变为 0 时触发（关卡结束） | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_enemy_count_zero.gd` |
| 敌人数量突破零时 | `on_enemy_count_nonzero` | System | 敌人数量从 0 变为 >0 时触发（关卡开始） | 无 | `new NodePath("System")` | `res://addons/flowkit/events/System/on_enemy_count_nonzero.gd` |
| 敌人数量变化时 | `on_enemy_count_changed` | System | 敌人数量变化超过阈值时触发 | `"最小变化量"` (int): 最小绝对变化量 (默认: `1`) | `new NodePath("System")` | `res://addons/flowkit/events/System/on_enemy_count_changed.gd` |

---

## 条件（Conditions）

| 条件名称 | ID | 适用节点类型 | 描述 | 参数 | 目标节点 | 脚本路径 |
|---------|----|-----------|----|------|---------|---------|
| 比较节点变量 | `compare_node_variable` | Entity | 比较节点变量与指定值 | `"变量名"` (String)<br>`"比较运算符"` (String): '==', '!=', '<', '>', '<=', '>='<br>`"值"` (Variant) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/conditions/Entity/compare_node_variable.gd` |
| 比较阵营 | `compare_faction` | Entity | 比较节点阵营 | `"比较运算符"` (String): '==' 或 '!=' (默认: `==`)<br>`"阵营"` (String): 玩家、敌人、中立 (默认: `中立`) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/faction/conditions/compare_faction.gd` |
| 比较血量 | `compare_health` | Entity | 比较当前血量或最大血量 | `"血量类型"` (String): 'current' 或 'max' (默认: `current`)<br>`"比较运算符"` (String) (默认: `>=`)<br>`"值"` (int) (默认: `0`) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/health/conditions/compare_health.gd` |
| Compare Variable | `compare_variable` | System | 比较全局变量与指定值 | `"Name"` (String)<br>`"Comparison"` (String)<br>`"Value"` (Variant) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/compare_variable.gd` |
| Is Action Released | `is_action_released` | System | 检查输入动作是否刚释放 | `"Action"` (String) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_action_released.gd` |
| Is Audio Bus Muted | `is_audio_bus_muted` | System | 检查音频总线是否静音 | `"BusName"` (String) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_audio_bus_muted.gd` |
| Is Debug Build | `is_debug_build` | System | 检查是否为调试模式 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_debug_build.gd` |
| Is Elapsed Time Greater | `is_elapsed_time_greater` | System | 比较游戏运行时间 | `"Seconds"` (float) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_elapsed_time_greater.gd` |
| Is Fast Forward | `is_fast_forward` | System | 检查时间缩放是否 > 1.0 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_fast_forward.gd` |
| Is FPS Above | `is_fps_above` | System | 检查 FPS 是否高于阈值 | `"Threshold"` (float) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_fps_above.gd` |
| Is FPS Below | `is_fps_below` | System | 检查 FPS 是否低于阈值 | `"Threshold"` (float) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_fps_below.gd` |
| Is Key Pressed | `is_key_pressed` | System | 检查键盘按键是否按下 | `"Key"` (String) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_key_pressed.gd` |
| Is Mobile | `is_mobile` | System | 检查是否为移动设备 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_mobile.gd` |
| Is Mouse Button Pressed | `is_mouse_button_pressed` | System | 检查鼠标按钮是否按下 | `"Button"` (String) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_mouse_button_pressed.gd` |
| Is Mouse Captured | `is_mouse_captured` | System | 检查鼠标是否被捕获 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_mouse_captured.gd` |
| Is Mouse Visible | `is_mouse_visible` | System | 检查鼠标是否可见 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_mouse_visible.gd` |
| Is Paused | `is_paused` | System | 检查游戏是否暂停 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_paused.gd` |
| Is Platform | `is_platform` | System | 检查运行平台 | `"Platform"` (String): 'windows', 'linux', 'macos', 'android', 'ios', 'web' | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_platform.gd` |
| Is Slow Motion | `is_slow_motion` | System | 检查时间缩放是否 < 1.0 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_slow_motion.gd` |
| Is Window Focused | `is_window_focused` | System | 检查窗口是否有焦点 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_window_focused.gd` |
| Is Window Fullscreen | `is_window_fullscreen` | System | 检查窗口是否全屏 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/is_window_fullscreen.gd` |
| Only Once When Looped | `only_once_when_looped` | System | 循环时仅运行一次 | 无 | `new NodePath("System")` | `res://addons/flowkit/conditions/System/only_once_when_looped.gd` |
| 比较敌人数量 | `compare_enemy_count` | System | 比较场景中 "enemy" 组的敌人数量 | `"比较运算符"` (String): '==', '!=', '<', '>', '<=', '>=' (默认: `>=`)<br>`"数量"` (int): 比较值 (默认: `0`) | `new NodePath("System")` | `res://addons/flowkit/conditions/System/compare_enemy_count.gd` |

---

## 动作（Actions）

| 动作名称 | ID | 适用节点类型 | 描述 | 参数 | 目标节点 | 脚本路径 |
|---------|----|-----------|----|------|---------|---------|
| 绑定一个节点计时器 | `bind_node_timer` | Entity | 给节点计时器绑定事件 | `"Timer Name"` (String)<br>`"callable"` (Callable) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/bind_node_timer.gd` |
| 创建一个节点计时器 | `create_node_timer` | Entity | 创建计时器 | `"Timer Name"` (String)<br>`"Value"` (float) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/create_node_timer.gd` |
| 删除当前节点 | `delete_self` | Entity | 删除当前节点（queue_free） | 无 | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/delete_self.gd` |
| 设置节点变量 | `set_node_variable` | Entity | 设置节点变量 | `"变量名"` (String)<br>`"值"` (String) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/set_node_variable.gd` |
| 设置X轴坐标 | `set_position_x` | Entity | 设置节点 X 坐标 | `"X"` (Float) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/set_position_x.gd` |
| 设置Y轴坐标 | `set_position_y` | Entity | 设置节点 Y 坐标 | `"Y"` (Float) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/set_position_y.gd` |
| 设置旋转 | `set_rotation` | Entity | 设置节点旋转（弧度） | `"Rotation"` (Float) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/set_rotation.gd` |
| 启用/禁用节点 | `set_node_enabled` | Entity, System | 启用或禁用目标节点（控制 process、physics_process、input 和 visibility） | `"启用"` (bool): true=启用, false=禁用 (默认: `false`) | 场景中的节点路径（如 `new NodePath("FMonsterTest")`、`new NodePath("Door")` 等） | `res://addons/flowkit/actions/Entity/set_node_enabled.gd` |
| 随机位置实例化实体 | `instantiate_entity_random_position` | Entity | 在随机位置克隆实例化目标实体 | `"X 最小值"` (float) (默认: `-100.0`)<br>`"X 最大值"` (float) (默认: `100.0`)<br>`"Y 最小值"` (float) (默认: `-100.0`)<br>`"Y 最大值"` (float) (默认: `100.0`) | `new NodePath(".")` 或场景中的实体节点名 | `res://addons/flowkit/actions/Entity/instantiate_entity_random_position.gd` |
| 指定位置实例化实体 | `instantiate_entity_at_position` | Entity | 在指定位置克隆实例化目标实体 | `"X"` (float) (默认: `0.0`)<br>`"Y"` (float) (默认: `0.0`) | `new NodePath(".")` 或场景中的实体节点名 | `res://addons/flowkit/actions/Entity/instantiate_entity_at_position.gd` |
| 传送到节点 | `teleport_to_node` | Entity | 将目标实体传送到指定节点的位置 | `"目标节点路径"` (String): 目标节点名称（如 "BornPoint"） | 被传送的实体节点路径（如 `new NodePath("FCharacterTest")`) | `res://addons/flowkit/actions/Entity/teleport_to_node.gd` |
| 【Area2D】打印碰撞物体名称 | `print_collision_body_name` | Entity | 打印 Area2D 碰撞物体名称 | `"碰撞类型"` (String): 'body' 或 'area' (默认: `body`) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/area2d/actions/print_collision_body_name.gd` |
| 打印碰撞对象名称 | `printerr_last_collider_name` | Entity, CharacterBody2D | 打印最近碰撞对象名称 | 无 | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/characterbody2d_collision/actions/printerr_last_collider_name.gd` |
| 改变血量 | `change_health` | Entity | 改变当前血量。需要 health Behavior | `"血量变化"` (int) (默认: `0`) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/health/actions/change_health.gd` |
| 被 Monster 碰撞时掉血 | `damage_fcharacter_on_collision` | FCharacter | 检查碰撞物体是否是 Monster，造成伤害 | `"伤害值"` (int) (默认: `20`)<br>`"碰撞类型"` (String): 'body' 或 'area' (默认: `body`) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/area2d/actions/damage_fcharacter_on_collision.gd` |
| 改变动画 | `change_animation` | Entity | 切换实体的动画（需要 animated_sprite2d behavior） | `"动画名"` (String): 动画名称（必须在 SpriteFrames 中存在） | `new NodePath(".")` 或子节点 | `res://addons/flowkit/actions/Entity/change_animation.gd` |
| 设置碰撞启用状态 | `set_collision_enabled` | Entity, CharacterBody2D | 启用或禁用 CharacterBody2D 碰撞检测（需要 characterbody2d_collision behavior） | `"启用"` (bool): true=启用, false=禁用 (默认: `true`) | `new NodePath(".")` 或子节点 | `res://addons/flowkit/behaviors/characterbody2d_collision/actions/set_collision_enabled.gd` |
| 设置标签文本 | `set_label_text` | Label | 设置 Label 节点的文本内容（需要 label behavior） | `"文本"` (String): 文本内容 | 场景中 Label 节点路径（如 `new NodePath("CanvasLayer/Label")`） | `res://addons/flowkit/actions/Entity/set_label_text.gd` |
| 设置标签颜色 | `set_label_color` | Label | 设置 Label 节点的字体颜色（需要 label behavior） | `"颜色"` (Color): 字体颜色 (默认: `Color.WHITE`) | 场景中 Label 节点路径 | `res://addons/flowkit/actions/Entity/set_label_color.gd` |
| 设置标签字体大小 | `set_label_font_size` | Label | 设置 Label 节点的字体大小（需要 label behavior） | `"字体大小"` (int): 字体大小像素值 (默认: `16`, 最小: `1`) | 场景中 Label 节点路径 | `res://addons/flowkit/actions/Entity/set_label_font_size.gd` |
| 模拟按键点击 | `action_press` | System | 模拟按下输入动作 | `"按键名"` (String)<br>`"力度"` (float) | `new NodePath("System")` | `res://addons/flowkit/actions/System/action_press.gd` |
| 模拟按键点击抬起 | `action_release` | System | 模拟释放输入动作 | `"Action"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/action_release.gd` |
| 给数值变量加上一个数值 | `add_to_variable` | System | 给全局变量添加数值 | `"Name"` (String)<br>`"Value"` (float) | `new NodePath("System")` | `res://addons/flowkit/actions/System/add_to_variable.gd` |
| 调用自定义的组合function | `call_function` | System | 调用已定义的函数 | `"Name"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/call_function.gd` |
| 将游戏窗口居中显示在主屏幕上 | `center_window` | System | 窗口居中 | 无 | `new NodePath("System")` | `res://addons/flowkit/actions/System/center_window.gd` |
| 关闭游戏 | `close_game` | System | 关闭游戏 | 无 | `new NodePath("System")` | `res://addons/flowkit/actions/System/close_game.gd` |
| 定义一个Function | `define_function` | System | 定义函数，合并当前事件块所有动作 | `"Name"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/define_function.gd` |
| 加载场景 | `load_scene` | System | 加载场景到指定位置 | `"scene"` (PackedScene)<br>`"position"` (Vector2) | `new NodePath("System")` | `res://addons/flowkit/actions/System/load_scene.gd` |
| Open URL | `open_url` | System | 在浏览器打开 URL | `"URL"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/open_url.gd` |
| Pause Game | `pause_game` | System | 暂停游戏 | 无 | `new NodePath("System")` | `res://addons/flowkit/actions/System/pause_game.gd` |
| 打印日志 | `print` | System | 打印日志到控制台 | `"Message"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/print.gd` |
| 打印错误日志 | `printerr` | System | 打印错误日志到控制台 | `"Message"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/printerr.gd` |
| Reload Scene | `reload_scene` | System | 重新加载当前场景 | 无 | `new NodePath("System")` | `res://addons/flowkit/actions/System/reload_scene.gd` |
| 替换游戏场景 | `replace_game_scene` | System | 替换游戏场景 | `"scene"` (PackedScene)<br>`"position"` (Vector2) | `new NodePath("System")` | `res://addons/flowkit/actions/System/replace_game_scene.gd` |
| Set Audio Bus Mute | `set_audio_bus_mute` | System | 设置音频总线静音 | `"BusName"` (String)<br>`"Muted"` (bool) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_audio_bus_mute.gd` |
| Set Audio Bus Volume | `set_audio_bus_volume` | System | 设置音频总线音量 | `"BusName"` (String)<br>`"VolumeDb"` (float) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_audio_bus_volume.gd` |
| Set Clipboard | `set_clipboard` | System | 设置剪贴板内容 | `"Text"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_clipboard.gd` |
| Set Max FPS | `set_max_fps` | System | 设置最大 FPS | `"MaxFPS"` (int) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_max_fps.gd` |
| Set Mouse Captured | `set_mouse_captured` | System | 捕获/释放鼠标 | `"Captured"` (bool) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_mouse_captured.gd` |
| Set Mouse Cursor | `set_mouse_cursor` | System | 设置自定义鼠标光标 | `"CursorPath"` (String)<br>`"HotspotX"` (int)<br>`"HotspotY"` (int) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_mouse_cursor.gd` |
| Set Mouse Visible | `set_mouse_visible` | System | 显示/隐藏鼠标 | `"Visible"` (bool) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_mouse_visible.gd` |
| Set Time Scale | `set_time_scale` | System | 设置时间缩放 | `"Scale"` (float) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_time_scale.gd` |
| Set Variable | `set_variable` | System | 设置场景变量 | `"Name"` (String)<br>`"Value"` (Variant) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_variable.gd` |
| Set VSync | `set_vsync` | System | 启用/禁用垂直同步 | `"Enabled"` (bool) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_vsync.gd` |
| Set Window Mode | `set_window_mode` | System | 设置窗口模式 | `"Mode"` (String): 'windowed', 'fullscreen', 'borderless', 'minimized', 'maximized' | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_window_mode.gd` |
| Set Window Position | `set_window_position` | System | 设置窗口位置 | `"X"` (int)<br>`"Y"` (int) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_window_position.gd` |
| Set Window Size | `set_window_size` | System | 设置窗口大小 | `"Width"` (int)<br>`"Height"` (int) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_window_size.gd` |
| Set Window Title | `set_window_title` | System | 设置窗口标题 | `"Title"` (String) | `new NodePath("System")` | `res://addons/flowkit/actions/System/set_window_title.gd` |
| Toggle Pause | `toggle_pause` | System | 切换暂停状态 | 无 | `new NodePath("System")` | `res://addons/flowkit/actions/System/toggle_pause.gd` |
| Unpause Game | `unpause_game` | System | 恢复游戏 | 无 | `new NodePath("System")` | `res://addons/flowkit/actions/System/unpause_game.gd` |
| Vibrate | `vibrate` | System | 移动设备震动 | `"DurationMs"` (int) | `new NodePath("System")` | `res://addons/flowkit/actions/System/vibrate.gd` |
| Warp Mouse | `warp_mouse` | System | 移动鼠标到指定位置 | `"X"` (float)<br>`"Y"` (float) | `new NodePath("System")` | `res://addons/flowkit/actions/System/warp_mouse.gd` |
| 发送自定义信号 | `emit_custom_signal` | System | 发送自定义信号（可被 on_custom_signal 事件监听） | `"信号名"` (String): 信号名称<br>`"信号数据"` (Variant, 可选): 信号携带的数据 | `new NodePath("System")` | `res://addons/flowkit/actions/System/emit_custom_signal.gd` |

---

## 行为（Behaviors）

| 行为名称 | ID | 适用节点类型 | 描述 | 参数 | 脚本路径 |
|---------|----|-----------|----|------|---------|
| 2D动画精灵组件 | `animated_sprite2d` | Entity | 管理 AnimatedSprite2D 子节点 | `"sprite_frames"` (Resource) (默认: ``)<br>`"初始动画"` (String) (默认: ``) | `res://addons/flowkit/behaviors/AnimatedSprite2D/AnimatedSprite2D_behavior.gd` |
| Area2D 碰撞区域 | `area2d` | Entity | 管理 Area2D 子节点，自动创建碰撞盒 | `"shape_size_x"` (float) (默认: `32.0`)<br>`"shape_size_y"` (float) (默认: `32.0`)<br>`"collision_layer"` (int) (默认: `1`)<br>`"collision_mask"` (int) (默认: `1`) | `res://addons/flowkit/behaviors/area2d/area2d.gd` |
| 行为树组件 | `behavior_tree` | Entity | 为节点挂载行为树（.tscn） | `"default_tree_scene"` (Resource) (默认: ``) | `res://addons/flowkit/behaviors/behavior_tree/behavior_tree.gd` |
| CharacterBody2D 碰撞 | `characterbody2d_collision` | Entity, CharacterBody2D | 管理 CharacterBody2D 碰撞检测 | `"shape_size_x"` (float) (默认: `32.0`)<br>`"shape_size_y"` (float) (默认: `32.0`)<br>`"collision_layer"` (int) (默认: `1`)<br>`"collision_mask"` (int) (默认: `1`)<br>`"emit_each_physics_frame"` (bool) (默认: `true`) | `res://addons/flowkit/behaviors/characterbody2d_collision/characterbody2d_collision.gd` |
| 死亡特效 | `death_effect` | Entity | 实例化死亡特效场景 | `"effect_scene"` (Resource) (默认: ``)<br>`"offset_x"` (float) (默认: `0.0`)<br>`"offset_y"` (float) (默认: `0.0`) | `res://addons/flowkit/behaviors/death_effect/death_effect.gd` |
| 阵营组件 | `faction` | Entity | 管理节点阵营信息 | `"阵营"` (String): 玩家、敌人、中立 (默认: `中立`) | `res://addons/flowkit/behaviors/faction/faction.gd` |
| 血量组件 | `health` | Entity | 管理节点血量信息 | `"最大血量"` (int) (默认: `100`)<br>`"当前血量"` (int) (默认: `100`)<br>`"碰到敌人伤害冷却时间"` (float) (默认: `5.0`) | `res://addons/flowkit/behaviors/health/health.gd` |
| 血条组件 | `hp_bar` | Entity | 自动挂载血条 UI | `"hp_bar_scene"` (Resource) (默认: ``)<br>`"pos_x"` (float) (默认: `0.0`)<br>`"pos_y"` (float) (默认: `0.0`) | `res://addons/flowkit/behaviors/hp_bar/hp_bar.gd` |
| 信号广播组件 | `signal_broadcaster` | Entity | 管理信号广播组件 | 无 | `res://addons/flowkit/behaviors/signal_broadcaster/signal_broadcaster.gd` |
| 技能盒子组件 | `skill_box` | Entity | 管理技能数据配置 | `"skill_box_scene"` (Resource) (默认: `res://Framework/Component/RoleComponent/SkillBoxComponent.tscn`)<br>`"init_attack_skill_datas"` (Array[Resource]) (默认: `[]`)<br>`"init_skill_datas"` (Array[Resource]) (默认: `[]`)<br>`"init_halo_skill_datas"` (Array[Resource]) (默认: `[]`) | `res://addons/flowkit/behaviors/skill_box/skill_box.gd` |
| 速度组件 | `speed` | Entity | 记录节点速度值 | `"速度"` (float) (默认: `50.0`) | `res://addons/flowkit/behaviors/speed/speed.gd` |
| Label组件 | `label` | Label | 管理 Label 节点的文本、颜色、字体大小等属性 | `"Anchors Preset"` (String): 锚点预设 (默认: `TopLeft`)<br>`"text"` (String): 显示文本<br>`"Position X"` (float) (默认: `0.0`)<br>`"Position Y"` (float) (默认: `0.0`)<br>`"fontColor"` (Color) (默认: `Color.WHITE`)<br>`"fontSize"` (int) (默认: `16`)<br>`"ZIndex"` (int) (默认: `0`) | `res://addons/flowkit/behaviors/label/label.gd` |

---

## 使用说明

### 节点类型说明
- **System**: 用于系统级事件和全局操作，目标节点必须是 `new NodePath("System")`
- **Entity**: 通用实体节点，目标节点通常是 `new NodePath(".")` (当前节点) 或 `new NodePath("子节点名称")`
- **CharacterBody2D**: 继承自 Entity，额外支持物理碰撞相关能力
- **FCharacter**: 游戏特定角色类型，支持 Monster 碰撞伤害等特定逻辑

### 目标节点路径规则
- System 类型：`new NodePath("System")`
- Entity/CharacterBody2D/FCharacter 类型：
  - 当前节点：`new NodePath(".")`
  - 子节点：`new NodePath("Role_flowkit")` 或其他子节点名称

### 参数示例格式（C#）
```csharp
new Godot.Collections.Dictionary {
    { "参数名", 参数值 },
    { "另一参数", 另一值 },
}
```

### 依赖关系
某些事件、条件和动作需要先添加对应的 Behavior：
- `on_area2d_collision` 事件 → 需要 `area2d` Behavior
- `on_characterbody2d_collision` 事件 → 需要 `characterbody2d_collision` Behavior
- `on_health_changed/decreased/increased` 事件 → 需要 `health` Behavior
- `change_health` 动作 → 需要 `health` Behavior
- `compare_health` 条件 → 需要 `health` Behavior
- `compare_faction` 条件 → 需要 `faction` Behavior
- `change_animation` 动作 → 需要 `animated_sprite2d` Behavior
- `set_collision_enabled` 动作 → 需要 `characterbody2d_collision` Behavior
- `set_label_text/set_label_color/set_label_font_size` 动作 → 需要 `label` Behavior
- `on_enemy_count_zero/nonzero/changed` 事件 → 需要场景中存在 "enemy" 组的节点

---