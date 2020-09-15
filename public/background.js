var fetchURL = "";

chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
  fetchURL = tab[0].url;
  console.log("first tab");
});

chrome.tabs.onHighlighted.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    fetchURL = tab[0].url;
    console.log("change in tab");
  });
});

chrome.tabs.onCreated.addListener(function (tab) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    fetchURL = tab[0].url;
    console.log("created new tab");
  });
});

chrome.tabs.onUpdated.addListener(function (tab) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    fetchURL = tab[0].url;
    console.log("updated url in tab");
  });
});
