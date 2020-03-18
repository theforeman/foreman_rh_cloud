import React from 'react';
import PropTypes from 'prop-types';
import { Switch, FieldLevelHelp } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import './autoUploadSwitcher.scss';

const AutoUploadSwitcher = ({ isAutoUpload, handleToggle }) => (
  <div className="auto_upload_switcher">
    <Switch size="mini" value={isAutoUpload} onChange={handleToggle} />
    <FieldLevelHelp
      content={__(
        'Enable automatic upload of your host inventory to the Red Hat cloud'
      )}
    />
    <span>Allow Auto Upload</span>
  </div>
);

AutoUploadSwitcher.propTypes = {
  isAutoUpload: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default AutoUploadSwitcher;
