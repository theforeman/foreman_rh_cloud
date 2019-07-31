import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Provider } from 'react-redux';
import configureStore from '../../../stories/configureStore';
import AccountList from './AccountList';

const store = configureStore();

storiesOf('Account list', module)
  .addDecorator(withKnobs)
  .add('Account list', () => (
    <div style={{ margin: '20px' }}>
      <Provider store={store}>
        <AccountList />
      </Provider>
    </div>
  ));
