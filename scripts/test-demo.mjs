import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  DEMO_COPY,
  DEMO_STEPS,
  DEMO_SUPPORTED_CATEGORIES,
  DEMO_TRANSPORTS,
  DEMO_VENUES,
} from "../src/assets/scripts/business/demo-data.js";
import { createDemoSimulation } from "../src/assets/scripts/business/demo-simulation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

test("initial state starts cleanly on step 1 as buyer with no selections", () => {
  const sim = createDemoSimulation("fr");
  const state = sim.getState();

  assert.equal(state.lang, "fr");
  assert.equal(state.step, 1);
  assert.equal(state.maxStepReached, 1);
  assert.equal(state.activeRole, "buyer");
  assert.equal(state.roleLinksCreated, false);
  assert.equal(state.buyerTransport, null);
  assert.equal(state.sellerTransport, null);
  assert.equal(state.selectedVenueId, null);
  assert.equal(state.resultViewRole, "buyer");
  assert.equal(state.proposalAcceptedSimulated, false);
  assert.equal(state.errorKey, null);
});

test("full 7-step flow transitions cleanly from chat to marketplace return", () => {
  const sim = createDemoSimulation("en");

  assert.equal(sim.createRoleLinks().ok, true);
  assert.equal(sim.getState().step, 2);
  assert.equal(sim.getState().roleLinksCreated, true);

  assert.equal(sim.continueAsBuyer().ok, true);
  assert.equal(sim.getState().step, 3);
  assert.equal(sim.getState().activeRole, "buyer");

  assert.equal(sim.setBuyerTransport("bike").ok, true);
  assert.equal(sim.advanceToSeller().ok, true);
  assert.equal(sim.getState().step, 4);
  assert.equal(sim.getState().activeRole, "seller");

  assert.equal(sim.setSellerTransport("walk").ok, true);
  assert.equal(sim.advanceToPlaces().ok, true);
  assert.equal(sim.getState().step, 5);

  assert.equal(sim.selectVenue("cafe-arcades").ok, true);
  assert.equal(sim.advanceToResult().ok, true);
  assert.equal(sim.getState().step, 6);
  assert.equal(sim.getState().resultViewRole, "buyer");

  assert.equal(sim.acceptProposalSimulated().ok, false);
  const missingAcceptance = sim.advanceToMarketplaceReturn();
  assert.equal(missingAcceptance.ok, false);
  assert.equal(missingAcceptance.errorKey, "missingAcceptance");

  assert.equal(sim.setResultViewRole("seller").ok, true);
  assert.equal(sim.getState().resultViewRole, "seller");

  assert.equal(sim.acceptProposalSimulated().ok, true);
  assert.equal(sim.getState().proposalAcceptedSimulated, true);

  assert.equal(sim.advanceToMarketplaceReturn().ok, true);
  assert.equal(sim.getState().step, 7);
  assert.equal(sim.getState().maxStepReached, 7);
});

test("changing venue or transport after acceptance invalidates the simulated acceptance", () => {
  const sim = createDemoSimulation("fr");
  sim.createRoleLinks();
  sim.continueAsBuyer();
  sim.setBuyerTransport("bike");
  sim.advanceToSeller();
  sim.setSellerTransport("walk");
  sim.advanceToPlaces();
  sim.selectVenue("cafe-arcades");
  sim.advanceToResult();
  sim.setResultViewRole("seller");
  sim.acceptProposalSimulated();
  sim.advanceToMarketplaceReturn();

  assert.equal(sim.getState().proposalAcceptedSimulated, true);
  assert.equal(sim.getState().maxStepReached, 7);

  // Going back to step 5 and switching venue invalidates prior acceptance and caps maxStepReached
  assert.equal(sim.goToStep(5).ok, true);
  assert.equal(sim.selectVenue("restaurant-passage").ok, true);
  assert.equal(sim.getState().proposalAcceptedSimulated, false);
  assert.equal(sim.getState().maxStepReached, 5);

  // Accept again, then alter transport and verify acceptance invalidates
  assert.equal(sim.advanceToResult().ok, true);
  assert.equal(sim.setResultViewRole("seller").ok, true);
  assert.equal(sim.acceptProposalSimulated().ok, true);
  assert.equal(sim.getState().proposalAcceptedSimulated, true);

  assert.equal(sim.goToStep(3).ok, true);
  assert.equal(sim.setBuyerTransport("car").ok, true);
  assert.equal(sim.getState().proposalAcceptedSimulated, false);
});

