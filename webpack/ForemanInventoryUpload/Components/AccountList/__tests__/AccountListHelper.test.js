import { filterAccounts } from '../AccountListHelper';
import { accounts, accountIDs } from '../AccountList.fixtures';

describe('AccountList helpers', () => {
  it('account ids filter should return all accounts where label contains "test"', () => {
    expect(filterAccounts(accounts, accountIDs, 'test')).toEqual(accountIDs);
  });

  it('account ids filter should not match', () => {
    expect(filterAccounts(accounts, accountIDs, 'no_match')).toEqual([]);
  });
});
