import _ from 'lodash';
import React from 'react';
import 'animate.css';
import SwitchTheme from 'components/SwitchTheme';
import style from './style.less';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div className={style.indexPage}>
        <div>index page</div>
        <SwitchTheme />
      </div>
    );
  }
}
