import {
  DEMO_COPY,
  DEMO_ROLES,
  DEMO_STEPS,
  DEMO_TRANSPORTS,
  DEMO_VENUES,
} from "./demo-data.js";

const VALID_VENUE_IDS = new Set(DEMO_VENUES.map((venue) => venue.id));

function cloneState(state) {
  return { ...state };
}

export function createDemoSimulation(initialLang = "en") {
  const lang = initialLang === "fr" ? "fr" : "en";
  const copy = DEMO_COPY[lang];

  function createInitialState() {
    return {
      lang,
      step: 1,
      maxStepReached: 1,
      activeRole: "buyer",
      invitationCreated: false,
      buyerTransport: null,
      sellerTransport: null,
      selectedVenueId: null,
      resultViewRole: "buyer",
      meetupConfirmedSimulated: false,
      errorKey: null,
    };
  }

  let state = createInitialState();

  function fail(errorKey) {
    state.errorKey = errorKey;
    return { ok: false, errorKey, state: cloneState(state) };
  }

  function succeed() {
    state.errorKey = null;
    return { ok: true, errorKey: null, state: cloneState(state) };
  }

  function validatePrerequisitesForStep(targetStep) {
    if (targetStep >= 3 && !state.invitationCreated) {
      return "missingInvitation";
    }
    if (targetStep >= 4 && !state.buyerTransport) {
      return "missingBuyerTransport";
    }
    if (targetStep >= 5 && !state.sellerTransport) {
      return "missingSellerTransport";
    }
    if (targetStep >= 6 && !state.selectedVenueId) {
      return "missingVenue";
    }
    return null;
  }

  return {
    getState() {
      return cloneState(state);
    },

    getCopy() {
      return copy;
    },

    startInvitation() {
      if (state.step !== 1) {
        return fail("invalidStep");
      }
      state.invitationCreated = true;
      state.step = 2;
      state.maxStepReached = Math.max(state.maxStepReached, 2);
      return succeed();
    },

    continueAsBuyer() {
      if (state.step !== 2 || !state.invitationCreated) {
        return fail("missingInvitation");
      }
      state.activeRole = "buyer";
      state.step = 3;
      state.maxStepReached = Math.max(state.maxStepReached, 3);
      return succeed();
    },

    setBuyerTransport(mode) {
      if (!DEMO_TRANSPORTS.includes(mode)) {
        return fail("missingBuyerTransport");
      }
      if (state.step < 3 || !state.invitationCreated) {
        return fail("invalidStep");
      }
      if (state.buyerTransport !== mode) {
        state.meetupConfirmedSimulated = false;
      }
      state.buyerTransport = mode;
      return succeed();
    },

    advanceToSeller() {
      if (state.step !== 3) {
        return fail("invalidStep");
      }
      if (!state.buyerTransport) {
        return fail("missingBuyerTransport");
      }
      state.activeRole = "seller";
      state.step = 4;
      state.maxStepReached = Math.max(state.maxStepReached, 4);
      return succeed();
    },

    setSellerTransport(mode) {
      if (!DEMO_TRANSPORTS.includes(mode)) {
        return fail("missingSellerTransport");
      }
      if (state.step < 4 || !state.buyerTransport) {
        return fail("invalidStep");
      }
      if (state.sellerTransport !== mode) {
        state.meetupConfirmedSimulated = false;
      }
      state.sellerTransport = mode;
      return succeed();
    },

    advanceToPlaces() {
      if (state.step !== 4) {
        return fail("invalidStep");
      }
      if (!state.sellerTransport) {
        return fail("missingSellerTransport");
      }
      state.step = 5;
      state.maxStepReached = Math.max(state.maxStepReached, 5);
      return succeed();
    },

    selectVenue(venueId) {
      if (!VALID_VENUE_IDS.has(venueId)) {
        return fail("missingVenue");
      }
      if (state.step < 5 || !state.sellerTransport) {
        return fail("invalidStep");
      }
      if (state.selectedVenueId !== venueId) {
        state.meetupConfirmedSimulated = false;
        state.maxStepReached = Math.min(state.maxStepReached, 5);
      }
      state.selectedVenueId = venueId;
      return succeed();
    },

    advanceToResult() {
      if (state.step !== 5) {
        return fail("invalidStep");
      }
      if (!state.selectedVenueId) {
        return fail("missingVenue");
      }
      state.resultViewRole = "buyer";
      state.activeRole = "buyer";
      state.step = 6;
      state.maxStepReached = Math.max(state.maxStepReached, 6);
      return succeed();
    },

    setResultViewRole(role) {
      if (!DEMO_ROLES.includes(role) || state.step < 6) {
        return fail("invalidStep");
      }
      state.resultViewRole = role;
      state.activeRole = role;
      return succeed();
    },

    confirmMeetupSimulated() {
      if (state.step !== 6 || !state.selectedVenueId) {
        return fail("invalidStep");
      }
      state.meetupConfirmedSimulated = true;
      return succeed();
    },

    advanceToMarketplaceReturn() {
      if (state.step !== 6) {
        return fail("invalidStep");
      }
      if (!state.selectedVenueId) {
        return fail("missingVenue");
      }
      state.step = 7;
      state.maxStepReached = 7;
      return succeed();
    },

    goBack() {
      if (state.step <= 1) {
        return fail("invalidStep");
      }
      state.step -= 1;
      if (state.step === 3) {
        state.activeRole = "buyer";
      } else if (state.step === 4) {
        state.activeRole = "seller";
      }
      return succeed();
    },

    goToStep(targetStep) {
      if (!DEMO_STEPS.includes(targetStep)) {
        return fail("invalidStep");
      }
      if (targetStep > state.maxStepReached) {
        return fail("invalidStep");
      }
      const prerequisiteError = validatePrerequisitesForStep(targetStep);
      if (prerequisiteError) {
        return fail(prerequisiteError);
      }
      state.step = targetStep;
      if (targetStep === 3) {
        state.activeRole = "buyer";
      } else if (targetStep === 4) {
        state.activeRole = "seller";
      } else if (targetStep === 6) {
        state.activeRole = state.resultViewRole;
      }
      return succeed();
    },

    reset() {
      state = createInitialState();
      return succeed();
    },

    getParticipantViewData(role) {
      if (!DEMO_ROLES.includes(role)) {
        return null;
      }
      const venueObj = state.selectedVenueId
        ? copy.marketplace.venues[state.selectedVenueId] || null
        : null;

      if (role === "buyer") {
        return {
          role: "buyer",
          ownName: copy.marketplace.buyerName,
          ownOrigin: copy.marketplace.buyerLocation,
          ownTransport: state.buyerTransport
            ? copy.marketplace.transports[state.buyerTransport].label
            : null,
          otherOriginVisible: false,
          otherOrigin: null,
          venue: venueObj,
        };
      }

      return {
        role: "seller",
        ownName: copy.marketplace.sellerName,
        ownOrigin: copy.marketplace.sellerLocation,
        ownTransport: state.sellerTransport
          ? copy.marketplace.transports[state.sellerTransport].label
          : null,
        otherOriginVisible: false,
        otherOrigin: null,
        venue: venueObj,
      };
    },
  };
}
