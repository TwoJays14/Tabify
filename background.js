console.log("addon working");

let highlightedTabs = [];
let groupedTabs = [];

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
  if (highlightInfo.tabIds.length > 1) {
    browser.menus.create({
      id: "add-group-option",
      type: "normal",
      title: "Group Tabs",
      contexts: ["tab"]
     }, onCreated)

    highlightedTabs = [];
    highlightInfo.tabIds.forEach(tabId => {
      highlightedTabs.push(tabId);
    })
    console.log("highlighted tabs in array: ", highlightedTabs);

  } else {
    browser
      .menus
      .remove("add-group-option")
  }
};

async function onGroupTabClicked(info, tab) {
  let index = 0
  if (info.menuItemId === "add-group-option") {
    for (const tabId of highlightedTabs) {
      const { url, title, id } = await browser.tabs.get(tabId);
      groupedTabs.push({index, tabUrl: url, tabTitleName: title, tabId: id});
      index++;
      console.log("grouped Tabs array: ", groupedTabs);
    }
  }
}

browser.tabs.onHighlighted.addListener(getHighlightedTabs)
browser.menus.onClicked.addListener(onGroupTabClicked);




