import _ from 'lodash';

/**
 * 基类模型
 */
export default {
  reducers: {
    // 更新 state
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 重置 state
    reset(state, { payload }) {
      return payload;
    },
  },
};
