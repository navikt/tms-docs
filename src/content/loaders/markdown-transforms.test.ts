import { describe, expect, it } from "vitest";
import {
  absolutizeUrls,
  githubAlertsToDirectives,
  stripLeadingH1,
} from "./markdown-transforms";

describe("stripLeadingH1", () => {
  it("fjerner en ledende h1", () => {
    expect(stripLeadingH1("# Tittel\n\nBrødtekst")).toBe("Brødtekst");
  });

  it("beholder h1 senere i dokumentet", () => {
    expect(stripLeadingH1("Intro\n\n# Ikke først")).toBe("Intro\n\n# Ikke først");
  });

  it("tåler innledende blanke linjer", () => {
    expect(stripLeadingH1("\n\n# Tittel\nTekst")).toBe("Tekst");
  });

  it("rører ikke h2", () => {
    expect(stripLeadingH1("## Under\nTekst")).toBe("## Under\nTekst");
  });
});

describe("githubAlertsToDirectives", () => {
  it("konverterer NOTE til note-direktiv", () => {
    const input = "> [!NOTE]\n> Viktig info\n> over to linjer\n\nEtterpå";
    expect(githubAlertsToDirectives(input)).toBe(
      ":::note\nViktig info\nover to linjer\n:::\n\nEtterpå",
    );
  });

  it("mapper alle fem typene", () => {
    for (const [gh, sl] of [
      ["NOTE", "note"],
      ["TIP", "tip"],
      ["IMPORTANT", "tip"],
      ["WARNING", "caution"],
      ["CAUTION", "danger"],
    ]) {
      expect(githubAlertsToDirectives(`> [!${gh}]\n> x`)).toBe(`:::${sl}\nx\n:::`);
    }
  });

  it("lar vanlige blockquotes være i fred", () => {
    const input = "> bare et sitat\n> to linjer";
    expect(githubAlertsToDirectives(input)).toBe(input);
  });

  it("rører ikke alerts inne i kodeblokker", () => {
    const input = "```md\n> [!NOTE]\n> eksempel\n```";
    expect(githubAlertsToDirectives(input)).toBe(input);
  });
});

describe("absolutizeUrls", () => {
  const opts = {
    blobBase: "https://github.com/navikt/tms-utkast/blob/main",
    rawBase: "https://raw.githubusercontent.com/navikt/tms-utkast/main",
  };

  it("gjør relative lenker absolutte mot blob-base", () => {
    expect(absolutizeUrls("[guide](docs/guide.md)", opts)).toBe(
      "[guide](https://github.com/navikt/tms-utkast/blob/main/docs/guide.md)",
    );
  });

  it("gjør relative bilder absolutte mot raw-base", () => {
    expect(absolutizeUrls("![skisse](./img/skisse.png)", opts)).toBe(
      "![skisse](https://raw.githubusercontent.com/navikt/tms-utkast/main/img/skisse.png)",
    );
  });

  it("lar absolutte lenker, ankere og mailto være i fred", () => {
    for (const url of ["https://nav.no", "#seksjon", "mailto:x@nav.no", "//cdn.x/y"]) {
      const input = `[t](${url})`;
      expect(absolutizeUrls(input, opts)).toBe(input);
    }
  });

  it("håndterer rot-relative stier", () => {
    expect(absolutizeUrls("[x](/docs/x.md)", opts)).toBe(
      "[x](https://github.com/navikt/tms-utkast/blob/main/docs/x.md)",
    );
  });

  it("rører ikke lenker inne i kodeblokker", () => {
    const input = "```\n[x](relativ.md)\n```";
    expect(absolutizeUrls(input, opts)).toBe(input);
  });
});
