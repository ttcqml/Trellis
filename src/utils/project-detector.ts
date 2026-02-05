import fs from "node:fs";
import path from "node:path";

/**
 * Project type detected by analyzing project files
 * For Godot game development workflow
 */
export type ProjectType = "godot" | "unknown";

/**
 * Files that indicate a Godot project
 */
const GODOT_INDICATORS = [
  // Godot project file
  "project.godot",
  // Common Godot directories
  "addons/",
  // Source directories
  "Game_flowkit/",
  "Framework/",
  // FlowKit addon
  "addons/flowkit/",
  // Beehave addon
  "addons/beehave/",
];

/**
 * File extensions that indicate a Godot project
 */
const GODOT_EXTENSIONS = [".gd", ".tscn", ".tres"];

/**
 * Check if a file or directory exists in the project directory
 */
function pathExists(cwd: string, filename: string): boolean {
  const fullPath = path.join(cwd, filename);
  return fs.existsSync(fullPath);
}

/**
 * Check if directory contains files with Godot extensions
 */
function hasGodotFiles(cwd: string): boolean {
  try {
    const files = fs.readdirSync(cwd, { recursive: true }) as string[];
    return files.some((file) =>
      GODOT_EXTENSIONS.some((ext) => file.endsWith(ext)),
    );
  } catch {
    return false;
  }
}

/**
 * Detect project type by analyzing project files
 *
 * @param cwd - Current working directory to analyze
 * @returns Detected project type
 */
export function detectProjectType(cwd: string): ProjectType {
  // Check for Godot project indicators
  const hasGodotIndicators = GODOT_INDICATORS.some((f) => pathExists(cwd, f));

  // Check for Godot file extensions
  const hasGodotExtensions = hasGodotFiles(cwd);

  if (hasGodotIndicators || hasGodotExtensions) {
    return "godot";
  }

  return "unknown";
}

/**
 * Get human-readable description of project type
 */
export function getProjectTypeDescription(type: ProjectType): string {
  switch (type) {
    case "godot":
      return "Godot project (game development)";
    case "unknown":
      return "Unknown project type (defaults to Godot)";
  }
}
