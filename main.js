// ==UserScript==
// @name         Twitch Theatermode
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Auto activate theater mode on Twitch + remove front-page-carousel and reapply on page change
// @author       HaCk3Dq
// @match        http*://*.twitch.tv/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/HaCk3Dq/twitch-tampermonkey/master/main.js
// @downloadURL  https://raw.githubusercontent.com/HaCk3Dq/twitch-tampermonkey/master/main.js
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(() => {
  "use strict";

  const waitForElement = (selector, timeout = 7000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        console.log(`Timeout waiting for element: ${selector}`);
        reject();
      }, timeout);
    });
  };

  function removeMainCarousel() {
    waitForElement('[data-test-selector="featured-item-video"] video').then(
      (videoElement) => {
        videoElement.pause();
        waitForElement('[data-a-target="front-page-carousel"]').then((el) => {
          el.remove();
        });
      },
    );
  }

  function removePinned() {
    waitForElement('button[aria-label="Hide for yourself"]').then((el) =>
      el.click(),
    );
  }

  function hideMutedVOD() {
    waitForElement('button[aria-label="Dismiss muted audio notice"]').then(
      (el) => el.click(),
    );
  }

  function activateTheatreMode() {
    setTimeout(() => {
      const theatreModeButton = document.querySelector(
        'button[aria-label="Theatre Mode (alt+t)"]',
      );
      if (theatreModeButton) {
        theatreModeButton.click();
      }
    }, 1500);
  }

  const handlePageChange = () => {
    activateTheatreMode();
    removeMainCarousel();
    removePinned();
    hideMutedVOD();
  };

  function watchURL() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        handlePageChange();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  handlePageChange();
  watchURL();
})();
