import { describe, expect, it } from "vitest";
import { countStepsLists, stepsInSections } from "./html-transforms";

const list = "<ol><li>Ett</li></ol>";
const steps = '<ol role="list" class="sl-steps"><li>Ett</li></ol>';

describe("stepsInSections", () => {
  it("markerer lista før første overskrift når _top er valgt", () => {
    const html = `<p>Intro</p>${list}<h2 id="varseltyper">Varseltyper</h2>${list}`;

    expect(stepsInSections(html, ["_top"])).toBe(
      `<p>Intro</p>${steps}<h2 id="varseltyper">Varseltyper</h2>${list}`,
    );
  });

  it("markerer lista i seksjonen med oppgitt slug", () => {
    const html = `${list}<h2 id="kom-i-gang">Kom i gang</h2>${list}`;

    expect(stepsInSections(html, ["kom-i-gang"])).toBe(
      `${list}<h2 id="kom-i-gang">Kom i gang</h2>${steps}`,
    );
  });

  it("markerer bare den første lista i en seksjon", () => {
    const html = `<h2 id="kom-i-gang">Kom i gang</h2>${list}<p>Mer</p>${list}`;

    expect(stepsInSections(html, ["kom-i-gang"])).toBe(
      `<h2 id="kom-i-gang">Kom i gang</h2>${steps}<p>Mer</p>${list}`,
    );
  });

  it("lar dokumentet være i fred uten valgte seksjoner", () => {
    const html = `<h2 id="kom-i-gang">Kom i gang</h2>${list}`;

    expect(stepsInSections(html, [])).toBe(html);
  });

  it("lar dokumentet være i fred når seksjonen ikke finnes", () => {
    const html = `<h2 id="kom-i-gang">Kom i gang</h2>${list}`;

    expect(stepsInSections(html, ["finnes-ikke"])).toBe(html);
  });

  it("takler overskrifter med ankerlenke og flere attributter", () => {
    const html =
      '<h2 id="kom-i-gang" class="sl-heading">Kom i gang' +
      '<a class="sl-anchor-link" href="#kom-i-gang">#</a></h2>' +
      list;

    expect(stepsInSections(html, ["kom-i-gang"])).toContain(steps);
  });

  it("beholder start-attributtet og gir Starlight riktig css-variabel", () => {
    const html = `<h2 id="kom-i-gang">Kom i gang</h2><ol start="3"><li>Tre</li></ol>`;

    expect(stepsInSections(html, ["kom-i-gang"])).toBe(
      '<h2 id="kom-i-gang">Kom i gang</h2>' +
        '<ol start="3" role="list" class="sl-steps" style="--sl-steps-start: 2">' +
        "<li>Tre</li></ol>",
    );
  });

  it("rører ikke punktlister", () => {
    const html = '<h2 id="kom-i-gang">Kom i gang</h2><ul><li>Ett</li></ul>';

    expect(stepsInSections(html, ["kom-i-gang"])).toBe(html);
  });
});

describe("countStepsLists", () => {
  it("teller lister som ble vist som steg", () => {
    expect(countStepsLists(`${steps}${list}${steps}`)).toBe(2);
  });

  it("teller ikke klassenavn som bare ligner", () => {
    expect(countStepsLists('<ol class="sl-steps-noe"></ol>')).toBe(0);
  });
});
