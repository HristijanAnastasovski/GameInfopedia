import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import VideoGame from './video-game';
import VideoGameDetail from './video-game-detail';
import VideoGameUpdate from './video-game-update';
import VideoGameDeleteDialog from './video-game-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={VideoGameUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={VideoGameUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={VideoGameDetail} />
      <ErrorBoundaryRoute path={match.url} component={VideoGame} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={VideoGameDeleteDialog} />
  </>
);

export default Routes;
