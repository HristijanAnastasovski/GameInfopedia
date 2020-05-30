import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IGenre, defaultValue } from 'app/shared/model/genre.model';

export const ACTION_TYPES = {
  FETCH_GENRE_LIST: 'genre/FETCH_GENRE_LIST',
  FETCH_GENRE: 'genre/FETCH_GENRE',
  CREATE_GENRE: 'genre/CREATE_GENRE',
  UPDATE_GENRE: 'genre/UPDATE_GENRE',
  DELETE_GENRE: 'genre/DELETE_GENRE',
  RESET: 'genre/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IGenre>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type GenreState = Readonly<typeof initialState>;

// Reducer

export default (state: GenreState = initialState, action): GenreState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_GENRE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_GENRE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_GENRE):
    case REQUEST(ACTION_TYPES.UPDATE_GENRE):
    case REQUEST(ACTION_TYPES.DELETE_GENRE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_GENRE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_GENRE):
    case FAILURE(ACTION_TYPES.CREATE_GENRE):
    case FAILURE(ACTION_TYPES.UPDATE_GENRE):
    case FAILURE(ACTION_TYPES.DELETE_GENRE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_GENRE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_GENRE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_GENRE):
    case SUCCESS(ACTION_TYPES.UPDATE_GENRE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_GENRE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/genres';

// Actions

export const getEntities: ICrudGetAllAction<IGenre> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_GENRE_LIST,
  payload: axios.get<IGenre>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IGenre> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_GENRE,
    payload: axios.get<IGenre>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IGenre> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_GENRE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IGenre> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_GENRE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IGenre> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_GENRE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
