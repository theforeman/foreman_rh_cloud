/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { isEmpty } from 'lodash';
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

  return (
    <React.Fragment>
      <Button
        variant="primary"
        isDisabled={isEmpty(selectedIds)}
        onClick={() => {
          toggleModal();
        }}
      >
        {__('Remediate')}
      </Button>{' '}
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
};

RemediationModal.defaultProps = {
  selectedIds: {},
  remediations: [],
  status: null,
  error: null,
  isAllSelected: false,
  query: null,
};

export default RemediationModal;
