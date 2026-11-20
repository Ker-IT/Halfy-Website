(function () {
  const toggleBtn = document.querySelector("[data-nav-toggle]");
  const drawer = document.querySelector("[data-mobile-drawer]");

  function setMenuState(isOpen) {
    if (!toggleBtn || !drawer) return;
    const openLabel = toggleBtn.getAttribute("data-open-label") || "Open navigation menu";
    const closeLabel = toggleBtn.getAttribute("data-close-label") || "Close navigation menu";
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
    drawer.hidden = !isOpen;
    drawer.classList.toggle("is-open", isOpen);
  }

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", function () {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  drawer.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggleBtn.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      toggleBtn.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980 && toggleBtn.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
  });
})();
