const { name, version } = require('./package.json');
const { NODE_ENV } = process.env;
const _DEV_ = NODE_ENV !== 'production';

// publicPath, for cdn link
const publicPath = _DEV_ || process.env.ENV !== 'prod' ? '/' : `/${version}/`;

// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  publicPath,
  ignoreMomentLocale: true,
  targets: {
    ie: 10,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'title',
        dll: true,
        locale: {
          enable: true,
          default: 'en-US',
          baseNavigator: true,
        },
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /themes\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
            /utils\//,
          ],
        },
        links: [{ rel: 'shortcut icon', href: '<%= PUBLIC_PATH %>favicon.svg' }],
        scripts: [],
      },
    ],
    [
      'umi-plugin-antd-theme',
      {
        theme: [
          {
            key: 'normal',
            fileName: 'normal.css',
            modifyVars: {
              '@primary-color': '#0FCD8C',
              '@btn-primary-color': '#01081E',
            },
          },
          {
            key: 'dark',
            fileName: 'dark.css',
            modifyVars: {
              '@primary-color': '#ff6100',
              '@btn-primary-color': '#ff6100',
            },
          },
        ],
      },
    ],
  ],
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
  chainWebpack(config) {
    config.module
      .rule('exclude')
      .use('url-loader')
      .tap(options => {
        return {
          ...options,
          limit: 10, // Set to extremely low values, stop processing
        };
      });
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        inline: 'fallback',
      });
  },
  proxy: {
    '/api': {
      target: 'http://xxx',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    },
  },
};
