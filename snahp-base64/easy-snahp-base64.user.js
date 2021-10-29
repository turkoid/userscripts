// ==UserScript==
// @name        Snaph.it Base64 Helper
// @namespace   turkoid
// @match       https://snahp.url/*
// @grant       none
// @version     1.1
// @author      turkoid
// @description Adds a button to decode base64 code blocks. Does not automatically do it.
// @updateURL   https://raw.githubusercontent.com/turkoid/userscripts/master/snahp-base64/easy-snahp-base64.meta.js
// @downloadURL https://raw.githubusercontent.com/turkoid/userscripts/master/snahp-base64/easy-snahp-base64.user.js
// ==/UserScript==

/* global MutationObserver */
/* global atob */

(function () {
  'use strict'

  const observer = new MutationObserver(findCodeBoxes)
  const decodeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU0QUIxM0E5QzVCQzExRUFBMTA1OUY5RUFFRDkyQUQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU0QUIxM0FBQzVCQzExRUFBMTA1OUY5RUFFRDkyQUQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTRBQjEzQTdDNUJDMTFFQUExMDU5RjlFQUVEOTJBRDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTRBQjEzQThDNUJDMTFFQUExMDU5RjlFQUVEOTJBRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5x7wqRAAAANlBMVEW2HBy6KCj////ku7vBT0/t09PVk5PaoaG7OTny39/79fXGY2O4IyO+NDT26urfrq7ox8fQhIT8Df5WAAAAl0lEQVR42rySzQ4DIQiEcUBB3d/3f9miTes2WQ+97FwIfGQgBFrDvVZa6F4LhQkJT5IIQD3ZPbZignxI5AzzQubWQNsgicyTnN8+Wq6EYYbSTSt0EPc/SAA3rbax/M5JAjct6dhMrm4UVVCJckJX+pJalEo2xckucB1zipB66OsNN/U2aevy3tc2todv/TeZ/870314CDAAGNgPd8i/eagAAAABJRU5ErkJggg=='

  function findCodeBoxes () {
    const codeBoxes = document.querySelectorAll('code:not([b64])')
    codeBoxes.forEach(codeBox => {
      addElements(codeBox)
    })
  }

  function encode (codeBox) {
    const [encoded, decoded, decodeButton] = codeBox.children
    decoded.style.display = 'none'
    encoded.style.display = 'inline'
    decodeButton.style.display = 'inline'
  }

  function decode (codeBox) {
    const [encoded, decoded, decodeButton] = codeBox.children
    decoded.style.display = 'inline'
    encoded.style.display = 'none'
    decodeButton.style.display = 'none'
  }

  function createButton (codeBox, img, fn) {
    const btn = document.createElement('input')
    btn.type = 'image'
    btn.src = img
    btn.classList.add(`b64-${fn.name}`)
    btn.style.display = 'none'
    btn.addEventListener('click', evt => fn(codeBox))
    return btn
  }

  function createEncodedElement (codeBox) {
    const span = document.createElement('span')
    span.textContent = codeBox.textContent
    return span
  }

  function createDecodedElement (codeBox) {
    const decoded = atob(codeBox.textContent)
    const link = document.createElement('a')
    link.href = decoded
    link.textContent = decoded
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    return link
  }

  function addElements (codeBox) {
    codeBox.setAttribute('b64', 'true')
    const decodeButton = createButton(codeBox, decodeImage, decode)
    const encodedElement = createEncodedElement(codeBox)
    const decodedElement = createDecodedElement(codeBox)
    codeBox.textContent = ''
    codeBox.appendChild(encodedElement)
    codeBox.appendChild(decodedElement)
    codeBox.appendChild(decodeButton)
    encode(codeBox)
  }

  findCodeBoxes()

  observer.observe(document, {
    childList: true,
    subtree: true
  })
})()
