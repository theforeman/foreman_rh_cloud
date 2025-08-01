import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { APIActions } from 'foremanReact/redux/API';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { IOP_CLOUDLESS_REMEDIATION_PATH, IOP_MAKE_ME_A_PLAYBOOK_PATH, IOP_PLAYBOOKS_API_KEY, IOP_REMEDIATIONS_API_KEY, JOB_INVOCATION_PATH } from './RemediationTableConstants';

const ModalFooter = ({ toggleModal, resolutions, hostsIds, isIop }) => {
  let token = document.querySelector('meta[name="csrf-token"]');
  token = token?.content || '';

  const issues = resolutions.map(reso => ({
    id: "advisor:" + reso.hit_id,
    resolution: reso.resolution_id,
    systems: hostsIds
  }));

  const reqBody = {
    name: "sat_iop_advisor_" + Date.now(),
    add: {
      issues,
    },
    auto_reboot: false
  };

  const [firstRenderDone, setFirstRenderDone] = useState(false);

  const { response: makeMeAPlaybook, setAPIOptions } = useAPI(
    isIop && firstRenderDone ? 'post' : null,
    IOP_MAKE_ME_A_PLAYBOOK_PATH,
    {
      key: IOP_REMEDIATIONS_API_KEY,
      params: reqBody,
    }
  );

  useEffect(() => {
    // make a new call when user changes resolution
    if (isIop) {
        setAPIOptions({
        key: IOP_REMEDIATIONS_API_KEY,
        params: reqBody,
      });
      setFirstRenderDone(true);
    }
  }, [setAPIOptions, resolutions])

  const dispatch = useDispatch();

  const playbookId = makeMeAPlaybook?.id;

  const handleSubmit = (event) => {
    if (!isIop) return;
    event.preventDefault;
    dispatch(
      APIActions.post({
        url: IOP_CLOUDLESS_REMEDIATION_PATH,
        key: IOP_PLAYBOOKS_API_KEY,
        params: {
          directive: 'playbook-sat',
          content: btoa(`http://iop-core-gateway:3001/api/remediations/v1/remediations/${playbookId}/playbook`),
          metadata: {
              return_url: 'http://iop-core-gateway:3001/api/ingress/v1/upload',
              hosts: hostsIds[0],
              sat_org_id: '1',
              response_interval: '5',
              correlation_id: '0'
          }
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:changeme'),
        },
        successToast: __("Remediation started"),
        errorToast: __("There was a problem with the remediation"),
      })
    );
    toggleModal();
  }

  return (
    <form action={isIop ? IOP_CLOUDLESS_REMEDIATION_PATH : JOB_INVOCATION_PATH} method="post">
      <Button
        type="submit"
        ouiaId="button-confirm"
        key="confirm"
        variant="primary"
        isDisabled={isIop && !playbookId}
        isLoading={isIop && !playbookId}
        onClick={handleSubmit}
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
      {hostsIds.map(id => (
        <input type="hidden" name="host_ids[]" key={id} value={id} />
        ))}
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
