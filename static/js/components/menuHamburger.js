class HamburgerMenu extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;  
        padding: 0px;
        margin: 0px;
      }

      nav {
        background-color: var(--love);
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        transform: translateX(-120%);
        transition: transform 1.0s ease-in-out;
        width: 100%;
        z-index: 1000;
      }

      nav.open {
        transform: translateX(0);
      }

      nav ul {
        list-style: none;
        padding: 20px;
        margin-top: 82px;
        text-align: center;
      }

      nav li {
        margin-bottom: 20px;
      }

      @media (max-width: 650px) {
        :host nav a {
          font-size: 3rem;
        }
      }

      nav a {
        color: var(--foam);
        font-size: 7rem;
        font-weight: bold;
        text-decoration: none;
        transition: text-decoration 0.8s ease;
      }

      nav a:hover {
        text-decoration: underline;
      }

      .menu-button {
        align-items: center;
        background-color: var(--base);
        border: 3px solid var(--text);
        color: var(--text);
        cursor: pointer;
        display: flex;
        height: 60px;
        font-family: var(--primary-font), mono;
        font-size: 2em;
        font-weight: 400;
        justify-content: center;
        outline: 3px solid var(--base);
        box-shadow: 6px 6px 0 var(--foam);
        position: fixed;
        top: 1rem;
        transition: transform  0.2s ease-out, 
                    box-shadow 0.2s ease-out,
                    outline 1.0s ease-out,
                    position 1.0s ease-out,
                    background-color 1.0s ease-out;
        width: 60px;
        z-index: 1001;
      }

      .menu-button:hover {
        box-shadow: 10px 10px 0 var(--foam);
        transform: translate(-4px, -4px);
      }

      .menu-button:active {
        background-color: var(--base);
        border-color: var(--text);
        box-shadow: 0px 0px 0 var(--foam);
        color: var(--text);
        transform: translate(4px, 4px);
      }

      .menu-button.open {
        background-color: var(--love);
        outline: 3px solid var(--love);
      }
    `;

    shadow.appendChild(style);

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');

    // Add menu items dynamically (you can customize these)
    const menuItems = [
      { href: '#home', text: 'HOME' },
      { href: '#about', text: 'ABOUT' },
      { href: '#projects', text: 'PROJECTS' },
      { href: '#contact', text: 'CONTACT' },
      { href: '#credits', text: 'CREDITS' },
    ];

    menuItems.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;

      // Smooth scroll on click
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const targetSection = document.querySelector(item.href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Close the menu after clicking a link
        nav.classList.remove('open');
        menuButton.classList.remove('open');
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    shadow.appendChild(nav);

    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-button');
    menuButton.textContent = '☰';
    shadow.appendChild(menuButton);

    menuButton.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuButton.classList.toggle('open')
    });
  }
}

customElements.define('hamburger-menu', HamburgerMenu);
