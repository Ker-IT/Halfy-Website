import {
  DEMO_STEPS,
  DEMO_TRANSPORTS,
  DEMO_VENUES,
} from "./demo-data.js";
import { createDemoSimulation } from "./demo-simulation.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderBikeSvg(altText) {
  return `
    <svg
      class="demo-bike-svg"
      viewBox="0 0 240 150"
      role="img"
      aria-label="${escapeHtml(altText)}"
    >
      <rect x="0" y="0" width="240" height="150" rx="12" fill="#eef2f7" />
      <ellipse cx="120" cy="122" rx="82" ry="7" fill="#cbd5e1" opacity="0.6" />
      <!-- Wheels -->
      <circle cx="64" cy="96" r="26" fill="#ffffff" stroke="#1e293b" stroke-width="4" />
      <circle cx="64" cy="96" r="18" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 4" />
      <circle cx="64" cy="96" r="4" fill="#1e293b" />
      <circle cx="176" cy="96" r="26" fill="#ffffff" stroke="#1e293b" stroke-width="4" />
      <circle cx="176" cy="96" r="18" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 4" />
      <circle cx="176" cy="96" r="4" fill="#1e293b" />
      <!-- Rear rack & fenders -->
      <path d="M36 86 A28 28 0 0 1 88 76" fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round" />
      <path d="M44 64 L78 64 L92 84" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M150 76 A28 28 0 0 1 204 88" fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round" />
      <!-- City frame -->
      <path d="M64 96 L108 96 L146 58 L92 58 Z" fill="none" stroke="#2563eb" stroke-width="4.5" stroke-linejoin="round" />
      <line x1="108" y1="96" x2="88" y2="44" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <path d="M77 44 Q88 40 100 44" fill="none" stroke="#1e293b" stroke-width="6" stroke-linecap="round" />
      <!-- Fork & handlebar -->
      <line x1="176" y1="96" x2="144" y2="42" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <path d="M138 42 L156 42 L162 49" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Crankset -->
      <circle cx="108" cy="96" r="7" fill="#ffffff" stroke="#334155" stroke-width="3" />
      <circle cx="108" cy="96" r="2.5" fill="#1e293b" />
    </svg>
  `;
}

function renderTransportIconSvg(mode) {
  if (mode === "car") {
    return `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 17H3a1 1 0 0 1-1-1v-4l2.2-5.2A2 2 0 0 1 6 5.5h12a2 2 0 0 1 1.8 1.3L22 12v4a1 1 0 0 1-1 1h-2" />
        <circle cx="7.5" cy="17" r="2.5" />
        <circle cx="16.5" cy="17" r="2.5" />
        <path d="M10 17h4" />
        <path d="M3 12h18" />
      </svg>
    `;
  }
  if (mode === "walk") {
    return `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="13" cy="4.5" r="2" />
        <path d="M10 21l2.5-6.5L10 12l2-3.5 3.5 1.5 2 3.5" />
        <path d="M14.5 14.5L17 21" />
        <path d="M7 13l2.5-3.5" />
      </svg>
    `;
  }
  return `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  `;
}

