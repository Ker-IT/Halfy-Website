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
  "halfway/index.html",
  "safemeet/index.html",
  "privacy.html",
  "fr/index.html",
  "fr/halfway/index.html",
  "fr/safemeet/index.html",
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

// Future routes not yet implemented must NOT appear in sitemap or links
const sitemap = fs.readFileSync(path.join(siteDir, "sitemap.xml"), "utf8");
const forbiddenFutureRoutes = ["/business", "/developers", "/pricing"];
for (const forbidden of forbiddenFutureRoutes) {
  assert(!sitemap.includes(forbidden), `Sitemap must not reference unavailable route: ${forbidden}`);
}
assert(sitemap.includes("https://halfy.app/halfway/"), "Sitemap missing /halfway/");
assert(sitemap.includes("https://halfy.app/fr/halfway/"), "Sitemap missing /fr/halfway/");
assert(sitemap.includes("https://halfy.app/safemeet/"), "Sitemap missing /safemeet/");
assert(sitemap.includes("https://halfy.app/fr/safemeet/"), "Sitemap missing /fr/safemeet/");

const htmlPages = [
  { file: "index.html", lang: "en", expectedCanonical: "https://halfy.app/", switchTarget: "/fr/" },
  { file: "fr/index.html", lang: "fr", expectedCanonical: "https://halfy.app/fr/", switchTarget: "/" },
  { file: "halfway/index.html", lang: "en", expectedCanonical: "https://halfy.app/halfway/", switchTarget: "/fr/halfway/" },
  { file: "fr/halfway/index.html", lang: "fr", expectedCanonical: "https://halfy.app/fr/halfway/", switchTarget: "/halfway/" },
  { file: "safemeet/index.html", lang: "en", expectedCanonical: "https://halfy.app/safemeet/", switchTarget: "/fr/safemeet/" },
  { file: "fr/safemeet/index.html", lang: "fr", expectedCanonical: "https://halfy.app/fr/safemeet/", switchTarget: "/safemeet/" },
  { file: "privacy.html", lang: "en", expectedCanonical: "https://halfy.app/privacy.html", switchTarget: "/fr/privacy.html" },
  { file: "fr/privacy.html", lang: "fr", expectedCanonical: "https://halfy.app/fr/privacy.html", switchTarget: "/privacy.html" },
];

console.log("3. Validating HTML pages, links, assets, SEO, mobile nav, and analytics...");
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

  // Mobile navigation must be present and active now that Halfway & SafeMeet are enabled
  assert(html.includes("data-nav-toggle"), `${page.file}: missing mobile nav toggle`);
  assert(html.includes('id="mobile-navigation-drawer"'), `${page.file}: missing mobile drawer`);

  const h1Matches = html.match(/<h1[\s>]/g) || [];
  assert(h1Matches.length === 1, `${page.file}: expected 1 <h1>, found ${h1Matches.length}`);
  assert(!html.includes("—"), `${page.file}: contains forbidden em dash (—)`);

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
      assert(!target.startsWith(forbidden), `${page.file}: link to unavailable route ${target}`);
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

for (const pageFile of ["index.html", "fr/index.html", "halfway/index.html", "fr/halfway/index.html"]) {
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
  assert(!html.includes("screen_1.png") && !html.includes("screen_2.png"), `${pageFile}: must not reuse Halfway screenshots`);
}

console.log("4. Checking JS syntax...");
execSync("node --check eleventy.config.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --check server.js", { cwd: rootDir, stdio: "inherit" });
execSync("node --check scripts/dev.mjs", { cwd: rootDir, stdio: "inherit" });
execSync("node --check scripts/check.mjs", { cwd: rootDir, stdio: "inherit" });
execSync("node --check src/assets/scripts/main.js", { cwd: rootDir, stdio: "inherit" });

if (errors.length > 0) {
  console.error("\nVerification failed with errors:");
  for (const err of errors) {
    console.error(` - ${err}`);
  }
  process.exit(1);
}

console.log("\nAll WEB-B2B-03 checks passed!");
