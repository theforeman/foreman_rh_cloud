import Immutable from 'seamless-immutable';
import { noop } from 'patternfly-react';

const hits = Immutable([
  {
    id: 16,
    host_id: 1,
    last_seen: '2020-11-01T15:55:14.280+02:00',
    title: 'Decreased security: Yum GPG verification disabled',
    solution_url: '',
    total_risk: 1,
    likelihood: 1,
    publish_date: '2017-11-02T14:00:00.000+02:00',
    results_url:
      'https://cloud.redhat.com/insights/advisor/recommendations/hardening_yum%7CHARDENING_YUM_GPG_3RD_6/716306d2-b4f8-446f-82c8-a45af30110bd/',
  },
  {
    id: 17,
    host_id: 1,
    last_seen: '2020-11-01T15:55:14.280+02:00',
    title: 'Installation of packages across major releases is not supported',
    solution_url: 'https://access.redhat.com/node/54483',
    total_risk: 2,
    likelihood: 3,
    publish_date: '2019-07-12T02:08:00.000+03:00',
    results_url:
      'https://cloud.redhat.com/insights/advisor/recommendations/packages_across_major_release%7CPACKAGES_ACROSS_MAJOR_RELEASE/716306d2-b4f8-446f-82c8-a45af30110bd/',
  },
]);

export const tableProps = {
  page: 1,
  perPage: 5,
  status: 'RESOLVED',
  sortBy: 'total_risk',
  sortOrder: 'desc',
  hits,
  query: '',
  itemCount: 2,
  fetchInsights: noop,
  onTableSetPage: noop,
  onTablePerPageSelect: noop,
  onTableSort: noop,
  onTableSelect: noop,
  selectedIds: {},
  showSelectAllAlert: false,
  selectAll: noop,
  clearAllSelection: noop,
  error: null,
};
