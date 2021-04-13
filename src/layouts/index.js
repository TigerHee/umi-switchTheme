import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import classname from 'classname';
import { Icon, Popover } from 'antd';
import { Link } from 'components/Router';
import Footer from 'components/Footer';
import { seoInfo } from 'config';
import styles from './style.less';


function BasicLayout(props) {
  const { children, location: { pathname }, currentHash } = props;

  const [hoverLogo, setHoverLogo] = useState(false);
  // alert(hash);
  // const isHeadTransparent = _.indexOf(['/'], pathname) > -1 && (!hash || hash === '#welcome');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const seoMap = seoInfo[pathname] || null;

  return (
    <div className={styles.layout}>
      {seoMap && (
        <Helmet>
          <title>{ seoMap.title }</title>
          <meta name="description" content={ seoMap.description } />
          <meta name="keywords" content={ seoMap.keywords } />
        </Helmet>
      )}
      <div className={styles.body}>
        {children}
      </div>
      {
        pathname === '/' ? null : <Footer />
      }
    </div>
  );
}

export default connect((state) => {
  return {
    currentHash: state.app.currentHash,
  };
})(BasicLayout);
