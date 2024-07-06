// ==UserScript==
// @name        Reddit Redirect
// @namespace   turkoid
// @match       https://*.reddit.com/*
// @grant       none
// @version     0.3
// @author      turkoid
// @description Replaces all new.reddit.com links
// @updateURL   https://raw.githubusercontent.com/turkoid/userscripts/master/reddit/reddit-redirect.meta.js
// @downloadURL https://raw.githubusercontent.com/turkoid/userscripts/master/reddit/reddit-redirect.user.js
// ==/UserScript==

/* global MutationObserver */

(function () {
  'use strict'

  const $ = {}

  $.scan = function () {
    const newRedditLinks = document.querySelectorAll('a[href^="https://new.reddit.com"]');
    newRedditLinks.forEach(link => {
        link.href = link.href.replace('new.reddit.com', 'www.reddit.com')
    })
  }

  $.init = function () {
    $.scan()

    const observer = new MutationObserver($.scan)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  $.init()
})()
