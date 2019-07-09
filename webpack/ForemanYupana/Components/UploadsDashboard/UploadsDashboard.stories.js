import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import UploadsDashboard from './UploadsDashboard';

storiesOf('UploadsDashboard', module)
  .addDecorator(withKnobs)
  .add('UploadsDashboard', () => (
    <div style={{ margin: '20px' }}>
      <UploadsDashboard />
    </div>
  ));
