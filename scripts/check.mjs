import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "_site");

const errors = [];
function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

console.log("1. Building Eleventy site into _site/...");
execSync("npx eleventy", { cwd: rootDir, stdio: "inherit" });

console.log("2. Verifying required generated files...");
const requiredFiles = [
  "index.html",
  "halfy/index.html",
  "halfway/index.html",
  "safemeet/index.html",
  "privacy.html",
  "fr/index.html",
  "fr/halfy/index.html",
  "fr/halfway/index.html",
  "fr/safemeet/index.html",
  "business/index.html",
  "fr/business/index.html",
  "fr/privacy.html",
  "CNAME",
  "robots.txt",
  "sitemap.xml",
  "assets/site.webmanifest",
  "assets/styles/main.css",
  "assets/scripts/main.js",
  "assets/favicon.ico",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/apple-touch-icon.png",
  "assets/images/screen_1.png",
  "assets/images/screen_2.png",
  "assets/safemeet-logos/svg/logo-symbol.svg",
  "assets/safemeet-logos/svg/logo-symbol-white.svg",
  "assets/safemeet-logos/svg/logo-lockup.svg",
  "assets/safemeet-logos/svg/logo-lockup-white.svg",
  "assets/safemeet-logos/web/og-image-1200x630.png",
  "business/demo/index.html",
  "fr/business/demo/index.html",
  "assets/scripts/business/demo-data.js",
  "assets/scripts/business/demo-simulation.js",
  "assets/scripts/business/demo-marketplace.js",
];

for (const relPath of requiredFiles) {
  assert(fs.existsSync(path.join(siteDir, relPath)), `Missing generated file: _site/${relPath}`);
}

const cname = fs.readFileSync(path.join(siteDir, "CNAME"), "utf8").trim();
assert(cname === "halfy.app", `CNAME must be 'halfy.app', got '${cname}'`);

