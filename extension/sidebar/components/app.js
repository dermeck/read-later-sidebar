import "./list/list.js";

const readLaterBookmarksFolderTitle = "Read Later Sidebar";

function isValidHttpUrl(string) {
  const regex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  return regex.test(string);
}

class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.filterString = "";
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

  disconnectedCallback() {
    this.removeEventListeners();
  }

  // TODO mr: implement button actions; either show add item or mark item button
  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>
      @import "./components/app.css";
    </style>
    <header>
      <div class="header-topbar">
        <!-- TODO mr: make input clearable -->
        <input id="filter-input" type="text" class="filter-input" />
      </div>
      <button id="add-item" class="button add-item-button">Add current tab</button>
     <!-- TODO mr: mark as read --> 
     <!-- <button id="mark-item" class="button mark-item-button">Mark current tab as read</button> -->
    </header>
    <main>
      <list-component id="list"></list-component>
    </main>
  `;
  }

  addEventListeners() {
    this.shadowRoot
      .querySelector("#filter-input")
      .addEventListener("input", () => this.handleFilterChange());
    this.shadowRoot
      .querySelector("#add-item")
      .addEventListener("click", () => this.handleAddItem());
    this.shadowRoot
      .querySelector("list-component")
      .addEventListener("delete-item", (e) => this.handleDeleteItem(e));

    browser.bookmarks.onCreated.addListener(() => this.updateList());
    browser.bookmarks.onChanged.addListener(() => this.updateList());
    browser.bookmarks.onMoved.addListener(() => this.updateList());
    browser.bookmarks.onRemoved.addListener(() => this.updateList());
  }

  removeEventListeners() {
    browser.bookmarks.onCreated.removeEventListener(() => this.updateList());
    browser.bookmarks.onChanged.removeEventListener(() => this.updateList());
    browser.bookmarks.onMoved.removeEventListener(() => this.updateList());
    browser.bookmarks.onRemoved.removeEventListener(() => this.updateList());
  }

  handleFilterChange() {
    this.filterString = this.shadowRoot
      .querySelector("#filter-input")
      .value.toLowerCase();

    this.updateList();
  }

  async getCurrentTab() {
    const currentTab = await browser.tabs
      .query({ active: true, windowId: browser.windows.WINDOW_ID_CURRENT })
      .then((tabs) => browser.tabs.get(tabs[0].id));

    return currentTab;
  }

  async searchBookmark(tab) {
    return isValidHttpUrl(tab.url)
      ? await browser.bookmarks.search({
          url: tab.url,
        })
      : [];
  }

  async addTabAsBookmark(tab) {
    await browser.bookmarks.create({
      parentId: this.readLaterBookmarksFolderId,
      title: tab.title,
      url: tab.url,
    });
    this.updateList();
  }

  async handleAddItem() {
    const currentTab = await this.getCurrentTab();
    const searchResult = await this.searchBookmark(currentTab);

    if (searchResult.length) {
      // TODO mr: handle case where link is bookmarked multiple times
      if (searchResult[0].parentId === this.readLaterBookmarksFolderId) {
        // bookmark already exists in our folder
      } else {
        if (window.confirm('Move existing bookmark to "Read Later" folder?')) {
          browser.bookmarks.remove(searchResult[0].id);
          await this.addTabAsBookmark(currentTab);
        }
      }
    } else {
      if (isValidHttpUrl(currentTab.url)) {
        await this.addTabAsBookmark(currentTab);
      }
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
      this.items = readLaterBookmarksTree[0].children.filter(
        (x) =>
          // sub folders are ignored
          x.type === "bookmark" &&
          (x.title.toLowerCase().includes(this.filterString) ||
            x.url.toLowerCase().includes(this.filterString))
      );
    }

    const listComponent = this.shadowRoot.querySelector("list-component");
    listComponent.setAttribute("items", JSON.stringify(this.items));
  }
}

customElements.define("bookmarks-app", App);
