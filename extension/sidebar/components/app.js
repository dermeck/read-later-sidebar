import "./list/list.js";

const dummyItems = [
  { title: "Item 1" },
  { title: "Item 2" },
  { title: "Item 3" },
  { title: "Item 4" },
  { title: "Item 5" },
  { title: "Item 6" },
  { title: "Item 7" },
  { title: "Item 8" },
  { title: "Item 9" },
  { title: "Item 10" },
  { title: "Item 11" },
  { title: "Item 12" },
  { title: "Item 13" },
  { title: "Item 14" },
  { title: "Item 15" },
  { title: "Item 16" },
  { title: "Item 17" },
  { title: "Item 18" },
  { title: "Item 19" },
  { title: "Item 20" },
  { title: "Item 21" },
  { title: "Item 22" },
  { title: "Item 23" },
  { title: "Item 24" },
  { title: "Item 25" },
  { title: "Item 26" },
  { title: "Item 27" },
  { title: "Item 28" },
  { title: "Item 29" },
  { title: "Item 30" },
  { title: "Item 31" },
  { title: "Item 32" },
  { title: "Item 33" },
  { title: "Item 34" },
  { title: "Item 35" },
  { title: "Item 36" },
  { title: "Item 37" },
  { title: "Item 38" },
  { title: "Item 39" },
  { title: "Item 40" },
  { title: "Item 41" },
  { title: "Item 42" },
  { title: "Item 43" },
  { title: "Item 44" },
  { title: "Item 45" },
  { title: "Item 46" },
  { title: "Item 47" },
  { title: "Item 48" },
  { title: "Item 49" },
  { title: "Item 50" },
  { title: "Item 51" },
  { title: "Item 52" },
  { title: "Item 53" },
  { title: "Item 54" },
  { title: "Item 55" },
  { title: "Item 56" },
  { title: "Item 57" },
  { title: "Item 58" },
  { title: "Item 59" },
];

const readLaterBookmarksFolderTitle = "Read Later Sidebar";

class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.items = dummyItems;
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
      // this.items = dummyItems; // TODO mr remove
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
      .addEventListener("click", () => this.addItem());
    this.shadowRoot
      .querySelector("list-component")
      .addEventListener("delete-item", (e) => this.removeItem(e.detail));
  }

  addItem() {
    // TODO mr: add current tab if not already added
    const newItem = `Item ${this.items.length + 1}`;
    this.items.push(newItem);
    this.updateList();
  }

  removeItem(item) {
    this.items = this.items.filter((existingItem) => existingItem !== item);
    this.updateList();
  }

  updateList() {
    const listComponent = this.shadowRoot.querySelector("list-component");
    listComponent.setAttribute("items", JSON.stringify(this.items));
  }
}

customElements.define("bookmarks-app", App);
