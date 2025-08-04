import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { useBulkSelect } from 'foremanReact/components/PF4/TableIndexPage/Table/TableHooks';
import { JOB_INVOCATION_PATH } from './RemediationTableConstants';

const ModalFooter = ({ toggleModal, resolutions, hostsIds, isIop }) => {
  let token = document.querySelector('meta[name="csrf-token"]');
  token = token?.content || '';

  const { fetchBulkParams } = useBulkSelect({
    initialArry: hostsIds,
    idColumn: 'subscription_uuid'
  })
  console.log(fetchBulkParams());
  return (
    <form action={JOB_INVOCATION_PATH} method="post">
      <Button
        type="submit"
        ouiaId="button-confirm"
        key="confirm"
        variant="primary"
      >
        {__('Remediate')}
      </Button>
      <Button
        key="cancel"
        ouiaId="button-cancel"
        variant="link"
        onClick={toggleModal}
      >
        {__('Cancel')}
      </Button>
      <input type="hidden" name="feature" value="rh_cloud_remediate_hosts" />
      <input type="hidden" name="authenticity_token" value={token} />
      <input
        type="hidden"
        name="inputs[hit_remediation_pairs]"
        value={JSON.stringify(resolutions)}
      />
      {!isIop && hostsIds.map(id => (
        <input type="hidden" name="host_ids[]" key={id} value={id} />
      ))}
      {isIop &&
        <input type="hidden" name="search" value={fetchBulkParams()} />
      }
    </form>
  );
};

ModalFooter.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  resolutions: PropTypes.array,
  hostsIds: PropTypes.array,
};

ModalFooter.defaultProps = {
  resolutions: [],
  hostsIds: [],
};

export default ModalFooter;
