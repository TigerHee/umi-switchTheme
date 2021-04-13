/**
 * 避免 take(namespace/effect) 警告
 * @param actionWithNameSpace
 * @returns {function(*): boolean}
 */
export const genCompare = (actionWithNameSpace) => {
  return (action) => {
    return action.type === actionWithNameSpace;
  };
};

/**
 * websocket用回流缓存
 */
export const genL2Cache = () => {
  const l2Cache = {
    // symbol => [data, ...]
    datas: {},
    // symbol => boolean
    locks: {},
    get: (symbol) => {
      return l2Cache.datas[symbol] || [];
    },
    push: (symbol, data) => {
      if (l2Cache.locks[symbol] === false) {
        if (l2Cache.datas[symbol]) {
          l2Cache.datas[symbol].push(data);
        } else {
          l2Cache.datas[symbol] = [data];
        }
      }
    },
    locked: (symbol) => {
      return l2Cache.locks[symbol];
    },
    lock: (symbol) => {
      l2Cache.locks[symbol] = true;
      l2Cache.datas[symbol] = [];
    },
    unlock: (symbol) => {
      l2Cache.locks[symbol] = false;
      l2Cache.datas[symbol] = [];
    },
  };

  return l2Cache;
};

/**
 * websocket 校验
 */
export const genWSCalibration = () => {
  const wsCalibration = {
    sequenceLastMap: {}, // symbol => sequenceLast time
    dropMap: {}, // symbol => bool
    getDropMap: (symbol) => {
      return wsCalibration.dropMap[symbol];
    },
    setSequenceLastMap: (symbol, sequence) => {
      wsCalibration.sequenceLastMap[symbol] = sequence;
    },
    getSequenceLastMap: (symbol) => {
      return wsCalibration.sequenceLastMap[symbol];
    },
    setDropMap: (symbol, status) => {
      wsCalibration.dropMap[symbol] = status;
    },
    calibration: (symbol, sequence, sequenceEnd) => {
      const sequenceLast = sequenceEnd || wsCalibration.sequenceLastMap[symbol];
      if (!sequenceLast) {
        wsCalibration.dropMap[symbol] = false;
      }
      if (sequenceLast
        && parseInt(sequence, 10) - parseInt(sequenceLast, 10) !== 1) {
        wsCalibration.dropMap[symbol] = false;
      }
    },
  };

  return wsCalibration;
};

/**
 * 日志处理
 */
export const genLogger = () => {
  const logger = {
    record: false,
    log: (...args) => {
      if (logger.record) {
        console.log(...args);
      }
    },
    set: (record) => {
      logger.record = record;
    },
  };
  return logger;
};
