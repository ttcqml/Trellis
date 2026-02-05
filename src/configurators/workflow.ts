import path from "node:path";

import { DIR_NAMES, PATHS } from "../constants/paths.js";
import { copyTrellisDir } from "../templates/extract.js";

// Import trellis templates (generic, not project-specific)
import {
  workflowMdTemplate,
  worktreeYamlTemplate,
  gitignoreTemplate,
} from "../templates/trellis/index.js";

// Import markdown templates
import {
  agentProgressIndexContent,
  // Entity structure
  entityIndexContent,
  // Scene structure
  sceneIndexContent,
  // Skill structure
  skillIndexContent,
  // AI structure
  aiIndexContent,
  // FlowKit structure
  flowkitIndexContent,
  // Guides structure
  guidesIndexContent,
  guidesCrossSystemThinkingGuideContent,
  guidesCodeReuseThinkingGuideContent,
} from "../templates/markdown/index.js";

import { writeFile, ensureDir } from "../utils/file-writer.js";
import type { ProjectType } from "../utils/project-detector.js";

interface DocDefinition {
  name: string;
  content: string;
}

/**
 * Options for creating workflow structure
 */
export interface WorkflowOptions {
  /** Detected or specified project type */
  projectType: ProjectType;
  /** Enable multi-agent pipeline with worktree support */
  multiAgent?: boolean;
}

/**
 * Create workflow structure based on project type
 *
 * This function creates the .trellis/ directory structure by:
 * 1. Copying scripts/ directory directly (dogfooding)
 * 2. Copying workflow.md and .gitignore (dogfooding)
 * 3. Creating workspace/ with index.md
 * 4. Creating tasks/ directory
 * 5. Creating spec/ with templates (not dogfooded - generic templates)
 * 6. Copying worktree.yaml if multi-agent is enabled
 *
 * @param cwd - Current working directory
 * @param options - Workflow options including project type
 */
export async function createWorkflowStructure(
  cwd: string,
  options?: WorkflowOptions,
): Promise<void> {
  const multiAgent = options?.multiAgent ?? false;

  // Create base .trellis directory
  ensureDir(path.join(cwd, DIR_NAMES.WORKFLOW));

  // Copy scripts/ directory from templates
  await copyTrellisDir("scripts", path.join(cwd, PATHS.SCRIPTS), {
    executable: true,
  });

  // Copy workflow.md from templates
  await writeFile(
    path.join(cwd, PATHS.WORKFLOW_GUIDE_FILE),
    workflowMdTemplate,
  );

  // Copy .gitignore from templates
  await writeFile(
    path.join(cwd, DIR_NAMES.WORKFLOW, ".gitignore"),
    gitignoreTemplate,
  );

  // Create workspace/ with index.md
  ensureDir(path.join(cwd, PATHS.WORKSPACE));
  await writeFile(
    path.join(cwd, PATHS.WORKSPACE, "index.md"),
    agentProgressIndexContent,
  );

  // Create tasks/ directory
  ensureDir(path.join(cwd, PATHS.TASKS));

  // Copy worktree.yaml if multi-agent enabled
  if (multiAgent) {
    await writeFile(
      path.join(cwd, DIR_NAMES.WORKFLOW, "worktree.yaml"),
      worktreeYamlTemplate,
    );
  }

  // Create spec templates for Godot development
  // These are NOT dogfooded - they are generic templates for new projects
  await createSpecTemplates(cwd);
}

async function createSpecTemplates(cwd: string): Promise<void> {
  // Ensure spec directory exists
  ensureDir(path.join(cwd, PATHS.SPEC));

  // Entity spec
  ensureDir(path.join(cwd, `${PATHS.SPEC}/entity`));
  await writeFile(
    path.join(cwd, `${PATHS.SPEC}/entity`, "index.md"),
    entityIndexContent,
  );

  // Scene spec
  ensureDir(path.join(cwd, `${PATHS.SPEC}/scene`));
  await writeFile(
    path.join(cwd, `${PATHS.SPEC}/scene`, "index.md"),
    sceneIndexContent,
  );

  // Skill spec
  ensureDir(path.join(cwd, `${PATHS.SPEC}/skill`));
  await writeFile(
    path.join(cwd, `${PATHS.SPEC}/skill`, "index.md"),
    skillIndexContent,
  );

  // AI spec
  ensureDir(path.join(cwd, `${PATHS.SPEC}/ai`));
  await writeFile(
    path.join(cwd, `${PATHS.SPEC}/ai`, "index.md"),
    aiIndexContent,
  );

  // FlowKit spec
  ensureDir(path.join(cwd, `${PATHS.SPEC}/flowkit`));
  await writeFile(
    path.join(cwd, `${PATHS.SPEC}/flowkit`, "index.md"),
    flowkitIndexContent,
  );

  // Guides - always created
  ensureDir(path.join(cwd, `${PATHS.SPEC}/guides`));
  const guidesDocs: DocDefinition[] = [
    { name: "index.md", content: guidesIndexContent },
    {
      name: "cross-system-thinking-guide.md",
      content: guidesCrossSystemThinkingGuideContent,
    },
    {
      name: "code-reuse-thinking-guide.md",
      content: guidesCodeReuseThinkingGuideContent,
    },
  ];

  for (const doc of guidesDocs) {
    await writeFile(
      path.join(cwd, `${PATHS.SPEC}/guides`, doc.name),
      doc.content,
    );
  }
}
