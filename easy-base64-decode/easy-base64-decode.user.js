// ==UserScript==
// @name        Easy Base64 Decode
// @namespace   turkoid
// @match       https://forum.snahp.it/*
// @grant       none
// @version     1.0
// @author      turkoid
// @description Adds icon to quickly decode base64
// ==/UserScript==

(function () {
  'use strict';

  const observer = new MutationObserver(findCodeBoxes);
  const base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYwOTkwMzY2QzVBQzExRUFBMEQ0OUFGNzgzOEVDRUU3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYwOTkwMzY3QzVBQzExRUFBMEQ0OUFGNzgzOEVDRUU3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjA5OTAzNjRDNUFDMTFFQUEwRDQ5QUY3ODM4RUNFRTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjA5OTAzNjVDNUFDMTFFQUEwRDQ5QUY3ODM4RUNFRTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4eg/9nAAABI1BMVEW2HBy3HBy2Gxu4HBy0FBS1GRm0FRW0Fha2Ghq1GBi1FxfpvLzrwsLdlZXMYWHDQ0PqwcHHUFDHUVG4IyOzExPDRESzEhLsx8fsxsagVlbBPz/DRUXuzs69MjLw1dWyEBDgn5/em5vtxsbpu7vqvr7hpKTUe3v57++3Hh6rYGD04eHGTU27HR358PD///+3ICC8LS3y2dnYh4fWgYGfQUG8Hh63HR3fnJzkqqrPaWngoKDJV1fuzMzPamq7KirNY2OyDg6uAwPrwcHAOzvck5O5HR3sw8Ptysqve3u6HR27Kyu6ICDrw8PgoaHjqam9MTHXg4Pw1NS4ICDemprjp6e4Hh7OZ2e0ExPqv7/lsbG4IiL25eWwBwfESEjGT0/dl5fmsrJsIa/4AAAA0ElEQVR42mLw8GZGA6aaDKGMDOiAkYGZAQtgJEWQiYMJyGBi5QCRcEF9BjEGTjYDYSYGVlaIIBO7ghuPGkuUn5MRC5edhCgbWJDFnU9UN4g3Xl6DwcFFT1sEIihgpWrOJqMYYh1j78stKAYVtOCNcNYyDjOMC4yVsORkAguKCzlG84lLs8sF8ESq+3hxggWVlbgTWG1tuIPD2VlUhMBmMjD580txsrLxC7JyMHHICjNB3MnFzg5ksbGAuFwcJPsdE+hgCrkySJoxogFPE4AAAwCw1hRfkjKMEAAAAABJRU5ErkJggg==';

  function findCodeBoxes() {
    let codeBoxes = document.querySelectorAll('code:not([base64])');
    codeBoxes.forEach(codeBox => {
      addBase64Button(codeBox);
    });
  }

  function base64Decode(codeBox, decodeButton) {
    let decoded = atob(codeBox.textContent);
    codeBox.innerHTML = `<a target="_blank" rel="noopener noreferrer" href="${decoded}">${decoded}</a>`
  }

  function addBase64Button(el) {
    el.setAttribute('base64', 'true');
    let decodeButton = document.createElement('input');
    decodeButton.type = 'image';
    decodeButton.src = base64Icon;
    decodeButton.classList.add('.base64')
    decodeButton.addEventListener('click', evt => base64Decode(el, decodeButton));
    el.appendChild(decodeButton);
  }

  findCodeBoxes();

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
})();