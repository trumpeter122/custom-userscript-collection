// ==UserScript==
// @name         Video Booster
// @namespace    vid-booster
// @version      1.2
// @description  Hold Alt+Z to temporarily play videos at a boosted speed
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  "use strict";

  const BOOST_RATE = 1.75;

  let boosted = false;
  let previousRate = 1;
  let boostedVideo = null;

  let altHeld = false;
  let zHeld = false;

  let overlay = null;

  function getVideo() {
    const videos = [...document.querySelectorAll("video")];
    if (videos.length === 0) return null;

    return (
      videos.find(v => !v.paused && !v.ended) ||
      videos.find(v => v.readyState > 0) ||
      videos[0]
    );
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return (
      el.isContentEditable ||
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT"
    );
  }

  function ensureOverlay() {
    if (overlay && overlay.isConnected) return overlay;

    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "12px";
    overlay.style.left = "12px";
    overlay.style.zIndex = "2147483647";
    overlay.style.padding = "6px 10px";
    overlay.style.borderRadius = "8px";
    overlay.style.background = "rgba(0, 0, 0, 0.35)";
    overlay.style.color = "#fff";
    overlay.style.font = "600 13px system-ui, -apple-system, sans-serif";
    overlay.style.letterSpacing = "0.02em";
    overlay.style.pointerEvents = "none";
    overlay.style.backdropFilter = "blur(4px)";
    overlay.style.webkitBackdropFilter = "blur(4px)";
    overlay.style.display = "none";

    document.documentElement.appendChild(overlay);
    return overlay;
  }

  function showOverlay() {
    const el = ensureOverlay();
    el.textContent = `${BOOST_RATE}×`;
    el.style.display = "block";
  }

  function hideOverlay() {
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  function updateBoostState() {
    if (isTypingTarget(document.activeElement)) {
      stopBoost();
      return;
    }

    if (altHeld && zHeld) {
      startBoost();
    } else {
      stopBoost();
    }
  }

  function startBoost() {
    if (boosted) return;

    const video = getVideo();
    if (!video) return;

    boostedVideo = video;
    previousRate = video.playbackRate;
    video.playbackRate = BOOST_RATE;
    boosted = true;
    showOverlay();
  }

  function stopBoost() {
    if (!boosted) return;

    if (boostedVideo && boostedVideo.isConnected) {
      boostedVideo.playbackRate = previousRate;
    }

    boosted = false;
    boostedVideo = null;
    hideOverlay();
  }

  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;

    if (e.code === "AltLeft" || e.code === "AltRight") altHeld = true;
    if (e.code === "KeyZ") zHeld = true;

    if ((altHeld && zHeld) || (e.altKey && e.code === "KeyZ")) {
      e.preventDefault();
    }

    updateBoostState();
  }, true);

  document.addEventListener("keyup", (e) => {
    if (e.code === "AltLeft" || e.code === "AltRight") altHeld = false;
    if (e.code === "KeyZ") zHeld = false;

    updateBoostState();
  }, true);

  window.addEventListener("blur", () => {
    altHeld = false;
    zHeld = false;
    stopBoost();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      altHeld = false;
      zHeld = false;
      stopBoost();
    }
  });
})();
