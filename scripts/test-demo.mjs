import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  DEMO_COPY,
  DEMO_STEPS,
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
  assert.equal(state.invitationCreated, false);
  assert.equal(state.buyerTransport, null);
  assert.equal(state.sellerTransport, null);
  assert.equal(state.selectedVenueId, null);
  assert.equal(state.resultViewRole, "buyer");
  assert.equal(state.meetupConfirmedSimulated, false);
  assert.equal(state.errorKey, null);
});

test("full 7-step flow transitions cleanly from chat to marketplace return", () => {
  const sim = createDemoSimulation("en");

  assert.equal(sim.startInvitation().ok, true);
  assert.equal(sim.getState().step, 2);
  assert.equal(sim.getState().invitationCreated, true);

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

  assert.equal(sim.selectVenue("cafe-centre").ok, true);
  assert.equal(sim.advanceToResult().ok, true);
  assert.equal(sim.getState().step, 6);
  assert.equal(sim.getState().resultViewRole, "buyer");

  assert.equal(sim.setResultViewRole("seller").ok, true);
  assert.equal(sim.getState().resultViewRole, "seller");

  assert.equal(sim.confirmMeetupSimulated().ok, true);
  assert.equal(sim.getState().meetupConfirmedSimulated, true);

  assert.equal(sim.advanceToMarketplaceReturn().ok, true);
  assert.equal(sim.getState().step, 7);
  assert.equal(sim.getState().maxStepReached, 7);
});

test("changing venue or transport after confirmation invalidates meetupConfirmedSimulated", () => {
  const sim = createDemoSimulation("fr");
  sim.startInvitation();
  sim.continueAsBuyer();
  sim.setBuyerTransport("bike");
  sim.advanceToSeller();
  sim.setSellerTransport("walk");
  sim.advanceToPlaces();
  sim.selectVenue("cafe-centre");
  sim.advanceToResult();
  sim.confirmMeetupSimulated();
  sim.advanceToMarketplaceReturn();

  assert.equal(sim.getState().meetupConfirmedSimulated, true);
  assert.equal(sim.getState().maxStepReached, 7);

  // Going back to step 5 and switching venue invalidates prior confirmation & caps maxStepReached
  assert.equal(sim.goToStep(5).ok, true);
  assert.equal(sim.selectVenue("place-centrale").ok, true);
  assert.equal(sim.getState().meetupConfirmedSimulated, false);
  assert.equal(sim.getState().maxStepReached, 5);

  // Confirm again, then alter transport and verify confirmation invalidates
  assert.equal(sim.advanceToResult().ok, true);
  assert.equal(sim.confirmMeetupSimulated().ok, true);
  assert.equal(sim.getState().meetupConfirmedSimulated, true);

  assert.equal(sim.goToStep(3).ok, true);
  assert.equal(sim.setBuyerTransport("car").ok, true);
  assert.equal(sim.getState().meetupConfirmedSimulated, false);
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
  assert.equal(sim.startInvitation().ok, true);
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

test("participant view separates buyer and seller starting locations", () => {
  const sim = createDemoSimulation("fr");
  sim.startInvitation();
  sim.continueAsBuyer();
  sim.setBuyerTransport("bike");
  sim.advanceToSeller();
  sim.setSellerTransport("car");
  sim.advanceToPlaces();
  sim.selectVenue("place-centrale");
  sim.advanceToResult();

  const buyerView = sim.getParticipantViewData("buyer");
  assert.equal(buyerView.ownOrigin, "Uccle, Bruxelles");
  assert.equal(buyerView.otherOriginVisible, false);
  assert.equal(buyerView.otherOrigin, null);
  assert.equal(buyerView.venue.name, "Place Centrale");

  const sellerView = sim.getParticipantViewData("seller");
  assert.equal(sellerView.ownOrigin, "Schaerbeek, Bruxelles");
  assert.equal(sellerView.otherOriginVisible, false);
  assert.equal(sellerView.otherOrigin, null);
  assert.equal(sellerView.venue.name, "Place Centrale");
});

test("goBack, goToStep, and reset restore expected states", () => {
  const sim = createDemoSimulation("en");
  sim.startInvitation();
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
  assert.equal(resetState.invitationCreated, false);
  assert.equal(resetState.buyerTransport, null);
  assert.equal(resetState.sellerTransport, null);
  assert.equal(resetState.selectedVenueId, null);
  assert.equal(resetState.meetupConfirmedSimulated, false);
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
    }
  }
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
});
