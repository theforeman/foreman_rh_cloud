/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Immutable from 'seamless-immutable';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
} from '@patternfly/react-table/deprecated';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { isEmpty, noop } from 'lodash';
import { STATUS } from 'foremanReact/constants';
import { translate as __ } from 'foremanReact/common/I18n';
import { columns } from './RemediationTableConstants';
import { modifyRows } from './RemediationHelpers';
import ModalFooter from './RemediationModalFooter';
import TableEmptyState from '../../../common/table/EmptyState';
import './RemediationModal.scss';
import { useIopConfig } from '../../../common/Hooks/ConfigHooks';

// Sample iopData:
/* eslint-disable spellcheck/spell-checker */
// const iopTestData = Immutable([
//   {
//     hostid: 'c7c6727e-2966-4f7c-87f1-20ef14db7a2d',
//     host_name: 'advisor-test.local',
//     rulename: 'hardening_cryptopol_krb5|NO_CPOL_KRB5',
//     resolutions: [
//       {
//         description: 'Remove manual crypto-policies',
//         id: 'fix',
//         needs_reboot: true,
//         resolution_risk: 1,
//       },
//     ],
//     rebootable: true,
//     description: 'Decreased security: krb5 crypto-policies overridden',
//   },
//   {
//     hostid: 'c7c6727e-2966-4f7c-87f1-20ef14db7a2d',
//     host_name: 'advisor-test.local',
//     rulename: 'hardening_logging_auditd|HARDENING_LOGGING_5_AUDITD',
//     resolutions: [
//       {
//         description: 'Install and enable auditd',
//         id: 'fix',
//         needs_reboot: false,
//         resolution_risk: 1,
//       },
//     ],
//     rebootable: false,
//     description: 'Decreased security: auditd not running',
//   },
// ]);
/* eslint-enable spellcheck/spell-checker */

const RemediationModal = ({
  iopData,
  selectedIds,
  fetchRemediations,
  remediations,
  status,
  error,
  isAllSelected,
  query,
  isDisabled,
}) => {
  const iopRows = Immutable(iopData ?? []).map(recommendation => ({
    id: recommendation.rulename,
    host_id: recommendation.hostid,
    hostname: recommendation.host_name,
    title: recommendation.description,
    resolutions: recommendation.resolutions ?? [],
    reboot: recommendation.rebootable,
  }));

  const [open, setOpen] = React.useState(false);
  const [resolutions, setResolutions] = React.useState([]);
  const [hostsIds, setHostsIds] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const toggleModal = () => setOpen(prevValue => !prevValue);

  const isIop = useIopConfig();
  useEffect(() => {
    // only fetch for Hosted. IoP provides via props.
    if (!isIop && open)
      fetchRemediations({ selectedIds, isAllSelected, query });
  }, [open]);

  useEffect(() => {
    let modifiedRows;
    if (isIop) {
      modifiedRows = modifyRows(iopRows, setResolutions, setHostsIds, true);
    } else {
      modifiedRows =
        status === STATUS.PENDING
          ? []
          : modifyRows(remediations, setResolutions, setHostsIds, false);
    }
    setRows(modifiedRows);
  }, [remediations, status, iopData, isIop]);

  return (
    <React.Fragment>
      <Button
        ouiaId="button-remediate"
        variant="primary"
        isDisabled={isDisabled || isEmpty(selectedIds)}
        onClick={() => {
          toggleModal();
        }}
      >
        {__('Remediate')}
      </Button>{' '}
      <Modal
        id="remediation-modal"
        ouiaId="remediation-modal"
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
            isIop={isIop}
          />
        }
      >
        <Table
          className="remediations-table"
          ouiaId="remediations-table"
          aria-label="remediations Table"
          cells={columns}
          rows={rows}
        >
          <TableHeader />
          <TableBody />
        </Table>
        <TableEmptyState
          status={status}
          error={error}
          rowsLength={rows.length}
        />
      </Modal>
    </React.Fragment>
  );
};

RemediationModal.propTypes = {
  iopData: PropTypes.arrayOf(
    PropTypes.shape({
      hostid: PropTypes.string,
      host_name: PropTypes.string,
      rulename: PropTypes.string,
      resolutions: PropTypes.array,
      rebootable: PropTypes.bool,
      description: PropTypes.string,
    })
  ),
  selectedIds: PropTypes.shape({}),
  fetchRemediations: PropTypes.func,
  remediations: PropTypes.array,
  status: PropTypes.string,
  error: PropTypes.string,
  isAllSelected: PropTypes.bool,
  query: PropTypes.string,
  isDisabled: PropTypes.bool,
};

RemediationModal.defaultProps = {
  iopData: null,
  selectedIds: {},
  fetchRemediations: noop,
  remediations: [],
  status: null,
  error: null,
  isAllSelected: false,
  query: null,
  isDisabled: false,
};

export default RemediationModal;
