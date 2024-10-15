import { WebApp } from '@twa-dev/sdk';

class TelegramService {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (!this.initialized) {
      WebApp.ready();
      this.initialized = true;
    }
  }

  getUserInfo() {
    if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
      return {
        id: WebApp.initDataUnsafe.user.id,
        firstName: WebApp.initDataUnsafe.user.first_name,
        lastName: WebApp.initDataUnsafe.user.last_name,
        username: WebApp.initDataUnsafe.user.username,
      };
    }
    return null;
  }

  async requestWallet() {
    try {
      const result = await WebApp.requestWallet();
      return result ? result.address : null;
    } catch (error) {
      console.error('Error requesting wallet:', error);
      return null;
    }
  }

  showAlert(message) {
    WebApp.showAlert(message);
  }

  showConfirm(message) {
    return WebApp.showConfirm(message);
  }

  openLink(url) {
    WebApp.openLink(url);
  }

  closeApp() {
    WebApp.close();
  }

  expandApp() {
    WebApp.expand();
  }

  setHeaderColor(color) {
    WebApp.setHeaderColor(color);
    WebApp.setBackgroundColor(color);
  }

  async requestReviews() {
    const result = await WebApp.requestReviews();
    return result;
  }

  async requestContact() {
    const result = await WebApp.requestContact();
    return result;
  }
}

export default new TelegramService();