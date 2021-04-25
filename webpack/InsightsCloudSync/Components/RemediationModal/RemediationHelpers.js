/* eslint-disable camelcase */
import React from 'react';
import { orderBy } from 'lodash';
import Resolutions from './Resolutions';

export const modifyRows = (remediations, setResolutions, setHostsIds) => {
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
    resolutionToSubmit.push({
      hit_id: id,
      resolution_id: selectedResolution /** defaults to the first resolution if many */,
    });
    return {
      cells: [
        hostname,
        title,
        <div>
          <Resolutions
            hit_id={id}
            resolutions={resolutions}
            setResolutions={setResolutions}
            selectedResolution={selectedResolution}
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
