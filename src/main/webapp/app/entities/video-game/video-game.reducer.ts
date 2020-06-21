import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction, ICrudSearchAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVideoGame, defaultValue } from 'app/shared/model/video-game.model';

export const ACTION_TYPES = {
  FETCH_VIDEOGAME_LIST: 'videoGame/FETCH_VIDEOGAME_LIST',
  FETCH_VIDEOGAME: 'videoGame/FETCH_VIDEOGAME',
  CREATE_VIDEOGAME: 'videoGame/CREATE_VIDEOGAME',
  UPDATE_VIDEOGAME: 'videoGame/UPDATE_VIDEOGAME',
  DELETE_VIDEOGAME: 'videoGame/DELETE_VIDEOGAME',
  SET_BLOB: 'videoGame/SET_BLOB',
  RESET: 'videoGame/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVideoGame>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type VideoGameState = Readonly<typeof initialState>;

// Reducer

export default (state: VideoGameState = initialState, action): VideoGameState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VIDEOGAME_LIST):
    case REQUEST(ACTION_TYPES.FETCH_VIDEOGAME):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_VIDEOGAME):
    case REQUEST(ACTION_TYPES.UPDATE_VIDEOGAME):
    case REQUEST(ACTION_TYPES.DELETE_VIDEOGAME):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_VIDEOGAME_LIST):
    case FAILURE(ACTION_TYPES.FETCH_VIDEOGAME):
    case FAILURE(ACTION_TYPES.CREATE_VIDEOGAME):
    case FAILURE(ACTION_TYPES.UPDATE_VIDEOGAME):
    case FAILURE(ACTION_TYPES.DELETE_VIDEOGAME):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_VIDEOGAME_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_VIDEOGAME):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_VIDEOGAME):
    case SUCCESS(ACTION_TYPES.UPDATE_VIDEOGAME):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_VIDEOGAME):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB:
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/video-games';
const apiUrlNoPagination = 'api/video-games-no-pagination';
const apiUrlByTitle = 'api/video-games-title-contains';
const apiUrlFindByGenreName = 'api/video-games-by-genre-name';
const apiUrlFindByPlatformName = 'api/video-games-by-platform-name';
const apiUrlFindByPublisherName = 'api/video-games-by-publisher-name';
const apiUrlFindByRating = 'api/video-games-by-rating';

// Actions

export const getEntities: ICrudGetAllAction<IVideoGame> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_VIDEOGAME_LIST,
    payload: axios.get<IVideoGame>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntitiesNoPagination: ICrudGetAllAction<IVideoGame> = () => ({
  type: ACTION_TYPES.FETCH_VIDEOGAME_LIST,
  payload: axios.get<IVideoGame>(`${apiUrlNoPagination}?cacheBuster=${new Date().getTime()}`)
});

export const getEntitiesByTitle: ICrudSearchAction<IVideoGame> = (title: String) => ({
  type: ACTION_TYPES.FETCH_VIDEOGAME_LIST,
  payload: axios.get<IVideoGame>(`${apiUrlByTitle}?title=${title}`)
});

export const findByGenreName: ICrudSearchAction<IVideoGame> = (genre: String) => {
  const requestUrl = `${apiUrlFindByGenreName}?genrename=${genre}`;
  return {
    type: ACTION_TYPES.FETCH_VIDEOGAME_LIST,
    payload: axios.get<IVideoGame>(requestUrl)
  };
};

export const findByPlatformName: ICrudSearchAction<IVideoGame> = (platform: String) => {
  const requestUrl = `${apiUrlFindByPlatformName}?platformname=${platform}`;
  return {
    type: ACTION_TYPES.FETCH_VIDEOGAME_LIST,
    payload: axios.get<IVideoGame>(requestUrl)
  };
};

export const findByPublisherName: ICrudSearchAction<IVideoGame> = (publisher: String) => {
  const requestUrl = `${apiUrlFindByPublisherName}?publishername=${publisher}`;
  return {
    type: ACTION_TYPES.FETCH_VIDEOGAME_LIST,
    payload: axios.get<IVideoGame>(requestUrl)
  };
};

export const findByRating: ICrudSearchAction<IVideoGame> = (minRating: String, sort: String) => {
  const requestUrl = `${apiUrlFindByRating}?minrating=${minRating}&maxrating=10&ascending=${sort === 'Ascending'}`;
  return {
    type: ACTION_TYPES.FETCH_VIDEOGAME_LIST,
    payload: axios.get<IVideoGame>(requestUrl)
  };
};

export const getEntity: ICrudGetAction<IVideoGame> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VIDEOGAME,
    payload: axios.get<IVideoGame>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IVideoGame> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VIDEOGAME,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IVideoGame> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VIDEOGAME,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVideoGame> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VIDEOGAME,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
