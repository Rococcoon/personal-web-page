const toggleDarkLightCss = `
  * {
    box-sizing: border-box;
    padding: 0px;
    margin: 0px;
  }

  .btn-toggle {
    align-items: center;
    background-color: var(--base);
    border: 3px solid var(--text);
    box-shadow: 6px 6px 0 var(--foam);
    cursor: pointer;
    display: flex;
    height: 60px;
    outline: 3px solid var(--base);
    transition: transform 0.2s ease-out, 
                box-shadow 0.2s ease-out,
                outline 1.0s ease-out;
    width: 60px;
    z-index: 1001;
  }

  .btn-toggle:hover {
    box-shadow: 10px 10px 0 var(--foam);
    transform: translate(-4px, -4px);
  }

  .btn-toggle:active {
    box-shadow: 0px 0px 0 var(--foam);
    transform: translate(4px, 4px);
  }

  .container {
    background-color: var(--base);
    border: none;
    height: 100%;
    width: 100%;
  }

  .toggle {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .input {
    display: none;
  }

  .icon {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .icon--moon {
    transition-delay: 100ms;
  }

  .icon--moon svg path {
    fill: var(--iris);
  }

  .icon--sun {
    transform: scale(0);
  }

  .icon--sun svg path {
    fill: var(--gold);
  }

  #switch:checked + .icon--moon {
    transform: rotate(360deg) scale(0);
  }

  #switch:checked ~ .icon--sun {
    transition-delay: 100ms;
    transform: scale(1) rotate(360deg);
  }
`

class DarkLightToggle extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const button = document.createElement("button");
    button.className = "btn-toggle";
    button.innerHTML = `
      <div class="container">
        <label class="toggle" for="switch">
          <input id="switch" class="input" type="checkbox">
          <div class="icon icon--moon">
            <svg height="32" width="32" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" fill-rule="evenodd"></path>
            </svg>
          </div>
          <div class="icon icon--sun">
            <svg height="32" width="32" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
            </svg>
          </div>
        </label>
      </div>`;

    const style = document.createElement("style");
    style.textContent = `
      ${toggleDarkLightCss}
    `;

    shadow.appendChild(style);
    shadow.appendChild(button);

    // Rest of the original logic remains the same...
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      document.body.classList.add("dark-theme");
      button.querySelector('#switch').checked = false;
    } else if (currentTheme === "light") {
      document.body.classList.add("light-theme");
      button.querySelector('#switch').checked = true;
    }

    button.querySelector('#switch').addEventListener("change", () => {
      let theme;
      if (prefersDarkScheme.matches) {
        document.body.classList.toggle("light-theme");
        theme = document.body.classList.contains("light-theme") ? "light" : "dark";
      } else {
        document.body.classList.toggle("dark-theme");
        theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
      }
      localStorage.setItem("theme", theme);
    });
  }
}

customElements.define("dark-light-toggle", DarkLightToggle);
