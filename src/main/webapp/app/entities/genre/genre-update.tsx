import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IVideoGame } from 'app/shared/model/video-game.model';
import { getEntities as getVideoGames } from 'app/entities/video-game/video-game.reducer';
import { getEntity, updateEntity, createEntity, reset } from './genre.reducer';
import { IGenre } from 'app/shared/model/genre.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IGenreUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IGenreUpdateState {
  isNew: boolean;
  gamesId: string;
}

export class GenreUpdate extends React.Component<IGenreUpdateProps, IGenreUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      gamesId: '0',
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

    this.props.getVideoGames();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { genreEntity } = this.props;
      const entity = {
        ...genreEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/genre');
  };

  render() {
    const { genreEntity, videoGames, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="gameInfopediaApp.genre.home.createOrEditLabel">Create or edit a Genre</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : genreEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="genre-id">ID</Label>
                    <AvInput id="genre-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="genre-name">
                    Name
                  </Label>
                  <AvField id="genre-name" type="text" name="name" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/genre" replace color="info">
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
  videoGames: storeState.videoGame.entities,
  genreEntity: storeState.genre.entity,
  loading: storeState.genre.loading,
  updating: storeState.genre.updating,
  updateSuccess: storeState.genre.updateSuccess
});

const mapDispatchToProps = {
  getVideoGames,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenreUpdate);
