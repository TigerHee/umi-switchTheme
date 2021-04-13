import React, { useEffect } from 'react';
import { Button } from 'antd';
import styles from './style.less';
import { setTheme } from 'theme/index';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

const SwitchTheme = ({ dispatch, theme }) => {
  const pathname = useHistory().location.pathname;

  useEffect(() => {
    setTheme();
  }, [pathname]);

  const switchButton = () => {
    const newTheme = theme === 'Dark' ? 'Light' : 'Dark';
    dispatch({ type: 'app/update', payload: { theme: newTheme } });
    setTheme(newTheme);
  };
  return (
    <span className={styles.switchTheme} onClick={switchButton}>
      <Button className={styles.btn} type="primary">
        {theme === 'Dark' ? '切换白主题' : '切换黑主题'}
      </Button>
    </span>
  );
};

export default connect(({ app }) => {
  return {
    theme: app.theme,
  };
})(SwitchTheme);
