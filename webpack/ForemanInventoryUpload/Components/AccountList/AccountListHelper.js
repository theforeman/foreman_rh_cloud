import { pickBy } from 'lodash';

export const filterAccounts = (accounts, filterTerm) => {
  if (!filterTerm) return accounts;

  const filterTermLowerCased = filterTerm.toLowerCase();
  return pickBy(accounts, (value, key) =>
    key.toLowerCase().includes(filterTermLowerCased)
  );
};
