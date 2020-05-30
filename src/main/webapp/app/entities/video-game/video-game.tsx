import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import {
  openFile,
  byteSize,
  ICrudGetAllAction,
  TextFormat,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './video-game.reducer';
import { IVideoGame } from 'app/shared/model/video-game.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IVideoGameProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export type IVideoGameState = IPaginationBaseState;

export class VideoGame extends React.Component<IVideoGameProps, IVideoGameState> {
  state: IVideoGameState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.getEntities();
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortEntities()
    );
  };

  sortEntities() {
    this.getEntities();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortEntities());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { videoGameList, match, totalItems } = this.props;
    return (
      <div>
        <h2 id="video-game-heading">
          Video Games
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Video Game
          </Link>
        </h2>
        <div className="table-responsive">
          {videoGameList && videoGameList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={this.sort('id')}>
                    ID <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('title')}>
                    Title <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('releasedate')}>
                    Releasedate <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('price')}>
                    Price <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('image')}>
                    Image <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('description')}>
                    Description <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('averageRating')}>
                    Average Rating <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('minimumStorageRequired')}>
                    Minimum Storage Required <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('minimumRAMRequired')}>
                    Minimum RAM Required <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    Publisher <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    Minimum CPU Required <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    Minimum GPU Required <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {videoGameList.map((videoGame, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${videoGame.id}`} color="link" size="sm">
                        {videoGame.id}
                      </Button>
                    </td>
                    <td>{videoGame.title}</td>
                    <td>
                      <TextFormat type="date" value={videoGame.releasedate} format={APP_LOCAL_DATE_FORMAT} />
                    </td>
                    <td>${videoGame.price}</td>
                    <td>
                      {videoGame.image ? (
                        <div>
                          <a onClick={openFile(videoGame.imageContentType, videoGame.image)}>Open &nbsp;</a>
                          <span>
                            {videoGame.imageContentType}, {byteSize(videoGame.image)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>{videoGame.description}</td>
                    <td>{videoGame.averageRating}</td>
                    <td>{videoGame.minimumStorageRequired}</td>
                    <td>{videoGame.minimumRAMRequired}</td>
                    <td>{videoGame.publisher ? <Link to={`publisher/${videoGame.publisher.id}`}>{videoGame.publisher.name}</Link> : ''}</td>
                    <td>
                      {videoGame.minimumCPURequired ? (
                        <Link to={`cpu/${videoGame.minimumCPURequired.id}`}>{videoGame.minimumCPURequired.name}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>
                      {videoGame.minimumGPURequired ? (
                        <Link to={`gpu/${videoGame.minimumGPURequired.id}`}>{videoGame.minimumGPURequired.name}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${videoGame.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${videoGame.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${videoGame.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Video Games found</div>
          )}
        </div>
        <div className={videoGameList && videoGameList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={this.state.activePage} total={totalItems} itemsPerPage={this.state.itemsPerPage} />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={this.state.activePage}
              onSelect={this.handlePagination}
              maxButtons={5}
              itemsPerPage={this.state.itemsPerPage}
              totalItems={this.props.totalItems}
            />
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ videoGame }: IRootState) => ({
  videoGameList: videoGame.entities,
  totalItems: videoGame.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoGame);
