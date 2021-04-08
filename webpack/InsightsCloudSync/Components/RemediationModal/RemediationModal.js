/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
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
}) => {
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const toggleModal = () => setOpen(prevValue => !prevValue);

  useEffect(() => {
    if (open) fetchRemediations(selectedIds);
  }, [open]);

  useEffect(() => {
    const modifiedRows =
      status === STATUS.PENDING ? [] : modifyRows(remediations);
    setRows(modifiedRows);
  }, [remediations, status]);

  return (
    <React.Fragment>
      <Button
        variant="primary"
        onClick={toggleModal}
        isDisabled={isEmpty(selectedIds)}
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
          <ModalFooter toggleModal={toggleModal} remediations={remediations} />
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
};

RemediationModal.defaultProps = {
  selectedIds: {},
  remediations: [],
  status: null,
  error: null,
};

export default RemediationModal;
