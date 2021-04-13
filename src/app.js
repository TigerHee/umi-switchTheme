import { message } from 'antd';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});
