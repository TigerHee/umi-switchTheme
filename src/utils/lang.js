import { formatMessage, setLocale, FormattedHTMLMessage } from 'umi';
import moment from 'moment';

export const _t = (key, values) => {
  return formatMessage({ id: key }, values);
};

export const _tHTML = (key, values) => {
  return <FormattedHTMLMessage id={key} values={values} />;
};

export const setLang = (localeKey, realReload = true) => {
  setLocale((localeKey || '').replace('_', '-'), realReload);
  moment.locale(localeKey);
  if (moment.locale() === 'en') {
    moment.updateLocale('en', { relativeTime: { s: '%d seconds' } });
  } else if (moment.locale() === 'zh-cn') {
    moment.updateLocale('zh-cn', { relativeTime: { s: '%d 秒' } });
  }
};
