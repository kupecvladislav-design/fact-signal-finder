export const ORIGINAL_REQUIRED = "Для оцінки маніпулятивності потрібен оригінальний матеріал";

// Conservative fallback for older clients; an explicit material selection takes precedence.
export function isNeutralQuestion(content: string): boolean {
  const text = content.trim();
  if (text.includes("\n") || /[«»“”"]/.test(text)) return false;
  return /^(чи\s+(правда|правдиво|дійсно|справді)|це\s+правда|правда\s+що|is\s+it\s+true|is\s+this\s+true)/iu.test(text)
    && !/(терміново|негайно|шок|приховують|поширюй|зрада|!!!)/iu.test(text);
}

export function needsOriginalMaterial(input: { mode: string; content: string; intent?: "material" | "question" }): boolean {
  return input.mode === "text" && (input.intent === "question" || (input.intent !== "material" && isNeutralQuestion(input.content)));
}