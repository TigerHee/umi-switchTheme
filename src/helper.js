import _ from 'lodash';
import FormData from 'form-data';
import moment from 'moment';
import Decimal from 'decimal.js/decimal';
import EventEmitter from 'event-emitter';
import { _t } from 'utils/lang';

Decimal.set({ precision: 128 });

/**
 * Date string to timestamp
 * @param timestamp
 * @param format
 * @returns {string}
 */
export const timestamp = (date) => {
  if (moment(date).isValid()) {
    return moment(date).valueOf();
  }
  return null;
};

/**
 * Timestamp formatting
 * Format by local time zone
 * @param timestamp ms
 * @param format
 * @returns {string}
 */
export const showDateTime = (time, format = 'MM-DD-YYYY HH:mm:ss') => {
  const timeVal = timestamp(time);
  return moment(_.toNumber(timeVal)).format(format);
};

/**
 * Format by fixed time zone
 * @param {*} ts
 * @param {*} zone
 */
export const showDateTimeByZone = (ts, format = 'YYYY/MM/DD HH:mm:ss', zone = 8) => {
  return moment(ts).utcOffset(zone).format(format);
};

/**
 * Object to form data
 * @param obj
 * @returns {*}
 */
export const formlize = (obj) => {
  if (obj instanceof FormData) {
    return obj;
  }
  const form = new FormData();
  _.each(obj, (value, key) => {
    if (typeof value !== 'undefined') {
      form.append(key, value);
    }
  });
  return form;
};

/**
 * Thousands separator
 * @param n
 * @returns {string}
 */
const SeparateNumberPool = {
  pool: Object.create(null),
  poolCount: 0,
  has(k) {
    return !!this.pool[k];
  },
  get(k) {
    return this.pool[k];
  },
  set(k, v) {
    if (this.poolCount > 100000) {
      // Clear cache
      this.poolCount = 0;
      this.pool = Object.create(null);
    }
    if (!this.has(k)) {
      this.poolCount += 1;
    }
    this.pool[k] = v;
  },
};
export const separateNumber = (n) => {
  if (typeof +n !== 'number') {
    return n;
  }
  const num = `${n}`;

  if (SeparateNumberPool.has(num)) {
    return SeparateNumberPool.get(num);
  }
  if (!/^[0-9.]+$/.test(num)) {
    return n;
  }

  let integer = num;
  let floater = '';
  if (num.indexOf('.') > -1) {
    const arr = num.split('.');
    integer = arr[0];
    floater = arr[1];
  }
  const len = integer.length;
  let parser = '';
  if (len > 3) {
    let count = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      parser = integer[i] + parser;
      count += 1;
      if (count % 3 === 0 && i > 0) {
        parser = `,${parser}`;
      }
    }
  } else {
    parser = integer;
  }
  if (floater !== '') {
    floater = `.${floater}`;
  }
  const r = `${parser}${floater}`;
  SeparateNumberPool.set(num, r);

  return r;
};

/**
 * Whether open in WeChat browser
 *
 * @returns {boolean}
 */
export const isOpenInWechat = (pUA) => {
  const ua = pUA || navigator.userAgent.toLowerCase();
  const match = ua.match(/MicroMessenger/i);

  return match && match[0] === 'micromessenger';
};

/**
 * Scroll to anchor
 * @param anchorName
 */
export const scrollToAnchor = (anchorName) => {
  if (anchorName) {
    const anchorElement = document.getElementById(anchorName);
    if (anchorElement) {
      anchorElement.scrollIntoView();
    }
  }
};

/**
 * Events
 */
export const Event = {};

Event.addHandler = window.addEventListener
  ? (target, type, handler) => {
      target.addEventListener(type, handler, false);
    }
  : (target, type, handler) => {
      target.attachEvent(`on${type}`, handler);
    };

Event.removeHandler = window.removeEventListener
  ? (target, type, handler) => {
      target.removeEventListener(type, handler, false);
    }
  : (target, type, handler) => {
      target.detachEvent(`on${type}`, handler);
    };

