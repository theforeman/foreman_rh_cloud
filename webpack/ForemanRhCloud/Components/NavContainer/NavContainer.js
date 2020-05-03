import React from 'react';
import PropTypes from 'prop-types';
import {
  TabContainer,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Icon,
  noop,
} from 'patternfly-react';
import './navContainer.scss';
import FullScreenModal from '../FullScreenModal';

const NavContainer = ({
  items,
  showFullScreen,
  toggleFullScreen,
  terminalProps,
}) => {
  const navItems = items.map((item, index) => {
    const { name, icon, onClick } = item;
    return (
      <NavItem
        key={index}
        eventKey={index}
        onClick={onClick}
        className="nav_item"
      >
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
        <Nav bsClass="nav nav-tabs nav-tabs-pf">{navItems}</Nav>
        <TabContent animation>{tabComponents}</TabContent>
        <FullScreenModal
          showFullScreen={showFullScreen}
          toggleFullScreen={toggleFullScreen}
          terminalProps={terminalProps}
        />
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
  showFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  terminalProps: PropTypes.shape({
    exitCode: PropTypes.string,
    logs: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    error: PropTypes.string,
  }),
};

NavContainer.defaultProps = {
  items: [],
  showFullScreen: false,
  toggleFullScreen: noop,
  terminalProps: {},
};

export default NavContainer;
