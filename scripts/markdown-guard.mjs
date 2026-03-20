import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = path.resolve(import.meta.dirname, "..");
const docsRoot = path.join(projectRoot, "docs");
const publicRoot = path.join(docsRoot, ".vuepress", "public");

const loadCreateMarkdown = async () => {
  try {
    const mod = await import("@vuepress/markdown");
    if (typeof mod.createMarkdown === "function") return mod.createMarkdown;
  } catch {
    // ignore
  }

  const pnpmRoot = path.join(projectRoot, "node_modules", ".pnpm");
  try {
    const entries = await fs.readdir(pnpmRoot, { withFileTypes: true });
    const candidateDir = entries.find((e) => e.isDirectory() && e.name.startsWith("@vuepress+markdown@"));
    if (!candidateDir) return null;
    const candidateFile = path.join(
      pnpmRoot,
      candidateDir.name,
      "node_modules",
      "@vuepress",
      "markdown",
      "dist",
      "index.js"
    );
    const mod = await import(pathToFileURL(candidateFile).href);
    if (typeof mod.createMarkdown === "function") return mod.createMarkdown;
    return null;
  } catch {
    return null;
  }
};

const suspiciousChars = [
  { ch: "\ufeff", name: "BOM" },
  { ch: "\u00a0", name: "NBSP" },
  { ch: "\u200b", name: "ZWSP" },
  { ch: "\u200c", name: "ZWNJ" },
  { ch: "\u200d", name: "ZWJ" },
  { ch: "\u2060", name: "WJ" },
  { ch: "\u3000", name: "IDEOGRAPHIC_SPACE" }
];

const imageLinkRe = /!\[[^\]]*\]\(([^)]+)\)/g;

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".temp" || ent.name === ".cache" || ent.name === "dist") continue;
      files.push(...(await walk(full)));
    } else if (ent.isFile()) {
      if (ent.name.endsWith(".md")) files.push(full);
    }
  }
  return files;
};

const normalizeImageUrl = (rawUrl) => {
  const trimmed = rawUrl.trim();
  const isWrapped = trimmed.startsWith("<") && trimmed.endsWith(">");
  const url = isWrapped ? trimmed.slice(1, -1) : (trimmed.split(/\s+/)[0] || "");
  const noQuery = url.split("?")[0].split("#")[0];
  try {
    return decodeURIComponent(noQuery);
  } catch {
    return noQuery;
  }
};

const validateFile = async (filePath, errors, markdownRenderer) => {
  const buf = await fs.readFile(filePath);
  if (buf.includes(13)) {
    errors.push({ filePath, line: 1, rule: "line-endings", message: "Found CR (\\r) characters" });
  }

  const content = buf.toString("utf8");
  const lines = content.split("\n");

  const containerStack = [];
  const detailsStack = [];

  for (let i = 0; i < lines.length; i += 1) {
    const lineNo = i + 1;
    const line = lines[i];

    for (const item of suspiciousChars) {
      if (line.includes(item.ch)) {
        errors.push({ filePath, line: lineNo, rule: "invisible-chars", message: `Found ${item.name}` });
      }
    }

    if (line.endsWith(" ")) {
      const m = line.match(/( +)$/);
      const count = m ? m[1].length : 0;
      if (count !== 2) {
        errors.push({ filePath, line: lineNo, rule: "trailing-spaces", message: "Trailing spaces" });
      }
    }

    if (line.includes("\t")) {
      errors.push({ filePath, line: lineNo, rule: "tabs", message: "Tab character found" });
    }

    const trimmed = line.trim();
    if (trimmed.startsWith("::::")) {
      errors.push({ filePath, line: lineNo, rule: "containers", message: "Container fence should use exactly 3 colons (:::)" });
    }

    if (trimmed.startsWith(":::")) {
      if (trimmed === ":::") {
        if (containerStack.length === 0) {
          errors.push({ filePath, line: lineNo, rule: "containers", message: "Unmatched container closing :::" });
        } else {
          containerStack.pop();
        }
      } else {
        containerStack.push({ line: lineNo, fence: trimmed });
      }
    }

    if (line.includes("<details")) {
      detailsStack.push({ line: lineNo });
    }
    if (line.includes("</details>")) {
      if (detailsStack.length === 0) {
        errors.push({ filePath, line: lineNo, rule: "details", message: "Unmatched </details>" });
      } else {
        detailsStack.pop();
      }
    }
  }

  for (const unclosed of containerStack) {
    errors.push({ filePath, line: unclosed.line, rule: "containers", message: `Unclosed container: ${unclosed.fence}` });
  }
  for (const unclosed of detailsStack) {
    errors.push({ filePath, line: unclosed.line, rule: "details", message: "Unclosed <details>" });
  }

  imageLinkRe.lastIndex = 0;
  for (const match of content.matchAll(imageLinkRe)) {
    const raw = match[1] ?? "";
    const urlForRules = raw.trim();
    const wrapped = urlForRules.startsWith("<") && urlForRules.endsWith(">");
    const url = normalizeImageUrl(raw);

    if (!wrapped && url.includes(" ")) {
      errors.push({ filePath, line: 1, rule: "images", message: `Image URL contains spaces: ${url}` });
      continue;
    }
    if (url.includes("\\")) {
      errors.push({ filePath, line: 1, rule: "images", message: `Image URL contains backslashes: ${url}` });
      continue;
    }
    if (!url || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) {
      continue;
    }

    const candidate = url.startsWith("/")
      ? path.join(publicRoot, url)
      : path.resolve(path.dirname(filePath), url);

    try {
      await fs.access(candidate);
    } catch {
      errors.push({ filePath, line: 1, rule: "images", message: `Image file not found: ${url}` });
    }
  }

  if (markdownRenderer) {
    try {
      markdownRenderer.render(content, { filePath });
    } catch (e) {
      errors.push({ filePath, line: 1, rule: "markdown-it", message: `Render failed: ${e instanceof Error ? e.message : String(e)}` });
    }
  }
};

const main = async () => {
  const createMarkdown = await loadCreateMarkdown();
  const markdownRenderer = createMarkdown ? createMarkdown() : null;
  const files = (await walk(docsRoot)).filter((filePath) => filePath.split(path.sep).includes("refrences"));
  const errors = [];
  for (const filePath of files) {
    await validateFile(filePath, errors, markdownRenderer);
  }

  if (errors.length === 0) {
    process.stdout.write(`markdown-guard: OK (${files.length} files)\n`);
    return;
  }

  for (const err of errors) {
    process.stderr.write(`${path.relative(projectRoot, err.filePath)}:${err.line} [${err.rule}] ${err.message}\n`);
  }
  process.stderr.write(`markdown-guard: FAILED (${errors.length} issues)\n`);
  process.exitCode = 1;
};

await main();
