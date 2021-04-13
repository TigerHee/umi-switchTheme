import React from 'react';

/**
 * 对于引用仅在客户端执行的代码，使用dynamic获取，ssr不会执行
 * dynamic目前在webpack4下build存在坑，先不使用
 */

/**
 * 在客户端执行的组件，由此组件进行加载，自带骨架屏填充背景
 * loader = () => require(Component)
 * LoadingComponent需要能够在node环境运行
 */
const noSSRHoc = (loader, LoadingComponent) =>
  class NoSSR extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loaded: false,
      };
    }

    componentDidMount() {
      // 在componentDidMount里执行，避免在服务端执行
      const promise = new Promise((resolve, reject) => {
        if (typeof loader !== 'function') {
          reject('Invalid noSSRHoc Loader');
          return;
        }

        const _module = loader();
        resolve(_module);
      });
      promise.then((module) => {
        this.handleSetModule(module.default);
        this.setState({ loaded: true });
      });
    }

    handleSetModule = (_module) => {
      this.module = _module;
    };
    module = null;

    render() {
      const Component = this.module;
      const { loaded } = this.state;
      return loaded && Component ? (
        <Component {...this.props} />
      ) : LoadingComponent ? (
        <LoadingComponent />
      ) : null;
    }
  };

export default noSSRHoc;
