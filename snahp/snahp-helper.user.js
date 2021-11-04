// ==UserScript==
// @name        Snahp Helper
// @namespace   turkoid
// @match       https://snahp.url/*
// @grant       none
// @version     1.0.2
// @author      turkoid
// @description Snahp, but gooder.
// @updateURL   https://raw.githubusercontent.com/turkoid/userscripts/master/snahp/snahp-helper.meta.js
// @downloadURL https://raw.githubusercontent.com/turkoid/userscripts/master/snahp1/snahp-helper.user.js
// ==/UserScript==

/* global MutationObserver */
/* global atob */

(function () {
  'use strict'

  var snahp = {
    dom: {},
    utils: {},
    base64: {},
    fragments: {}
  }

  const observer = new MutationObserver(observeDocument)
  const BROKEN_URLS = {
    'snahp.url': ['forum.snahp.it'],
    'snahp.link.url': ['links.snahp.it']
  }
  const SNAHP_ATTR = 'Snahpd'
  const REVERT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVBOTA2NjhGQzVCQzExRUE5MEYyODUxOTE2RDE3MUFFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVBOTA2NjkwQzVCQzExRUE5MEYyODUxOTE2RDE3MUFFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUE5MDY2OERDNUJDMTFFQTkwRjI4NTE5MTZEMTcxQUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUE5MDY2OEVDNUJDMTFFQTkwRjI4NTE5MTZEMTcxQUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6VHkUfAAAAyVBMVEVcifBlj/H///9vl/JhjfD2+f6duPZtlfLP3Pu2yvhijvFdifCrwveqwfeEpvT+///L2vpgjPDC0/l7oPNeivBokvGlvvdslfHp7/3b5fzy9v5qk/H6+//f6Pz3+f6Ao/OBpPPg6Pz7/P/R3vuGp/Smvvf8/f9kj/H5+/7i6vz1+P68zvl4nfNvlvK1yfh0mvJdivBfi/C0yPjs8f2mv/f09/5zmvLg6fy6zfnk7P3N2vrc5vy9z/nH1vqSsPXz9/5wl/K0yfh2nPIedHxNAAAA3ElEQVR42nyS5xaCMAyFy1VAQJy499577/H+D2UBjcCp3j9N+p303KRhqiSWysJMrDCTvOl6QqHkJdYIISHpRSAmuQrEZLziAHltGyTtIVw1lws/meXxUSvpf610sm/r5zigBRzoR8eBAnSfAdfW3vF2cYt8nbJOnJMaMCCiKIqLrjnGkoBMZAPoVKgDNyI7IEYkBjSITIEIET69B5F7GTDfIAr0Q19vPEUizYN0gkdRT6fzlD2A4qFoHynDOwMjK7+nJmeNwC9kzEIVcsHMiH7bJ+nP7vzct5cAAwCHUwt1O27t+wAAAABJRU5ErkJggg=='
  const BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU0QUIxM0E5QzVCQzExRUFBMTA1OUY5RUFFRDkyQUQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU0QUIxM0FBQzVCQzExRUFBMTA1OUY5RUFFRDkyQUQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTRBQjEzQTdDNUJDMTFFQUExMDU5RjlFQUVEOTJBRDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTRBQjEzQThDNUJDMTFFQUExMDU5RjlFQUVEOTJBRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5x7wqRAAAANlBMVEW2HBy6KCj////ku7vBT0/t09PVk5PaoaG7OTny39/79fXGY2O4IyO+NDT26urfrq7ox8fQhIT8Df5WAAAAl0lEQVR42rySzQ4DIQiEcUBB3d/3f9miTes2WQ+97FwIfGQgBFrDvVZa6F4LhQkJT5IIQD3ZPbZignxI5AzzQubWQNsgicyTnN8+Wq6EYYbSTSt0EPc/SAA3rbax/M5JAjct6dhMrm4UVVCJckJX+pJalEo2xckucB1zipB66OsNN/U2aevy3tc2todv/TeZ/870314CDAAGNgPd8i/eagAAAABJRU5ErkJggg=='
  const BASE64_CHARS = /(?<=^|\s)[A-Za-z0-9+/]+[=]{0,3}(?=\s|$)/g
  const MEGA_URL_FRAGMENT = /(?<=^|\s)(?:\w+(?::|=|-)\s*)?((#F!|#!|!)[A-Za-z0-9_-]+)(?=\s|$)/ig
  const URL = /(?<=^|\s)https?:\/\/\S+(?=\s|$)/ig
  const PARTIAL_URL = /(?<=^|\s)(http|ttp|tp|p|https|ttps|tps|ps|s):\/\/\S+(?=\s|$)/ig
  const TEXT_NODE_TYPE = 3
  const MEGA_URL = 'https://mega.nz'

  function observeDocument () {
    const contentNodes = document.querySelectorAll('div.post h3.first ~ div.content')
    contentNodes.forEach(content => {
      snahp.checkHideBoxes(content)
      snahp.checkCodeElements(content)
      snahp.checkContent(content)
    })
  }

  snahp.checkHideBoxes = function (container) {
    /**
     * <dl class="hidebox">
     *   <dd>??</dd>
     * </dl>
     */
    const hideBoxes = container.querySelectorAll(`dl.hidebox > dd:not([${SNAHP_ATTR}])`)
    hideBoxes.forEach(hideBox => {
      if (snahp.utils.hasSingleTextNode(hideBox)) {
        snahp.findEncodedUrls(hideBox)
        snahp.findUrls(hideBox)
      }
    })
  }

  snahp.checkCodeElements = function (container) {
    /**
     * <code>??</code>
     */
    const codeElements = container.querySelectorAll(`code:not([${SNAHP_ATTR}])`)
    codeElements.forEach(codeElement => {
      if (snahp.utils.hasSingleTextNode(codeElement)) {
        snahp.findEncodedUrls(codeElement)
        snahp.findUrls(codeElement)
      }
    })
  }

  snahp.checkContent = function (container) {
    /**
     * checks the full content node by node, but only at depth 1
     */
    snahp.findUrlFragments(container)
  }

  snahp.findEncodedUrls = function (container) {
    /**
     * search only container that contains a text node
     * look for base64 strings and decode up to 3 times till we hit a url
     */
    if (container.hasAttribute(SNAHP_ATTR)) {
      return
    }
    const nodeValue = container.childNodes[0].nodeValue
    const matches = nodeValue.matchAll(BASE64_CHARS)
    const nodes = []
    let lastIndex = 0
    for (const match of matches) {
      let isDecoded = false
      const encodedValue = match[0]
      let decodedValue = encodedValue
      // decode till we see a non base64 url pattern, but only up to 3 times
      let decodeCount = 0
      do {
        console.debug(decodedValue)
        if (decodedValue.length % 4 !== 0) {
          break
        }
        decodedValue = atob(decodedValue)
        decodeCount++
        BASE64_CHARS.lastIndex = 0
        isDecoded = snahp.utils.isPartialUrl(decodedValue) || snahp.utils.isPatternFound(MEGA_URL_FRAGMENT, decodedValue)
      } while (decodeCount < 3 && !isDecoded)
      if (isDecoded) {
        // add text node from last match endIndex to current match beginIndex
        // then create a wrapper element to store the helper buttons.
        snahp.utils.addTextNode(nodes, nodeValue.slice(lastIndex, match.index))
        const wrapper = snahp.base64.createWrapper(encodedValue, decodedValue)
        nodes.push(wrapper)
      } else {
        // just add the whole match string including anything before it
        snahp.utils.addTextNode(nodes, nodeValue.slice(lastIndex, match.index + encodedValue.length))
      }
      lastIndex = match.index + match[0].length
    }
    // add any remaining text
    snahp.utils.addTextNode(nodes, nodeValue.slice(lastIndex))
    if (nodes.length > 1 || nodes[0].nodeType !== TEXT_NODE_TYPE) {
      container.setAttribute(SNAHP_ATTR, 'true')
      // only replace child nodes if something changed
      container.childNodes[0].remove()
      container.append(...nodes)
    }
  }

  snahp.findUrls = function (container) {
    /**
     * search container only if it contains a single text node
     * look for urls and conver them to links
     */
    if (container.hasAttribute(SNAHP_ATTR)) {
      return
    }
    const nodeValue = container.childNodes[0].nodeValue
    const matches = nodeValue.matchAll(URL)
    const nodes = []
    let lastIndex = 0
    for (const match of matches) {
      snahp.utils.addTextNode(nodes, nodeValue.slice(lastIndex, match.index))
      const url = snahp.utils.updateUrl(match[0])
      const link = snahp.dom.createLink(url)
      nodes.push(link)
      lastIndex = match.index + match[0].length
    }
    // add any remaining text
    snahp.utils.addTextNode(nodes, nodeValue.slice(lastIndex))
    if (nodes.length > 1 || nodes[0].nodeType !== TEXT_NODE_TYPE) {
      container.setAttribute(SNAHP_ATTR, 'true')
      // only replace child nodes if something changed
      container.childNodes[0].remove()
      container.append(...nodes)
    }
  }

  snahp.findUrlFragments = function (container) {
    /**
     * search each child node for text nodes and find url fragments that can be combined
     * it begins by looking for the "url" fragment and the first "key" fragment after
     * this is very greedy in that it will not reset if it finds another "url" before a "key" fragment
     */
    if (container.hasAttribute(SNAHP_ATTR)) {
      return
    }
    const nodes = []
    let currentNodes = nodes
    let urlFragment = null
    let isModified = false
    container.childNodes.forEach(node => {
      if (node.nodeType === TEXT_NODE_TYPE) {
        const CAPTURED = { full: 0, fragment: 1, fragmentType: 2 }
        const text = node.nodeValue
        const matches = text.matchAll(MEGA_URL_FRAGMENT)

        let lastIndex = 0
        for (const match of matches) {
          let fragmentType = null
          switch (match[CAPTURED.fragmentType].toUpperCase()) {
            case '#F!': // folder
            case '#!': // file
              fragmentType = 'url'
              break
            case '!': // key
              fragmentType = 'key'
              break
            default:
              throw new Error(`Invalid fragmentType: ${match[CAPTURED.fragmentType]}`)
          }
          // add everything up to the match's index from the last match's index
          snahp.utils.addTextNode(currentNodes, text.slice(lastIndex, match.index))
          if (fragmentType === 'url' && !urlFragment) {
            // start catching elements until we see a "key" match
            currentNodes = []
            urlFragment = match[CAPTURED.fragment]
          }
          // add the full match (we do this after so it will be collected in the correct array)
          snahp.utils.addTextNode(currentNodes, match[CAPTURED.full])
          if (fragmentType 'key' && urlFragment) {
            const keyFragment = match[CAPTURED.fragment]
            const wrapper = snahp.fragments.createWrapper(currentNodes, urlFragment, keyFragment)
            nodes.push(wrapper)
            isModified = true
            currentNodes = nodes
            urlFragment = null
          }
          lastIndex = match.index + match[CAPTURED.full].length
        }
        // add the tail after the last match
        snahp.utils.addTextNode(currentNodes, text.slice(lastIndex))
      } else {
        currentNodes.push(node)
      }
    })
    if (nodes !== currentNodes) {
      nodes.push(...currentNodes)
    }
    if (isModified) {
      container.setAttribute(SNAHP_ATTR, 'true')
      container.textContent = ''
      container.append(...nodes)
    }
  }

  snahp.fragments.createWrapper = function (nodes, urlFragment, keyFragment) {
    const wrapper = document.createElement('div')
    const fragments = document.createElement('div')
    const link = snahp.dom.createLink(`${MEGA_URL}/${urlFragment}${keyFragment}`)
    const showFragments = snahp.dom.createButton(wrapper, REVERT_IMAGE, snahp.fragments.showFragments)
    const showUrl = snahp.dom.createButton(wrapper, REVERT_IMAGE, snahp.fragments.showUrl)
    fragments.append(...nodes)
    wrapper.append(fragments, link, showFragments, showUrl)
    snahp.fragments.showUrl(wrapper)
    return wrapper
  }

  snahp.fragments.toggleElements = function (container, op) {
    const [fragments, link, showFragments, showUrl] = container.children
    switch (op) {
      case 'fragments':
        link.style.display = 'none'
        showFragments.style.display = 'none'
        fragments.style.display = 'inline'
        showUrl.style.display = 'inline'
        break
      case 'url':
        link.style.display = 'inline'
        showFragments.style.display = 'inline'
        fragments.style.display = 'none'
        showUrl.style.display = 'none'
        break
      default:
        throw new Error(`invalid op: ${op}`)
    }
  }

  snahp.fragments.showFragments = function (container) {
    snahp.fragments.toggleElements(container, 'fragments')
  }

  snahp.fragments.showUrl = function (container) {
    snahp.fragments.toggleElements(container, 'url')
  }

  snahp.base64.createWrapper = function (encodedValue, decodedValue) {
    /**
     * adds a encode/decode button that will toggle between the encoded/decoded values
     */
    const wrapper = document.createElement('div')
    const encodeButton = snahp.dom.createButton(wrapper, REVERT_IMAGE, snahp.base64.encode)
    const decodeButton = snahp.dom.createButton(wrapper, BASE64_IMAGE, snahp.base64.decode)
    const encodedElement = snahp.base64.createEncodedElement(encodedValue)
    const decodedElement = snahp.base64.createDecodedElement(decodedValue)
    wrapper.append(encodedElement, decodedElement, encodeButton, decodeButton)
    snahp.base64.decode(wrapper)
    return wrapper
  }

  snahp.base64.toggleElements = function (container, op) {
    const [encoded, decoded, encodeButton, decodeButton] = container.children
    switch (op) {
      case 'encode':
        decoded.style.display = 'none'
        encodeButton.style.display = 'none'
        encoded.style.display = 'inline'
        decodeButton.style.display = 'inline'
        break
      case 'decode':
        decoded.style.display = 'inline'
        encodeButton.style.display = 'inline'
        encoded.style.display = 'none'
        decodeButton.style.display = 'none'
        break
      default:
        throw new Error(`invalid op: ${op}`)
    }
  }

  snahp.base64.encode = function (container) {
    snahp.base64.toggleElements(container, 'encode')
  }

  snahp.base64.decode = function (container) {
    snahp.base64.toggleElements(container, 'decode')
  }

  snahp.base64.createEncodedElement = function (encodedValue) {
    return snahp.dom.createSpan(encodedValue)
  }

  snahp.base64.createDecodedElement = function (decodedValue) {
    decodedValue = snahp.utils.fixPartialUrl(decodedValue)
    if (snahp.utils.isUrl(decodedValue)) {
      decodedValue = snahp.utils.updateUrl(decodedValue)
      return snahp.dom.createLink(decodedValue)
    } else {
      return snahp.dom.createSpan(decodedValue)
    }
  }

  snahp.utils.hasSingleTextNode = function (container) {
    return container.childNodes.length === 1 && container.childNodes[0].nodeType === TEXT_NODE_TYPE
  }

  snahp.utils.fixPartialUrl = function (text) {
    /**
     * will try to fix urls.
     * For example if a base64 string is decoded and is "s://example.com",
     * this function will add the missing "http"
     */
    const index = text.indexOf('://')
    if (index > 0) {
      const protocol = text.slice(0, index).toLowerCase().trim()
      if ('http'.endsWith(protocol)) {
        text = `http${text.slice(index)}`
      } else if ('https'.endsWith(protocol)) {
        text = `https${text.slice(index)}`
      }
    }
    return text
  }

  snahp.utils.addTextNode = function (nodes, value) {
    /**
     * adds the text node to the array or updates the last one if already a text node.
     */
    if (nodes.length === 0 || nodes[nodes.length - 1].nodeType !== TEXT_NODE_TYPE) {
      nodes.push(document.createTextNode(value))
    } else {
      nodes[nodes.length - 1].nodeValue += value
    }
  }

  snahp.utils.isPatternFound = function (regex, string) {
    /**
     * handles a quirk with running regexp.test as it will update lastIndex and not reset each time.
     */
    const origLastIndex = regex.lastIndex
    regex.lastIndex = 0
    const result = regex.test(string)
    regex.lastIndex = origLastIndex
    return result
  }

  snahp.utils.isBase64 = function (string) {
    return snahp.utils.isPatternFound(BASE64_CHARS, string)
  }

  snahp.utils.isUrl = function (string) {
    return snahp.utils.isPatternFound(URL, string)
  }

  snahp.utils.isPartialUrl = function (string) {
    return snahp.utils.isPatternFound(PARTIAL_URL, string)
  }

  snahp.utils.updateUrl = function (url) {
    /**
     * update old urls to the new ones
     */
    for (const [newUrl, oldUrls] of Object.entries(BROKEN_URLS)) {
      for (const oldUrl of oldUrls) {
        if (url.includes(oldUrl)) {
          return url.replace(oldUrl, newUrl)
        }
      }
    }
    return url
  }

  snahp.dom.createButton = function (container, img, fn) {
    const btn = document.createElement('input')
    btn.type = 'image'
    btn.src = img
    btn.classList.add(`b64-${fn.name}`)
    btn.style.display = 'none'
    btn.addEventListener('click', evt => fn(container))
    return btn
  }

  snahp.dom.createSpan = function (text) {
    const span = document.createElement('span')
    span.textContent = text
    return span
  }

  snahp.dom.createLink = function (href, text = href) {
    const link = document.createElement('a')
    link.href = href
    link.textContent = text
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    return link
  }

  observeDocument()

  observer.observe(document, {
    childList: true,
    subtree: true
  })
})()
