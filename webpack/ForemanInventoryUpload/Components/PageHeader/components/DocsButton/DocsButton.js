import React from 'react';
import { Button, Icon } from 'patternfly-react';
import {
  INVENTORY_DOCS_LINK,
  DOCS_BUTTON_TEXT,
} from '../../../../ForemanInventoryConstants';
import './docsButton.scss';

const DocsButton = () => (
  <Button
    className="docs_btn"
    href={INVENTORY_DOCS_LINK}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon type="pf" name="help" />
    {DOCS_BUTTON_TEXT}
  </Button>
);

export default DocsButton;
