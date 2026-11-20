/** Vrai si un id, un nom ou un titre met en avant Tractive (pas de carte ni de bouton). */
export function mentionsTractive(
  ...parts: Array<string | null | undefined>
): boolean {
  return parts.some((part) => (part ?? "").toLowerCase().includes("tractive"));
}
