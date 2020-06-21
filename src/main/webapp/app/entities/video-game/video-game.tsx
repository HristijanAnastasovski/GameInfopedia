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
import { getEntitiesNoPagination } from './video-game.reducer';
import { IVideoGame } from 'app/shared/model/video-game.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IVideoGameProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class VideoGame extends React.Component<IVideoGameProps> {
  componentDidMount() {
    this.props.getEntitiesNoPagination();
  }

  render() {
    const { videoGameList, match } = this.props;
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
                  <th className="hand">ID</th>
                  <th className="hand">Title</th>
                  <th className="hand">Releasedate</th>
                  <th className="hand">Price</th>
                  <th className="hand">
                    Image <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand">
                    Description <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand">
                    Average Rating <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand">
                    Minimum Storage Required <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand">
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
      </div>
    );
  }
}

const mapStateToProps = ({ videoGame }: IRootState) => ({
  videoGameList: videoGame.entities,
  totalItems: videoGame.totalItems
});

const mapDispatchToProps = {
  getEntitiesNoPagination
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoGame);
