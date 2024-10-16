/**
 * copied from core, since it's not in the ReactApp folder,
 * it's complicated to import it and mock it in tests.
 * should be imported once core moves it to the ReactApp folder.
 */
export const foremanUrl = path => `${window.URL_PREFIX}${path}`;

export const isNotRhelHost = ({ hostDetails }) =>
  // eslint-disable-next-line camelcase
  !new RegExp('red\\s?hat', 'i').test(hostDetails?.operatingsystem_name);
