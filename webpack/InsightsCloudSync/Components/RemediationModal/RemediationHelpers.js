/* eslint-disable camelcase */
import React from 'react';
import { orderBy } from 'lodash';
import Resolutions from './Resolutions';

export const getResolutionId = (selectedResolution, id) =>
  `${id}_${selectedResolution}`;

export const modifyRows = (
  remediations,
  setResolutions,
  setHostsIds,
  isIop
) => {
  if (remediations.length === 0) return [];

  const resolutionToSubmit = [];
  const hostsIdsToSubmit = new Set();
  const modifiedRemediations = orderBy(
    remediations.asMutable(),
    [r => r.resolutions?.length || 0],
    ['desc']
  ).map(({ id, host_id, hostname, title, resolutions, reboot }) => {
    // debugger;
    hostsIdsToSubmit.add(host_id);
    const selectedResolution = resolutions[0]?.id;
    // For IoP: {
    //  hit_id: "c7c6727e-2966-4f7c-87f1-20ef14db7a2d",
    //  rule_id: "hardening_ssh_client_alive|OPENSSH_HARDENING_CLIENT_ALIVE",
    //  resolution_type: "less_secure",
    //  resolution_id:"hardening_ssh_client_alive|OPENSSH_HARDENING_CLIENT_ALIVE_less_secure",
    // }
    // for Hosted, hit_id and rule_id will be Foreman database IDs
    resolutionToSubmit.push({
      hit_id: isIop ? host_id : id,
      rule_id: id,
      resolution_type: selectedResolution /** defaults to the first resolution if many */,
      resolution_id: getResolutionId(selectedResolution, id),
    });
    return {
      cells: [
        hostname,
        title,
        <div>
          <Resolutions
            hit_id={isIop ? host_id : id}
            resolutions={resolutions}
            setResolutions={setResolutions}
            selectedResolution={selectedResolution}
            isIop={isIop}
          />
        </div>,
        reboot,
      ],
      id,
    };
  });

  setResolutions(resolutionToSubmit);
  setHostsIds(Array.from(hostsIdsToSubmit));
  return modifiedRemediations;
};
