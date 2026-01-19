export { sprintf } from 'jed';

export const translate = s => s;

export const ngettext = (singular, plural, count) =>
  count === 1 ? singular : plural;
