import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './publisher.reducer';
import { IPublisher } from 'app/shared/model/publisher.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPublisherDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class PublisherDetail extends React.Component<IPublisherDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { publisherEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Publisher [<b>{publisherEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">Name</span>
            </dt>
            <dd>{publisherEntity.name}</dd>
            <dt>
              <span id="country">Country</span>
            </dt>
            <dd>{publisherEntity.country}</dd>
            <dt>
              <span id="description">Description</span>
            </dt>
            <dd>{publisherEntity.description}</dd>
          </dl>
          <Button tag={Link} to="/entity/publisher" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/publisher/${publisherEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ publisher }: IRootState) => ({
  publisherEntity: publisher.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublisherDetail);
