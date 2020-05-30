import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IPublisher } from 'app/shared/model/publisher.model';
import { getEntities as getPublishers } from 'app/entities/publisher/publisher.reducer';
import { ICPU } from 'app/shared/model/cpu.model';
import { getEntities as getCPus } from 'app/entities/cpu/cpu.reducer';
import { IGPU } from 'app/shared/model/gpu.model';
import { getEntities as getGPus } from 'app/entities/gpu/gpu.reducer';
import { IPlatform } from 'app/shared/model/platform.model';
import { getEntities as getPlatforms } from 'app/entities/platform/platform.reducer';
import { IGenre } from 'app/shared/model/genre.model';
import { getEntities as getGenres } from 'app/entities/genre/genre.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './video-game.reducer';
import { IVideoGame } from 'app/shared/model/video-game.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IVideoGameUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IVideoGameUpdateState {
  isNew: boolean;
  idsplatforms: any[];
  idsgenres: any[];
  publisherId: string;
  minimumCPURequiredId: string;
  minimumGPURequiredId: string;
}

export class VideoGameUpdate extends React.Component<IVideoGameUpdateProps, IVideoGameUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idsplatforms: [],
      idsgenres: [],
      publisherId: '0',
      minimumCPURequiredId: '0',
      minimumGPURequiredId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getPublishers();
    this.props.getCPus();
    this.props.getGPus();
    this.props.getPlatforms();
    this.props.getGenres();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { videoGameEntity } = this.props;
      const entity = {
        ...videoGameEntity,
        ...values,
        platforms: mapIdList(values.platforms),
        genres: mapIdList(values.genres)
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/video-game');
  };

  render() {
    const { videoGameEntity, publishers, cPUS, gPUS, platforms, genres, loading, updating } = this.props;
    const { isNew } = this.state;

    const { image, imageContentType, description } = videoGameEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="gameInfopediaApp.videoGame.home.createOrEditLabel">Create or edit a VideoGame</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : videoGameEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="video-game-id">ID</Label>
                    <AvInput id="video-game-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="video-game-title">
                    Title
                  </Label>
                  <AvField id="video-game-title" type="text" name="title" />
                </AvGroup>
                <AvGroup>
                  <Label id="releasedateLabel" for="video-game-releasedate">
                    Releasedate
                  </Label>
                  <AvField id="video-game-releasedate" type="date" className="form-control" name="releasedate" />
                </AvGroup>
                <AvGroup>
                  <Label id="priceLabel" for="video-game-price">
                    Price
                  </Label>
                  <AvField id="video-game-price" type="string" className="form-control" name="price" />
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="imageLabel" for="image">
                      Image
                    </Label>
                    <br />
                    {image ? (
                      <div>
                        <a onClick={openFile(imageContentType, image)}>Open</a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {imageContentType}, {byteSize(image)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('image')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_image" type="file" onChange={this.onBlobChange(false, 'image')} />
                    <AvInput type="hidden" name="image" value={image} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="video-game-description">
                    Description
                  </Label>
                  <AvInput id="video-game-description" type="textarea" name="description" />
                </AvGroup>
                <AvGroup>
                  <Label id="averageRatingLabel" for="video-game-averageRating">
                    Average Rating
                  </Label>
                  <AvField id="video-game-averageRating" type="string" className="form-control" name="averageRating" />
                </AvGroup>
                <AvGroup>
                  <Label id="minimumStorageRequiredLabel" for="video-game-minimumStorageRequired">
                    Minimum Storage Required
                  </Label>
                  <AvField id="video-game-minimumStorageRequired" type="string" className="form-control" name="minimumStorageRequired" />
                </AvGroup>
                <AvGroup>
                  <Label id="minimumRAMRequiredLabel" for="video-game-minimumRAMRequired">
                    Minimum RAM Required
                  </Label>
                  <AvField id="video-game-minimumRAMRequired" type="string" className="form-control" name="minimumRAMRequired" />
                </AvGroup>
                <AvGroup>
                  <Label for="video-game-publisher">Publisher</Label>
                  <AvInput id="video-game-publisher" type="select" className="form-control" name="publisher.id">
                    <option value="" key="0" />
                    {publishers
                      ? publishers.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="video-game-minimumCPURequired">Minimum CPU Required</Label>
                  <AvInput id="video-game-minimumCPURequired" type="select" className="form-control" name="minimumCPURequired.id">
                    <option value="" key="0" />
                    {cPUS
                      ? cPUS.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="video-game-minimumGPURequired">Minimum GPU Required</Label>
                  <AvInput id="video-game-minimumGPURequired" type="select" className="form-control" name="minimumGPURequired.id">
                    <option value="" key="0" />
                    {gPUS
                      ? gPUS.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="video-game-platforms">Platforms</Label>
                  <AvInput
                    id="video-game-platforms"
                    type="select"
                    multiple
                    className="form-control"
                    name="platforms"
                    value={videoGameEntity.platforms && videoGameEntity.platforms.map(e => e.id)}
                  >
                    <option value="" key="0" />
                    {platforms
                      ? platforms.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="video-game-genres">Genres</Label>
                  <AvInput
                    id="video-game-genres"
                    type="select"
                    multiple
                    className="form-control"
                    name="genres"
                    value={videoGameEntity.genres && videoGameEntity.genres.map(e => e.id)}
                  >
                    <option value="" key="0" />
                    {genres
                      ? genres.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/video-game" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  publishers: storeState.publisher.entities,
  cPUS: storeState.cPU.entities,
  gPUS: storeState.gPU.entities,
  platforms: storeState.platform.entities,
  genres: storeState.genre.entities,
  videoGameEntity: storeState.videoGame.entity,
  loading: storeState.videoGame.loading,
  updating: storeState.videoGame.updating,
  updateSuccess: storeState.videoGame.updateSuccess
});

const mapDispatchToProps = {
  getPublishers,
  getCPus,
  getGPus,
  getPlatforms,
  getGenres,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoGameUpdate);
