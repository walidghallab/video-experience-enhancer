const supportedUrlsRegex = ["https://(.*.)?coursera.org/.*"].map(url => new RegExp(url));

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    url = tabs[0].url || "";
    if (isSupportedDomain(url)) {
      document.querySelector("#content-placeholder").innerHTML =
        getInnerHtmlForSupportedDomain();
    } else {
      document.querySelector("#content-placeholder").innerHTML =
        getInnerHtmlForNotSupportedDomain();
    }
  });
});

function isSupportedDomain(url) {
  return supportedUrlsRegex.some((urlRegex) => url.match(urlRegex));
}

function getInnerHtmlForNotSupportedDomain() {
  return `
    Functionality on this website already works out of the box.
    ` + getDomForFilingRequest();
}

function getInnerHtmlForSupportedDomain() {
  return `
    We currently support those keys:
    <dl>
        <dt>Space</dt>
        <dd>Play/Pause</dd>
    
        <dt>Left</dt>
        <dd>Backward 5 seconds</dd>
    
        <dt>Right</dt>
        <dd>Forward 5 seconds</dd>
    
        <dt>F or f</dt>
        <dd>Enter/Exit Fullscreen</dd>
    
        <dt>C or c</dt>
        <dd>Show/Hide English subtitles</dd>
    </dl>
    ` + getDomForFilingRequest();
}

function getDomForFilingRequest() {
  return `
  <p>
    <span class="colorful"> 
      If you have any new functionality that you want to see on this website or any others,
      <em>please submit a feature request on
        <a 
            href="https://github.com/walidghallab/video-experience-enhancer?tab=readme-ov-file#feature-requests" 
            alt="Link to file a feature request."
            target="_blank"
        >our GitHub page</a></em> 
    </span>
  </p>
    `;
}
