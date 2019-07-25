import React from 'react';
import { mount } from 'enzyme';
import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import NavContainer from '../NavContainer';
import { props } from '../NavContainer.fixtures';

const fixtures = {
  'render without Props': {},
  'render with Props': props,
};

describe('NavContainer', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(NavContainer, fixtures));

  it('click should call onTabClick prop', () => {
    const onTabClick = jest.fn();
    const modifiedProps = {
      ...props,
    };
    modifiedProps.items[0].onClick = onTabClick;
    const wrapper = mount(<NavContainer {...modifiedProps} />);
    wrapper.find('NavItem a').simulate('click');
    expect(onTabClick).toBeCalled();
  });
});
