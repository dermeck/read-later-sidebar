import "./list/list.js";

class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.items = ["Item 1", "Item 2", "Item 3"];
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
