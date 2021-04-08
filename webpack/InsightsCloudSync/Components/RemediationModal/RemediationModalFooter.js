import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { JOB_INVOCATION_PATH } from './RemediationTableConstants';

const ModalFooter = ({ toggleModal, remediations }) => {
  let token = document.querySelector('meta[name="csrf-token"]');
  token = token?.content || '';
  return (
    <form action={JOB_INVOCATION_PATH} method="post">
      <Button type="submit" key="confirm" variant="primary">
        {__('Remediate')}
      </Button>
      <Button key="cancel" variant="link" onClick={toggleModal}>
        {__('Cancel')}
      </Button>
      <input type="hidden" name="feature" value="insights_remediation" />
      <input type="hidden" name="authenticity_token" value={token} />
      {remediations.map((remediation, index) => (
        <React.Fragment key={index}>
          <input
            type="hidden"
            name="hit_ids[]"
            key={remediation.id}
            value={JSON.stringify({
              hit_id: remediation.id,
              resolution_id: remediation.resolutions[0].id,
            })}
          />
        </React.Fragment>
      ))}
    </form>
  );
};

ModalFooter.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  remediations: PropTypes.array,
};

ModalFooter.defaultProps = {
  remediations: [],
};

export default ModalFooter;
