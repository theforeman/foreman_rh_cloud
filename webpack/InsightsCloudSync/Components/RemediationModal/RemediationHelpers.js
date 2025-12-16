/* eslint-disable camelcase */
import React from 'react';
import { orderBy } from 'lodash';
import Resolutions from './Resolutions';

export const getResolutionId = (selectedResolution, id, isIop = true) => {
  if (isIop) return `${id}_${selectedResolution}`;
  return selectedResolution;
};

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
    hostsIdsToSubmit.add(host_id);
    const selectedResolution = resolutions[0]?.id;

    // For IoP:
    // All of the values will be plain strings
    // {
    // eslint-disable-next-line spellcheck/spell-checker
    //  hit_id: "c7c6727e-2966-4f7c-87f1-20ef14db7a2d", <-- this refers to a host by insights ID
    //  rule_id: "hardening_ssh_client_alive|OPENSSH_HARDENING_CLIENT_ALIVE",
    //  resolution_type: "less_secure",
    //  resolution_id:"hardening_ssh_client_alive|OPENSSH_HARDENING_CLIENT_ALIVE_less_secure", <-- joined rule id and resolution type
    // }
    // For non-IoP:
    // All of the values will be numeric Foreman database IDs
    // hit_id refers to an InsightsHit
    // rule_id refers to an InsightsRule
    // resolution_type and resolution_id both refer to an InsightsResolution (InsightsHit.find(xx).rule.resolutions)

    resolutionToSubmit.push({
      hit_id: isIop ? host_id : id,
      rule_id: id,
      resolution_type: selectedResolution /** defaults to the first resolution if many */,
      resolution_id: getResolutionId(selectedResolution, id, isIop),
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
