import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './video-game.reducer';
import { IVideoGame } from 'app/shared/model/video-game.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IVideoGameDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class VideoGameDetail extends React.Component<IVideoGameDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { videoGameEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            VideoGame [<b>{videoGameEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">Title</span>
            </dt>
            <dd>{videoGameEntity.title}</dd>
            <dt>
              <span id="releasedate">Releasedate</span>
            </dt>
            <dd>
              <TextFormat value={videoGameEntity.releasedate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="price">Price</span>
            </dt>
            <dd>${videoGameEntity.price}</dd>
            <dt>
              <span id="image">Image</span>
            </dt>
            <dd>
              {videoGameEntity.image ? (
                <div>
                  <a onClick={openFile(videoGameEntity.imageContentType, videoGameEntity.image)}>Open&nbsp;</a>
                  <span>
                    {videoGameEntity.imageContentType}, {byteSize(videoGameEntity.image)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <span id="description">Description</span>
            </dt>
            <dd>{videoGameEntity.description}</dd>
            <dt>
              <span id="averageRating">Average Rating</span>
            </dt>
            <dd>{videoGameEntity.averageRating}</dd>
            <dt>
              <span id="minimumStorageRequired">Minimum Storage Required</span>
            </dt>
            <dd>{videoGameEntity.minimumStorageRequired}</dd>
            <dt>
              <span id="minimumRAMRequired">Minimum RAM Required</span>
            </dt>
            <dd>{videoGameEntity.minimumRAMRequired}</dd>
            <dt>Publisher</dt>
            <dd>{videoGameEntity.publisher ? videoGameEntity.publisher.name : ''}</dd>
            <dt>Minimum CPU Required</dt>
            <dd>{videoGameEntity.minimumCPURequired ? videoGameEntity.minimumCPURequired.id : ''}</dd>
            <dt>Minimum GPU Required</dt>
            <dd>{videoGameEntity.minimumGPURequired ? videoGameEntity.minimumGPURequired.id : ''}</dd>
            <dt>Platforms</dt>
            <dd>
              {videoGameEntity.platforms
                ? videoGameEntity.platforms.map((val, i) => (
                    <span key={val.id}>
                      <a>{val.name}</a>
                      {i === videoGameEntity.platforms.length - 1 ? '' : ', '}
                    </span>
                  ))
                : null}
            </dd>
            <dt>Genres</dt>
            <dd>
              {videoGameEntity.genres
                ? videoGameEntity.genres.map((val, i) => (
                    <span key={val.id}>
                      <a>{val.name}</a>
                      {i === videoGameEntity.genres.length - 1 ? '' : ', '}
                    </span>
                  ))
                : null}
            </dd>
          </dl>
          <Button tag={Link} to="/entity/video-game" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/video-game/${videoGameEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ videoGame }: IRootState) => ({
  videoGameEntity: videoGame.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoGameDetail);
