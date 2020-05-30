import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Genre from './genre';
import Platform from './platform';
import Publisher from './publisher';
import VideoGame from './video-game';
import CPU from './cpu';
import GPU from './gpu';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/genre`} component={Genre} />
      <ErrorBoundaryRoute path={`${match.url}/platform`} component={Platform} />
      <ErrorBoundaryRoute path={`${match.url}/publisher`} component={Publisher} />
      <ErrorBoundaryRoute path={`${match.url}/video-game`} component={VideoGame} />
      <ErrorBoundaryRoute path={`${match.url}/cpu`} component={CPU} />
      <ErrorBoundaryRoute path={`${match.url}/gpu`} component={GPU} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
