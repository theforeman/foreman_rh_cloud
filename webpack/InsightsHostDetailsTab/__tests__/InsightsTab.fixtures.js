export const hostID = 1234;

export const hits = [
  {
    insights_hit: {
      hostname: 'my-host.example.com',
      rhel_version: '7.8',
      uuid: '4739b323-a343-4e89-b71b-81991b8dc656',
      last_seen: '2020-08-19T04:43:09.068706Z',
      title:
        'New Ansible Engine packages are inaccessible when dedicated Ansible repo is not enabled',
      solution_url: 'https://access.redhat.com/node/3359651',
      total_risk: 2,
      likelihood: 2,
      publish_date: '2018-04-16T10:03:16Z',
      results_url:
        'https://cloud.redhat.com/insights/advisor/recommendations/ansible_deprecated_repo%7CANSIBLE_DEPRECATED_REPO/4739b323-a343-4e89-b71b-81991b8dc656/',
    },
  },
];

export const props = {
  hostID,
  hits,
};
