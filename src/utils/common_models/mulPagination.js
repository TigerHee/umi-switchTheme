import extend from 'dva-model-extend';
import { toNumber } from 'lodash';
import base from './base';
import filter from './filter';
import sort from './sort';

/**
 * 分页模型
 */
export default extend(base, filter, sort, {
  state: {
    records: [],
    pagination: false,
  },
  reducers: {
    savePage(state, { payload: { items, totalNum, currentPage, page, pageSize }, listName = '' }) {
      const current = currentPage ? toNumber(currentPage) : toNumber(page);
      const pagination = {
        current, // 当前页数
        total: toNumber(totalNum), // 数据总数
        pageSize: toNumber(pageSize), // 每页条数
      };
      let newState = null;
      if (listName) {
        newState = { ...state,
          [listName]: {
            pagination,
            records: items,
          } };
      } else {
        newState = {
          ...state,
          pagination,
          records: items,
        };
      }

      return newState;
    },

    clearPage(state, { listName = '' }) {
      let newState = null;
      if (listName) {
        newState = {
          ...state,
          [listName]: {
            pagination: false,
            records: [],
          },
        };
      } else {
        newState = {
          ...state,
          pagination: false,
          records: [],
        };
      }
      return newState;
    },
  },
});
