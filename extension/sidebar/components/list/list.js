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
                  <ul id="list-container"></ul>
              `;
  }

  updateList(items) {
    const listContainer = this.shadowRoot.querySelector("#list-container");
    listContainer.innerHTML = "";

    items.forEach((item) => {
      const listItem = document.createElement("list-item");
      listItem.setAttribute("data", item);
      // TODO mr teardown? => move into item?
      listItem.addEventListener("delete-item", () =>
        this.dispatchEvent(
          new CustomEvent("delete-item", {
            detail: item,
            bubbles: true,
            composed: true,
          })
        )
      );
      listContainer.appendChild(listItem);
    });
  }
}

customElements.define("list-component", List);
