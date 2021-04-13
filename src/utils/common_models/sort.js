/**
 * 排序模型
 */
export default {
  state: {
    sorter: null,
  },
  reducers: {
    updateSorter(state, { payload = null, override = false } = {}) {
      return {
        ...state,
        sorter: {
          ...(override ? null : state.sorter),
          ...payload,
        },
      };
    },
  },
  effects: {
    *sort(action, { put }) {
      yield put({ ...action, type: 'updateSorter' });
      yield put({ type: 'query' });
    },
  },
};