const manifest = JSON.parse(fs.readFileSync(path.join(siteDir, "assets/site.webmanifest"), "utf8"));
for (const icon of manifest.icons || []) {
  assert(icon.src.startsWith("/assets/"), `Manifest icon src must start with /assets/: ${icon.src}`);
  const diskPath = path.join(siteDir, icon.src.replace(/^\//, ""));
  assert(fs.existsSync(diskPath), `Manifest icon file missing in _site: ${icon.src}`);
}

// Sitemap must list canonical product and Business routes and exclude redirects or future routes
const sitemap = fs.readFileSync(path.join(siteDir, "sitemap.xml"), "utf8");
const forbiddenSitemapRoutes = ["/halfway", "/business/marketplaces", "/developers", "/pricing"];
for (const forbidden of forbiddenSitemapRoutes) {
  assert(!sitemap.includes(forbidden), `Sitemap must not reference route: ${forbidden}`);
}
assert(sitemap.includes("https://halfy.app/halfy/"), "Sitemap missing /halfy/");
assert(sitemap.includes("https://halfy.app/fr/halfy/"), "Sitemap missing /fr/halfy/");
assert(sitemap.includes("https://halfy.app/safemeet/"), "Sitemap missing /safemeet/");
assert(sitemap.includes("https://halfy.app/fr/safemeet/"), "Sitemap missing /fr/safemeet/");
assert(sitemap.includes("https://halfy.app/business/"), "Sitemap missing /business/");
assert(sitemap.includes("https://halfy.app/fr/business/"), "Sitemap missing /fr/business/");

const redirectPages = [
  { file: "halfway/index.html", lang: "en", target: "/halfy/", expectedCanonical: "https://halfy.app/halfy/" },
  { file: "fr/halfway/index.html", lang: "fr", target: "/fr/halfy/", expectedCanonical: "https://halfy.app/fr/halfy/" },
];

for (const redir of redirectPages) {
  const html = fs.readFileSync(path.join(siteDir, redir.file), "utf8");
  assert(html.includes(`<html lang="${redir.lang}">`), `${redir.file}: wrong lang`);
  assert(html.includes('<meta name="robots" content="noindex, follow" />'), `${redir.file}: missing noindex`);
  assert(
    html.includes(`<link rel="canonical" href="${redir.expectedCanonical}" />`),
    `${redir.file}: missing canonical to ${redir.expectedCanonical}`
  );
  assert(
    html.includes(`<meta http-equiv="refresh" content="0; url=${redir.target}" />`),
    `${redir.file}: missing meta refresh to ${redir.target}`
  );
  assert(html.includes(`href="${redir.target}"`), `${redir.file}: missing accessible fallback link`);
  assert(!html.includes("how-it-works"), `${redir.file}: must not duplicate commercial content`);
}

const htmlPages = [
  {
    file: "index.html",
    lang: "en",
    expectedCanonical: "https://halfy.app/",
    switchTarget: "/fr/",
    activeProductHref: null,
    expectedCtaLabel: "Open Halfy",
    expectedCtaHref: "https://app.halfy.app/",
  },
  {
    file: "fr/index.html",
    lang: "fr",
    expectedCanonical: "https://halfy.app/fr/",
    switchTarget: "/",
    activeProductHref: null,
    expectedCtaLabel: "Ouvrir Halfy",
    expectedCtaHref: "https://app.halfy.app/",
  },
  {
    file: "halfy/index.html",
    lang: "en",
    expectedCanonical: "https://halfy.app/halfy/",
    switchTarget: "/fr/halfy/",
    activeProductHref: "/halfy/",
    expectedCtaLabel: "Open Halfy",
    expectedCtaHref: "https://app.halfy.app/",
  },
  {
    file: "fr/halfy/index.html",
    lang: "fr",
    expectedCanonical: "https://halfy.app/fr/halfy/",
    switchTarget: "/halfy/",
    activeProductHref: "/fr/halfy/",
    expectedCtaLabel: "Ouvrir Halfy",
    expectedCtaHref: "https://app.halfy.app/",
  },
  {
    file: "safemeet/index.html",
    lang: "en",
    expectedCanonical: "https://halfy.app/safemeet/",
    switchTarget: "/fr/safemeet/",
    activeProductHref: "/safemeet/",
    expectedCtaLabel: "Create a meetup",
    expectedCtaHref: "https://app.halfy.app/meet",
  },
  {
    file: "fr/safemeet/index.html",
    lang: "fr",
    expectedCanonical: "https://halfy.app/fr/safemeet/",
    switchTarget: "/safemeet/",
    activeProductHref: "/fr/safemeet/",
    expectedCtaLabel: "Créer une rencontre",
    expectedCtaHref: "https://app.halfy.app/meet",
  },
  {
    file: "business/index.html",
    lang: "en",
    expectedCanonical: "https://halfy.app/business/",
    switchTarget: "/fr/business/",
    activeProductHref: "/business/",
    expectedCtaLabel: "Business enquiries",
    expectedCtaHref: "mailto:contactus.kerit@gmail.com?subject=SafeMeet%20Business%20-%20Business%20enquiries",
  },
  {
    file: "fr/business/index.html",
    lang: "fr",
    expectedCanonical: "https://halfy.app/fr/business/",
    switchTarget: "/business/",
    activeProductHref: "/fr/business/",
    expectedCtaLabel: "Contact professionnel",
    expectedCtaHref: "mailto:contactus.kerit@gmail.com?subject=SafeMeet%20Business%20-%20Contact%20professionnel",
  },
  {
    file: "privacy.html",
    lang: "en",
    expectedCanonical: "https://halfy.app/privacy.html",
    switchTarget: "/fr/privacy.html",
    activeProductHref: null,
    expectedCtaLabel: "Open Halfy",
    expectedCtaHref: "https://app.halfy.app/",
  },
  {
    file: "fr/privacy.html",
    lang: "fr",
    expectedCanonical: "https://halfy.app/fr/privacy.html",
    switchTarget: "/privacy.html",
    activeProductHref: null,
    expectedCtaLabel: "Ouvrir Halfy",
    expectedCtaHref: "https://app.halfy.app/",
  },
];

const forbiddenFutureRoutes = ["/halfway", "/business/marketplaces", "/business/contact", "/business/pricing", "/developers", "/pricing"];

console.log("3. Validating HTML pages, links, brand naming, assets, SEO, navigation, and analytics...");
for (const page of htmlPages) {
  const html = fs.readFileSync(path.join(siteDir, page.file), "utf8");

  assert(html.startsWith("<!DOCTYPE html>"), `${page.file}: missing <!DOCTYPE html>`);
  assert(html.includes(`<html lang="${page.lang}">`), `${page.file}: missing <html lang="${page.lang}">`);

  const headEndIdx = html.indexOf("</head>");
  const bodyStartIdx = html.indexOf("<body");
  const gtagIdx = html.indexOf("G-YYH1720STZ");
  assert(headEndIdx !== -1 && bodyStartIdx !== -1, `${page.file}: malformed head/body`);
  assert(gtagIdx !== -1 && gtagIdx < headEndIdx, `${page.file}: GA4 script must be inside <head>`);
  const betweenHeadAndBody = html.slice(headEndIdx + 7, bodyStartIdx).trim();
  assert(betweenHeadAndBody === "", `${page.file}: unexpected content between </head> and <body>`);

  assert(
    html.includes(`<link rel="canonical" href="${page.expectedCanonical}" />`),
    `${page.file}: missing or wrong canonical (${page.expectedCanonical})`
  );
  assert(html.includes('hreflang="en"'), `${page.file}: missing hreflang="en"`);
  assert(html.includes('hreflang="fr"'), `${page.file}: missing hreflang="fr"`);
  assert(html.includes('hreflang="x-default"'), `${page.file}: missing hreflang="x-default"`);
  assert(
    html.includes(`href="${page.switchTarget}"`) && html.includes('class="lang-switch"'),
    `${page.file}: missing or wrong EN/FR switcher target (${page.switchTarget})`
  );

  // Old dropdown must be completely removed
  assert(!html.includes("data-dropdown"), `${page.file}: obsolete data-dropdown attribute still present`);
  assert(!html.includes("desktop-products-menu"), `${page.file}: obsolete desktop-products-menu still present`);
  assert(!html.includes("nav-dropdown"), `${page.file}: obsolete nav-dropdown class still present`);
  assert(!html.includes("mobile-nav-group-label"), `${page.file}: obsolete mobile-nav-group-label still present`);

  // Direct desktop product links + logos + mobile drawer must be present
  const expectedHalfyUrl = page.lang === "fr" ? "/fr/halfy/" : "/halfy/";
  const expectedSafeMeetUrl = page.lang === "fr" ? "/fr/safemeet/" : "/safemeet/";
  const siteNavMatch = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/);
  assert(siteNavMatch, `${page.file}: missing desktop .site-nav`);
  const siteNavHtml = siteNavMatch ? siteNavMatch[0] : "";
  assert(siteNavHtml.includes(`href="${expectedHalfyUrl}"`), `${page.file}: desktop nav missing Halfy link`);
  assert(siteNavHtml.includes(`href="${expectedSafeMeetUrl}"`), `${page.file}: desktop nav missing SafeMeet link`);
  assert(siteNavHtml.includes("/assets/icon-192.png"), `${page.file}: desktop nav missing Halfy icon`);
  assert(
    siteNavHtml.includes("/assets/safemeet-logos/svg/logo-symbol.svg"),
    `${page.file}: desktop nav missing SafeMeet logo`
  );

  // Active state check in desktop nav and mobile drawer
  const headerMatch = html.match(/<header class="site-header">[\s\S]*?<\/header>/);
  const headerHtml = headerMatch ? headerMatch[0] : "";
  const activeAttrMatches = headerHtml.match(/aria-current="page"/g) || [];
  if (page.activeProductHref) {
    assert(
      activeAttrMatches.length === 2,
      `${page.file}: expected 2 aria-current="page" links (desktop + mobile), found ${activeAttrMatches.length}`
    );
    assert(
      siteNavHtml.includes(`href="${page.activeProductHref}"`) && siteNavHtml.includes('aria-current="page"'),
      `${page.file}: desktop nav missing active state for ${page.activeProductHref}`
    );
  } else {
    assert(
      activeAttrMatches.length === 0,
      `${page.file}: unexpected aria-current="page" in header (${activeAttrMatches.length})`
    );
  }

  // Contextual header CTA check (desktop + mobile)
  const expectedCtaPattern = new RegExp(
    `<a[^>]*href="${page.expectedCtaHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*class="btn-header btn-header-primary"[^>]*>\\s*${page.expectedCtaLabel}\\s*</a>`,
    "g"
  );
  const ctaMatches = headerHtml.match(expectedCtaPattern) || [];
  assert(
    ctaMatches.length === 2,
    `${page.file}: expected contextual header CTA '${page.expectedCtaLabel}' -> '${page.expectedCtaHref}' in both desktop and mobile header, found ${ctaMatches.length}`
  );
  assert(
    !/Request a demo|Demander une démo/i.test(headerHtml),
    `${page.file}: unavailable Business CTA must not appear in header`
  );

  assert(html.includes("data-nav-toggle"), `${page.file}: missing mobile nav toggle`);
  assert(html.includes('id="mobile-navigation-drawer"'), `${page.file}: missing mobile drawer`);

  const h1Matches = html.match(/<h1[\s>]/g) || [];
  assert(h1Matches.length === 1, `${page.file}: expected 1 <h1>, found ${h1Matches.length}`);
  assert(!html.includes("—"), `${page.file}: contains forbidden em dash (—)`);

  // Official brand architecture checks (no Private Meet, no standalone Halfway, no Create a SafeMeet)
  assert(!/\bPrivate\s+Meet\b/i.test(html), `${page.file}: contains legacy 'Private Meet' brand name`);
  assert(
    !/Create a SafeMeet|Créer un SafeMeet/i.test(html),
    `${page.file}: contains forbidden 'Create a SafeMeet' / 'Créer un SafeMeet' CTA`
  );
  assert(!html.includes("Halfway"), `${page.file}: contains 'Halfway' as capitalized product name`);

  if (page.lang === "fr") {
    assert(html.includes("société en cours de formation"), `${page.file}: missing Kër IT legal status in FR`);
  } else {
    assert(html.includes("company in formation"), `${page.file}: missing Kër IT legal status in EN`);
  }

  const attrRegex = /\b(?:href|src)="([^"]+)"/g;
  let match;
  while ((match = attrRegex.exec(html)) !== null) {
    const target = match[1];
    if (
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("mailto:") ||
      target.startsWith("#")
    ) {
      continue;
    }

    for (const forbidden of forbiddenFutureRoutes) {
      assert(!target.startsWith(forbidden), `${page.file}: link to deprecated/unavailable route ${target}`);
    }

    const cleanTarget = target.split("#")[0].split("?")[0];
    let resolved;
    if (cleanTarget.startsWith("/")) {
      resolved = path.join(siteDir, cleanTarget.slice(1));
    } else {
      resolved = path.join(siteDir, path.dirname(page.file), cleanTarget);
    }

    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      resolved = path.join(resolved, "index.html");
    }

    assert(fs.existsSync(resolved), `${page.file}: broken internal reference '${target}' -> ${resolved}`);
  }
}

