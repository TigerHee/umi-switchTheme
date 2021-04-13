import { pull } from 'utils/request';

export function getVersion() {
  const { protocol, host } = window.location;
  const prefix = `${protocol}//${host}`;
  return pull(`${prefix}/version.json?_ts=${Date.now()}`);
}
