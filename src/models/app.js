import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import { getVersion } from 'services/app';
import { setLang } from 'utils/lang';
import { searchToJson, getFirstBrowserLanguage } from 'helper';
import storage from 'utils/storage';
import { LANG_LIST } from 'src/config';

/**
 * Init lang code
 */
const DEFAULT_LANG = 'en_US';
const DEFAULT_CURRENCY = 'USD';

const validLangs = _.map(LANG_LIST, ({ key }) => key);
const $initLang = (() => {
  const langInQuery = searchToJson().lang;
  const langInStore = storage.getItem('lang');

  let _lang = langInQuery || langInStore;
  if (!_lang) {
    let browserLang = getFirstBrowserLanguage();
    if (browserLang) {
      browserLang = browserLang.replace('-', '_');
    }
    _lang = browserLang;
  }

  if (_lang && _.indexOf(validLangs, _lang) > -1) {
    return _lang;
  }

  return DEFAULT_LANG;
})();

/**
 * Base app model
 */
export default extend(base, {
  namespace: 'app',
  state: {
    langs: LANG_LIST,
    currentLang: null,
    toastConfig: {},
    theme: ['Light', 'Dark'].includes(storage.getItem('theme'))
      ? storage.getItem('theme')
      : 'Light',
    currencyList: [],
    currentCurrency: null,
    tokens: [],
    tokenIcons: {},
  },
  effects: {
    *init(_, { put, take }) {
      yield put({ type: 'selectLang' });
    },
    *checkVersion(_, { call }) {
      const { release } = yield call(getVersion);
      if (release && release !== _RELEASE_) {
        console.log('Current Release:', _RELEASE_);
        console.log('New Release:', release);
        console.log('Try to refresh new release website');
        window.location.reload(true);
      }
    },
    *selectLang({ payload: { lang, force } = {} }, { put }) {
      lang = lang || $initLang;
      if (_.indexOf(validLangs, lang) === -1) {
        lang = DEFAULT_LANG;
      }
      setLang(lang, force || false);
      storage.setItem('lang', lang);
      yield put({ type: 'update', payload: { currentLang: lang } });
    },
    *setToast({ payload }, { put }) {
      const defaultToastConfig = { type: 'success', open: true, duration: 3000 };
      yield put({
        type: 'update',
        payload: { toastConfig: { ...defaultToastConfig, ...payload } },
      });
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'init' });
    },
    checkVersion({ dispatch }) {
      if (!_DEV_) {
        dispatch({ type: 'checkVersion' });
      }
    },
  },
});
