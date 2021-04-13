/**
 * 分页模型
 */
export default {
  state: {
    records: [],
    pagination: false,
  },
  reducers: {
    savePage(
      state,
      {
        payload: { items, totalNum, currentPage, page = 1, pageSize },
      },
    ) {
      const current = typeof currentPage === 'number' ? currentPage : page;
      const pagination = {
        total: totalNum, // 数据总数
        current, // 当前页数
        pageSize, // 每页条数
      };
      return {
        ...state,
        pagination,
        records: items || [],
      };
    },
  },
};
