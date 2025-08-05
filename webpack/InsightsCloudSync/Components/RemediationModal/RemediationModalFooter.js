import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { useBulkSelect } from 'foremanReact/components/PF4/TableIndexPage/Table/TableHooks';
import { JOB_INVOCATION_PATH } from './RemediationTableConstants';

const ModalFooter = ({ toggleModal, resolutions, hostsIds, isIop }) => {
  let token = document.querySelector('meta[name="csrf-token"]');
  token = token?.content || '';

  const [jobInProgress, setJobInProgress] = React.useState(false);
  const formRef = React.useRef(null);

  const { fetchBulkParams } = useBulkSelect({
    initialArry: hostsIds,
    idColumn: 'insights_uuid',
  });

  const handleSubmit = e => {
    e.preventDefault();
    setJobInProgress(true);

    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      formRef.current?.submit?.();
    }, 100);
  };
  return (
    <form
      action={JOB_INVOCATION_PATH}
      method="post"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <Button
        type="submit"
        ouiaId="button-confirm"
        key="confirm"
        variant="primary"
        isDisabled={jobInProgress}
        isLoading={jobInProgress}
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
      {!isIop &&
        hostsIds.map(id => (
          <input type="hidden" name="host_ids[]" key={id} value={id} />
        ))}
      {isIop && (
        <>
          <input type="hidden" name="search" value={fetchBulkParams()} />
        </>
      )}
    </form>
  );
};

ModalFooter.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  resolutions: PropTypes.array,
  hostsIds: PropTypes.array,
  isIop: PropTypes.bool,
};

ModalFooter.defaultProps = {
  resolutions: [],
  hostsIds: [],
  isIop: false,
};

export default ModalFooter;
