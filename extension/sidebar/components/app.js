import "./list/list.js";

class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.items = ["Item 1", "Item 2", "Item 3"];
  }

  // TODO mr interact with bookmarks api
  connectedCallback() {
    this.render();
    this.addEventListeners();
    this.updateList();
  }

  render() {
    // TODO mr extract css
    this.shadowRoot.innerHTML = `
                <style>
                    button {
                        background-color: green;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                    button:hover {
                        background-color: darkgreen;
                    }
                </style>
                <list-component id="list"></list-component>
                <button id="add-item">Add Item</button>
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
