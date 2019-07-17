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

const NavContainer = ({ items }) => {
  const navItems = items.map((item, index) => (
    <NavItem key={index} eventKey={index}>
      <Icon name={item.icon} size="2x" />
      <p>{item.name}</p>
    </NavItem>
  ));
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
};

NavContainer.defaultProps = {
  items: [],
};

export default NavContainer;