function renderSchematicMapSvg(copy, selectedVenueId) {
  const markersHtml = DEMO_VENUES.map((venue, index) => {
    const venueCopy = copy.marketplace.venues[venue.id];
    const isSelected = selectedVenueId === venue.id;
    return `
      <g
        class="demo-map-pin ${isSelected ? "is-selected" : ""}"
        data-select-venue="${venue.id}"
        tabindex="0"
        role="button"
        aria-pressed="${isSelected ? "true" : "false"}"
        aria-label="${escapeHtml(venueCopy.name)}"
      >
        <circle
          cx="${venue.mapX}"
          cy="${venue.mapY}"
          r="${isSelected ? 16 : 13}"
          fill="${isSelected ? "#2665EC" : "#ffffff"}"
          stroke="#2665EC"
          stroke-width="3"
        />
        <text
          x="${venue.mapX}"
          y="${venue.mapY + 4}"
          text-anchor="middle"
          font-size="11"
          font-weight="700"
          fill="${isSelected ? "#ffffff" : "#2665EC"}"
        >${index + 1}</text>
        <rect
          x="${venue.mapX - 52}"
          y="${venue.mapY + 20}"
          width="104"
          height="21"
          rx="6"
          fill="#ffffff"
          stroke="${isSelected ? "#2665EC" : "#cbd5e1"}"
          stroke-width="${isSelected ? "1.5" : "1"}"
        />
        <text
          x="${venue.mapX}"
          y="${venue.mapY + 34}"
          text-anchor="middle"
          font-size="10.5"
          font-weight="700"
          fill="#111827"
        >${escapeHtml(venueCopy.name)}</text>
      </g>
    `;
  }).join("");

  return `
    <svg
      class="demo-schematic-map"
      viewBox="0 0 480 250"
      role="group"
      aria-label="${escapeHtml(copy.ui.step5.mapAriaLabel)}"
    >
      <!-- Base urban canvas -->
      <rect x="0" y="0" width="480" height="250" rx="14" fill="#f1f5f9" stroke="#cbd5e1" />

      <!-- Urban blocks -->
      <rect x="26" y="24" width="84" height="50" rx="6" fill="#e2e8f0" opacity="0.65" />
      <rect x="128" y="22" width="110" height="44" rx="6" fill="#e2e8f0" opacity="0.65" />
      <rect x="34" y="92" width="76" height="62" rx="6" fill="#e2e8f0" opacity="0.65" />
      <rect x="130" y="182" width="96" height="46" rx="6" fill="#e2e8f0" opacity="0.65" />
      <rect x="260" y="188" width="94" height="42" rx="6" fill="#e2e8f0" opacity="0.65" />
      <rect x="372" y="138" width="82" height="84" rx="6" fill="#e2e8f0" opacity="0.65" />

      <!-- Urban green spaces (parks) -->
      <rect x="312" y="24" width="140" height="92" rx="14" fill="#dcfce7" stroke="#bbf7d0" stroke-width="1" />
      <ellipse cx="76" cy="204" rx="44" ry="26" fill="#dcfce7" stroke="#bbf7d0" stroke-width="1" />

      <!-- Stylized river / canal -->
      <path d="M-10 218 C110 198, 220 238, 355 215 S450 185, 495 192" fill="none" stroke="#bfdbfe" stroke-width="14" stroke-linecap="round" />

      <!-- Secondary streets -->
      <path d="M118 0 L118 250" stroke="#ffffff" stroke-width="6" />
      <path d="M248 0 L248 250" stroke="#ffffff" stroke-width="6" />
      <path d="M362 0 L362 250" stroke="#ffffff" stroke-width="6" />
      <path d="M0 80 L480 80" stroke="#ffffff" stroke-width="6" />
      <path d="M0 166 L480 166" stroke="#ffffff" stroke-width="6" />

      <!-- Main urban avenues -->
      <path d="M-10 132 Q 210 106 490 128" fill="none" stroke="#ffffff" stroke-width="10" />
      <path d="M40 250 L315 0" fill="none" stroke="#ffffff" stroke-width="9" />

      <!-- Illustrative shared search zone (no participant starting points) -->
      <ellipse
        cx="250"
        cy="128"
        rx="132"
        ry="78"
        fill="rgba(38, 101, 236, 0.08)"
        stroke="#2665EC"
        stroke-width="1.75"
        stroke-dasharray="5 5"
      />
      <rect x="196" y="34" width="108" height="20" rx="10" fill="#ffffff" stroke="#93c5fd" stroke-width="1" />
      <text x="250" y="48" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">
        ${escapeHtml(copy.ui.step5.mapSharedZoneLabel)}
      </text>

      ${markersHtml}
    </svg>
  `;
}

