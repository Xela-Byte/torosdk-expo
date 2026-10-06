/**
 * Best-effort TypeScript → JavaScript strip.
 * Removes: type imports, interface/type declarations,
 * inline type annotations, generics.
 */
export function tsToJs(ts: string): string {
  return ts
    // Remove "import type" lines
    .replace(/^import type .+;?\n?/gm, '')
    // Remove ": Type" annotations on function params / vars (basic)
    .replace(/:\s*(string|number|boolean|void|any|null|undefined|never|object|ReactNode|React\.FC|React\.ReactNode|Error|Promise<[^>]*>|[A-Z][A-Za-z<>, |[\]]*)\b/g, '')
    // Remove generic type params: <Type>, <Type, Type>
    .replace(/<([A-Z][A-Za-z]*)(,\s*[A-Z][A-Za-z]*)*>/g, '')
    // Remove interface declarations
    .replace(/^(export\s+)?interface\s+\w+\s*\{[^}]*\}/gm, '')
    // Remove type declarations
    .replace(/^(export\s+)?type\s+\w+\s*=.+;?\n?/gm, '')
    // Remove TypeScript "as Type" assertions
    .replace(/\s+as\s+[A-Z][A-Za-z<>, [\]]+/g, '')
    // Clean up leftover blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
