import './home.scss';

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col, Alert, Spinner, Navbar, NavbarText } from 'reactstrap';

import { getSession } from 'app/shared/reducers/authentication';
import {
  findByGenreName,
  findByPlatformName,
  findByPublisherName,
  findByRating,
  getEntitiesByTitle,
  getEntitiesNoPagination
} from 'app/entities/video-game/video-game.reducer';
import { getEntities as getGenres } from 'app/entities/genre/genre.reducer';
import { getEntities as getPublishers } from 'app/entities/publisher/publisher.reducer';
import { getEntities as getPlatforms } from 'app/entities/platform/platform.reducer';
import Game from 'app/modules/game-item/game';

export interface IHomeProp extends StateProps, DispatchProps {}

export interface IHomeState {
  title: string;
  selectedFilter: string;
  dropdownLoading: boolean;
}

export class Home extends React.Component<IHomeProp, IHomeState> {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      selectedFilter: '',
      dropdownLoading: false
    };
  }

  componentDidMount() {
    this.props.getSession();
    this.props.getEntitiesNoPagination();
  }

  componentDidUpdate(prevProps, prevState: Readonly<IHomeState>, snapshot?: any): void {
    const { genre: prevGenre, platform: prevPlatform, publisher: prevPublisher } = prevProps;
    const { genre, platform, publisher } = this.props;
    if (prevGenre.loading !== genre.loading || prevPlatform.loading !== platform.loading || prevPublisher.loading !== publisher.loading) {
      this.setState({
        dropdownLoading: genre.loading || publisher.loading || platform.loading
      });
    }
  }

  renderGames = () => {
    const { entities } = this.props.videoGames;
    return entities.length ? (
      entities.map(item => {
        return (
          <Col key={item.id}>
            <Game game={item} />
          </Col>
        );
      })
    ) : (
      <div className="alert alert-warning">No Video Games found</div>
    );
  };

  handleChange = event => {
    const value = event.target.value;
    this.setState({
      title: value
    });
  };

  handleSubmit = () => {
    const { title, selectedFilter } = this.state;
    const { getEntitiesByTitle, findByGenreName, findByPlatformName, findByPublisherName, findByRating } = this.props;
    if (selectedFilter === 'none') {
      getEntitiesByTitle(title);
    }
    if (selectedFilter === 'genre') {
      const genresDropdown = document.getElementById('genres');
      if (genresDropdown) {
        findByGenreName(genresDropdown.value);
      }
    }
    if (selectedFilter === 'platform') {
      const platformsDropdown = document.getElementById('platforms');
      if (platformsDropdown) {
        findByPlatformName(platformsDropdown.value);
      }
    }
    if (selectedFilter === 'publisher') {
      const publishersDropdown = document.getElementById('publishers');
      if (publishersDropdown) {
        findByPublisherName(publishersDropdown.value);
      }
    }
    if (selectedFilter === 'rating') {
      const ratingsDropdown = document.getElementById('ratings');
      const ratingAscDscDropdown = document.getElementById('ratingAscDsc');
      if (ratingsDropdown && ratingAscDscDropdown) {
        findByRating(ratingsDropdown.value, ratingAscDscDropdown.value);
      }
    }
  };

  handleRadioChange = event => {
    const checkedValue = event.target.value;
    this.setState(
      {
        selectedFilter: checkedValue
      },
      () => {
        if (checkedValue === 'genre') {
          this.props.getGenres();
        }
        if (checkedValue === 'platform') {
          this.props.getPlatforms();
        }
        if (checkedValue === 'publisher') {
          this.props.getPublishers();
        }
      }
    );
  };

  renderDropDown = () => {
    const { selectedFilter, dropdownLoading } = this.state;
    const { genre, platform, publisher } = this.props;
    if (dropdownLoading) {
      return <Spinner color="secondary" />;
    }
    if (selectedFilter === 'none') {
      return null;
    }
    if (selectedFilter === 'genre') {
      return (
        <select id="genres" name="genres">
          {genre.entities.map(genreItem => {
            return (
              <option key={genreItem.id} value={genreItem.name}>
                {genreItem.name}
              </option>
            );
          })}
        </select>
      );
    }
    if (selectedFilter === 'platform') {
      return (
        <select id="platforms" name="platforms">
          {platform.entities.map(platformItem => {
            return (
              <option key={platformItem.id} value={platformItem.name}>
                {platformItem.name}
              </option>
            );
          })}
        </select>
      );
    }
    if (selectedFilter === 'publisher') {
      return (
        <select id="publishers" name="publishers">
          {publisher.entities.map(publisherItem => {
            return (
              <option key={publisherItem.id} value={publisherItem.name}>
                {publisherItem.name}
              </option>
            );
          })}
        </select>
      );
    }
    if (selectedFilter === 'rating') {
      const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      return (
        <div>
          <select id="ratings" name="ratings">
            {ratings.map(rating => {
              return (
                <option key={rating} value={rating}>
                  {rating !== 10 ? `${rating}+` : `${rating}`}
                </option>
              );
            })}
          </select>
          <select id="ratingAscDsc" name="ratingAscDsc">
            <option key="asc" value="Ascending">
              Ascending
            </option>
            <option key="dsc" value="Descending">
              Descending
            </option>
          </select>
        </div>
      );
    }
  };

  render() {
    const { account, videoGames } = this.props;
    const { title, selectedFilter } = this.state;
    return (
      <div>
        <div className="topnav">
          <div className="left">
            <h5>Filter by:</h5>
            <input onChange={this.handleRadioChange} type="radio" id="none" name="filter" value="none" />
            <label htmlFor="none">None</label>
            <br />
            <input onChange={this.handleRadioChange} type="radio" id="genre" name="filter" value="genre" />
            <label htmlFor="genre">Genre</label>
            <br />
            <input onChange={this.handleRadioChange} type="radio" id="platform" name="filter" value="platform" />
            <label htmlFor="platform">Platform</label>
            <br />
            <input onChange={this.handleRadioChange} type="radio" id="publisher" name="filter" value="publisher" />
            <label htmlFor="publisher">Publisher</label>
            <input onChange={this.handleRadioChange} type="radio" id="rating" name="filter" value="rating" />
            <label htmlFor="rating">Rating</label>
            {this.renderDropDown()}
          </div>
          <div className="search-container">
            <input
              onChange={this.handleChange}
              disabled={selectedFilter !== 'none'}
              id="title"
              type="text"
              placeholder="Search.."
              name="search"
              value={title}
            />
            <button onClick={this.handleSubmit}>
              <i className="fa fa-search" />
            </button>
          </div>
        </div>
        <Row>{videoGames.loading ? <Spinner color="secondary" /> : this.renderGames()}</Row>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  videoGames: storeState.videoGame,
  genre: storeState.genre,
  publisher: storeState.publisher,
  platform: storeState.platform
});

const mapDispatchToProps = {
  getSession,
  getEntitiesNoPagination,
  getEntitiesByTitle,
  getGenres,
  getPlatforms,
  getPublishers,
  findByGenreName,
  findByPlatformName,
  findByPublisherName,
  findByRating
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