for (const pageFile of ["index.html", "fr/index.html", "halfy/index.html", "fr/halfy/index.html"]) {
  const html = fs.readFileSync(path.join(siteDir, pageFile), "utf8");
  assert(html.includes("https://app.halfy.app"), `${pageFile}: missing WebApp link`);
  assert(html.includes("https://app.halfy.app/meet"), `${pageFile}: missing SafeMeet/Meet link`);
  assert(
    html.includes("https://play.google.com/store/apps/details?id=com.crankynx.halfy"),
    `${pageFile}: missing Google Play link`
  );
  assert(html.includes("/assets/safemeet-logos/svg/logo-symbol.svg"), `${pageFile}: missing SafeMeet symbol SVG`);
}

for (const pageFile of ["safemeet/index.html", "fr/safemeet/index.html"]) {
  const html = fs.readFileSync(path.join(siteDir, pageFile), "utf8");
  assert(html.includes("https://app.halfy.app/meet"), `${pageFile}: missing SafeMeet WebApp CTA`);
  assert(html.includes("/assets/safemeet-logos/svg/logo-lockup.svg"), `${pageFile}: missing SafeMeet lockup SVG`);
  assert(
    html.includes("/assets/safemeet-logos/svg/logo-lockup-white.svg"),
    `${pageFile}: missing SafeMeet white lockup SVG`
  );
  assert(
    html.includes("/assets/safemeet-logos/web/og-image-1200x630.png"),
    `${pageFile}: missing SafeMeet Open Graph image`
  );
  assert(html.includes('name="twitter:card" content="summary_large_image"'), `${pageFile}: wrong twitter:card`);
  assert(!html.includes("screen_1.png") && !html.includes("screen_2.png"), `${pageFile}: must not reuse Halfy screenshots`);
}

