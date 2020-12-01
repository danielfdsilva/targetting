import get from 'lodash.get';

export const arrayRange = (start, end) => Array(end - start + 1).fill(start).map((x, y) => x + y);

const identitySortFn = (path) => (a, b) => {
  const va = get(a, path);
  const vb = get(b, path);

  if (va > vb) return -1;
  if (va < vb) return 1;
  return 0;
};

export const arraySort = (arraySort, fn) => {
  const copy = [...arraySort];

  const func = typeof fn === 'function'
    ? fn
    : identitySortFn(fn);

  return copy.sort(func);
};
