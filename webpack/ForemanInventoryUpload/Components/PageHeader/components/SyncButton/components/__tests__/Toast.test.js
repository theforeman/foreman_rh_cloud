import React from 'react';
import { shallow } from '@theforeman/test';
import Toast from '../Toast';

describe('Toast', () => {
  it('renders with all three status counts including user_omitted', () => {
    const wrapper = shallow(
      <Toast syncHosts={5} disconnectHosts={3} userOmittedHosts={2} />
    );

    const links = wrapper.find('HostsWithStatusLink');
    expect(links).toHaveLength(3);

    // Check the children (numbers) of each link
    expect(
      links
        .at(0)
        .children()
        .text()
    ).toBe('5');
    expect(
      links
        .at(1)
        .children()
        .text()
    ).toBe('3');
    expect(
      links
        .at(2)
        .children()
        .text()
    ).toBe('2');
  });

  it('does not render user_omitted section when count is 0', () => {
    const wrapper = shallow(
      <Toast syncHosts={5} disconnectHosts={3} userOmittedHosts={0} />
    );

    // Should have only 2 HostsWithStatusLink components (sync and disconnect)
    const links = wrapper.find('HostsWithStatusLink');
    expect(links).toHaveLength(2);

    // Should not contain the user_omitted explanation text
    expect(wrapper.text()).not.toContain(
      'host_registration_insights_inventory parameter value is false'
    );
  });

  it('renders without crashing when userOmittedHosts is not provided (default)', () => {
    const wrapper = shallow(<Toast syncHosts={5} disconnectHosts={3} />);

    // Should use default value of 0, so only 2 links
    const links = wrapper.find('HostsWithStatusLink');
    expect(links).toHaveLength(2);

    // Verify the count values
    expect(
      links
        .at(0)
        .children()
        .text()
    ).toBe('5');
    expect(
      links
        .at(1)
        .children()
        .text()
    ).toBe('3');
  });

  it('renders correct status links for each category', () => {
    const wrapper = shallow(
      <Toast syncHosts={5} disconnectHosts={3} userOmittedHosts={2} />
    );

    const links = wrapper.find('HostsWithStatusLink');
    expect(links.at(0).prop('statusName')).toBe('sync');
    expect(links.at(1).prop('statusName')).toBe('disconnect');
    expect(links.at(2).prop('statusName')).toBe('user_omitted');
  });
});
