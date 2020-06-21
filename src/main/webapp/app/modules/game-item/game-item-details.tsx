import './game.scss';
import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from 'app/entities/video-game/video-game.reducer';
import { connect } from 'react-redux';
import { Spinner, Row, Col, Image } from 'reactstrap';

export interface IGameDetailsProp extends StateProps, DispatchProps {}

export class GameDetails extends React.Component<IGameDetailsProp, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    const { id } = this.props.match.params;
    this.props.getEntity(id);
  }

  getYear = date => {
    if (date) {
      return date.split('-')[0];
    }
  };

  printList = items => {
    if (items) {
      const length = items.length;
      return items.map((item, index) => (index === length - 1 ? item.name : item.name + ', '));
    }
  };

  render(): React.ReactNode {
    const { loading, entity } = this.props;
    return loading && entity ? (
      <Spinner color="secondary" />
    ) : (
      <Row>
        <Col sm={4}>
          {entity.image && entity.imageContentType ? (
            <img src={`data:${entity.imageContentType};base64, ${entity.image}`} className="image-rounded" />
          ) : null}
        </Col>
        <Col sm={8}>
          <h2>
            {entity.title} ({this.getYear(entity.releasedate)})
          </h2>
          <br />
          <h4>Description:</h4>
          <p>{entity.description}</p>
          <br />
          <div className="inline">
            <h4>Release Date: </h4>
            <p className="leveled">{entity.releasedate}</p>
            <br />
            <h4 className="spaced-out">Price: </h4>
            <p className="leveled">{entity.price}$</p>
            <h4 className="spaced-out">Rating: </h4>
            <p className="leveled">{entity.averageRating}</p>
            <h4 className="spaced-out">Publisher: </h4>
            <p className="leveled">{entity.publisher ? entity.publisher.name : null}</p>
          </div>
          <br />
          <div className="inline">
            <h4>Genres: </h4>
            <p className="leveled">{this.printList(entity.genres)}</p>
          </div>
          <br />
          <div className="inline">
            <h4>Platforms: </h4>
            <p className="leveled">{this.printList(entity.platforms)}</p>
          </div>
          <br />
          <div className="inline">
            <i className="icon-cpu" style={{ fontSize: '50px' }} aria-hidden="true" />
            <p className="leveled icon-text">{entity.minimumCPURequired ? entity.minimumCPURequired.name : null}</p>
            <i className="icon-ram" style={{ fontSize: '50px' }} aria-hidden="true" />
            <p className="leveled icon-text">{entity.minimumRAMRequired + ' GB'}</p>
            <i className="icon-gpu" style={{ fontSize: '50px' }} aria-hidden="true" />
            <p className="leveled icon-text">{entity.minimumGPURequired ? entity.minimumGPURequired.name : null}</p>
            <i className="icon-hard-disk-drive" style={{ fontSize: '50px' }} aria-hidden="true" />
            <p className="leveled icon-text">{entity.minimumStorageRequired + ' GB'}</p>
          </div>
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = ({ videoGame }: IRootState) => ({
  entity: videoGame.entity,
  loading: videoGame.loading
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameDetails);
