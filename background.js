console.log("addon working");

async function getTabs() {
  const tabsUrlsInCurrentWindow = await browser.tabs.query({currentWindow: true})
  return tabsUrlsInCurrentWindow.map(t => console.log(t.url));
};

getTabs()