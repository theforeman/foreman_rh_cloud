import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import routes from './ForemanRhCloudRoutes';

const ForemanRhCloudRouter = () => (
  <BrowserRouter>
    <IntlProvider locale={navigator.language}>
      <Switch>
        {Object.entries(routes).map(([key, props]) => (
          <Route key={key} {...props} />
        ))}
      </Switch>
    </IntlProvider>
  </BrowserRouter>
);

export default ForemanRhCloudRouter;
