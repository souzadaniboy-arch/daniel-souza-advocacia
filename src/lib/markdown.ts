function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return out;
}

/**
 * Renderizador Markdown leve e seguro (sem HTML bruto).
 * Suporta: # h1, ## h2, ### h3, **negrito**, *itálico*,
 * listas ordenadas/não ordenadas, citações >, links e parágrafos.
 */
export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      html.push(`<${listType}><li>${list.map((item) => inline(item)).join("</li><li>")}</li></${listType}>`);
      list = [];
      listType = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      html.push(`<h1>${inline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      html.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      list.push(line.replace(/^\d+\.\s/, ""));
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      list.push(line.replace(/^[-*]\s/, ""));
      continue;
    }
    if (line === "---") {
      flushParagraph();
      flushList();
      html.push("<hr />");
      continue;
    }

    if (listType) {
      flushList();
    }
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return html.join("\n");
}
