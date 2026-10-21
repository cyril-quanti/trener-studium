import { expect, test, type Page } from "@playwright/test";

/**
 * Captures every screen/state described in docs/design.md's quality gate, at
 * mobile (390px) and desktop (1280px), in light and dark mode, using the
 * fixture content (VITE_CONTENT_FIXTURES=1, wired via playwright.config.ts).
 * Run with `npm run screenshots`. Output goes to docs/screenshots/.
 */

const STORAGE_KEY = "trener-studium:v1";

const now = Date.now();

// A plausible, partially-progressed state so the dashboard, mastery rings
// and weakest-topics list all have something real to show.
const seedState = {
  version: 1,
  theme: "light",
  cards: {
    "pohybove-schopnosti-c01": { box: 5, dueAt: now + 14 * 86400000, lastReviewed: now },
    "pohybove-schopnosti-c02": { box: 4, dueAt: now + 7 * 86400000, lastReviewed: now },
    "pohybove-schopnosti-c03": { box: 2, dueAt: now - 86400000, lastReviewed: now - 2 * 86400000 },
    "pohybove-schopnosti-c04": { box: 1, dueAt: now, lastReviewed: now - 86400000 },
    "pohybove-schopnosti-c05": { box: 1, dueAt: now, lastReviewed: 0 },
    "sila-c01": { box: 5, dueAt: now + 14 * 86400000, lastReviewed: now },
    "sila-c02": { box: 5, dueAt: now + 14 * 86400000, lastReviewed: now },
    "sila-c03": { box: 4, dueAt: now + 7 * 86400000, lastReviewed: now },
    "sila-c04": { box: 3, dueAt: now + 3 * 86400000, lastReviewed: now },
    "sila-c05": { box: 1, dueAt: now, lastReviewed: 0 },
    "sila-c06": { box: 1, dueAt: now, lastReviewed: 0 },
    "regenerace-c01": { box: 2, dueAt: now - 86400000, lastReviewed: now - 2 * 86400000 },
    "regenerace-c02": { box: 1, dueAt: now, lastReviewed: 0 },
  },
  questions: {
    "pohybove-schopnosti-q01": { lastScore: 60, lastAttemptAt: now },
    "sila-q01": { lastScore: 100, lastAttemptAt: now },
    "sila-q02": { lastScore: 80, lastAttemptAt: now },
  },
};

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
];

const themes = ["light", "dark"] as const;

async function seed(page: Page, theme: "light" | "dark") {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [STORAGE_KEY, JSON.stringify({ ...seedState, theme })],
  );
}

async function shoot(page: Page, name: string) {
  await page.waitForTimeout(150); // let fade-in / ring animations settle
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: true });
}

for (const viewport of viewports) {
  for (const theme of themes) {
    const suffix = `${viewport.name}-${theme}`;

    test.describe(`${viewport.name} / ${theme}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test(`domu-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Domů" })).toBeVisible();
        await shoot(page, `domu-${suffix}`);
      });

      test(`blok-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/blok/blok-1");
        await expect(page.getByRole("heading", { name: "Teorie sportovního tréninku" })).toBeVisible();
        await shoot(page, `blok-${suffix}`);
      });

      test(`tema-studium-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/blok/blok-1/pohybove-schopnosti?tab=studium");
        await expect(page.getByText("Co jsou pohybové schopnosti")).toBeVisible();
        await shoot(page, `tema-studium-${suffix}`);
      });

      test(`tema-karticky-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/blok/blok-1/pohybove-schopnosti?tab=karticky");
        await expect(page.getByText("kartiček")).toBeVisible();
        await shoot(page, `tema-karticky-${suffix}`);
      });

      test(`tema-otazky-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/blok/blok-1/pohybove-schopnosti?tab=otazky");
        await expect(page.getByText("otázek k procvičení")).toBeVisible();
        await shoot(page, `tema-otazky-${suffix}`);
      });

      test(`tema-prazdny-stav-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/blok/blok-1/zasady-treninku?tab=studium");
        await expect(page.getByText("Obsah se připravuje")).toBeVisible();
        await shoot(page, `tema-prazdny-stav-${suffix}`);
      });

      test(`karticky-predni-strana-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/karticky?scope=topic&id=blok-2:sila");
        await expect(page.getByRole("button", { name: /Otočit kartičku a zobrazit odpověď/ })).toBeVisible();
        await shoot(page, `karticky-predni-strana-${suffix}`);
      });

      test(`karticky-zadni-strana-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/karticky?scope=topic&id=blok-2:sila");
        await page.getByRole("button", { name: /Otočit kartičku a zobrazit odpověď/ }).click();
        await page.waitForTimeout(550); // 3D flip animation
        await shoot(page, `karticky-zadni-strana-${suffix}`);
      });

      test(`karticky-shrnuti-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/karticky?scope=topic&id=blok-3:regenerace");
        for (let i = 0; i < 4; i += 1) {
          await page.getByRole("button", { name: /Otočit kartičku a zobrazit odpověď/ }).click();
          await page.waitForTimeout(550);
          await page.getByRole("button", { name: "Umím" }).click();
        }
        await expect(page.getByText("Session dokončena")).toBeVisible();
        await shoot(page, `karticky-shrnuti-${suffix}`);
      });

      test(`zkouska-vyber-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/zkouska");
        await expect(page.getByRole("heading", { name: "Simulátor ústní zkoušky" })).toBeVisible();
        await shoot(page, `zkouska-vyber-${suffix}`);
      });

      test(`zkouska-otazka-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/zkouska/beh?blocks=blok-1,blok-2,blok-3");
        await expect(page.getByRole("button", { name: "Zobrazit vzorovou odpověď" })).toBeVisible();
        await shoot(page, `zkouska-otazka-${suffix}`);
      });

      test(`zkouska-odhaleni-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/zkouska/beh?blocks=blok-1,blok-2,blok-3");
        await page.getByRole("button", { name: "Zobrazit vzorovou odpověď" }).click();
        await expect(page.getByText("Vzorová odpověď")).toBeVisible();
        await shoot(page, `zkouska-odhaleni-${suffix}`);
      });

      test(`zkouska-shrnuti-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/zkouska/beh?blocks=blok-1,blok-2,blok-3");
        for (let i = 0; i < 3; i += 1) {
          await page.getByRole("button", { name: "Zobrazit vzorovou odpověď" }).click();
          await page.getByRole("button", { name: /Další otázka|Dokončit zkoušku/ }).click();
        }
        await expect(page.getByText("Zkouška dokončena")).toBeVisible();
        await shoot(page, `zkouska-shrnuti-${suffix}`);
      });

      test(`nastaveni-${suffix}`, async ({ page }) => {
        await seed(page, theme);
        await page.goto("/#/nastaveni");
        await expect(page.getByRole("heading", { name: "Nastavení" })).toBeVisible();
        await shoot(page, `nastaveni-${suffix}`);
      });
    });
  }
}
