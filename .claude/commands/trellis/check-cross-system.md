Check cross-system consistency after making changes that span multiple systems.

Execute these steps:
1. Run `git status` to see all modified files
2. Identify which systems are involved:
   - Entity (.tscn in Entity/)
   - Scene (.tscn in Scenes/)
   - FlowKit (event sheets, behaviors)
   - AI (behavior trees, Beehave nodes)
   - Skills (SkillData resources)

3. For each system boundary, verify:

   **Entity ↔ FlowKit**:
   - Required behaviors are added before events use them
   - Event targets match behavior capabilities (Entity vs System)
   - Condition parameters match behavior configuration

   **Entity ↔ AI**:
   - Beehave tree is attached via behavior_tree behavior
   - Blackboard keys are consistent across conditions and actions
   - AI conditions/actions match entity structure

   **Entity ↔ Skill**:
   - skill_box behavior is added with correct skill data
   - SkillData resources exist and are valid
   - Skill events match entity animation names

   **Scene ↔ Entity**:
   - Entity scenes exist before being instanced
   - Entity behaviors are compatible with scene requirements
   - Collision layers are compatible between entities

4. Read `.trellis/spec/guides/cross-system-thinking-guide.md` for common issues

5. Report any inconsistencies and fix them
