# Finish Work - Pre-Commit Checklist

Before submitting or committing, use this checklist to ensure work completeness.

**Timing**: After code is written and tested, before commit

---

## Checklist

### 1. Scene Validation

```bash
# Verify scene files are valid
# Check for any parse errors in .tscn files
git diff --name-only | grep "\.tscn$"
```

- [ ] All .tscn files parse correctly?
- [ ] No missing resource references?
- [ ] No broken node paths?

### 2. Entity Completeness

For each entity created/modified:

- [ ] Required behaviors are added?
  - health, faction for combatants
  - collision behavior for physics
  - animated_sprite2d for visuals
- [ ] Collision layers are correct?
- [ ] FlowKit events are configured (if needed)?

### 3. FlowKit Events

For each FlowKit event block:

- [ ] Event target matches capability (Entity vs System)?
- [ ] Required behaviors exist for the event?
- [ ] Conditions use correct parameters?
- [ ] Actions are in correct order?

### 4. Behavior Tree Validation

For each behavior tree:

- [ ] All condition scripts exist?
- [ ] All action scripts exist?
- [ ] Blackboard keys are consistent?
- [ ] Tree structure follows patterns (die > attack > move)?

### 5. Documentation Sync

**Structure Docs**:
- [ ] Does `.trellis/spec/entity/` need updates?
  - New entity patterns, new behaviors
- [ ] Does `.trellis/spec/scene/` need updates?
  - New scene types, new composition patterns
- [ ] Does `.trellis/spec/skill/` need updates?
  - New skill types, new events
- [ ] Does `.trellis/spec/ai/` need updates?
  - New AI patterns, new conditions/actions
- [ ] Does `.trellis/spec/guides/` need updates?
  - New cross-system flows, lessons from bugs

**Key Question**:
> "If I fixed a bug or discovered something non-obvious, should I document it so future me (or others) won't hit the same issue?"

If YES -> Update the relevant spec doc.

### 6. Cross-System Verification

If the change spans multiple systems:

- [ ] Entity behaviors match FlowKit event requirements?
- [ ] Beehave conditions/actions match entity structure?
- [ ] Skill data matches entity skill_box configuration?
- [ ] Scene entity instances are properly configured?

### 7. Manual Testing

- [ ] Scene runs in Godot editor?
- [ ] Entities behave as expected?
- [ ] FlowKit events trigger correctly?
- [ ] AI behaviors work properly?

---

## Quick Check Flow

```bash
# 1. View changes
git status
git diff --name-only

# 2. Check scene files
git diff --name-only | grep "\.tscn$"

# 3. Based on changed files, check relevant items above
```

---

## Common Oversights

| Oversight | Consequence | Check |
|-----------|-------------|-------|
| Structure docs not updated | Others don't know the change | Check .trellis/spec/ |
| Missing behavior | FlowKit events don't trigger | Check entity behaviors |
| Wrong collision layer | Entities don't interact | Check collision config |
| Blackboard key mismatch | AI doesn't work | Check condition/action pairs |
| Wrong event target | Events never fire | Check Entity vs System |

---

## Relationship to Other Commands

```
Development Flow:
  Write code -> Test in Godot -> /trellis:finish-work -> git commit -> /trellis:record-session
                                      |                              |
                               Ensure completeness              Record progress

Debug Flow:
  Hit bug -> Fix -> /trellis:break-loop -> Knowledge capture
                       |
                  Deep analysis
```

- `/trellis:finish-work` - Check work completeness (this command)
- `/trellis:record-session` - Record session and commits
- `/trellis:break-loop` - Deep analysis after debugging

---

## Core Principle

> **Delivery includes not just code, but also documentation, verification, and knowledge capture.**

Complete work = Scenes + Behaviors + Events + Tests + Docs
