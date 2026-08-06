export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface TocItem extends TocHeading {
  children: TocItem[];
}

/**
 * Bygger Starlight sitt nestede toc-tre fra flate markdown-headings.
 * Starlight eksponerer ingen offentlig hjelper for dette.
 */
export function buildToc(
  headings: TocHeading[],
  minLevel = 2,
  maxLevel = 3,
): TocItem[] {
  const items: TocItem[] = [];
  const stack: TocItem[] = [];
  for (const heading of headings) {
    if (heading.depth < minLevel || heading.depth > maxLevel) continue;
    const item: TocItem = { ...heading, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }
    (stack.length > 0 ? stack[stack.length - 1].children : items).push(item);
    stack.push(item);
  }
  return items;
}
