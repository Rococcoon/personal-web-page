class ThemeAwareIcon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.iconImg = document.createElement('img');
    this.shadowRoot.appendChild(this.iconImg);

    const styles = document.createElement('style');
    styles.textContent = `
      img {
        width: var(--icon-width, 20px);
        height: var(--icon-height, 20px);
        transition: opacity 0.3s ease;
        vertical-align: middle;
        opacity: 1;
      }
    `;
    this.shadowRoot.appendChild(styles);

    this.iconImg.style.opacity = 0; // Initially hide the icon

    this.observer = new MutationObserver(() => {
      this.updateIcon();
    });

    this.observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  connectedCallback() {
    this.updateIcon();
    this.updateSize();
  }

  updateIcon() {
    const isDarkMode = document.body.classList.contains('light-theme');
    const iconName = this.getAttribute('icon');

    if (!iconName) {
      console.error('Icon name is required. Set the "icon" attribute.');
      return;
    }

    const lightIconPath = `/static/icons/${iconName}-light.png`;
    const darkIconPath = `/static/icons/${iconName}-dark.png`;
    const iconUrl = isDarkMode ? darkIconPath : lightIconPath;

    this.iconImg.src = iconUrl;
    this.iconImg.alt = isDarkMode ? `${iconName} (Dark)` : `${iconName} (Light)`;

    // Fade in the image after changing the source
    setTimeout(() => {
      this.iconImg.style.opacity = 1;
    }, 150);
  }

  updateSize() {
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');

    if (width) this.style.setProperty('--icon-width', `${width}px`);
    if (height) this.style.setProperty('--icon-height', `${height}px`);
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
