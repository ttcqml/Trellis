/**
 * Claude Code templates
 *
 * These are GENERIC templates for user projects.
 * Do NOT use Trellis project's own .claude/ directory (which may be customized).
 *
 * Directory structure:
 *   claude/
 *   ├── commands/       # Slash commands
 *   ├── agents/         # Multi-agent pipeline agents
 *   ├── hooks/          # Context injection hooks
 *   └── settings.json   # Settings configuration
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readTemplate(relativePath: string): string {
  return readFileSync(join(__dirname, relativePath), "utf-8");
}

function listFiles(dir: string): string[] {
  try {
    return readdirSync(join(__dirname, dir));
  } catch {
    return [];
  }
}

// Settings
export const settingsTemplate = readTemplate("settings.json");

/**
 * Command template with name and content
 */
export interface CommandTemplate {
  name: string;
  content: string;
}

/**
 * Agent template with name and content
 */
export interface AgentTemplate {
  name: string;
  content: string;
}

/**
 * Hook template with target path and content
 */
export interface HookTemplate {
  targetPath: string;
  content: string;
}

/**
 * Get all command templates
 * Commands are stored in commands/trellis/ subdirectory
 * This creates commands like /trellis:start, /trellis:finish-work, etc.
 */
export function getAllCommands(): CommandTemplate[] {
  const commands: CommandTemplate[] = [];
  const files = listFiles("commands/trellis");

  for (const file of files) {
    if (file.endsWith(".md")) {
      const name = file.replace(".md", "");
      const content = readTemplate(`commands/trellis/${file}`);
      commands.push({ name, content });
    }
  }

  return commands;
}

/**
 * Get all agent templates
 */
export function getAllAgents(): AgentTemplate[] {
  const agents: AgentTemplate[] = [];
  const files = listFiles("agents");

  for (const file of files) {
    if (file.endsWith(".md")) {
      const name = file.replace(".md", "");
      const content = readTemplate(`agents/${file}`);
      agents.push({ name, content });
    }
  }

  return agents;
}

/**
 * Get all hook templates
 */
export function getAllHooks(): HookTemplate[] {
  const hooks: HookTemplate[] = [];
  const files = listFiles("hooks");

  for (const file of files) {
    const content = readTemplate(`hooks/${file}`);
    hooks.push({ targetPath: `hooks/${file}`, content });
  }

  return hooks;
}

/**
 * Get settings template
 */
export function getSettingsTemplate(): HookTemplate {
  return {
    targetPath: "settings.json",
    content: settingsTemplate,
  };
}

/**
 * Skill template with skill name, relative path and content
 */
export interface SkillTemplate {
  skillName: string; // e.g. "godot-game-builder"
  relativePath: string; // e.g. "godot-game-builder/SKILL.md"
  content: string;
}

/**
 * Recursively collect all files under a directory, returning paths relative to baseDir
 */
function collectFilesRecursive(
  dir: string,
  baseDir: string,
): { relativePath: string; fullPath: string }[] {
  const results: { relativePath: string; fullPath: string }[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...collectFilesRecursive(fullPath, baseDir));
      } else {
        const relativePath = fullPath
          .slice(baseDir.length + 1)
          .replace(/\\/g, "/");
        results.push({ relativePath, fullPath });
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return results;
}

/**
 * Get all skill templates
 * Skills are stored in skills/ subdirectory, each skill in its own folder
 */
export function getAllSkills(): SkillTemplate[] {
  const skills: SkillTemplate[] = [];
  const skillsDir = join(__dirname, "skills");

  try {
    const skillDirs = readdirSync(skillsDir);
    for (const skillName of skillDirs) {
      const skillDir = join(skillsDir, skillName);
      const stat = statSync(skillDir);
      if (!stat.isDirectory()) continue;

      const files = collectFilesRecursive(skillDir, skillsDir);
      for (const file of files) {
        const content = readFileSync(file.fullPath, "utf-8");
        skills.push({
          skillName,
          relativePath: file.relativePath,
          content,
        });
      }
    }
  } catch {
    // skills directory doesn't exist
  }

  return skills;
}
