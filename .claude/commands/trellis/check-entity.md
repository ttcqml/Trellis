Check if the entity you just created follows the development guidelines.

Execute these steps:
1. Run `git status` to see modified files
2. Read `.trellis/spec/entity/index.md` to understand which guidelines apply
3. Based on what you changed, read the relevant guideline files:
   - Entity structure → `.trellis/spec/entity/directory-structure.md`
   - Role usage → `.trellis/spec/entity/role-guidelines.md`
   - Components → `.trellis/spec/entity/component-guidelines.md`
   - Behaviors → `.trellis/spec/entity/behavior-guidelines.md`
   - FlowKit patterns → `.trellis/spec/entity/flowkit-entity-patterns.md`
   - Collision setup → `.trellis/spec/entity/collision-guidelines.md`
   - Quality → `.trellis/spec/entity/quality-guidelines.md`
4. Review your entity against the guidelines:
   - Required behaviors are added (health, faction, etc.)
   - Collision layers are correct
   - FlowKit events are properly configured
   - Scene structure follows conventions
5. Report any violations and fix them if found