function renderMarketplaceHeader(copy, state) {
  let badgeHtml = "";
  if (state.step === 3) {
    badgeHtml = `<span class="demo-role-pill">${escapeHtml(copy.ui.activeRoleLabel)} <strong>${escapeHtml(copy.ui.roleBuyerLabel)}</strong></span>`;
  } else if (state.step === 4) {
    badgeHtml = `<span class="demo-role-pill">${escapeHtml(copy.ui.activeRoleLabel)} <strong>${escapeHtml(copy.ui.roleSellerLabel)}</strong></span>`;
  } else if (state.step === 6) {
    const label =
      state.resultViewRole === "seller"
        ? copy.ui.roleSellerLabel
        : copy.ui.roleBuyerLabel;
    badgeHtml = `<span class="demo-role-pill">${escapeHtml(copy.ui.activeRoleLabel)} <strong>${escapeHtml(label)}</strong></span>`;
  } else {
    const contextLabel = copy.ui.headerContexts[state.step] || `${copy.ui.stepPrefix} ${state.step} ${copy.ui.stepOf} ${DEMO_STEPS.length}`;
    badgeHtml = `<span class="demo-step-counter">${escapeHtml(contextLabel)}</span>`;
  }

  return `
    <div class="demo-market-topbar">
      <div class="demo-market-brand">
        <span class="demo-market-monogram" aria-hidden="true">MD</span>
        <div>
          <strong class="demo-market-name">${escapeHtml(copy.marketplace.brandName)}</strong>
          <span class="demo-market-tag">${escapeHtml(copy.marketplace.brandTag)}</span>
        </div>
      </div>
      <div class="demo-market-meta">${badgeHtml}</div>
    </div>
  `;
}