for (const pageFile of ["business/index.html", "fr/business/index.html"]) {
  const html = fs.readFileSync(path.join(siteDir, pageFile), "utf8");
  assert(html.includes("/assets/safemeet-logos/svg/logo-lockup.svg"), `${pageFile}: missing SafeMeet lockup SVG`);
  assert(html.includes("/business/demo/") || html.includes("/fr/business/demo/"), `${pageFile}: missing localised demo link`);
  assert(html.includes("mailto:contactus.kerit@gmail.com"), `${pageFile}: missing professional email contact`);
  assert(!html.includes("/business/marketplaces/"), `${pageFile}: deferred marketplace route must not be linked`);
  assert(!/receives? the agreed venue|reçoit le lieu accepté/i.test(html), `${pageFile}: must not claim the partner receives the agreed venue`);
}

console.log("3b. Validating SafeMeet Business simulated demo pages (/business/demo/)...");
const demoPages = [
  {
    file: "business/demo/index.html",
    lang: "en",
    expectedCanonical: "https://halfy.app/business/demo/",
    switchTarget: "/fr/business/demo/",
    expectedCtaLabel: "Business enquiries",
    expectedCtaHrefPrefix: "mailto:contactus.kerit@gmail.com",
    expectedDisclaimer:
      "Interactive demo using fictional data, with no API call. The B2B API remains private and Halfy supports each partner integration.",
  },
  {
    file: "fr/business/demo/index.html",
    lang: "fr",
    expectedCanonical: "https://halfy.app/fr/business/demo/",
    switchTarget: "/business/demo/",
    expectedCtaLabel: "Contact professionnel",
    expectedCtaHrefPrefix: "mailto:contactus.kerit@gmail.com",
    expectedDisclaimer:
      "Démonstration interactive utilisant des données fictives, sans appel API. L'API B2B reste privée et l'intégration partenaire est accompagnée.",
  },
];

