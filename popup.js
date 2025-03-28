import {getStorageItem} from "./background.js";

const container = document.getElementById("container");

document.addEventListener("DOMContentLoaded", async () => {
  const {tabGroups} = await getStorageItem("tabGroups");

  tabGroups
    .map(tab =>
      container.insertAdjacentHTML("beforeend",
        `
   <div>
        <h2>${tab.tabTitleName}</h2>
    </div>
  `)
    );
});