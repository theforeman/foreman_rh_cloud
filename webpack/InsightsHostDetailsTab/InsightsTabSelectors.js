import { selectHostInsights } from '../ForemanRhCloudSelectors';

export const selectHits = state => selectHostInsights(state).hits;
