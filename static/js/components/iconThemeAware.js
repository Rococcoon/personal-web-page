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

    this.previousBlobUrl = null;
    this.cachedIcons = {};  // Store cached icon URLs here

    this.observer = new MutationObserver(() => {
      this.updateIcon();
    });

    this.observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  connectedCallback() {
    this.updateIcon();
    this.updateSize();
  }

  async updateIcon() {
    const isDarkMode = document.body.classList.contains('light-theme');
    const iconName = this.getAttribute('icon');

    if (!iconName) {
      console.error('Icon name is required. Set the "icon" attribute.');
      return;
    }

    const lightIconPath = `/static/icons/${iconName}-light.png`;
    const darkIconPath = `/static/icons/${iconName}-dark.png`;
    const iconUrl = isDarkMode ? darkIconPath : lightIconPath;

    // Check if this icon is already cached in the local state
    if (this.cachedIcons[iconUrl]) {
      this.setBlobUrl(this.cachedIcons[iconUrl]);
      return;
    }

    this.iconImg.style.opacity = 0; // Fade out

    try {
      const cachedBlob = await this.getCachedImage(iconUrl);
      if (cachedBlob) {
        this.setBlobUrl(cachedBlob);
      } else {
        this.fetchAndCacheImage(iconUrl);
      }
    } catch (error) {
      console.error("Error fetching or caching icon:", error);
      this.iconImg.src = iconUrl; // Fallback to direct fetch if cache fails
    }

    this.iconImg.alt = isDarkMode ? `${iconName} (Dark)` : `${iconName} (Light)`;

    setTimeout(() => {
      this.iconImg.style.opacity = 1; // Fade in
    }, 150);
  }

  async getCachedImage(url) {
    if ('caches' in window) {
      const cache = await caches.open('icon-cache');
      const response = await cache.match(url);
      if (response) {
        return response.blob();
      }
    }
    return null;
  }

  async fetchAndCacheImage(url) {
    // Only fetch if not already in cache
    if (this.cachedIcons[url]) {
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);

      const cache = await caches.open('icon-cache');
      cache.put(url, response.clone()); // Store in cache

      const blob = await response.blob();
      this.cachedIcons[url] = blob; // Store it in our local cache
      this.setBlobUrl(blob);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  setBlobUrl(blob) {
    // Revoke the old Blob URL to prevent memory leaks
    if (this.previousBlobUrl) {
      URL.revokeObjectURL(this.previousBlobUrl);
    }

    this.previousBlobUrl = URL.createObjectURL(blob);
    this.iconImg.src = this.previousBlobUrl;
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
    if (this.previousBlobUrl) {
      URL.revokeObjectURL(this.previousBlobUrl); // Clean up on component removal
    }
  }
}

customElements.define('theme-aware-icon', ThemeAwareIcon);
