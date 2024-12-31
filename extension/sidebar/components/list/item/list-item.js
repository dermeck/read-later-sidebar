class ListItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const data = this.getAttribute("data") || "Default Content";
    this.render(data);
  }

  // TODO mr extract css
  render(data) {
    this.shadowRoot.innerHTML = `
                <style>
                    div {
                        background-color: #f4f4f4;
                        margin: 5px;
                        padding: 10px;
                        border-radius: 4px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    button {
                        background-color: red;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                    button:hover {
                        background-color: darkred;
                    }
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
