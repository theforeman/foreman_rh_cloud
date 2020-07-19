import React from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Button, Icon } from 'patternfly-react';
import { INSIGHTS_SYNC_PAGE_TITLE } from './InventorySyncConstants';

const InventorySync = ({ data: { settingsUrl }, syncInventory }) => {
  document.title = INSIGHTS_SYNC_PAGE_TITLE;
  return (
    <IntlProvider locale={navigator.language}>
      <div className="inventory-sync">
        <h1>{__('Red Hat Inventory Sync')}</h1>
        <p>
          {__(
            "By syncing, you'll be able to know which hosts were uploaded successfuly, as your inventory, to the Red Hat cloud"
          )}
        </p>
        <p>
          {__(`1. Obtain an RHSM API token: `)}
          <a
            href="https://access.redhat.com/management/api"
            target="_blank"
            rel="noopener noreferrer"
          >
            access.redhat.com <Icon name="external-link" size="xs" />
          </a>
          <br />
          {__("2. Copy the token to 'Red Hat Cloud token' setting: ")}
          <a href={settingsUrl} target="_blank" rel="noopener noreferrer">
            {__('Red Hat Cloud token ')}
            <Icon name="external-link" size="xs" />
          </a>
          <br />
          {__(
            '3. Now you can syncronize your inventory manually using the "Sync now" button.'
          )}
        </p>
        <div>
          <Button bsStyle="primary" onClick={syncInventory}>
            {__('Sync now')}
          </Button>
        </div>
      </div>
    </IntlProvider>
  );
};

InventorySync.propTypes = {
  syncInventory: PropTypes.func.isRequired,
  data: PropTypes.shape({
    settingsUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default InventorySync;
