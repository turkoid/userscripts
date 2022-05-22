// ==UserScript==
// @name        Snahp Helper
// @namespace   turkoid
// @match       https://snahp.url/*
// @grant       none
// @version     2.2.0
// @author      turkoid
// @description Snahp, but gooder.
// @updateURL   https://raw.githubusercontent.com/turkoid/userscripts/master/snahp/snahp-helper.meta.js
// @downloadURL https://raw.githubusercontent.com/turkoid/userscripts/master/snahp/snahp-helper.user.js
// ==/UserScript==

/* global MutationObserver */
/* global atob */

(function () {
  'use strict'

  const $ = {
    dom: {},
    utils: {},
    base64: {},
    urls: {},
    fragments: {}
  }

  const MEGA_DOMAIN = 'mega.nz'
  const BROKEN_DOMAINS = {
    'snahp.url': ['forum.snahp.it'],
    'snahp.link.url': ['links.snahp.it'],
    [MEGA_DOMAIN]: ['.nz']
  }
  const SNAHP_ATTR = 'Snahpd'
  const SNAHP_CONTAINER = 'snahp-container'
  const SNAHP_BASE64_SECTION = 'snahp-base64'
  const SNAHP_URLS_SECTION = 'snahp-urls'
  const SNAHP_FRAGMENTS_SECTION = 'snahp-fragments'
  const REVERT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVBOTA2NjhGQzVCQzExRUE5MEYyODUxOTE2RDE3MUFFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVBOTA2NjkwQzVCQzExRUE5MEYyODUxOTE2RDE3MUFFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUE5MDY2OERDNUJDMTFFQTkwRjI4NTE5MTZEMTcxQUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUE5MDY2OEVDNUJDMTFFQTkwRjI4NTE5MTZEMTcxQUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6VHkUfAAAAyVBMVEVcifBlj/H///9vl/JhjfD2+f6duPZtlfLP3Pu2yvhijvFdifCrwveqwfeEpvT+///L2vpgjPDC0/l7oPNeivBokvGlvvdslfHp7/3b5fzy9v5qk/H6+//f6Pz3+f6Ao/OBpPPg6Pz7/P/R3vuGp/Smvvf8/f9kj/H5+/7i6vz1+P68zvl4nfNvlvK1yfh0mvJdivBfi/C0yPjs8f2mv/f09/5zmvLg6fy6zfnk7P3N2vrc5vy9z/nH1vqSsPXz9/5wl/K0yfh2nPIedHxNAAAA3ElEQVR42nyS5xaCMAyFy1VAQJy499577/H+D2UBjcCp3j9N+p303KRhqiSWysJMrDCTvOl6QqHkJdYIISHpRSAmuQrEZLziAHltGyTtIVw1lws/meXxUSvpf610sm/r5zigBRzoR8eBAnSfAdfW3vF2cYt8nbJOnJMaMCCiKIqLrjnGkoBMZAPoVKgDNyI7IEYkBjSITIEIET69B5F7GTDfIAr0Q19vPEUizYN0gkdRT6fzlD2A4qFoHynDOwMjK7+nJmeNwC9kzEIVcsHMiH7bJ+nP7vzct5cAAwCHUwt1O27t+wAAAABJRU5ErkJggg=='
  const BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU0QUIxM0E5QzVCQzExRUFBMTA1OUY5RUFFRDkyQUQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU0QUIxM0FBQzVCQzExRUFBMTA1OUY5RUFFRDkyQUQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTRBQjEzQTdDNUJDMTFFQUExMDU5RjlFQUVEOTJBRDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTRBQjEzQThDNUJDMTFFQUExMDU5RjlFQUVEOTJBRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5x7wqRAAAANlBMVEW2HBy6KCj////ku7vBT0/t09PVk5PaoaG7OTny39/79fXGY2O4IyO+NDT26urfrq7ox8fQhIT8Df5WAAAAl0lEQVR42rySzQ4DIQiEcUBB3d/3f9miTes2WQ+97FwIfGQgBFrDvVZa6F4LhQkJT5IIQD3ZPbZignxI5AzzQubWQNsgicyTnN8+Wq6EYYbSTSt0EPc/SAA3rbax/M5JAjct6dhMrm4UVVCJckJX+pJalEo2xckucB1zipB66OsNN/U2aevy3tc2todv/TeZ/870314CDAAGNgPd8i/eagAAAABJRU5ErkJggg=='
  const BASE64_CHARS = /(?<=^|\s|:)[a-z0-9+/]+[=]{0,3}(?=\s|$)/ig
  const MEGA_URL_FRAGMENT = /(?<=^|\s|:|=)(#F!|#!|!)([a-z0-9_-]+)(?=\s|$)/ig
  const URL = /(?<=^|\s)(https?):\/\/(([a-z.-]+)(\S*))(?=\s|$)/ig
  const PARTIAL_URL = /(?<=^|\s)(http|ttp|tp|p|https|ttps|tps|ps|s):\/\/(([a-z.-]+)(\S*))(?=\s|$)/ig
  const TEXT_NODE_TYPE = 3
  const GLOBAL_STYLE = `
    .snahp-border {
      border: 1px solid #de7300;
    }

    .snahp-highlight {
      background-color: #3cdc3c;
      color: #171717;
    }

    #snahp-container {
      background-color: #171717;
      padding: 5px;
      margin: 5px 0;
      display: block;
    }

    .snahp-button {
      margin: 2px 0;
    }

    input[type="image"].snahp-button {
      padding: 0px;
    }
  `
  let softMaxDecodeCount = 0

  $.scan = function (container) {
    /**
     * Perform a bread-first search for textnodes
     * Perform any number of search functions on that node
     * Run a function against all unmodified textNodes at the same level
     */
    if (container.hasAttribute(SNAHP_ATTR)) {
      return
    }
    const queue = [[0, container]]
    let currentLevel = 0
    let textNodes = []
    while (queue.length) {
      const [level, node] = queue.shift()
      if (level > currentLevel) {
        $.fragments.search(textNodes)
        currentLevel = level
        textNodes = []
      }
      if (node.nodeType === TEXT_NODE_TYPE) {
        let isModified = false
        isModified = isModified || $.base64.search(node)
        isModified = isModified || $.urls.search(node)
        if (!isModified) {
          textNodes.push(node)
        }
      } else if (!node.hasAttribute(SNAHP_ATTR)) {
        for (const childNode of node.childNodes) {
          queue.push([level + 1, childNode])
        }
      }
    }
  }

  $.base64.search = function (node) {
    /**
     * Find all base64 strings and decode up to 3 times
     * A valid decoded value is a partial url or url fragment
     */
    if (node.nodeType !== TEXT_NODE_TYPE) {
      return false
    }

    let isModified = false
    const nodes = []
    const nodeValue = node.nodeValue
    const matches = nodeValue.matchAll(BASE64_CHARS)
    let lastIndex = 0
    for (const match of matches) {
      let isDecoded = false
      const encodedValue = match[0]
      let decodedValue = encodedValue
      let decodeCount = 0
      do {
        if (decodedValue.length % 4 !== 0) {
          break
        }
        decodedValue = atob(decodedValue)
        decodeCount++
        BASE64_CHARS.lastIndex = 0
        isDecoded = $.utils.isPatternFound(PARTIAL_URL, decodedValue) || $.utils.isPatternFound(MEGA_URL_FRAGMENT, decodedValue)
        isDecoded = isDecoded || decodeCount === softMaxDecodeCount
      } while (decodeCount < 3 && !isDecoded)
      if (isDecoded) {
        if (decodeCount > softMaxDecodeCount) {
          softMaxDecodeCount = decodeCount
        }
        $.utils.addTextNode(nodes, nodeValue.slice(lastIndex, match.index))
        const container = $.base64.createContainer(encodedValue, decodedValue)
        nodes.push(container)
        isModified = true
      } else {
        $.utils.addTextNode(nodes, nodeValue.slice(lastIndex, match.index + encodedValue.length))
      }
      lastIndex = match.index + encodedValue.length
    }
    $.utils.addTextNode(nodes, nodeValue.slice(lastIndex))

    if (isModified) {
      const container = $.dom.createContainer(nodes)
      node.replaceWith(container)
    }

    return isModified
  }

  $.base64.addSectionItems = function (items) {
    $.utils.addItemsToSection(items, SNAHP_BASE64_SECTION)
  }

  $.base64.createContainer = function (encodedValue, decodedValue) {
    const container = $.dom.createElement('div')
    const encodedElement = $.base64.createEncodedElement(encodedValue)
    const decodedElement = $.base64.createDecodedElement(decodedValue)
    const encodeButton = $.base64.createButton(container, 'encode', decodedElement)
    const decodeButton = $.base64.createButton(container, 'decode', encodedElement)
    const newLine = $.dom.createElement('br')
    container.append(encodeButton, decodeButton, newLine, encodedElement, decodedElement)
    $.base64.toggleElements(container, 'decode')
    return container
  }

  $.base64.toggleElements = function (container, op) {
    const [encodeButton, decodeButton, , encodedElement, decodedElement] = container.children
    switch (op) {
      case 'encode':
        decodedElement.style.display = 'none'
        encodeButton.style.display = 'none'
        encodedElement.style.display = 'inline'
        decodeButton.style.display = 'inline'
        break
      case 'decode':
        decodedElement.style.display = 'inline'
        encodeButton.style.display = 'inline'
        encodedElement.style.display = 'none'
        decodeButton.style.display = 'none'
        break
      default:
        throw new Error(`invalid op: ${op}`)
    }
  }

  $.base64.createButton = function (container, op, element) {
    const btn = $.dom.createElement('input')
    btn.type = 'image'
    btn.classList.add('snahp-button', 'snahp-border')
    btn.src = op === 'encode' ? REVERT_IMAGE : BASE64_IMAGE
    btn.style.display = 'none'
    btn.addEventListener('click', evt => $.base64.toggleElements(container, op))
    btn.addEventListener('mouseenter', evt => element.classList.add('snahp-highlight'))
    btn.addEventListener('mouseleave', evt => element.classList.remove('snahp-highlight'))
    return btn
  }

  $.base64.createEncodedElement = function (encodedValue) {
    return $.dom.createSpan(encodedValue)
  }

  $.base64.createDecodedElement = function (decodedValue) {
    const container = $.dom.createElement('div')
    const textNode = document.createTextNode(decodedValue)
    container.append(textNode)
    let isModified = false
    isModified = isModified || $.urls.search(textNode, true)
    isModified = isModified || $.fragments.search([textNode])
    if (isModified) {
      // find adjacent link and add a newline between them
      for (const element of container.children) {
        const nextElement = element.nextElementSibling
        if (nextElement && element.nodeName === 'A' && nextElement.nodeName === 'A') {
          container.insertBefore($.dom.createElement('br'), nextElement)
        }
      }
      return container
    }
    if ($.utils.isPatternFound(PARTIAL_URL, decodedValue)) {
      let decodedUrl = $.utils.fixPartialUrl(decodedValue)
      decodedUrl = $.utils.updateUrl(decodedUrl)
      return $.dom.createLink(decodedUrl, decodedValue)
    } else {
      return $.dom.createSpan(decodedValue)
    }
  }

  $.urls.search = function (node, allowPartial = false) {
    /**
     * find all urls in the text that is not a child of a link
     */
    const pattern = allowPartial ? PARTIAL_URL : URL
    if (node.nodeType !== TEXT_NODE_TYPE || ($.utils.isPatternFound(pattern, node.value) && node.parentElement?.closest('a'))) {
      return false
    }

    let isModified = false
    const nodeValue = node.nodeValue
    const matches = nodeValue.matchAll(pattern)
    const nodes = []
    let lastIndex = 0
    for (const match of matches) {
      $.utils.addTextNode(nodes, nodeValue.slice(lastIndex, match.index))
      const text = match[0]
      let href = text
      if (allowPartial) {
        href = $.utils.fixPartialUrl(href)
      }
      href = $.utils.updateUrl(href)
      const link = $.dom.createLink(href, text)
      nodes.push(link)
      lastIndex = match.index + text.length
      isModified = true
    }
    $.utils.addTextNode(nodes, nodeValue.slice(lastIndex))
    if (isModified) {
      node.replaceWith(...nodes)
    }
    return isModified
  }

  $.urls.addSectionItems = function (items) {
    $.utils.addItemsToSection(items, SNAHP_URLS_SECTION)
  }

  $.fragments.search = function (nodes) {
    /**
     * find all url fragments and place them in the top level post container
     * hovering over the combined fragments when highlight the matches
     */
    if (!nodes.every(node => node.nodeType === TEXT_NODE_TYPE)) {
      return false
    }

    const ids = []
    const keys = []
    let isModified = false
    for (const node of nodes) {
      const nodeValue = node.nodeValue
      const matches = nodeValue.matchAll(MEGA_URL_FRAGMENT)
      const replaceNodes = []
      let lastIndex = 0
      for (const match of matches) {
        const fragment = match[0]
        const fragmentType = match[1]
        $.utils.addTextNode(replaceNodes, nodeValue.slice(lastIndex, match.index))
        let fragments
        switch (fragmentType.toUpperCase()) {
          case '#F!': // folder
          case '#!': // file
            fragments = ids
            break
          case '!': // key
            fragments = keys
            break
          default:
            throw new Error(`Invalid fragmentType: ${fragmentType}`)
        }
        const span = $.dom.createSpan(fragment)
        fragments.push(span)
        replaceNodes.push(span)
        lastIndex = match.index + fragment.length
      }
      $.utils.addTextNode(replaceNodes, nodeValue.slice(lastIndex))
      if (replaceNodes.length > 0) {
        isModified = true
        node.replaceWith(...replaceNodes)
      }
    }

    if (isModified) {
      /**
       * mimics python's zip_longest
       */
      const longest = ids.length > keys.length ? ids : keys
      const zipped = longest.map((_, i) => [ids, keys].map(fragments => fragments[i]))
      const sectionItems = []
      for (const [id, key] of zipped) {
        const sectionItem = $.fragments.createContainer(id, key)
        sectionItems.push(sectionItem)
      }
      $.fragments.addSectionItems(sectionItems)
    }

    return isModified
  }

  $.fragments.addSectionItems = function (items) {
    $.utils.addItemsToSection(items, SNAHP_FRAGMENTS_SECTION)
  }

  $.fragments.createContainer = function (id, key) {
    let container
    if (id && key) {
      container = $.dom.createLink(`https://${MEGA_DOMAIN}/${id.textContent}${key.textContent}`)
    } else {
      container = $.dom.createSpan(`${id?.textContent ?? '?'} + ${key?.textContent ?? '?'}`)
    }
    container.addEventListener('mouseenter', evt => {
      if (id) id.classList.add('snahp-highlight')
      if (key) key.classList.add('snahp-highlight')
    })
    container.addEventListener('mouseleave', evt => {
      if (id) id.classList.remove('snahp-highlight')
      if (key) key.classList.remove('snahp-highlight')
    })
    return container
  }

  $.dom.createElement = function (name) {
    const element = document.createElement(name)
    element.setAttribute(SNAHP_ATTR, 'true')
    return element
  }

  $.dom.createSpan = function (text) {
    const span = $.dom.createElement('span')
    span.textContent = text
    return span
  }

  $.dom.createLink = function (href, text = href) {
    const link = $.dom.createElement('a')
    link.href = href
    link.textContent = text
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    return link
  }

  $.dom.createContainer = function (nodes) {
    const container = $.dom.createElement('div')
    container.append(...nodes)
    return container
  }

  $.utils.addTextNode = function (nodes, value) {
    /**
     * adds a text node to the array or updates the last one if already a text node.
     */
    if (!value) return
    if (nodes.length === 0 || nodes[nodes.length - 1].nodeType !== TEXT_NODE_TYPE) {
      nodes.push(document.createTextNode(value))
    } else {
      nodes[nodes.length - 1].nodeValue += value
    }
  }

  $.utils.isPatternFound = function (regex, string) {
    /**
     * handles a quirk with running regexp.test as it will update lastIndex and not reset each time.
     */
    const origLastIndex = regex.lastIndex
    regex.lastIndex = 0
    const result = regex.test(string)
    regex.lastIndex = origLastIndex
    return result
  }

  $.utils.fixPartialUrl = function (text) {
    /**
     * will try to fix urls.
     * For example if a base64 string is decoded and it's "ttps://example.com",
     * this function will add the missing "h"
     */
    const matches = text.matchAll(PARTIAL_URL)
    const parts = []
    let lastIndex = 0

    for (const match of matches) {
      parts.push(text.slice(lastIndex, match.index))
      const protocol = match[1].endsWith('s') ? 'https' : 'http'
      const url = `${protocol}://${match[2]}`
      parts.push(url)
      lastIndex += match[0].length
    }
    parts.push(text.slice(lastIndex))

    return parts.join('')
  }

  $.utils.updateUrl = function (url) {
    /**
     * update old domains to the new ones
     */
    for (const [newDomain, oldDomains] of Object.entries(BROKEN_DOMAINS)) {
      for (const oldDomain of oldDomains) {
        const matches = url.matchAll(URL)
        for (const match of matches) {
          const protocol = match[1]
          const domain = match[3]
          const remaining = match[4]
          if (domain === oldDomain) {
            url = `${protocol}://${newDomain}${remaining}`
            return url
          }
        }
      }
    }
    return url
  }

  $.utils.addItemsToSection = function (items, sectionId) {
    if (!items?.length) {
      return
    }
    const container = document.getElementById(SNAHP_CONTAINER)
    const section = document.getElementById(sectionId)
    const list = section.childNodes[1]
    items = items.slice().map(item => {
      const listItem = $.dom.createElement('li')
      listItem.append(item)
      return listItem
    })
    list.append(...items)
    section.style.display = 'block'
    container.style.display = 'block'
  }

  $.observe = function (mutations, observer) {
    for (const mut of mutations) {
      for (const addedNode of mut.addedNodes) {
        $.scan(addedNode)
      }
    }
  }

  $.init = function () {
    const selector = 'div.post h3.first ~ div.content'
    const originalPost = document.querySelector(selector)
    if (!originalPost) {
      console.debug(`selector "${selector}" not found!!`)
      return
    }

    const style = $.dom.createElement('style')
    style.innerHTML = GLOBAL_STYLE
    document.head.append(style)

    const container = $.dom.createElement('div')
    container.style.display = 'none'
    container.id = SNAHP_CONTAINER
    container.classList.add('snahp-border')
    for (const [id, title] of [[SNAHP_BASE64_SECTION, 'Base64'], [SNAHP_URLS_SECTION, 'Urls'], [SNAHP_FRAGMENTS_SECTION, 'Fragments']]) {
      const section = $.dom.createElement('div')
      section.id = id
      section.style.display = 'none'
      const heading = $.dom.createElement('h4')
      heading.textContent = title
      const ul = $.dom.createElement('ul')
      section.append(heading)
      section.append(ul)
      container.append(section)
    }
    originalPost.insertBefore(container, originalPost.firstChild)

    // do a one time scan of all posts
    const posts = document.querySelectorAll('div.post div.content')
    for (const post of posts) {
      $.scan(post)
    }
    // only attach observer to the original post
    const observer = new MutationObserver($.observe)
    observer.observe(originalPost, {
      childList: true,
      subtree: true
    })
  }

  $.init()
})()
