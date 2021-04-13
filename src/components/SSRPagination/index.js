import React from 'react';
import pathToRegexp from 'path-to-regexp';
import { Pagination, Icon } from 'antd';
import Link from 'umi/link';
import style from './style.less';

class NewsPagination extends React.Component {
  /**
   * 处理分页参数
   * @param {*} page
   * @param {*} type 'page' | 'prev' | 'next'
   * @param {*} originalElement
   */
  itemRender = (page, type, originalElement) => {
    const { pathTpl } = this.props;

    const toPath = pathToRegexp.compile(pathTpl);
    const toLink = toPath({ page });

    if (type === 'page') {
      return (
        <Link to={toLink} className={style.pageLink}>{ page }</Link>
      );
    }
    return (
      <Link to={toLink} className={`${style.pageLink}`}>
        <Icon type={type === 'prev' ? 'left' : 'right'} />
      </Link>
    );
  };

  render() {
    const { match, location, history, ...otherProps } = this.props;
    const { total } = otherProps;
    if (!total) {
      return null;
    }

    return (
      <Pagination
        {...otherProps}
        itemRender={this.itemRender}
      />
    );
  }
}

export default NewsPagination;
