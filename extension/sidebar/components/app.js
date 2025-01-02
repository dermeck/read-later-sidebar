import "./list/list.js";

const dummyItems = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
  "Item 11",
  "Item 12",
  "Item 13",
  "Item 14",
  "Item 15",
  "Item 16",
  "Item 17",
  "Item 18",
  "Item 19",
  "Item 20",
  "Item 21",
  "Item 22",
  "Item 23",
  "Item 24",
  "Item 25",
  "Item 26",
  "Item 27",
  "Item 28",
  "Item 29",
  "Item 30",
  "Item 31",
  "Item 32",
  "Item 33",
  "Item 34",
  "Item 35",
  "Item 36",
  "Item 37",
  "Item 38",
  "Item 39",
  "Item 40",
  "Item 41",
  "Item 42",
  "Item 43",
  "Item 44",
  "Item 45",
  "Item 46",
  "Item 47",
  "Item 48",
  "Item 49",
  "Item 50",
  "Item 51",
  "Item 52",
  "Item 53",
  "Item 54",
  "Item 55",
  "Item 56",
  "Item 57",
  "Item 58",
  "Item 59",
];

class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.items = dummyItems;
  }

  // TODO mr: interact with bookmarks api
  connectedCallback() {
    this.render();
    this.addEventListeners();
    this.updateList();
  }

  // TODO mr: implement button actions; either show add item or mark item button
  render() {
    this.shadowRoot.innerHTML = `
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