test("invalid transitions and incomplete prerequisites are rejected", () => {
  const sim = createDemoSimulation("fr");

  // Cannot jump ahead from step 1
  const jumpEarly = sim.goToStep(5);
  assert.equal(jumpEarly.ok, false);
  assert.equal(jumpEarly.errorKey, "invalidStep");
  assert.equal(sim.getState().step, 1);

  // Cannot go back from step 1
  const backAtStart = sim.goBack();
  assert.equal(backAtStart.ok, false);
  assert.equal(backAtStart.errorKey, "invalidStep");

  // Cannot skip step 1 -> 3 without invitation
  assert.equal(sim.continueAsBuyer().ok, false);

  // Move to step 3 and try advancing without transport
  assert.equal(sim.createRoleLinks().ok, true);
  assert.equal(sim.continueAsBuyer().ok, true);
  const missingBuyerMode = sim.advanceToSeller();
  assert.equal(missingBuyerMode.ok, false);
  assert.equal(missingBuyerMode.errorKey, "missingBuyerTransport");
  assert.equal(sim.getState().step, 3);

  // Invalid transport rejected
  const invalidTransport = sim.setBuyerTransport("helicopter");
  assert.equal(invalidTransport.ok, false);

  // Valid buyer transport unlocks step 4, then missing seller transport blocks step 5
  assert.equal(sim.setBuyerTransport("car").ok, true);
  assert.equal(sim.advanceToSeller().ok, true);
  const missingSellerMode = sim.advanceToPlaces();
  assert.equal(missingSellerMode.ok, false);
  assert.equal(missingSellerMode.errorKey, "missingSellerTransport");
  assert.equal(sim.getState().step, 4);

  // Valid seller transport unlocks step 5, then missing venue blocks step 6
  assert.equal(sim.setSellerTransport("bike").ok, true);
  assert.equal(sim.advanceToPlaces().ok, true);
  const missingVenue = sim.advanceToResult();
  assert.equal(missingVenue.ok, false);
  assert.equal(missingVenue.errorKey, "missingVenue");
  assert.equal(sim.getState().step, 5);

  // Unknown venue rejected
  assert.equal(sim.selectVenue("unknown-place").ok, false);
  assert.equal(sim.goToStep(99).ok, false);
});

test("participant result views omit submitted origins and expose proposal roles", () => {
  const sim = createDemoSimulation("fr");
  sim.createRoleLinks();
  sim.continueAsBuyer();
  sim.setBuyerTransport("bike");
  sim.advanceToSeller();
  sim.setSellerTransport("car");
  sim.advanceToPlaces();
  sim.selectVenue("restaurant-passage");
  sim.advanceToResult();

  const buyerView = sim.getParticipantViewData("buyer");
  assert.equal("ownOrigin" in buyerView, false);
  assert.equal("otherOrigin" in buyerView, false);
  assert.equal(buyerView.proposedByRole, "buyer");
  assert.equal(buyerView.acceptedByRole, null);
  assert.equal(buyerView.venue.name, "Restaurant du Passage");

  const sellerView = sim.getParticipantViewData("seller");
  assert.equal("ownOrigin" in sellerView, false);
  assert.equal("otherOrigin" in sellerView, false);
  assert.equal(sellerView.proposedByRole, "buyer");
  assert.equal(sellerView.venue.name, "Restaurant du Passage");
});

test("goBack, goToStep, and reset restore expected states", () => {
  const sim = createDemoSimulation("en");
  sim.createRoleLinks();
  sim.continueAsBuyer();
  sim.setBuyerTransport("walk");
  sim.advanceToSeller();

  assert.equal(sim.goBack().ok, true);
  assert.equal(sim.getState().step, 3);
  assert.equal(sim.getState().activeRole, "buyer");

  assert.equal(sim.goToStep(4).ok, true);
  assert.equal(sim.getState().step, 4);
  assert.equal(sim.getState().activeRole, "seller");

  sim.reset();
  const resetState = sim.getState();
  assert.equal(resetState.step, 1);
  assert.equal(resetState.maxStepReached, 1);
  assert.equal(resetState.roleLinksCreated, false);
  assert.equal(resetState.buyerTransport, null);
  assert.equal(resetState.sellerTransport, null);
  assert.equal(resetState.selectedVenueId, null);
  assert.equal(resetState.proposalAcceptedSimulated, false);
});

test("data covers all 7 steps, simplified panel, header contexts, transports, and venues in both EN and FR", () => {
  for (const lang of ["fr", "en"]) {
    const copy = DEMO_COPY[lang];
    assert.equal(copy.ui.stepTitles.length, DEMO_STEPS.length);
    for (const stepNum of [1, 2, 5, 7]) {
      assert.ok(copy.ui.headerContexts[stepNum], `Missing headerContext for step ${stepNum} in ${lang}`);
    }
    for (const stepNum of DEMO_STEPS) {
      const panelStep = copy.panel.steps[stepNum];
      assert.ok(panelStep, `Missing panel step ${stepNum} in ${lang}`);
      assert.ok(panelStep.title && panelStep.explanation && panelStep.forMarketplace);
    }
    for (const mode of DEMO_TRANSPORTS) {
      assert.ok(copy.marketplace.transports[mode]?.label, `Missing transport label ${mode} in ${lang}`);
    }
    for (const venue of DEMO_VENUES) {
      assert.ok(copy.marketplace.venues[venue.id], `Missing venue ${venue.id} in ${lang}`);
      assert.ok(
        DEMO_SUPPORTED_CATEGORIES.includes(venue.category),
        `Unsupported venue category ${venue.category}`
      );
      assert.ok(copy.marketplace.venues[venue.id].categoryLabel);
    }
  }
});

