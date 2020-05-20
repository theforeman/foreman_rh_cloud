export const filterAccounts = (accounts, accountIds, filterTerm) => {
  if (!filterTerm || !accountIds.length) {
    return accountIds;
  }

  const filterTermLowerCased = filterTerm.toLowerCase();
  return accountIds.filter(id =>
    accounts[id].label.toLowerCase().includes(filterTermLowerCased)
  );
};
