// ==UserScript==
// @name        New script youtube.com
// @namespace   Violentmonkey Scripts
// @icon        data:image/x-icon;base64,AAABAAIAAAAAAAEAIAAAAgAAJgAAAAAAAAABACAALQMAACYCAACJUE5HDQoaCgAAAA1JSERSAAAAIAAAACAIBgAAAHN6evQAAAHHSURBVFhH7VbPK0RRFP7um4XEUGokUbOzUcJQFtZSmCXyT7Cx8AdYKCTWWMjKQmNiNkqWFiZZsfFjYfIjxSBDXN+ZmWdKs7jMa+6kuXU678d553zv3HPO/RQsL2U5PsoASicDGv0VwO0Aa6ID0EFA1VP7qasyGrUUAlYUXZO/dtQj32m++6TwWiV5/5zVN9TnfH4IBKIKOynxkc6ARncb8LHJSwYuyroAfGGFgyOl0VMJvJ8SRlNRQueCXAL+FgIIjTL4epGDZ8M5wwJgjgAm7ABQiwTQGWPwPksAYpKBY2ag1RhAfR0w2AusbLHWpdgLWlKEoQQBNBi7CTYCZxEgfgKMzwL77Kq/r4RsAXsV1cY+XADuBxu7wOQCQV0Zu8gZqqQAkMFhvn4CkC9Tb8A8G2l6GUi+mPuipTcA3JDX98DUErAaNa6PfwKgwC2wXYTW29D6ILI6irdtH0YzBNA1xqZd+9X08MzYGXEJCQe7bvbMr5mjDCERWwuUjMF9Q2lK5oLNkNK7MLejnRM6yOcBCsmnJimFiEtKnSxJzfOf36RUzpcH+nmilsOBBBUkpZpc0InTXURh71UclA4tN9s2763KGbCegS+ON7RZONjChwAAAABJRU5ErkJggolQTkcNChoKAAAADUlIRFIAAAAwAAAAMAgGAAAAVwL5hwAAAvRJREFUaEPtmU9szEEUx7/TJSXaqIYQdy4kJLYStxIHB24SceJMlIiLiD8H6UFIGqGJS0OIBEcSTRCNA0mlQqyLhgNRNEibVlvV7s/n2f1tdru7NN1fuzvNvmQy8/szb9533ryZN+85eU7Oc/lVBVBuDVY1UNVAiTNQcAkF2rJYmlxHWSvVrJaSKyXXKAV1jLeENnXQQNueF1AWpt5naBGt2lzZ3Bh9fmW9+0n7d7rQdgN8H6amiOfgB2N/pf5E3SvF3jg9G52KNwdAoM0bEPosTHbQ0QSrIHITyNQJmJNOz1+GgmUABIrv5Ydr6dmsIMHzRDGt7XfquWlf/gJg5uPM/FMPhA/RACLW5NT9Kg0g/gAY2yt52gvIdg8t7HIYLMY5/i3Uhj8gzCbqlgGgCYNN3vdH8GxJ3VYAbDrKqwt+AlCLAbiM8Ac8BXARAPE7GPDuSAA01EsDQ5Gwmh4Td8sAPAZA8/Q6/OevjlPsxknpRLvUz0E66+QeGYAEAHAbIqCrZ6R9O1NaOH1Fake5E5MRMC7GwiUMwBcA4OtEQCGAkFXinXTonNTVEwHzgiz6zIhxorQ0khGmAgiZ3uacPNYmfcQ3i5YGDYB5f9me5MyHKAbAOI7gjLZ2sGHfkMbGZz5Gbs9hAxBExU3/AhAO8h7v+AjHzt0nkQw79wBCsTvxHVvOS70fSgJSXgCHAfDWNwCzsIQ8NmI3NB+20fhnDrJVJVlS2Lk8B5nProRezwtnznt3+hI2cDASG5h7Jnah8f5K6fOlXttMA8vRfD/Fs1C7hVVqG/0PbJndERvaSGyom6ZFmX2g3NBiGsQeQFz3AER+cDec8lR4PdmKTojWqabCVEG4Qw8px4mJvghlK5LgaCZxMbqeGMkawJDg0AoKxu7s6pkuAfdoRyAoiFGTzAhIimSoQIJDltzgXpmhEVp2t8QYZYmNQWpLbKQTHPrOOzYX18ekkuCoJ8HRZd9yyLOdJ39NVAGU206qGqhqoMQZ8H4J/QEyLheavdj1EAAAAABJRU5ErkJggg==
// @version     1.0.0
//
// @match       https://www.youtube.com/playlist*
// @match       https://music.apple.com/*/album/*
// @grant       none
//
// @author      -
// @description
// ==/UserScript==