test("copy exposes two simulated role links without individual progress claims", () => {
  for (const lang of ["fr", "en"]) {
    const copy = DEMO_COPY[lang];
    assert.ok(copy.ui.step2.buyerLinkLabel);
    assert.ok(copy.ui.step2.sellerLinkLabel);
    assert.match(copy.ui.step2.simulatedLinkText, /simul/i);
  }

  const serialisedCopy = JSON.stringify(DEMO_COPY);
  assert.equal(/L'acheteur a renseigné|buyer has entered|buyer has completed/i.test(serialisedCopy), false);
  assert.equal(/s'engage plus facilement|engage more easily/i.test(serialisedCopy), false);
});

test("demo scripts perform no API/network calls, geolocation, storage persistence, internal refs, or Step 5 origin leaks", () => {
  const businessJsDir = path.join(rootDir, "src/assets/scripts/business");
  const files = fs.readdirSync(businessJsDir).filter((f) => f.endsWith(".js"));
  assert.equal(files.length, 3);

  const forbiddenPatterns = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bnavigator\.geolocation\b/,
    /\blocalStorage\b/,
    /\bsessionStorage\b/,
    /\bdocument\.cookie\b/,
    /\bindexedDB\b/,
    /\bWEB-B2B\b/i,
    /\bbacklog\b/i,
    /MD-2026-0418/,
    /\bPrivate\s+Meet\b/i,
    /—/,
  ];

  for (const file of files) {
    const source = fs.readFileSync(path.join(businessJsDir, file), "utf8");
    for (const pattern of forbiddenPatterns) {
      assert.equal(
        pattern.test(source),
        false,
        `${file} must not use forbidden pattern ${pattern}`
      );
    }
  }

  const rendererSrc = fs.readFileSync(
    path.join(businessJsDir, "demo-marketplace.js"),
    "utf8"
  );
  const mapFnMatch = rendererSrc.match(/function renderSchematicMapSvg[\s\S]*?\n\}/);
  assert.ok(mapFnMatch, "renderSchematicMapSvg function must exist");
  assert.equal(
    /buyerLocation|sellerLocation|Uccle|Schaerbeek/i.test(mapFnMatch[0]),
    false,
    "Step 5 schematic map must never display participant origin districts"
  );

  assert.equal(
    (rendererSrc.match(/data-role-start-link=/g) || []).length,
    2,
    "Step 2 must render separate buyer and seller start links"
  );

  const resultFnMatch = rendererSrc.match(
    /if \(state\.step === 6\) \{\s*const viewRole[\s\S]*?\/\/ Step 7:/
  );
  assert.ok(resultFnMatch, "Step 6 renderer must exist");
  assert.equal(
    /buyerLocation|sellerLocation|viewData\.ownOrigin|viewData\.otherOrigin/i.test(resultFnMatch[0]),
    false,
    "Step 6 must not render submitted origins"
  );
  assert.match(
    resultFnMatch[0],
    /<div class="demo-outcome-card">[\s\S]*?<\/div>\s*<p class="demo-field-note demo-outcome-note" data-origin-removed>/,
    "Step 6 must render the origin-removal note after, and outside, the proposed venue card"
  );

  const marketplaceReturnMatch = rendererSrc.match(/\/\/ Step 7:[\s\S]*?\n\}/);
  assert.ok(marketplaceReturnMatch, "Step 7 renderer must exist");
  assert.equal(
    /selectedVenue|\.venues\[|categoryLabel/i.test(marketplaceReturnMatch[0]),
    false,
    "Step 7 marketplace return must not render the accepted POI"
  );
});

test("demo pages remain noindex and keep analytics disabled", () => {
  for (const lang of ["en", "fr"]) {
    const pagePath = path.join(rootDir, "src/pages", lang, "business/demo.njk");
    const pageSource = fs.readFileSync(pagePath, "utf8");
    assert.match(pageSource, /robots:\s*["']noindex, follow["']/);
  }

  const layoutSource = fs.readFileSync(
    path.join(rootDir, "src/_includes/layouts/business-demo.njk"),
    "utf8"
  );
  assert.match(layoutSource, /disableAnalytics:\s*true/);
});