function renderListingSummary(copy) {
  const mp = copy.marketplace;
  const listing = mp.listing;
  return `
    <div class="demo-listing-card">
      <div class="demo-listing-media">
        ${renderBikeSvg(listing.imageAlt)}
      </div>
      <div class="demo-listing-info">
        <div class="demo-listing-header">
          <h3>${escapeHtml(listing.title)}</h3>
          <span class="demo-listing-price">${escapeHtml(listing.price)}</span>
        </div>
        <div class="demo-listing-tags">
          <span class="demo-listing-tag">${escapeHtml(listing.condition)}</span>
          <span class="demo-listing-tag">${escapeHtml(listing.handoff)}</span>
          <span class="demo-listing-tag">${escapeHtml(listing.city)}</span>
        </div>
        <div class="demo-seller-row">
          <span class="demo-avatar demo-avatar--seller" aria-hidden="true">${escapeHtml(mp.sellerInitials)}</span>
          <span class="demo-seller-meta">
            <strong>${escapeHtml(mp.sellerName)}</strong>
            <small>${escapeHtml(mp.sellerMemberSince)}</small>
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderChatMessages(copy) {
  const mp = copy.marketplace;
  return mp.conversation
    .map((msg) => {
      const isBuyer = msg.authorRole === "buyer";
      const initials = isBuyer ? mp.buyerInitials : mp.sellerInitials;
      const author = isBuyer
        ? `${mp.roleLabels.buyer} · ${mp.buyerName}`
        : `${mp.roleLabels.seller} · ${mp.sellerName}`;
      return `
        <div class="demo-chat-row ${isBuyer ? "is-buyer" : "is-seller"}">
          <span class="demo-avatar ${isBuyer ? "demo-avatar--buyer" : "demo-avatar--seller"}" aria-hidden="true">${escapeHtml(initials)}</span>
          <div class="demo-chat-bubble ${isBuyer ? "is-buyer" : "is-seller"}">
            <div class="demo-chat-meta">
              <span class="demo-chat-author">${escapeHtml(author)}</span>
              <span class="demo-chat-time">${escapeHtml(msg.time)}</span>
            </div>
            <p>${escapeHtml(msg.text)}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderTransportSelector(copy, selectedMode, actionAttr) {
  return `
    <div class="demo-transport-grid" role="radiogroup">
      ${DEMO_TRANSPORTS.map((mode) => {
        const modeCopy = copy.marketplace.transports[mode];
        const isSelected = selectedMode === mode;
        return `
          <button
            type="button"
            class="demo-choice-card ${isSelected ? "is-selected" : ""}"
            ${actionAttr}="${mode}"
            role="radio"
            aria-checked="${isSelected ? "true" : "false"}"
          >
            <span class="demo-choice-icon">${renderTransportIconSvg(mode)}</span>
            <strong>${escapeHtml(modeCopy.label)}</strong>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderStepBody(copy, state, sim) {
  const ui = copy.ui;
  const mp = copy.marketplace;

  if (state.step === 1) {
    return `
      ${renderListingSummary(copy)}
      <div class="demo-stage-block">
        <h2 class="demo-stage-heading" tabindex="-1">${escapeHtml(ui.step1.heading)}</h2>
        <div class="demo-chat-thread">${renderChatMessages(copy)}</div>
        <div class="demo-safemeet-callout">
          <div class="demo-safemeet-callout-row">
            <img src="/assets/safemeet-logos/svg/logo-symbol.svg" alt="SafeMeet" width="40" height="27" class="demo-safemeet-icon" />
            <div class="demo-safemeet-callout-text">
              <h3>${escapeHtml(ui.step1.promptTitle)}</h3>
              <p>${escapeHtml(ui.step1.promptText)}</p>
            </div>
          </div>
          <div class="demo-action-row">
            <button type="button" class="btn-web demo-btn" data-action="start-invitation">
              ${escapeHtml(ui.step1.cta)}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.step === 2) {
    return `
      <div class="demo-stage-block">
        <div class="demo-safemeet-header-bar">
          <img src="/assets/safemeet-logos/svg/logo-lockup.svg" alt="SafeMeet" width="112" height="64" class="demo-safemeet-lockup-sm" />
        </div>
        <h2 class="demo-stage-heading" tabindex="-1">${escapeHtml(ui.step2.heading)}</h2>
        <div class="demo-info-box">
          <p><strong>${escapeHtml(ui.step2.listingLine)}</strong></p>
          <p class="demo-notice-text">${escapeHtml(ui.step2.note)}</p>
        </div>
        <div class="demo-action-row demo-action-row--split">
          <button type="button" class="btn-secondary demo-btn" data-action="back">${escapeHtml(ui.backButton)}</button>
          <button type="button" class="btn-web demo-btn" data-action="continue-buyer">${escapeHtml(ui.step2.cta)}</button>
        </div>
      </div>
    `;
  }

  if (state.step === 3) {
    return `
      <div class="demo-stage-block">
        <h2 class="demo-stage-heading" tabindex="-1">${escapeHtml(ui.step3.heading)}</h2>
        <div class="demo-field-card">
          <span class="demo-field-label">${escapeHtml(ui.step3.locationLabel)}</span>
          <strong class="demo-field-value">${escapeHtml(mp.buyerLocation)}</strong>
          <p class="demo-field-note">${escapeHtml(ui.step3.privacyNote)}</p>
        </div>
        <div class="demo-field-group">
          <p class="demo-sub-heading">${escapeHtml(ui.step3.transportHeading)}</p>
          ${renderTransportSelector(copy, state.buyerTransport, "data-buyer-transport")}
          <p class="demo-field-note">${escapeHtml(ui.step3.transportNote)}</p>
        </div>
        <div class="demo-action-row demo-action-row--split">
          <button type="button" class="btn-secondary demo-btn" data-action="back">${escapeHtml(ui.backButton)}</button>
          <button type="button" class="btn-web demo-btn" data-action="advance-seller">${escapeHtml(ui.step3.cta)}</button>
        </div>
      </div>
    `;
  }

  if (state.step === 4) {
    return `
      <div class="demo-stage-block">
        <div class="demo-status-box demo-status-box--success">
          <p><strong>${escapeHtml(ui.step4.buyerDoneTitle)}</strong></p>
          <p class="demo-field-note">${escapeHtml(ui.step4.buyerDoneNote)}</p>
        </div>
        <h2 class="demo-stage-heading" tabindex="-1">${escapeHtml(ui.step4.heading)}</h2>
        <div class="demo-field-card">
          <span class="demo-field-label">${escapeHtml(ui.step4.locationLabel)}</span>
          <strong class="demo-field-value">${escapeHtml(mp.sellerLocation)}</strong>
        </div>
        <div class="demo-field-group">
          <p class="demo-sub-heading">${escapeHtml(ui.step4.transportHeading)}</p>
          ${renderTransportSelector(copy, state.sellerTransport, "data-seller-transport")}
          <p class="demo-field-note">${escapeHtml(ui.step4.staticNote)}</p>
        </div>
        <div class="demo-action-row demo-action-row--split">
          <button type="button" class="btn-secondary demo-btn" data-action="back">${escapeHtml(ui.step4.viewBuyerBtn)}</button>
          <button type="button" class="btn-web demo-btn" data-action="advance-places">${escapeHtml(ui.step4.cta)}</button>
        </div>
      </div>
    `;
  }

  if (state.step === 5) {
    const venueListHtml = DEMO_VENUES.map((venue, index) => {
      const venueCopy = mp.venues[venue.id];
      const isSelected = state.selectedVenueId === venue.id;
      return `
        <button
          type="button"
          class="demo-venue-card ${isSelected ? "is-selected" : ""}"
          data-select-venue="${venue.id}"
          aria-pressed="${isSelected ? "true" : "false"}"
        >
          <span class="demo-venue-num">${index + 1}</span>
          <span class="demo-venue-text">
            <strong>${escapeHtml(venueCopy.name)}</strong>
            <small>${escapeHtml(venueCopy.area)} · ${escapeHtml(venueCopy.summary)}</small>
          </span>
        </button>
      `;
    }).join("");

    return `
      <div class="demo-stage-block">
        <h2 class="demo-stage-heading" tabindex="-1">${escapeHtml(ui.step5.heading)}</h2>
        <p class="demo-notice-text">${escapeHtml(ui.step5.lead)}</p>
        ${renderSchematicMapSvg(copy, state.selectedVenueId)}
        <div class="demo-venue-list">${venueListHtml}</div>
        <p class="demo-field-note">${escapeHtml(ui.step5.transportNotice)}</p>
        <div class="demo-action-row demo-action-row--split">
          <button type="button" class="btn-secondary demo-btn" data-action="back">${escapeHtml(ui.backButton)}</button>
          <button type="button" class="btn-web demo-btn" data-action="advance-result">${escapeHtml(ui.step5.cta)}</button>
        </div>
      </div>
    `;
  }

  if (state.step === 6) {
    const viewRole = state.resultViewRole;
    const viewData = sim.getParticipantViewData(viewRole);
    const isConfirmed = state.meetupConfirmedSimulated;

    return `
      <div class="demo-stage-block">
        <h2 class="demo-stage-heading" tabindex="-1">${escapeHtml(ui.step6.heading)}</h2>
        <div class="demo-view-switch" role="group" aria-label="${escapeHtml(ui.step6.toggleLabel)}">
          <button
            type="button"
            class="demo-tab-btn ${viewRole === "buyer" ? "is-active" : ""}"
            data-result-role="buyer"
            aria-pressed="${viewRole === "buyer" ? "true" : "false"}"
          >
            ${escapeHtml(ui.step6.buyerViewBtn)}
          </button>
          <button
            type="button"
            class="demo-tab-btn ${viewRole === "seller" ? "is-active" : ""}"
            data-result-role="seller"
            aria-pressed="${viewRole === "seller" ? "true" : "false"}"
          >
            ${escapeHtml(ui.step6.sellerViewBtn)}
          </button>
        </div>

        <div class="demo-outcome-card">
          <div class="demo-outcome-venue">
            <span class="demo-field-label">${escapeHtml(ui.step6.selectedVenueLabel)}</span>
            <strong>${escapeHtml(viewData.venue ? viewData.venue.name : "")}</strong>
            <span>${escapeHtml(viewData.venue ? viewData.venue.area : "")}</span>
          </div>
          <dl class="demo-outcome-details">
            <div>
              <dt>${escapeHtml(ui.step6.ownOriginLabel)}</dt>
              <dd>${escapeHtml(viewData.ownOrigin)} (${escapeHtml(viewData.ownTransport || "")})</dd>
            </div>
            <div>
              <dt>${escapeHtml(ui.step6.otherOriginLabel)}</dt>
              <dd><span class="demo-private-pill">${escapeHtml(ui.step6.otherOriginHidden)}</span></dd>
            </div>
          </dl>
        </div>

        <div class="demo-confirm-bar ${isConfirmed ? "is-confirmed" : ""}">
          <div class="demo-confirm-status">
            <span class="demo-field-label">${escapeHtml(ui.step6.confirmHeading)}</span>
            <span class="demo-confirm-pill ${isConfirmed ? "is-confirmed" : ""}">
              ${escapeHtml(isConfirmed ? ui.step6.confirmDone : ui.step6.confirmPending)}
            </span>
          </div>
          <button
            type="button"
            class="demo-inline-action"
            data-action="confirm-simulated"
            ${isConfirmed ? "disabled" : ""}
          >
            ${escapeHtml(isConfirmed ? ui.step6.confirmedBtn : ui.step6.confirmBtn)}
          </button>
        </div>

        <div class="demo-action-row demo-action-row--split">
          <button type="button" class="btn-secondary demo-btn" data-action="back">${escapeHtml(ui.backButton)}</button>
          <button type="button" class="btn-web demo-btn" data-action="advance-return">${escapeHtml(ui.step6.cta)}</button>
        </div>
      </div>
    `;
  }

  // Step 7: Return to marketplace + synthesis + restart + commercial contact
  const selectedVenue = mp.venues[state.selectedVenueId];
  const statusText = state.meetupConfirmedSimulated
    ? ui.step7.summaryStatusConfirmed
    : ui.step7.summaryStatusPending;
  const takeawaysHtml = ui.step7.takeaways
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    ${renderListingSummary(copy)}
    <div class="demo-stage-block">
      <h2 class="demo-stage-heading" tabindex="-1">${escapeHtml(ui.step7.heading)}</h2>
      <div class="demo-chat-thread">
        ${renderChatMessages(copy)}
        <div class="demo-chat-summary-card">
          <div class="demo-chat-summary-top">
            <img src="/assets/safemeet-logos/svg/logo-symbol.svg" alt="SafeMeet" width="32" height="22" class="demo-safemeet-icon-sm" />
            <span class="demo-confirm-pill ${state.meetupConfirmedSimulated ? "is-confirmed" : ""}">${escapeHtml(statusText)}</span>
          </div>
          <p class="demo-chat-summary-title">${escapeHtml(ui.step7.summaryHeading)}</p>
          <p class="demo-chat-summary-venue">${escapeHtml(selectedVenue ? selectedVenue.name : "")} · ${escapeHtml(selectedVenue ? selectedVenue.area : "")}</p>
          <p class="demo-field-note">${escapeHtml(ui.step7.summaryNote)}</p>
        </div>
      </div>

      <div class="demo-takeaways-card">
        <h3>${escapeHtml(ui.step7.conclusionTitle)}</h3>
        <ul>${takeawaysHtml}</ul>
      </div>

      <div class="demo-action-row demo-action-row--split">
        <button type="button" class="btn-secondary demo-btn" data-action="restart">
          ${escapeHtml(ui.restartButton)}
        </button>
        <a href="${escapeHtml(ui.step7.contactHref)}" class="btn-web demo-btn">
          ${escapeHtml(ui.step7.contactCta)}
        </a>
      </div>
      <p class="demo-field-note">${escapeHtml(ui.step7.contactNote)}</p>
    </div>
  `;
}

function renderProgressBar(copy, state) {
  return `
    <nav class="demo-stepper" aria-label="${escapeHtml(copy.ui.progressLabel)}">
      <ol class="demo-stepper-list">
        ${DEMO_STEPS.map((stepNum, idx) => {
          const isCurrent = state.step === stepNum;
          const isCompleted = stepNum < state.step;
          const isReachable = stepNum <= state.maxStepReached;
          return `
            <li class="demo-stepper-item ${isCurrent ? "is-current" : ""} ${isCompleted ? "is-completed" : ""}">
              <button
                type="button"
                class="demo-stepper-btn"
                data-go-step="${stepNum}"
                ${isCurrent ? 'aria-current="step"' : ""}
                ${!isReachable ? "disabled" : ""}
              >
                <span class="demo-stepper-num">${stepNum}</span>
                <span class="demo-stepper-label">${escapeHtml(copy.ui.stepTitles[idx])}</span>
              </button>
            </li>
          `;
        }).join("")}
      </ol>
    </nav>
  `;
}

function renderPanel(copy, step) {
  const panelCopy = copy.panel;
  const stepInfo = panelCopy.steps[step];
  return `
    <div class="demo-panel-card">
      <div class="demo-panel-header">
        <span class="demo-panel-badge">${escapeHtml(panelCopy.stepLabel)} ${step} / ${DEMO_STEPS.length}</span>
        <h2>${escapeHtml(stepInfo.title)}</h2>
      </div>
      <p class="demo-panel-explanation">${escapeHtml(stepInfo.explanation)}</p>
      <div class="demo-panel-benefit">
        <h3>${escapeHtml(panelCopy.forMarketplaceLabel)}</h3>
        <p>${escapeHtml(stepInfo.forMarketplace)}</p>
      </div>
    </div>
  `;
}

function scrollStageIntoViewIfObscured(stageSlot) {
  const header = document.querySelector(".site-header");
  const headerBottom = header ? header.getBoundingClientRect().bottom : 80;
  const anchorEl = stageSlot.querySelector(".demo-stepper") || stageSlot;
  const rect = anchorEl.getBoundingClientRect();
  const safeTop = headerBottom + 16;

  if (rect.top < safeTop || rect.top > window.innerHeight * 0.55) {
    const targetY = Math.max(0, window.scrollY + rect.top - safeTop);
    window.scrollTo({ top: targetY, behavior: "auto" });
  }
}

function mountDemo() {
  const root = document.getElementById("business-demo-root");
  if (!root) return;

  const lang = root.getAttribute("data-demo-lang") === "fr" ? "fr" : "en";
  const sim = createDemoSimulation(lang);

  const stageSlot = root.querySelector("[data-demo-stage]");
  const panelSlot = root.querySelector("[data-demo-panel]");
  if (!stageSlot || !panelSlot) return;

  function render(onStepTransition = false) {
    const state = sim.getState();
    const copy = sim.getCopy();
    const errorMessage = state.errorKey ? copy.ui.errors[state.errorKey] || "" : "";

    stageSlot.innerHTML = `
      ${renderProgressBar(copy, state)}
      <div class="demo-market-frame">
        ${renderMarketplaceHeader(copy, state)}
        <div class="demo-market-body">
          ${
            errorMessage
              ? `<div class="demo-error-banner" role="alert">${escapeHtml(errorMessage)}</div>`
              : ""
          }
          ${renderStepBody(copy, state, sim)}
        </div>
      </div>
    `;

    panelSlot.innerHTML = renderPanel(copy, state.step);

    if (onStepTransition) {
      scrollStageIntoViewIfObscured(stageSlot);
      const heading = stageSlot.querySelector(".demo-stage-heading");
      if (heading) {
        heading.focus({ preventScroll: true });
      }
    }
  }

  function handleActionElement(target) {
    const actionBtn = target.closest("[data-action]");
    if (actionBtn) {
      const action = actionBtn.getAttribute("data-action");
      let res = null;
      let moveStep = false;
      if (action === "start-invitation") {
        res = sim.startInvitation();
        moveStep = true;
      } else if (action === "continue-buyer") {
        res = sim.continueAsBuyer();
        moveStep = true;
      } else if (action === "advance-seller") {
        res = sim.advanceToSeller();
        moveStep = true;
      } else if (action === "advance-places") {
        res = sim.advanceToPlaces();
        moveStep = true;
      } else if (action === "advance-result") {
        res = sim.advanceToResult();
        moveStep = true;
      } else if (action === "confirm-simulated") {
        res = sim.confirmMeetupSimulated();
      } else if (action === "advance-return") {
        res = sim.advanceToMarketplaceReturn();
        moveStep = true;
      } else if (action === "back") {
        res = sim.goBack();
        moveStep = true;
      } else if (action === "restart") {
        res = sim.reset();
        moveStep = true;
      }
      if (res) {
        render(Boolean(res.ok && moveStep));
      }
      return true;
    }

    const buyerTransportBtn = target.closest("[data-buyer-transport]");
    if (buyerTransportBtn) {
      sim.setBuyerTransport(buyerTransportBtn.getAttribute("data-buyer-transport"));
      render(false);
      return true;
    }

    const sellerTransportBtn = target.closest("[data-seller-transport]");
    if (sellerTransportBtn) {
      sim.setSellerTransport(sellerTransportBtn.getAttribute("data-seller-transport"));
      render(false);
      return true;
    }

    const venueBtn = target.closest("[data-select-venue]");
    if (venueBtn) {
      sim.selectVenue(venueBtn.getAttribute("data-select-venue"));
      render(false);
      return true;
    }

    const resultRoleBtn = target.closest("[data-result-role]");
    if (resultRoleBtn) {
      sim.setResultViewRole(resultRoleBtn.getAttribute("data-result-role"));
      render(false);
      return true;
    }

    const stepBtn = target.closest("[data-go-step]");
    if (stepBtn && !stepBtn.hasAttribute("disabled")) {
      const targetStep = Number(stepBtn.getAttribute("data-go-step"));
      const res = sim.goToStep(targetStep);
      render(Boolean(res.ok));
      return true;
    }

    return false;
  }

  stageSlot.addEventListener("click", function (event) {
    handleActionElement(event.target);
  });

  stageSlot.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const svgPin = event.target.closest("g[data-select-venue]");
    if (svgPin) {
      event.preventDefault();
      handleActionElement(svgPin);
    }
  });

  render(false);
}

mountDemo();
