import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

const CVEsHostDetailsTab = ({ hostName }) => (
  <div>
    <h1>
      {__('CVEs tab for host:')} {hostName}
    </h1>
  </div>
);

CVEsHostDetailsTab.propTypes = {
  hostName: PropTypes.string.isRequired,
};

export default CVEsHostDetailsTab;
