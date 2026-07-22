import React, { useState } from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Flex,
  FlexItem,
  Truncate,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import InsightsLabel from '../../../InsightsCloudSync/Components/InsightsTable/InsightsLabel';

const ListItem = ({ title, totalRisk, resultsUrl, solutionUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const knowledgebaseLink = solutionUrl && (
    <p>
      <a href={solutionUrl} target="_blank" rel="noopener noreferrer">
        {__('Knowledgebase article')} <ExternalLinkAltIcon />
      </a>
    </p>
  );

  const insightsCloudLink = resultsUrl && (
    <p>
      <a href={resultsUrl} target="_blank" rel="noopener noreferrer">
        {__('Read more about it in RH cloud insights')}
        <ExternalLinkAltIcon />
      </a>
    </p>
  );

  return (
    <AccordionItem>
      <AccordionToggle
        onClick={() => setIsExpanded(currentValue => !currentValue)}
        isExpanded={isExpanded}
      >
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          flexWrap={{ default: 'nowrap' }}
        >
          <FlexItem>
            <Truncate content={title} />
          </FlexItem>
          <FlexItem>
            <InsightsLabel value={totalRisk} />
          </FlexItem>
        </Flex>
      </AccordionToggle>
      <AccordionContent isHidden={!isExpanded}>
        {isExpanded && (
          <>
            <p>{title}</p>
            {knowledgebaseLink}
            {insightsCloudLink}
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  totalRisk: PropTypes.number.isRequired,
  resultsUrl: PropTypes.string,
  solutionUrl: PropTypes.string,
};

ListItem.defaultProps = {
  resultsUrl: '',
  solutionUrl: '',
};

export default ListItem;
