// ==UserScript==
// @name        No RickRoll
// @namespace   turkoid
// @match       https://*.reddit.com/*
// @grant       none
// @version     2.0
// @author      turkoid
// @description Adds a Rick Astley image to links that contain the infamous youtube video
// @updateURL   https://raw.githubusercontent.com/turkoid/userscripts/master/no-rickroll/no-rickroll.meta.js
// @downloadURL https://raw.githubusercontent.com/turkoid/userscripts/master/no-rickroll/no-rickroll.user.js
// ==/UserScript==

/* global MutationObserver */

(function () {
  'use strict'

  const $ = {}

  const RICK_BLOCKED_ATTR = 'rick-blocked'
  const RICK_ASTLEY =
      'data:image/png;base64,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'
  const GLOBAL_STYLE = `
    img.rick-astley {
      background: url(${RICK_ASTLEY}) no-repeat center;
      display: inline;
      width: 32px;
      height: 29px;
      border: #000000 solid 2px;
      margin-right: 2px;
    }
  `

  $.blockRick = function (link) {
    link.setAttribute(RICK_BLOCKED_ATTR, 'true')
    const img = document.createElement('img')
    img.classList.add('rick-astley')
    link.parentElement.insertBefore(img, link)
  }

  $.scan = function () {
    const rickRolls = document.querySelectorAll(`a[href*="v=dQw4w9WgXcQ"]:not([${RICK_BLOCKED_ATTR}])`)
    for (const link of rickRolls) {
      $.blockRick(link)
    }
  }

  $.init = function () {
    const style = document.createElement('style')
    style.innerHTML = GLOBAL_STYLE
    document.head.append(style)

    $.scan()

    const observer = new MutationObserver($.scan)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  $.init()
})()
