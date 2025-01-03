import "./item/list-item.js";

class List extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["items"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "items") {
      this.updateList(JSON.parse(newValue));
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "./components/list/list.css";
      </style>
      <ul id="list-container" class="item-list"></ul>
  `;
  }

  updateList(items) {
    const listContainer = this.shadowRoot.querySelector("#list-container");
    listContainer.innerHTML = "";

    items.forEach((item) => {
      const listItem = document.createElement("list-item");
      listItem.setAttribute("data", JSON.stringify(item));
      listContainer.appendChild(listItem);
    });
  }
}

customElements.define("list-component", List);
