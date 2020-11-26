import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Level, LevelItem } from '@patternfly/react-core';
import {
  OverlayTrigger,
  Tooltip,
  Icon,
  Grid,
  ControlLabel,
  noop,
} from 'patternfly-react';

const Switcher = ({
  id,
  label,
  tooltip,
  isChecked,
  onChange,
  labelCol = 5,
  SwitchCol = 2,
}) => (
  <React.Fragment>
    <Grid.Col sm={labelCol}>
      <ControlLabel className="control-label" style={{ paddingTop: '0' }}>
        <Level>
          <LevelItem>
            <span className={`rh-cloud-switcher-${id}-label`}>{label}</span>
          </LevelItem>
          <LevelItem>
            <OverlayTrigger
              overlay={
                <Tooltip
                  id={`rh-cloud-switcher-${id}-tooltip`}
                  style={{ zIndex: 10000 }}
                >
                  {tooltip}
                </Tooltip>
              }
              placement="bottom"
              trigger={['hover', 'focus']}
              rootClose={false}
            >
              <Icon type="pf" name="info" />
            </OverlayTrigger>
          </LevelItem>
        </Level>
      </ControlLabel>
    </Grid.Col>
    <Grid.Col sm={SwitchCol} style={{ marginBottom: '5px' }}>
      <Switch
        id={`rh-cloud-switcher-${id}`}
        isChecked={isChecked}
        onChange={onChange}
        label=" "
      />
    </Grid.Col>
  </React.Fragment>
);

Switcher.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  tooltip: PropTypes.string,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
  labelCol: PropTypes.number,
  SwitchCol: PropTypes.number,
};

Switcher.defaultProps = {
  label: null,
  tooltip: null,
  isChecked: true,
  onChange: noop,
  labelCol: 5,
  SwitchCol: 2,
};

export default Switcher;
