import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Provider } from 'react-redux';
import configureStore from '../../../stories/configureStore';
import Dashboard from './index';
import { generating, uploading } from './Dashboard.fixtures';

const store = configureStore();

storiesOf('Dashboard', module)
  .addDecorator(withKnobs)
  .add('Dashboard', () => (
    <div style={{ margin: '20px' }}>
      <Provider store={store}>
        <Dashboard generating={generating} uploading={uploading} />
      </Provider>
    </div>
  ));
