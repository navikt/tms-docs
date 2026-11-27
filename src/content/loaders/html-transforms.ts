/** Seksjonsnøkkelen for innhold som ligger før første h2. */
export const TOP_SECTION = "_top";

const H2_OPEN = /<h2\b[^>]*\bid="([^"]*)"[^>]*>/g;
const OL_OPEN = /<ol\b([^>]*)>/;

/**
 * Gir lista de samme attributtene som Starlight sin `<Steps>`-komponent setter,
 * slik at hentet innhold ser likt ut som de lokale sidene.
 * Se `@astrojs/starlight/user-components/rehype-steps.ts`.
 */
function markFirstOrderedList(html: string): string {
  return html.replace(OL_OPEN, (_tag, attrs: string) => {
    // `list-style: none` fjerner listesemantikken i Safari uten role="list".
    let marked = `<ol${attrs} role="list" class="sl-steps"`;
    const start = attrs.match(/\bstart="(\d+)"/);
    if (start) marked += ` style="--sl-steps-start: ${Number(start[1]) - 1}"`;
    return `${marked}>`;
  });
}

/**
 * Viser den første nummererte lista i hver valgte seksjon som steg. Seksjonene
 * oppgis med overskriftens slug (den samme som i lenka til seksjonen), eller
 * `"_top"` for innhold før første h2. Kildefila i det andre repoet er uendret
 * markdown – det er bare visningen her som endres.
 */
export function stepsInSections(html: string, sections: string[]): string {
  if (sections.length === 0) return html;
  const wanted = new Set(sections);

  const headings = [...html.matchAll(H2_OPEN)];
  const bounds = [0, ...headings.map((h) => h.index), html.length];
  const ids = [TOP_SECTION, ...headings.map((h) => h[1])];

  return ids
    .map((id, i) => {
      const section = html.slice(bounds[i], bounds[i + 1]);
      return wanted.has(id) ? markFirstOrderedList(section) : section;
    })
    .join("");
}

/** Antall lister som faktisk ble vist som steg i ferdig rendret html. */
export function countStepsLists(html: string): number {
  let count = 0;
  for (const [, classes] of html.matchAll(/<ol\b[^>]*\bclass="([^"]*)"/g)) {
    // Klassenavn må sammenlignes helt – «sl-steps-noe» er ikke et treff.
    if (classes.split(/\s+/).includes("sl-steps")) count += 1;
  }
  return count;
}
