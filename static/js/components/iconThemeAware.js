class ThemeAwareIcon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.iconImg = document.createElement('img');
    this.shadowRoot.appendChild(this.iconImg);

    const styles = document.createElement('style');
    styles.textContent = `
      img {
        width: var(--icon-width, 20px); /* Default width */
        height: var(--icon-height, 20px); /* Default height */
        transition: all 0.3s ease;
        vertical-align: middle;
      }
    `;
    this.shadowRoot.appendChild(styles);

    this.observer = new MutationObserver(() => {
      this.updateIcon();
    });

    this.observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  connectedCallback() {
    this.updateIcon();
    this.updateSize(); // Call updateSize when the component is connected
  }


  updateIcon() {
    const isDarkMode = document.body.classList.contains('light-theme');
    const iconName = this.getAttribute('icon');

    if (iconName) {
      const lightIconPath = `/static/icons/${iconName}-light.png`;
      const darkIconPath = `/static/icons/${iconName}-dark.png`;

      this.iconImg.style.opacity = 0; // Fade out

      setTimeout(() => {
        this.iconImg.src = isDarkMode ? darkIconPath : lightIconPath;
        this.iconImg.alt = isDarkMode ? `${iconName} (Dark)` : `${iconName} (Light)`;
        this.iconImg.style.opacity = 1;
      }, 150)
    } else {
      console.error('Icon name is required. Set the "icon" attribute.');
    }
  }

  updateSize() {
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');

    if (width) {
      this.style.setProperty('--icon-width', width + 'px'); // Set as CSS variable
    }
    if (height) {
      this.style.setProperty('--icon-height', height + 'px'); // Set as CSS variable
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'width' || name === 'height') {
      this.updateSize();
    }
  }

  static get observedAttributes() {
    return ['width', 'height'];
  }


  disconnectedCallback() {
    this.observer.disconnect();
  }
}

customElements.define('theme-aware-icon', ThemeAwareIcon);
