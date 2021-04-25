import { get } from 'foremanReact/redux/API';
import {
  REMEDIATIONS_API_KEY,
  REMEDIATIONS_PATH,
} from './RemediationTableConstants';

export const fetchRemediations = ({ selectedIds, isAllSelected, query }) =>
  get({
    key: REMEDIATIONS_API_KEY,
    url: REMEDIATIONS_PATH,
    params: { ids: Object.keys(selectedIds), isAllSelected, query },
  });
