/**
 * copied from core, since it's not in the ReactApp folder,
 * it's complicated to import it and mock it in tests.
 * should be imported once core moves it to the ReactApp folder.
 */
export const foremanUrl = path => `${window.URL_PREFIX}${path}`;

export const OVERVIEW_TAB_PATH = '/Overview';

export const isNotRhelHost = ({ hostDetails }) =>
  // This regex tries matches sane variations of "RedHat", "RHEL" and "RHCOS"
  !new RegExp('red[\\s\\-]?hat|rh[\\s\\-]?el|rhc[\\s\\-]?os', 'i').test(
    // eslint-disable-next-line camelcase
    hostDetails?.operatingsystem_name
  );

export const vulnerabilityDisabled = ({ hostDetails }) =>
  isNotRhelHost({ hostDetails }) || !hostDetails?.vulnerability?.enabled;

export const hasNoInsightsFacet = ({ response, hostDetails }) =>
  // eslint-disable-next-line camelcase
  !(response?.insights_attributes || hostDetails?.insights_attributes);
