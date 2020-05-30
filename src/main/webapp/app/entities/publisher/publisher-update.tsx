import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './publisher.reducer';
import { IPublisher } from 'app/shared/model/publisher.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPublisherUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPublisherUpdateState {
  isNew: boolean;
}

export class PublisherUpdate extends React.Component<IPublisherUpdateProps, IPublisherUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { publisherEntity } = this.props;
      const entity = {
        ...publisherEntity,
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
    this.props.history.push('/entity/publisher');
  };

  render() {
    const { publisherEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    const { description } = publisherEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="gameInfopediaApp.publisher.home.createOrEditLabel">Create or edit a Publisher</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : publisherEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="publisher-id">ID</Label>
                    <AvInput id="publisher-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="publisher-name">
                    Name
                  </Label>
                  <AvField id="publisher-name" type="text" name="name" />
                </AvGroup>
                <AvGroup>
                  <Label id="countryLabel" for="publisher-country">
                    Country
                  </Label>
                  <AvField id="publisher-country" type="text" name="country" />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="publisher-description">
                    Description
                  </Label>
                  <AvInput id="publisher-description" type="textarea" name="description" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/publisher" replace color="info">
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
  publisherEntity: storeState.publisher.entity,
  loading: storeState.publisher.loading,
  updating: storeState.publisher.updating,
  updateSuccess: storeState.publisher.updateSuccess
});

const mapDispatchToProps = {
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
)(PublisherUpdate);
