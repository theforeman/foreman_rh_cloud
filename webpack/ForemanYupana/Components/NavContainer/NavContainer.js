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
  const navItems = items.map((item, index) => {
    const { name, icon, onClick } = item;
    return (
      <NavItem key={index} eventKey={index} onClick={onClick}>
        <Icon name={icon} size="2x" />
        <p>{name}</p>
      </NavItem>
    );
  });
  const tabComponents = items.map(({ component: Component, props }, index) => (
    <TabPane key={index} eventKey={index}>
      <Component {...props} />
    </TabPane>
  ));
  return (
    <TabContainer id="basic-tabs-pf" defaultActiveKey={0}>
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
      onClick: PropTypes.func,
    })
  ),
};

NavContainer.defaultProps = {
  items: [],
};

export default NavContainer;
