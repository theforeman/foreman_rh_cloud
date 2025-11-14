import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TabContainer,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Icon,
} from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import './navContainer.scss';
import { selectSubscriptionConnectionEnabled } from '../InventorySettings/InventorySettingsSelectors';

const NavContainer = ({ items }) => {
  const subscriptionConnectionEnabled = useSelector(
    selectSubscriptionConnectionEnabled
  );
  const navItems = items.map((item, index) => {
    const { name, icon, onClick } = item;
    if (name === __('Uploading') && !subscriptionConnectionEnabled) return null;

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
