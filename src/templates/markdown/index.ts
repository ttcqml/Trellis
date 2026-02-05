/**
 * Markdown templates for Trellis workflow
 *
 * These are GENERIC templates for new Godot projects.
 * Structure templates use .md.txt extension as they are generic templates.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Read a template file from src/templates/markdown/
 */
function readLocalTemplate(filename: string): string {
  const filePath = join(__dirname, filename);
  return readFileSync(filePath, "utf-8");
}

// =============================================================================
// Root files for new projects
// =============================================================================

export const agentsMdContent: string = readLocalTemplate("agents.md");

// Workspace index template (developer work records)
export const workspaceIndexContent: string =
  readLocalTemplate("workspace-index.md");

// Backwards compatibility alias
export const agentProgressIndexContent = workspaceIndexContent;

// Gitignore (template file - .gitignore is ignored by npm)
export const workflowGitignoreContent: string =
  readLocalTemplate("gitignore.txt");

// =============================================================================
// Structure templates (generic templates from .txt files)
// These are NOT dogfooded - they are generic templates for new projects
// =============================================================================

// Entity structure
export const entityIndexContent: string = readLocalTemplate(
  "spec/entity/index.md.txt",
);

// Scene structure
export const sceneIndexContent: string = readLocalTemplate(
  "spec/scene/index.md.txt",
);

// Skill structure
export const skillIndexContent: string = readLocalTemplate(
  "spec/skill/index.md.txt",
);

// AI structure
export const aiIndexContent: string = readLocalTemplate(
  "spec/ai/index.md.txt",
);

// FlowKit structure
export const flowkitIndexContent: string = readLocalTemplate(
  "spec/flowkit/index.md.txt",
);

// Guides structure
export const guidesIndexContent: string = readLocalTemplate(
  "spec/guides/index.md.txt",
);
export const guidesCrossSystemThinkingGuideContent: string = readLocalTemplate(
  "spec/guides/cross-system-thinking-guide.md.txt",
);
export const guidesCodeReuseThinkingGuideContent: string = readLocalTemplate(
  "spec/guides/code-reuse-thinking-guide.md.txt",
);
