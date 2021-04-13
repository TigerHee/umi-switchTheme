import _ from 'lodash';
import { delay as delaySaga } from 'dva/saga';
import { genCompare } from './modelHelper';


/**
 * 轮询模型
 * @type {boolean}
 */

const polling = true;
const watched = {};

export default {
  effects: {
    *watchPolling({ type, payload: { effect, interval = 20 * 1000 } },
      { take, put, race, call, fork, cancel, cancelled }) {
      let initOptions = { interval };
      let options = { ...initOptions };
      const namespace = type.split('/')[0];
      const withNamespace = actionType => `${namespace}/${actionType}`;

      const START = `${effect}@polling`;
      const RESTART = `${effect}@polling:restart`;
      const UPDATE = `${effect}@polling:update`;
      const CANCEL = `${effect}@polling:cancel`;
      const OPTIONS = `${effect}@polling:options`;

      const innerActionTypePrefix = `${effect}@polling?${namespace}`;
      const _TICK = `${innerActionTypePrefix}:tick`;
      const _TICK_DO = `${_TICK}:do`;
      const _TICK_NEXT = `${_TICK}:next`;

      let effectPayload = null;
      let tickTask = null;
      let cancelTask = null;
      let updateTask = null;
      let configTask = null;

      const effectWithNameSpace = withNamespace(effect);
      if (watched[effectWithNameSpace]) {
        return;
      }
      watched[effectWithNameSpace] = true;

      const runTick = function *runTick() {
        try {
          while (polling) {
            let optInterval = options.interval;
            if (_.isFunction(optInterval)) {
              optInterval = yield call(optInterval, effectPayload);
            }
            if (!_.isFinite(optInterval)) {
              yield put({ type: CANCEL });
            }
            const { waited, doTick } = yield race({
              waited: call(delaySaga, optInterval),
              doTick: take(_TICK_DO),
              next: take(_TICK_NEXT),
            });
            if (waited || doTick) {
              yield put({ type: _TICK });
            }
          }
        } finally {
          if (yield cancelled()) {
            tickTask = null;
          }
        }
      };
      const listenCancelAction = function *listenCancelAction() {
        while (polling) {
          yield race([
            take(CANCEL),
            take(genCompare(withNamespace(CANCEL))),
          ]);
          if (tickTask) {
            yield cancel(tickTask);
          }
        }
      };
      const listenUpdatePayload = function *listenUpdatePayload() {
        while (polling) {
          const updateAction = yield take(genCompare(withNamespace(UPDATE)));
          if (typeof updateAction.payload !== 'undefined') {
            effectPayload = updateAction.payload;
            yield put({ type: _TICK });
          }
        }
      };
      const listenUpdateConfig = function *listenUpdateConfig() {
        while (polling) {
          const updateAction = yield take(genCompare(withNamespace(OPTIONS)));
          const configReducer = updateAction.payload;
          if (typeof configReducer === 'function') {
            const newOptions = configReducer.call(null, { ...initOptions });
            if (_.isPlainObject(newOptions)) {
              options = newOptions;
              yield put({ type: _TICK_DO });
            }
          }
        }
      };

      while (polling) {
        const { start, restart } = yield race({
          tick: take(_TICK),
          start: take(genCompare(withNamespace(START))),
          restart: take(genCompare(withNamespace(RESTART))),
        });

        if (start) {
          effectPayload = start.payload;
          if (start.options) {
            initOptions = { ...initOptions, ...start.options };
            options = { ...initOptions };
          }
        }

        if (start || restart) {
          if (!tickTask) {
            tickTask = yield fork(call, runTick);
          }
          if (!cancelTask) {
            cancelTask = yield fork(call, listenCancelAction);
          }
          if (!updateTask) {
            updateTask = yield fork(call, listenUpdatePayload);
          }
          if (!configTask) {
            configTask = yield fork(call, listenUpdateConfig);
          }
        }

        yield put({ type: effect, payload: effectPayload });
      }
    },
  },
};
