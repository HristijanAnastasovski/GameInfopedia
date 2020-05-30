import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { byteSize, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './publisher.reducer';
import { IPublisher } from 'app/shared/model/publisher.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPublisherProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Publisher extends React.Component<IPublisherProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { publisherList, match } = this.props;
    return (
      <div>
        <h2 id="publisher-heading">
          Publishers
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Publisher
          </Link>
        </h2>
        <div className="table-responsive">
          {publisherList && publisherList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Description</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {publisherList.map((publisher, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${publisher.id}`} color="link" size="sm">
                        {publisher.id}
                      </Button>
                    </td>
                    <td>{publisher.name}</td>
                    <td>{publisher.country}</td>
                    <td>{publisher.description}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${publisher.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${publisher.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${publisher.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Publishers found</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ publisher }: IRootState) => ({
  publisherList: publisher.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Publisher);
