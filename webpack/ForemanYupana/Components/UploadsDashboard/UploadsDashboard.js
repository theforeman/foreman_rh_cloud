import React from 'react';
import { Image, Segment, Step as suiStep } from 'semantic-ui-react';
import Step from './Components/Step';
import './uploadsDashboard.scss';

const UploadsDashboard = () => (
  <div className="uploads">
    <suiStep.Group attached="top">
      <Step active icon="database">
        Retrieving Data
      </Step>
      <Step disabled icon="cloud-upload">
        Uploading
      </Step>
      <Step disabled icon="check">
        Complete
      </Step>
    </suiStep.Group>
    <Segment attached>
      <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
    </Segment>
  </div>
);

export default UploadsDashboard;