for (const page of demoPages) {
  const html = fs.readFileSync(path.join(siteDir, page.file), "utf8");
  const normalizedHtml = html.replace(/&#39;/g, "'");
  assert(html.startsWith("<!DOCTYPE html>"), `${page.file}: missing <!DOCTYPE html>`);
  assert(html.includes(`<html lang="${page.lang}">`), `${page.file}: wrong html lang`);
  assert(html.includes('<meta name="robots" content="noindex, follow" />'), `${page.file}: missing noindex, follow`);

  // GA4 must NOT run on internal simulated demo pages
  assert(!html.includes("G-YYH1720STZ"), `${page.file}: GA4 ID must be excluded from demo pages`);
  assert(!html.includes("googletagmanager.com/gtag/js"), `${page.file}: GA4 script tag must be excluded from demo pages`);

  assert(
    html.includes(`<link rel="canonical" href="${page.expectedCanonical}" />`),
    `${page.file}: wrong canonical`
  );
  assert(html.includes('hreflang="en"'), `${page.file}: missing hreflang="en"`);
  assert(html.includes('hreflang="fr"'), `${page.file}: missing hreflang="fr"`);
  assert(
    html.includes(`href="${page.switchTarget}"`) && html.includes('class="lang-switch"'),
    `${page.file}: wrong language switcher target (${page.switchTarget})`
  );
  assert(html.includes("/assets/safemeet-logos/svg/logo-lockup.svg"), `${page.file}: missing SafeMeet lockup`);
  assert(
    html.includes("/assets/scripts/business/demo-marketplace.js"),
    `${page.file}: missing demo-marketplace.js module script`
  );
  assert(normalizedHtml.includes(page.expectedDisclaimer), `${page.file}: missing concise commercial transparency disclaimer`);
  assert(!html.includes("—"), `${page.file}: contains forbidden em dash (—)`);
  assert(!/\bWEB-B2B\b/i.test(normalizedHtml), `${page.file}: must not expose internal lot identifiers`);
  assert(!/\bbacklog\b/i.test(normalizedHtml), `${page.file}: must not expose internal backlog wording`);
  assert(!/\bPrivate\s+Meet\b/i.test(html), `${page.file}: contains legacy 'Private Meet'`);
  assert(!html.includes("Halfway"), `${page.file}: contains 'Halfway' as capitalized brand`);
  assert(
    !/Leboncoin|Facebook Marketplace|Vinted|2ememain|2dehands/i.test(html),
    `${page.file}: must not mention third-party marketplace brands`
  );

  const headerMatch = html.match(/<header class="site-header">[\s\S]*?<\/header>/);
  const headerHtml = headerMatch ? headerMatch[0] : "";
  const expectedBusinessUrl = page.lang === "fr" ? "/fr/business/" : "/business/";
  assert(headerHtml.includes(`href="${expectedBusinessUrl}"`), `${page.file}: Business nav link must be enabled`);
  assert(
    !/Request a demo|Demander une démo/i.test(headerHtml),
    `${page.file}: unavailable Business header CTA must not appear`
  );

  const demoCtaPattern = new RegExp(
    `<a[^>]*href="${page.expectedCtaHrefPrefix}[^"]*"[^>]*class="btn-header btn-header-primary"[^>]*>\\s*${page.expectedCtaLabel}\\s*</a>`,
    "g"
  );
  const demoCtaMatches = headerHtml.match(demoCtaPattern) || [];
  assert(
    demoCtaMatches.length === 2,
    `${page.file}: expected contextual header CTA '${page.expectedCtaLabel}' -> '${page.expectedCtaHrefPrefix}' in both desktop and mobile header, found ${demoCtaMatches.length}`
  );

  const h1Matches = html.match(/<h1[\s>]/g) || [];
  assert(h1Matches.length === 1, `${page.file}: expected 1 <h1>, found ${h1Matches.length}`);
}

console.log("4. Checking JS syntax and running demo simulation unit tests...");
execSync("node --check eleventy.config.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --check server.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --check scripts/dev.mjs", { cwd: rootDir, stdio: "inherit" });
execSync("node --check scripts/check.mjs", { cwd: rootDir, stdio: "inherit" });
execSync("node --check scripts/test-demo.mjs", { cwd: rootDir, stdio: "inherit" });
execSync("node --check src/assets/scripts/main.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --check src/assets/scripts/business/demo-data.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --check src/assets/scripts/business/demo-simulation.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --check src/assets/scripts/business/demo-marketplace.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --test scripts/test-demo.mjs", { cwd: rootDir, stdio: "inherit" });

if (errors.length > 0) {
  console.error("\nVerification failed with errors:");
  for (const err of errors) {
    console.error(` - ${err}`);
  }
  process.exit(1);
}

console.log("\nAll WEB-B2B-05.2 checks passed!");
