let highlightedTabs = [];
let groupedTabs = [];
let savedTabs;
let APP_GLOBALS = {
  GROUP_TABS_CONTEXT_MENU_ITEM_ID: "add-group-option"
}



async function getTabs() {
  const tabsUrlsInCurrentWindow = await browser.tabs.query({currentWindow: true})
  return tabsUrlsInCurrentWindow.map(t => console.log(t.url));
}

async function onGroupTabClicked(info, tab) {
  if (info.menuItemId === APP_GLOBALS.GROUP_TABS_CONTEXT_MENU_ITEM_ID) {
    await createTabGroup();
  }
}

async function createTabGroup() {
  let index = 0

  for (const tabId of highlightedTabs) {
    const {url, title, id} = await browser.tabs.get(tabId);
    groupedTabs.push({index, tabUrl: url, tabTitleName: title, tabId: id});
    index++;
  }

  await setStorageItem({
    tabGroups: groupedTabs
  });
}


function setStorageItem(storageObject) {
  return browser.storage.sync.set(storageObject);
}

export function getStorageItem(storageItemId) {
  return browser.storage.sync.get(storageItemId);
}

function createContextMenuItem(contextMenuId, contextMenuType, contextMenuTitle, contextMenuContexts) {
  browser.menus.create({
    id: contextMenuId,
    type: contextMenuType,
    title: contextMenuTitle,
    contexts: contextMenuContexts
  }, onCreated)
}

function removeContextMenuItem(contextMenuId) {
  browser
    .menus
    .remove(contextMenuId);
}

function addHighlightedTabsToStagingArea(highlightedTabInfo) {
  highlightedTabInfo.tabIds.forEach(tabId => {
    highlightedTabs.push(tabId);
  })
}

function getHighlightedTabs(highlightInfo, tab) {
  if (highlightInfo.tabIds.length > 1) {
    createContextMenuItem(APP_GLOBALS.GROUP_TABS_CONTEXT_MENU_ITEM_ID, "normal", "Group Tabs", ["tab"]);

    highlightedTabs = [];
    addHighlightedTabsToStagingArea(highlightInfo);

  } else {
    removeContextMenuItem(APP_GLOBALS.GROUP_TABS_CONTEXT_MENU_ITEM_ID);
  }
}

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

browser.tabs.onHighlighted.addListener(getHighlightedTabs)
browser.menus.onClicked.addListener(onGroupTabClicked);




