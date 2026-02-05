Check if the scene you just created follows the development guidelines.

Execute these steps:
1. Run `git status` to see modified files
2. Read `.trellis/spec/scene/index.md` to understand which guidelines apply
3. Based on what you changed, read the relevant guideline files:
   - Scene structure → `.trellis/spec/scene/directory-structure.md`
   - Level design → `.trellis/spec/scene/level-guidelines.md`
   - UI design → `.trellis/spec/scene/ui-guidelines.md`
   - Entity composition → `.trellis/spec/scene/entity-composition.md`
   - FlowKit patterns → `.trellis/spec/scene/flowkit-scene-patterns.md`
   - Quality → `.trellis/spec/scene/quality-guidelines.md`
4. Review your scene against the guidelines:
   - System node is present for FlowKit events
   - Entity instances are properly configured
   - Scene organization follows conventions
   - FlowKit event sheet is saved
5. Report any violations and fix them if found