Event.triggerEvent = (target, type) => {
  if (document.createEvent) {
    const eventMp = {
      HTMLEvents: [
        'abort',
        'blur',
        'change',
        'error',
        'focus',
        'load',
        'reset',
        'resize',
        'scroll',
        'select',
        'submit',
        'unload',
      ],
      UIEvents: ['DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'keydown', 'keypress', 'keyup'],
      MouseEvents: ['click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'],
      MutationEvents: [
        'DOMAttrModified',
        'DOMNodeInserted',
        'DOMNodeRemoved',
        'DOMCharacterDataModified',
        'DOMNodeInsertedIntoDocument',
        'DOMNodeRemovedFromDocument',
        'DOMSubtreeModified',
      ],
    };
    let eventKey = null;
    _.map(eventMp, (types, key) => {
      if (_.indexOf(types, type) > -1) {
        eventKey = key;
        return false;
      }
    });

    if (!eventKey) {
      throw new TypeError('Unknown EventType.');
    }

    const event = document.createEvent(eventKey);
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
  } else if (document.createEventObject) {
    target.fireEvent(`on${type}`);
  }
};

/**
 *
 * @description Get queryString string into JSON object
 * @param {String} search Optional parameter None is to automatically obtain the queryString behind the location
 * @returns {Object}
 */
export function searchToJson(search) {
  if (!search) {
    search = window.location.search.slice(1);
  }
  const temp = {};
  if (search) {
    try {
      const arr = search.split('&');
      for (const key in arr) {
        if (Object.prototype.hasOwnProperty.call(arr, key)) {
          const str = arr[key];
          const at = str.indexOf('=');
          const k = str.substring(0, at);
          const v = decodeURIComponent(decodeURI(str.substring(at + 1)));
          temp[k] = v;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return temp;
}

/**
 * Get browser language
 *
 * @returns {String|null}
 */
export const getFirstBrowserLanguage = () => {
  const nav = window.navigator;
  const browserLanguagePropertyKeys = [
    'language',
    'browserLanguage',
    'systemLanguage',
    'userLanguage',
  ];
  let i;
  let language;

  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) {
        return language;
      }
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return language;
    }
  }

  return null;
};

/**
 * get Window rect height
 */
export const getWindowRectHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

/**
 * hash format
 */
export const hashFormat = (hash, preHashNum) => {
  if (!hash) {
    return '';
  }
  const ignoreLength = preHashNum ? preHashNum * 2 : 20;
  if (hash.length <= ignoreLength || typeof hash !== 'string') {
    return hash;
  }
  const hashNum = preHashNum ? preHashNum : 5;
  var reg = new RegExp(`^(.{${hashNum}})(?:.+)(.{${hashNum}})$`);
  return hash.replace(reg, '$1...$2');
};

export const numberFormat = (num) => {
  num = parseFloat(num);
  return num.toFixed(8);
};

/**
 * 高精度指定位数（默认超出精度截断）
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
export const numberFixed = (v, decimal = 8, round = Decimal.ROUND_DOWN) => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  let str = new Decimal(stringV).toFixed(decimal, round);
  str = separateNumber(str);
  return str;
};
export const NumberFixedOnly = (v, decimal = 8, round = Decimal.ROUND_DOWN, ignoreZero = true) => {
  round = round || Decimal.ROUND_DOWN;
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0 && ignoreZero) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  let str = new Decimal(stringV).toFixed(decimal, round);
  return str;
};

/**
 * 高精度减法
 */
export const sub = (a, b) => {
  return new Decimal(a).sub(b);
};

/**
 * 高精度加法
 */
export const add = (a, b) => {
  return new Decimal(a).plus(b);
};

/**
 * 高精度加法，并转换成字符串显示（默认超出精度截断）
 */
export const addAndFixed = (a, b, decimal = 8, round = Decimal.ROUND_DOWN) => {
  let str = add(a, b).toFixed(decimal, round);
  str = fixedDecimalZero(str);
  return str;
};

/**
 * 高精度除法
 * @param a
 * @param b
 * @returns {Decimal}
 */
export const divide = (a, b) => {
  return new Decimal(a).div(b);
};

/**
 * 高精度除法，并转换成字符串显示（默认超出精度截断）
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const divideAndFixed = (a, b, decimal = 8, round = Decimal.ROUND_DOWN) => {
  let str = divide(a, b).toFixed(decimal, round);
  str = fixedDecimalZero(str);
  return str;
};

/**
 * 高精度乘法
 * @param a
 * @param b
 * @returns {Decimal}
 */
export const multiply = (a, b) => {
  return new Decimal(a).mul(b);
};

/**
 * 高精度乘法，并转换成字符串显示（默认超出精度截断）
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const multiplyAndFixed = (a, b, decimal = 8, round = Decimal.ROUND_DOWN) => {
  let str = multiply(a, b).toFixed(decimal, round);
  str = fixedDecimalZero(str);
  return str;
};

/**
 * 去除小数后多余的0
 * @param str
 * @returns {string}
 */
export const fixedDecimalZero = (str) => {
  if (str && !isNaN(str)) {
    return new Decimal(str).toFixed();
  }
  return str;
};

export const formatDenom = (str) => {
  if (!str) return str;
  if (str.includes('/')) {
    return str.split('/')[1].toUpperCase();
  }
  return str.toUpperCase();
};

export const formatSymbol = (str, separatorFrom = '-', separatorTo = '-') => {
  if (!str) return str;
  const target = str.split(separatorFrom)[0];
  const base = str.split(separatorFrom)[1];
  return `${formatDenom(target)}${separatorTo}${formatDenom(base)}`;
};

export const formatTokenAmount = (num, decimal = 8) => {
  if (num) num = +num;
  else return '-';
  const base = Math.pow(10, 18);
  let str = divideAndFixed(num, base, decimal);
  str = separateNumber(str);
  return str;
};

/**
 * 事件集合，可以创建、获取、删除指定的事件(只需要一个事件处理器, 建议不传参数，这样可以保持单例模式)
 */
const evts = {};

const getEvt = (evtId = 'event') => {
  if (!evts[evtId]) {
    evts[evtId] = new EventEmitter();
  }
  return evts[evtId];
};

const removeEvt = (id) => {
  delete evts[id];
};

/**
 *
 * @type {{getEvt: (function(*): *), removeEvt: removeEvt}}
 */
export const evtEmitter = {
  getEvt,
  removeEvt,
};

// 从步长获取精度
export const getPrecisionFromIncrement = (increment, maxPrecision = 8) => {
  if (!increment) return maxPrecision;
  if (typeof increment === 'number') {
    increment = increment.toString();
  }
  const decimalsArr = (increment || '').split('.');
  if (decimalsArr.length > 1) {
    return decimalsArr[1].length;
  }
  return 0;
};

/**
 * 精简大位数，并增加千分位分隔符 (超出百万的数字，小数位只显示2位)
 * @param value
 * @returns {*}
 */
export const readableNumber = (value) => {
  const million = 1000000;
  const number = parseFloat(value);

  if (isNaN(number)) {
    return value;
  }
  if (number < million) {
    return separateNumber(value);
  }

  return separateNumber(numberFixed(number, 2));
};
