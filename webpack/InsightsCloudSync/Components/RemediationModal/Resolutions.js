/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from '@patternfly/react-core';
import { getResolutionId } from './RemediationHelpers';

const Resolutions = ({
  resolutions,
  setResolutions,
  selectedResolution,
  hit_id,
  isIop,
}) => {
  const [checkedID, setCheckedID] = React.useState(selectedResolution);

  if (resolutions.length === 1) return <>{resolutions[0].description}</>;

  return (
    <>
      {resolutions.map(({ id: resolution_id, description }) => (
        <Radio
          key={resolution_id}
          ouiaId={`resolution-radio-${resolution_id}`}
          className="resolution-radio"
          id={resolution_id}
          isChecked={resolution_id === checkedID}
          onChange={() =>
            setResolutions(stateRes =>
              stateRes.map(res => {
                if (hit_id === res.hit_id) {
                  setCheckedID(resolution_id);
                  if (isIop)
                    return {
                      ...res,
                      resolution_id: getResolutionId(
                        resolution_id,
                        res.rule_id
                      ),
                      resolution_type: resolution_id,
                    };
                  return { ...res, resolution_id };
                }
                return res;
              })
            )
          }
          label={description}
        />
      ))}
    </>
  );
};

Resolutions.propTypes = {
  setResolutions: PropTypes.func.isRequired,
  resolutions: PropTypes.array,
  hit_id: PropTypes.number,
  selectedResolution: PropTypes.number,
};

Resolutions.defaultProps = {
  resolutions: [],
  hit_id: null,
  selectedResolution: null,
};

export default Resolutions;
