/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Tr, Td } from '@patternfly/react-table';
import {
  Card,
  CardTitle,
  CardBody,
  Modal,
  ModalVariant,
  Spinner,
  Text,
  Icon,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import {
  global_danger_color_200 as dangerColor,
  global_success_color_100 as successColor,
} from '@patternfly/react-tokens';
import { get } from 'foremanReact/redux/API';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { STATUS } from 'foremanReact/constants';
import { selectAPIStatus } from 'foremanReact/redux/API/APISelectors';
import { inventoryUrl } from '../../../../ForemanInventoryHelpers';

export const API_KEY = 'CLOUD_PING';

const CloudPingModal = ({ title, isOpen, toggle }) => {
  const [certAuths, setCertAuths] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(state => selectAPIStatus(state, API_KEY));
  const isPending = status === STATUS.PENDING;

  const handleSuccess = useCallback(
    ({
      data: {
        ping: { cert_auth = [] },
      },
    }) => {
      setCertAuths(cert_auth);
    },
    []
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

  return (
    <>
      <Modal
        id="cloud-ping-modal"
        ouiaId="cloud-ping-modal"
        appendTo={document.getElementsByClassName('react-container')[0]}
        variant={ModalVariant.large}
        title={title}
        isOpen={isOpen}
        onClose={toggle}
      >
        <Card className="certs-status" ouiaId="card-org-status">
          <CardTitle>{__('Organization status')}</CardTitle>
          <CardBody>
            <Text ouiaId="text-description">
              {__('Displays manifest statuses per accessible organizations.')}
            </Text>
            {isPending ? (
              <Spinner size="xl" />
            ) : (
              <>
                <Text className="pull-right" ouiaId="text-org-count">
                  {sprintf(__('%s organizations'), certAuths.length)}
                </Text>
                <Table
                  aria-label="Organization status"
                  ouiaId="simple-table"
                  variant="compact"
                  borders={false}
                >
                  <Tbody>
                    {certAuths.map((cert, idx) => (
                      <Tr
                        key={cert.org_name || idx}
                        ouiaId={`org-status-row-${idx}`}
                      >
                        <Td dataLabel={__('Organization')}>
                          <StatusIcon isPending={isPending} authStatus={cert} />{' '}
                          {cert.org_name} {cert.error}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
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
  if (authStatus.success)
    return (
      <Icon color={successColor.value}>
        <CheckCircleIcon />
      </Icon>
    );
  if (authStatus.error)
    return (
      <Icon color={dangerColor.value}>
        <ExclamationCircleIcon />
      </Icon>
    );
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
