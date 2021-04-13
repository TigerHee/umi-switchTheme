import cssVars from 'css-vars-ponyfill';
import storage from 'utils/storage';

export const THEME = {
  Light: {
    '--font-high-emphasis': 'rgba(1, 8, 30, 1)',
    '--font-primary': 'rgba(36, 174, 143, 1)',
  },
  Dark: {
    '--font-high-emphasis': 'rgba(255, 255, 255, 1)',
    '--font-primary': 'rgba(237, 110, 114, 1)',
  },
};

export const setTheme = themeKey => {
  const themeKeys = Object.keys(THEME);
  let KEY = null;
  if (themeKeys.includes(themeKey)) {
    KEY = themeKey;
  } else {
    KEY = storage.getItem('theme') || 'Light';
  }
  storage.setItem('theme', KEY);

  let styleLink = document.getElementById('theme-style');
  let hrefSrc = '/theme/normal.css';
  if (KEY === 'Light') {
    hrefSrc = '/theme/normal.css';
  } else if (KEY === 'Dark') {
    hrefSrc = '/theme/dark.css';
  }

  if (styleLink) {
    styleLink.href = hrefSrc;
  } else {
    styleLink = document.createElement('link');
    styleLink.type = 'text/css';
    styleLink.rel = 'stylesheet';
    styleLink.id = 'theme-style';
    styleLink.href = hrefSrc;
    document.body.append(styleLink);
  }
  cssVars({
    onlyLegacy: false,
    variables: THEME[KEY],
    onError() {
      cssVars({
        onlyLegacy: false,
        variables: THEME[KEY],
      });
    },
  });
};
