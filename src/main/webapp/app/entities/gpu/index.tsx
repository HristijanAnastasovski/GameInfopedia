import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import GPU from './gpu';
import GPUDetail from './gpu-detail';
import GPUUpdate from './gpu-update';
import GPUDeleteDialog from './gpu-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={GPUUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={GPUUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={GPUDetail} />
      <ErrorBoundaryRoute path={match.url} component={GPU} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={GPUDeleteDialog} />
  </>
);

export default Routes;
