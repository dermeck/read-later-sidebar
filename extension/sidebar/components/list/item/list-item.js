class ListItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.data = JSON.parse(this.getAttribute("data"));
    this.render(this.data);
  }

  render(data) {
    this.shadowRoot.innerHTML = /* html */ `
      <style>
          @import "./components/list/item/list-item.css";
      </style>
      <li class="list-item">
        <div class="list-item__grid">
          <!-- TODO mr: add icon or color cat? -->
          <i></i>
          <a class="list-item__link" href=${data.url}>${data.title}</a>          
          <button id="delete-button" class="button list-item__remove-button">
            <!-- https://phosphoricons.com/?q=%22trash -->
            <!-- keep the svg inline so that css color is applied -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none" />
                  <line x1="216" y1="56" x2="40" y2="56" fill="none" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="16" />
                <line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
                <line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
                <path d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56" fill="none" stroke="currentColor"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
                <path d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56" fill="none"
                  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
            </svg>
        </div>
      </li>
  `;

    this.shadowRoot
      .querySelector("#delete-button")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-item", {
            bubbles: false,
            composed: true,
            detail: this.data,
          })
        );
      });
  }
}

customElements.define("list-item", ListItem);
