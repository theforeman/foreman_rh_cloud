import React from 'react';
import { Button, Icon } from 'patternfly-react';
import { DOCS_BUTTON_TEXT } from '../../../../ForemanInventoryConstants';
import { getInventoryDocsUrl } from '../../../../ForemanInventoryHelpers';

const DocsButton = () => (
  <Button
    href={getInventoryDocsUrl()}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon type="pf" name="help" />
    {DOCS_BUTTON_TEXT}
  </Button>
);

export default DocsButton;
