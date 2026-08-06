const FENCE = /^(```|~~~)/;

/** Kjør en linjebasert transform, men hopp over innhold i kodeblokker. */
function outsideFences(
  markdown: string,
  transform: (lines: string[]) => string[],
): string {
  const lines = markdown.split(/\r?\n/);
  const out: string[] = [];
  let chunk: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (FENCE.test(line)) {
      if (!inFence) {
        out.push(...transform(chunk));
        chunk = [];
      }
      inFence = !inFence;
      out.push(line);
      continue;
    }
    (inFence ? out : chunk).push(line);
  }
  out.push(...transform(chunk));
  return out.join("\n");
}

/** Kildedokumentets h1 erstattes av sidetittelen i frontmatter. */
export function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*# .*\r?\n+/, "");
}

const ALERT_TYPES: Record<string, string> = {
  NOTE: "note",
  TIP: "tip",
  IMPORTANT: "tip",
  WARNING: "caution",
  CAUTION: "danger",
};

/**
 * Konverterer GitHubs alert-syntaks (`> [!NOTE]`) til Starlight-direktiver,
 * slik at kildedokumenter rendres som native callouts både på GitHub og her.
 */
export function githubAlertsToDirectives(markdown: string): string {
  return outsideFences(markdown, (lines) => {
    const out: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const match = lines[i].match(
        /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/,
      );
      if (!match) {
        out.push(lines[i]);
        i += 1;
        continue;
      }
      const content: string[] = [];
      i += 1;
      while (i < lines.length && /^>( |$)/.test(lines[i])) {
        content.push(lines[i].replace(/^> ?/, ""));
        i += 1;
      }
      out.push(`:::${ALERT_TYPES[match[1]]}`, ...content, ":::");
    }
    return out;
  });
}

const MARKDOWN_LINK = /(!?)\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g;
const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

/**
 * Skriver om relative lenker og bildestier i hentede dokumenter til absolutte
 * URL-er mot kilderepoet: lenker til lesbar blob-visning, bilder til råinnhold.
 */
export function absolutizeUrls(
  markdown: string,
  { blobBase, rawBase }: { blobBase: string; rawBase: string },
): string {
  return outsideFences(markdown, (lines) =>
    lines.map((line) =>
      line.replace(MARKDOWN_LINK, (full, bang, text, url, rest) => {
        if (ABSOLUTE_URL.test(url)) return full;
        const base = bang ? rawBase : blobBase;
        const path = url.replace(/^\.\//, "").replace(/^\//, "");
        return `${bang}[${text}](${base}/${path}${rest})`;
      }),
    ),
  );
}
