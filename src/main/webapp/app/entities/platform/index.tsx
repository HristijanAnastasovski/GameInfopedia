import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Platform from './platform';
import PlatformDetail from './platform-detail';
import PlatformUpdate from './platform-update';
import PlatformDeleteDialog from './platform-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PlatformUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PlatformUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PlatformDetail} />
      <ErrorBoundaryRoute path={match.url} component={Platform} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={PlatformDeleteDialog} />
  </>
);

export default Routes;
