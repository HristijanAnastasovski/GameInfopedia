import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CPU from './cpu';
import CPUDetail from './cpu-detail';
import CPUUpdate from './cpu-update';
import CPUDeleteDialog from './cpu-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CPUUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CPUUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CPUDetail} />
      <ErrorBoundaryRoute path={match.url} component={CPU} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={CPUDeleteDialog} />
  </>
);

export default Routes;
