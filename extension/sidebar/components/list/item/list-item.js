class ListItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const data = this.getAttribute("data") || "Default Content";
    this.render(data);
  }

  render(data) {
    this.shadowRoot.innerHTML = `
      <style>
          @import "./components/list/item/list-item.css";
      </style>
      <div>
          <span>${data}</span>
          <button id="delete-button">Delete</button>
      </div>
  `;

    // Add event listener for delete button
    this.shadowRoot
      .querySelector("#delete-button")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-item", {
            bubbles: true,
            composed: true,
          })
        );
      });
  }
}

customElements.define("list-item", ListItem);
