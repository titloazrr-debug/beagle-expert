import { parse as parseYaml } from "yaml";

/**
 * Parse frontmatter YAML entre --- sans gray-matter (évite le chunk esprima cassé en dev).
 */
export function parseFrontmatter<T = Record<string, unknown>>(
  raw: string
): { data: T; content: string } {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    return { data: {} as T, content: text };
  }

  const afterOpen = text.slice(3); // after opening ---
  // skip optional newline after opening ---
  const bodyStart =
    afterOpen.startsWith("\n") || afterOpen.startsWith("\r\n")
      ? afterOpen.replace(/^\r?\n/, "")
      : afterOpen;

  const closeMatch = bodyStart.match(/\r?\n---\r?\n/);
  if (!closeMatch || closeMatch.index === undefined) {
    // closing fence optional at EOF
    const alt = bodyStart.match(/\r?\n---\s*$/);
    if (!alt || alt.index === undefined) {
      return { data: {} as T, content: text };
    }
    const yamlBlock = bodyStart.slice(0, alt.index);
    const data = parseYaml(yamlBlock) as T;
    return { data: data ?? ({} as T), content: "" };
  }

  const yamlBlock = bodyStart.slice(0, closeMatch.index);
  const content = bodyStart.slice(closeMatch.index + closeMatch[0].length);
  const data = parseYaml(yamlBlock) as T;
  return { data: data ?? ({} as T), content };
}
