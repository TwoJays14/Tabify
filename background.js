console.log("addon working");

const groupedTabs = [];

if(browser && browser.menus) {
  console.log("context menus api working...")
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

async function getTabs() {
  const tabsUrlsInCurrentWindow = await browser.tabs.query({currentWindow: true})
  return tabsUrlsInCurrentWindow.map(t => console.log(t.url));
};

function getHighlightedTabs(highlightInfo, tab) {
  console.log("tab", tab);
  console.log("highlighted tabs: ", highlightInfo.tabIds)
  if (highlightInfo.tabIds.length > 1) {
    browser.menus.create({
      id: "add-group-option",
      type: "normal",
      title: "Group Tabs",
      contexts: ["tab"]
     }, onCreated)

  } else {
    browser
      .menus
      .remove("add-group-option")
  }
};

async function onGroupTabClicked(info, tab) {
  if (info.menuItemId === "add-group-option") {
    await browser.tabs.create({
      url: "http://localhost:8080"
    })

  }
}

browser.tabs.onHighlighted.addListener(getHighlightedTabs)
browser.menus.onClicked.addListener(onGroupTabClicked);




