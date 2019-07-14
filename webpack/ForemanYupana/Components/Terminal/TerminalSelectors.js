import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectTerminal = state => selectForemanYupana(state).terminal;
export const selectLogs = state => selectTerminal(state).logs;
