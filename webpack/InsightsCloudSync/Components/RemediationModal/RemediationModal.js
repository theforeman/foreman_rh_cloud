/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Modal, ModalVariant, Button, Popover } from '@patternfly/react-core';
import { STATUS } from 'foremanReact/constants';
import { translate as __ } from 'foremanReact/common/I18n';
import { columns } from './RemediationTableConstants';
import { modifyRows } from './RemediationHelpers';
import ModalFooter from './RemediationModalFooter';
import TableEmptyState from '../../../common/table/EmptyState';
import './RemediationModal.scss';

const RemediationModal = ({
  selectedIds,
  fetchRemediations,
  remediations,
  status,
  error,
  isAllSelected,
  query,
  isExperimentalMode,
}) => {
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [resolutions, setResolutions] = React.useState([]);
  const [hostsIds, setHostsIds] = React.useState([]);
  const toggleModal = () => setOpen(prevValue => !prevValue);

  useEffect(() => {
    if (open) fetchRemediations({ selectedIds, isAllSelected, query });
  }, [open]);

  useEffect(() => {
    const modifiedRows =
      status === STATUS.PENDING
        ? []
        : modifyRows(remediations, setResolutions, setHostsIds);
    setRows(modifiedRows);
  }, [remediations, status]);

  let remediateButton = (
    <Button
      variant="primary"
      onClick={() => isExperimentalMode && toggleModal()}
      isDisabled={isEmpty(selectedIds)}
    >
      {__('Remediate')}
    </Button>
  );

  if (!isExperimentalMode) {
    remediateButton = (
      <Popover
        bodyContent={
          <div
            dangerouslySetInnerHTML={{
              __html: __(
                'To use this feature, please enable <a href="/settings?search=name+%3D+lab_features">Show Experimental Labs</a> in settings.'
              ),
            }}
          />
        }
        closeBtnAriaLabel="Close Popover with Link"
      >
        {remediateButton}
      </Popover>
    );
  }

  return (
    <React.Fragment>
      {remediateButton}{' '}
      <Modal
        id="remediation-modal"
        appendTo={document.body}
        variant={ModalVariant.large}
        title={__('Remediation summary')}
        isOpen={open}
        onClose={toggleModal}
        footer={
          <ModalFooter
            toggleModal={toggleModal}
            resolutions={resolutions}
            hostsIds={hostsIds}
          />
        }
      >
        <Table
          className="remediations-table"
          aria-label="remediations Table"
          cells={columns}
          rows={rows}
        >
          <TableHeader />
          <TableBody />
        </Table>
        <TableEmptyState status={status} error={error} />
      </Modal>
    </React.Fragment>
  );
};

RemediationModal.propTypes = {
  selectedIds: PropTypes.object,
  fetchRemediations: PropTypes.func.isRequired,
  remediations: PropTypes.array,
  status: PropTypes.string,
  error: PropTypes.string,
  isAllSelected: PropTypes.bool,
  query: PropTypes.string,
  isExperimentalMode: PropTypes.bool,
};

RemediationModal.defaultProps = {
  selectedIds: {},
  remediations: [],
  status: null,
  error: null,
  isAllSelected: false,
  query: null,
  isExperimentalMode: false,
};

export default RemediationModal;
