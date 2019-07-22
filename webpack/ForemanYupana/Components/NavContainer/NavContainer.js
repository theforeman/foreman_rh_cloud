import React from 'react';
import PropTypes from 'prop-types';

import {
  TabContainer,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Icon,
} from 'patternfly-react';
import { noop } from 'patternfly-react/dist/js/common/helpers';

const NavContainer = ({ items, onTabClick }) => {
  const navItems = items.map((item, index) => {
    const { name, icon } = item;
    return (
      <NavItem
        key={index}
        eventKey={index}
        onClick={() => onTabClick(name.toLowerCase())}
      >
        <Icon name={icon} size="2x" />
        <p>{name}</p>
      </NavItem>
    );
  });
  const tabComponents = items.map((Item, index) => (
    <TabPane key={index} eventKey={index}>
      <Item.component />
    </TabPane>
  ));
  return (
    <TabContainer id="basic-tabs-pf" defaultActiveKey={1}>
      <div className="dashboard">
        <Nav bsClass="nav nav-tabs nav-tabs-pf nav-justified">{navItems}</Nav>
        <TabContent animation>{tabComponents}</TabContent>
      </div>
    </TabContainer>
  );
};

NavContainer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      name: PropTypes.string,
      component: PropTypes.func,
    })
  ),
  onTabClick: PropTypes.func,
};

NavContainer.defaultProps = {
  items: [],
  onTabClick: noop,
};

export default NavContainer;
