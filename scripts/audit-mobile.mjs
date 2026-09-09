import { chromium, devices } from "playwright";

const OUT = process.argv[2] ?? ".";
const URL = "http://localhost:3000";

const viewports = [
  { name: "iphone-se", width: 375, height: 667, dpr: 2 },
  { name: "iphone-14", width: 390, height: 844, dpr: 3 },
  { name: "pixel-7", width: 412, height: 915, dpr: 2.6 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: true,
    hasTouch: true,
    userAgent: devices["iPhone 13"].userAgent,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1200);

  console.log(`\n===== ${vp.name} (${vp.width}px) =====`);

  // 1. Debordement horizontal
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const guilty = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1)) {
        guilty.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      guilty: guilty.slice(0, 6),
    };
  });
  console.log(
    `debordement: scrollWidth ${overflow.scrollWidth} vs ${overflow.clientWidth}` +
      (overflow.scrollWidth > overflow.clientWidth ? "  <-- PROBLEME" : "  ok"),
  );
  for (const g of overflow.guilty) {
    console.log(`   ${g.tag}.${g.cls}  [${g.left} -> ${g.right}]`);
  }

  // 2. Taille des cibles tactiles
  const small = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("a, button, input, [role=button]")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.height < 44 || r.width < 44) {
        out.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30),
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
      }
    }
    return out.slice(0, 10);
  });
  console.log(`cibles tactiles < 44px: ${small.length === 0 ? "aucune" : ""}`);
  for (const s of small) console.log(`   ${s.tag} "${s.text}" ${s.w}x${s.h}`);

  // 3. Lisibilite du panneau LED : taille d'un pixel a l'ecran
  const panels = await page.evaluate(() => {
    return [...document.querySelectorAll("canvas")].map((c) => {
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), perLed: +(r.width / 68).toFixed(2) };
    });
  });
  console.log("panneaux LED:");
  for (const p of panels) {
    console.log(
      `   ${p.w}x${p.h}px -> ${p.perLed}px par LED` +
        (p.perLed < 3 ? "   <-- ILLISIBLE" : p.perLed < 4.5 ? "   <-- limite" : ""),
    );
  }

  // 4. Hero visible sans scroll ?
  const hero = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const btn = document.querySelector("form button[type=submit]");
    return {
      h1Bottom: h1 ? Math.round(h1.getBoundingClientRect().bottom) : null,
      ctaTop: btn ? Math.round(btn.getBoundingClientRect().top) : null,
      ctaBottom: btn ? Math.round(btn.getBoundingClientRect().bottom) : null,
    };
  });
  console.log(
    `hero: bas du titre ${hero.h1Bottom}px | CTA a ${hero.ctaTop}-${hero.ctaBottom}px` +
      (hero.ctaBottom && hero.ctaBottom > vp.height ? "  <-- CTA sous la ligne de flottaison" : "  ok"),
  );

  // 5. Hauteur totale de la page
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`hauteur totale: ${total}px  (${(total / vp.height).toFixed(1)} ecrans)`.replace("vp.height", ""));

  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.28));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${vp.name}-milieu.png` });

  await ctx.close();
}

await browser.close();
console.log("\ncaptures ecrites.");
