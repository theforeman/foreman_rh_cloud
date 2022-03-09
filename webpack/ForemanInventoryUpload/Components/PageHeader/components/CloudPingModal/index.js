/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import {
  Card,
  CardTitle,
  CardBody,
  Modal,
  ModalVariant,
  Spinner,
  Text,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { get } from 'foremanReact/redux/API';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { STATUS } from 'foremanReact/constants';
import { selectAPIStatus } from 'foremanReact/redux/API/APISelectors';
import { inventoryUrl } from '../../../../ForemanInventoryHelpers';
import './index.scss';

export const API_KEY = 'CLOUD_PING';

const CloudPingModal = ({ title, isOpen, toggle }) => {
  const [rows, setRows] = useState([]);
  const [tokenStatus, setTokenStatus] = useState({});
  const dispatch = useDispatch();
  const handleSuccess = useCallback(
    ({
      data: {
        ping: { cert_auth = [], token_auth = {} },
      },
    }) => {
      cert_auth.length &&
        setRows(
          cert_auth.map(cert => ({
            cells: [
              {
                title: (
                  <>
                    <StatusIcon
                      isPending={status === STATUS.PENDING}
                      authStatus={cert}
                    />{' '}
                    {cert.org_name} {cert.error}
                  </>
                ),
              },
            ],
          }))
        );
      setTokenStatus(token_auth);
    },
    [status]
  );

  useEffect(() => {
    isOpen &&
      dispatch(
        get({
          key: API_KEY,
          url: inventoryUrl('status'),
          handleSuccess,
        })
      );
  }, [isOpen, dispatch, handleSuccess]);

  const status = useSelector(state => selectAPIStatus(state, API_KEY));
  const isPending = status === STATUS.PENDING;
  // const error = useSelector(state => selectAPIErrorMessage(state, API_KEY));

  return (
    <>
      <Modal
        id="cloud-ping-modal"
        appendTo={document.getElementsByClassName('react-container')[0]}
        variant={ModalVariant.large}
        title={title}
        isOpen={isOpen}
        onClose={toggle}
      >
        <Card className="token-status">
          <CardTitle>
            <StatusIcon isPending={isPending} authStatus={tokenStatus} />{' '}
            {__('API token status')}
          </CardTitle>
        </Card>
        <Card className="certs-status">
          <CardTitle>{__('Organization status')}</CardTitle>
          <CardBody>
            <Text>
              {__('Displays manifest statuses per accessible organizations.')}
            </Text>
            {isPending ? (
              <Spinner size="xl" />
            ) : (
              <>
                <Text className="pull-right">
                  {sprintf(__('%s organizations'), rows.length)}
                </Text>
                <Table aria-label="Simple Table" cells={['']} rows={rows}>
                  <TableHeader />
                  <TableBody />
                </Table>{' '}
              </>
            )}
          </CardBody>
        </Card>
      </Modal>
    </>
  );
};

const StatusIcon = ({ isPending, authStatus }) => {
  if (isPending) return <Spinner size="sm" />;
  if (authStatus.success) return <CheckCircleIcon color="green" />;
  if (authStatus.error) return <ExclamationCircleIcon color="red" />;
  return <Spinner size="sm" />;
};

StatusIcon.propTypes = {
  isPending: PropTypes.bool,
  authStatus: PropTypes.shape({
    success: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
};

StatusIcon.defaultProps = {
  isPending: true,
  authStatus: {},
};

CloudPingModal.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default CloudPingModal;
