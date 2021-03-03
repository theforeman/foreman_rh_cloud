import { filterAccounts } from '../AccountListHelper';
import { accounts } from '../AccountList.fixtures';

describe('AccountList helpers', () => {
  it('account ids filter should return all accounts where label contains "test"', () => {
    expect(filterAccounts(accounts, 'AcCoUnT')).toEqual(accounts);
  });

  it('account ids filter should not match', () => {
    expect(filterAccounts(accounts, 'no_match')).toEqual({});
  });
});
