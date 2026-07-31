import { describe, expect, it } from "vitest";
import { buildToc } from "./toc";

const h = (depth: number, slug: string) => ({ depth, slug, text: slug });

describe("buildToc", () => {
  it("nester h3 under nærmeste h2", () => {
    const toc = buildToc([h(2, "a"), h(3, "a1"), h(3, "a2"), h(2, "b")]);
    expect(toc.map((i) => i.slug)).toEqual(["a", "b"]);
    expect(toc[0].children.map((i) => i.slug)).toEqual(["a1", "a2"]);
    expect(toc[1].children).toEqual([]);
  });

  it("filtrerer utenfor min/max-nivå", () => {
    const toc = buildToc([h(1, "tittel"), h(2, "a"), h(4, "dypt")]);
    expect(toc.map((i) => i.slug)).toEqual(["a"]);
  });

  it("takler h3 uten forelder", () => {
    const toc = buildToc([h(3, "foreldreløs"), h(2, "a")]);
    expect(toc.map((i) => i.slug)).toEqual(["foreldreløs", "a"]);
  });

  it("tom input gir tom liste", () => {
    expect(buildToc([])).toEqual([]);
  });
});
