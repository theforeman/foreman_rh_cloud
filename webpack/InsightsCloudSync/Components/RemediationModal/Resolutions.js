/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from '@patternfly/react-core';

const Resolutions = ({ resolutions, setResolutions, hit_id }) => {
  const [checkedID, setCheckedID] = React.useState(0);

  if (resolutions.length === 1) return <>{resolutions[0].description}</>;

  return (
    <>
      {resolutions.map((currentRes, i) => (
        <Radio
          key={i}
          className="resolution-radio"
          id={currentRes.rule_id}
          isChecked={i === checkedID}
          onChange={() =>
            setResolutions(stateRes =>
              stateRes.map(prevRes => {
                if (hit_id === prevRes.hit_id) {
                  setCheckedID(i);
                  return { ...prevRes, resolution_id: currentRes.id };
                }
                return prevRes;
              })
            )
          }
          label={currentRes.description}
        />
      ))}
    </>
  );
};

Resolutions.propTypes = {
  setResolutions: PropTypes.func.isRequired,
  resolutions: PropTypes.array,
  hit_id: PropTypes.number,
};

Resolutions.defaultProps = {
  resolutions: [],
  hit_id: null,
};

export default Resolutions;
