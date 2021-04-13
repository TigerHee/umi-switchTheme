import React from 'react';
import { Spin } from 'antd';
import styles from './style.less';

const AbsoluteLoading = (props) => {
  return (
    <Spin
      className={styles.loading}
      {...props}
    />
  );
};

export default AbsoluteLoading;
