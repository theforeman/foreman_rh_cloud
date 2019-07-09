import React from 'react';
import { Image, Segment, Step } from 'semantic-ui-react';
import { Icon } from 'patternfly-react';
import './uploadsDashboard.scss';

const StepExampleAttached = () => (
  <div className="uploads">
    <Step.Group attached="top">
      <Step active>
        <Icon name="file" size="2x" />
        <Step.Content>
          <Step.Title>Generating</Step.Title>
          <Step.Description></Step.Description>
        </Step.Content>
      </Step>

      <Step disabled>
        <Icon name="cloud-upload" size="2x" />
        <Step.Content>
          <Step.Title>Uploading</Step.Title>
          <Step.Description></Step.Description>
        </Step.Content>
      </Step>

      <Step disabled>
        <Icon name="check" size="2x" />
        <Step.Content>
          <Step.Title>Complete</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>

    <Segment attached>
      <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
    </Segment>
  </div>
);

export default StepExampleAttached;
