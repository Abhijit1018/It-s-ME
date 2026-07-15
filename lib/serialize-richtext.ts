type LexicalNode = {
  type: string;
  text?: string;
  format?: number;
  tag?: string;
  children?: LexicalNode[];
  url?: string;
  listType?: string;
  value?: number;
};

function serializeNode(node: LexicalNode): string {
  if (node.type === "text" && node.text) {
    let t = node.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    if (node.format) {
      if (node.format & 1) t = `<strong>${t}</strong>`;
      if (node.format & 2) t = `<em>${t}</em>`;
      if (node.format & 8) t = `<code>${t}</code>`;
    }
    return t;
  }

  const inner = node.children?.map(serializeNode).join("") ?? "";

  switch (node.type) {
    case "paragraph": return `<p>${inner}</p>`;
    case "heading": return `<${node.tag ?? "h2"}>${inner}</${node.tag ?? "h2"}>`;
    case "link": return `<a href="${node.url ?? ""}">${inner}</a>`;
    case "list": return node.listType === "number" ? `<ol>${inner}</ol>` : `<ul>${inner}</ul>`;
    case "listitem": return `<li>${inner}</li>`;
    case "quote": return `<blockquote>${inner}</blockquote>`;
    case "horizontalrule": return "<hr />";
    default: return inner;
  }
}

export function lexicalToHtml(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const root = (content as { root?: LexicalNode }).root;
  if (!root?.children) return "";
  return root.children.map(serializeNode).join("");
}

function textOf(node: LexicalNode): string {
  if (node.type === "text") return node.text ?? "";
  return node.children?.map(textOf).join("") ?? "";
}

export function lexicalToParagraphs(content: unknown): string[] {
  if (!content || typeof content !== "object") return [];
  const root = (content as { root?: LexicalNode }).root;
  if (!root?.children) return [];
  return root.children.map(textOf).filter(Boolean);
}
