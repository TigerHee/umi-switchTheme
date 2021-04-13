import extend from 'dva-model-extend';
import { delay } from 'dva/saga';
import base from './base';
import { genCompare } from './modelHelper';

/**
 * 倒计数模型
 */
const countingPool = {};

export default extend(base, {
  effects: {
    *countDown({ type, payload: { countKey, initial = 60, step = 1, interval = 1000 } },
      { call, put, select, race, take }) {
      const namespace = type.split('/')[0];

      yield put({ type: 'update', payload: { [countKey]: initial } });

      const poolKey = `${namespace}/${countKey}`;
      if (countingPool[poolKey]) return;
      countingPool[poolKey] = 1;

      while (true) {
        const { stop } = yield race({
          run: call(delay, interval),
          stop: take(genCompare(`${namespace}/countDownClear`)),
        });
        if (stop) {
          return;
        }

        const count = yield select(state => state[namespace][countKey]);
        if (!count) {
          delete countingPool[poolKey];
          return;
        }

        yield put({ type: 'update', payload: { [countKey]: count - step } });
      }
    },
    *countDownClear({ type, payload: { countKey } }) {
      const namespace = type.split('/')[0];
      const poolKey = `${namespace}/${countKey}`;

      delete countingPool[poolKey];
    },
  },
});
