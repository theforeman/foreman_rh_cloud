import camelCase from 'lodash/camelCase';

export const getURIQuery = jest.fn(() => ({}));

export const noop = Function.prototype;

export const propsToCamelCase = ob => {
  if (typeof ob !== 'object' || ob === null) return ob;

  return Object.keys(ob).reduce((memo, key) => {
    memo[camelCase(key)] = ob[key];
    return memo;
  }, {});
};
