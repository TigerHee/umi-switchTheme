/**
 * 筛选器模型
 */
export default {
  state: {
    filters: {},
  },
  reducers: {
    updateFilters(state, { payload = null, override = false } = {}) {
      return {
        ...state,
        filters: {
          ...(override ? {} : state.filters),
          // page: 1,
          ...payload,
        },
      };
    },
  },
  effects: {
    *filter({ payload, override, effect = 'query' }, { put }) {
      yield put({ type: 'updateFilters', payload, override });
      if (effect !== false) {
        yield put({ type: effect });
      }
    },
  },
};