(async () => {
  const SELECTORS = window.location.hostname.includes("youtube.com") ? {
    playlistTitle: [
      "yt-dynamic-sizing-formatted-string.style-scope.ytd-playlist-header-renderer div#container yt-formatted-string#text",
      "h1 span.ytAttributedStringHost.ytAttributedStringWhiteSpacePreWrap",
    ],
    playlistArtists: [
      "div.metadata-owner yt-formatted-string.ytd-playlist-header-renderer:not(#owner-text)",
      "yt-avatar-stack-view-model span.ytAttributedStringHost.ytAvatarStackViewModelAvatarStackText.ytAttributedStringWhiteSpacePreWrap.ytAttributedStringLinkInheritColor span a",
    ],
    videos: ["div#content ytd-playlist-video-renderer"],
    videoTitle: ["a#video-title"],
    videoUrl: ["a#video-title"]
  } : window.location.hostname.includes("music.apple.com") ? {
    playlistTitle: [
      "div.headings h1.headings__title span:not(.headings__badges)",
    ],
    playlistArtists: [
      "div.headings__subtitles a"
    ],
    videos: ["div.songs-list-row__song-name-wrapper"],
    videoTitle: ["div.songs-list-row__song-name"],
    videoUrl: ["a.click-action"]
  } : {}

  const getElement = (elementName, root, querySelectors, all) => {
    if (all === true) {
      for (const qs of querySelectors) {
        try {
          const elements = root.querySelectorAll(qs);
          if (elements === null || elements === undefined) {
            throw Error(`${elementName} not found with query selector ${qs}`);
          }
          if (elements.length === 0) {
            throw Error(
              `Empty list found for ${elementName} with query selector ${qs}`,
            );
          }
          return elements;
        } catch (e) {
          if (qs !== querySelectors[-1]) {
            console.error(e);
          } else {
            throw e;
          }
        }
      }
    } else {
      for (const qs of querySelectors) {
        try {
          const element = root.querySelector(qs);
          if (element === null || element === undefined) {
            throw Error(`${elementName} not found with query selector ${qs}`);
          }
          return element;
        } catch (e) {
          if (qs !== querySelectors[-1]) {
            console.error(e);
          } else {
            throw e;
          }
        }
      }
    }
  };

  const getField = (elementName, root, querySelectors, field) => {
    const element = getElement(elementName, root, querySelectors, false);

    const elementField = element[field];
    if (
      elementField === null ||
      elementField === undefined ||
      (typeof elementField === "string" && elementField === "")
    ) {
      throw Error(
        `Empty field ${field} found on ${element} for ${elementName}`,
      );
    }

    return elementField;
  };

  const scrape = () => {
    console.log("PLS: scraping starts");

    try {
      const playlistTitle = getField(
        "playlist title",
        document,
        SELECTORS.playlistTitle,
        "innerText",
      );

      const playlistArtists = getField(
        "playlist artists",
        document,
        SELECTORS.playlistArtists,
        "innerText",
      );
      let parsedPlaylistArtists = playlistArtists.trim();
      if (parsedPlaylistArtists.endsWith('• Album')) {
        parsedPlaylistArtists = parsedPlaylistArtists.slice(0, parsedPlaylistArtists.length - 7)
      }
      if (parsedPlaylistArtists.startsWith('by')) {
        parsedPlaylistArtists = parsedPlaylistArtists.slice(2);

      }
      parsedPlaylistArtists = parsedPlaylistArtists
        .split(",")
        .map((a) => a.trim());
      if (
        parsedPlaylistArtists === null ||
        parsedPlaylistArtists.length === 0
      ) {
        throw Error("Empty playlist artists found");
      }

      const videos = Array.from(
        getElement("videos", document, SELECTORS.videos, true),
      );

      const parsedVideos = videos.map((video, index) => {
        return {
          index: index + 1,
          title: getField(
            "video title",
            video,
            SELECTORS.videoTitle,
            "innerText",
          ),
          url: getField("video url", video, SELECTORS.videoUrl, "href"),
        };
      });

      return {
        title: playlistTitle,
        artists: parsedPlaylistArtists,
        items: parsedVideos,
      };
    } catch (e) {
      console.error(`PLS: unable to scrape: ${e}`);
      return null;
    }
  };

  const addCopyButton = (text) => {
    const btn = document.createElement("button");
    btn.textContent = "Copy PLS";
    btn.style = `
    position: fixed;
    bottom: 8px;
    right: 8px;
    z-index: 999999;
    padding: 6px 10px;
    cursor: pointer;
  `;

    btn.onclick = async () => {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = "Copy PLS"), 1000);
    };

    document.body.appendChild(btn);
  };

  while (true) {
    const result = scrape();
    if (result === null) {
      const sleepTime = 3000;
      console.log(`PLS: scraping restarts in ${sleepTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
    } else {
      const resultText = JSON.stringify(result, null, 2);
      console.log(resultText);
      addCopyButton(resultText);
      break;
    }
  }
})();
