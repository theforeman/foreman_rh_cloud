import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Grid } from 'patternfly-react';
import { FormattedRelative } from 'react-intl';
import { translate as __ } from 'foremanReact/common/I18n';
import './scheduledRun.scss';

const ScheduledRun = ({ date }) =>
  date ? (
    <Grid.Col sm={12} className="scheduled_run">
      <p>
        <Icon name="calendar" />
        {__('Next run: ')}
        <FormattedRelative value={date} />.
      </p>
    </Grid.Col>
  ) : null;

ScheduledRun.propTypes = {
  date: PropTypes.string,
};

ScheduledRun.defaultProps = {
  date: null,
};

export default ScheduledRun;
