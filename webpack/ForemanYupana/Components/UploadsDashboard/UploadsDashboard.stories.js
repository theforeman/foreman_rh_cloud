import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Provider } from 'react-redux';
import configureStore from '../../../stories/configureStore';
import UploadsDashboard from './index';
import { generating, uploading } from './UploadsDashboard.fixtures';

const store = configureStore();

storiesOf('UploadsDashboard', module)
  .addDecorator(withKnobs)
  .add('UploadsDashboard', () => (
    <div style={{ margin: '20px' }}>
      <Provider store={store}>
        <UploadsDashboard generating={generating} uploading={uploading} />
      </Provider>
    </div>
  ));
