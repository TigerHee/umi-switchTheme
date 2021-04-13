import { storagePrefix } from 'config';

const { localStorage } = window;

const genKey = subKey => `${storagePrefix}_${subKey}`;

export default {
  getItem: (key) => {
    if (!localStorage) return;

    const data = localStorage.getItem(genKey(key));
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
    } else {
      return null;
    }
  },
  setItem: (key, data) => {
    if (!localStorage) return;
    try {
      return localStorage.setItem(genKey(key), JSON.stringify(data));
    } catch (e) {
      const notification = require('antd/lib/notification').default;

      notification.warn({
        message: 'Sorry, the browser’s storage space is full.',
        description: 'To ensure the normal usage, please visit Tools > Clear ' +
        'Recent History > Cookies and select All in Time Range to release the storage space.',
      });
    }
  },
  removeItem: (key) => {
    if (!localStorage) return;
    try {
      localStorage.removeItem(genKey(key));
    } catch (e) {
      console.log(e);
    }
  },
};
