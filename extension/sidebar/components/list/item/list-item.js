class ListItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const data = this.getAttribute("data") || "Default Content";
    console.log("data", JSON.parse(data)); // TODO
    this.render(JSON.parse(data));
  }

  render(data) {
    this.shadowRoot.innerHTML = /* html */ `
      <style>
          @import "./components/list/item/list-item.css";
      </style>
      <li class="list-item">
        <div class="list-item__grid">
          <!-- TODO mr: add icon or color cat -->
          <i></i>
          <!-- TODO mr: add click effect (color change) + open link -->
          <a class="list-item__link" href=${data.url}>${data.title}</a> <!-- JSON string blabla-->
          <!-- TODO mr: add x icon -->
          <button id="delete-button" class="button list-item__remove-button">x</button>
        </div>
      </li>
  `;

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
