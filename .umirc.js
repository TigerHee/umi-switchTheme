const { name, version } = require('./package.json');
const { NODE_ENV } = process.env;
const _DEV_ = NODE_ENV !== 'production';

// publicPath, for cdn link
const publicPath = _DEV_ || process.env.ENV !== 'prod' ? '/' : `/${version}/`;

export default {
  publicPath,
  ignoreMomentLocale: true,
  antd: {},
  dva: {},
  title: 'title',
  locale: {
    default: 'en-US',
    baseNavigator: true,
  },
  alias: {
    src: `${__dirname}/src/`,
    helper: `${__dirname}/src/helper.js`,
    config: `${__dirname}/src/config.js`,
    models: `${__dirname}/src/models/`,
    services: `${__dirname}/src/services/`,
    utils: `${__dirname}/src/utils/`,
    assets: `${__dirname}/src/assets/`,
    components: `${__dirname}/src/components/`,
    theme: `${__dirname}/src/theme/`,
  },
  define: {
    _DEV_,
    _PUBLIC_PATH_: publicPath,
    _RELEASE_: `${name}_${version}`,
    _ENV_: process.env.ENV,
  },
  proxy: {
    '/api': {
      target: 'http://xxx',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    },
  },
};
