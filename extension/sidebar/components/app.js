import "./list/list.js";

const readLaterBookmarksFolderTitle = "Read Later Sidebar";

class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    // TODO mr: notify backgroundscript that we're ready
    this.render();
    this.addEventListeners();
    browser.runtime.onMessage.addListener((message) => {
      console.log("message", message); // TODO
    });

    const readLaterBookmarksFolder = (
      await browser.bookmarks.search({
        title: readLaterBookmarksFolderTitle,
      })
    ).filter((x) => x.type === "folder");

    if (readLaterBookmarksFolder.length > 0) {
      const id = readLaterBookmarksFolder[0].id;
      this.readLaterBookmarksFolderId = id;
    } else {
      // folder does not yet exist
      const createdFolder = await browser.bookmarks.create({
        title: readLaterBookmarksFolderTitle,
      });
      this.readLaterBookmarksFolderId = createdFolder.id;
    }

    this.updateList();
  }

  // TODO mr: implement button actions; either show add item or mark item button
  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>
      @import "./components/app.css";
    </style>
    <header>
      <div class="header-topbar">
        <input type="text" class="filter-input" />
      </div>
      <button id="add-item" class="button add-item-button">Add current tab</button>
     <!-- <button id="mark-item" class="button mark-item-button">Mark current tab as read</button> -->
    </header>
    <main>
      <list-component id="list"></list-component>
    </main>
  `;
  }

  addEventListeners() {
    this.shadowRoot
      .querySelector("#add-item")
      .addEventListener("click", () => this.handleAddItem());
    this.shadowRoot
      .querySelector("list-component")
      .addEventListener("delete-item", (e) => this.handleDeleteItem(e));
  }

  async handleAddItem() {
    const currentTab = await browser.tabs
      .query({ active: true, windowId: browser.windows.WINDOW_ID_CURRENT })
      .then((tabs) => browser.tabs.get(tabs[0].id));

    const searchResult = await browser.bookmarks.search({
      url: currentTab.url,
    });

    if (searchResult.length > 0) {
      if (searchResult[0].parentId === this.readLaterBookmarksFolderId) {
        // bookmark already exists in our folder
      }
    } else {
      await browser.bookmarks.create({
        parentId: this.readLaterBookmarksFolderId,
        title: currentTab.title,
        url: currentTab.url,
      });
      this.updateList();
    }
  }

  async handleDeleteItem(event) {
    const bookmark = event.detail;
    await browser.bookmarks.remove(bookmark.id);
    this.updateList();
  }

  async updateList() {
    const readLaterBookmarksTree = await browser.bookmarks.getSubTree(
      this.readLaterBookmarksFolderId
    );

    if (
      readLaterBookmarksTree.length > 0 &&
      readLaterBookmarksTree[0].children
    ) {
      // sub folders are ignored
      this.items = readLaterBookmarksTree[0].children.filter(
        (x) => x.type === "bookmark"
      );
    }

    const listComponent = this.shadowRoot.querySelector("list-component");
    listComponent.setAttribute("items", JSON.stringify(this.items));
  }
}

customElements.define("bookmarks-app", App);
