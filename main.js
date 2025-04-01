// ==UserScript==
// @name         Twitch Theatermode
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Auto activate theater mode on Twitch + remove front-page-carousel and reapply on page change
// @author       HaCk3Dq
// @match        http*://*.twitch.tv/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  activateTheatreMode();
  removeMainCarousel();
  removePinned();
  watchURL();
})();

function watchURL() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      activateTheatreMode();
      removePinned();
      removeMainCarousel();
    }
  }).observe(document, { subtree: true, childList: true });
}

function removeMainCarousel() {
  const carouselNode = document.querySelector(
    '[data-a-target="front-page-carousel"]',
  );
  if (carouselNode) {
    carouselNode.remove();
    console.log("Front page carousel removed");
  } else {
    console.log("No front page carousel element found");
  }
}

function removePinned() {
  setTimeout(() => {
    const pinnedMessage = document.getElementsByClassName(
      "community-highlight-stack__card community-highlight-stack__card--wide",
    )[0];
    if (pinnedMessage) {
      pinnedMessage.remove();
      console.log("Pinned removed");
    } else {
      console.log("Pinned not found");
    }
  }, 3000);
}

function activateTheatreMode() {
  setTimeout(() => {
    const theatreModeButton = document.querySelector(
      'button[aria-label="Theatre Mode (alt+t)"]',
    );
    if (theatreModeButton) {
      theatreModeButton.click();
      console.log("Theater Mode button clicked");
    } else {
      console.log("Theater Mode button not found");
    }
  }, 1500);
}
