import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPlatform, defaultValue } from 'app/shared/model/platform.model';

export const ACTION_TYPES = {
  FETCH_PLATFORM_LIST: 'platform/FETCH_PLATFORM_LIST',
  FETCH_PLATFORM: 'platform/FETCH_PLATFORM',
  CREATE_PLATFORM: 'platform/CREATE_PLATFORM',
  UPDATE_PLATFORM: 'platform/UPDATE_PLATFORM',
  DELETE_PLATFORM: 'platform/DELETE_PLATFORM',
  RESET: 'platform/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPlatform>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type PlatformState = Readonly<typeof initialState>;

// Reducer

export default (state: PlatformState = initialState, action): PlatformState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PLATFORM_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PLATFORM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PLATFORM):
    case REQUEST(ACTION_TYPES.UPDATE_PLATFORM):
    case REQUEST(ACTION_TYPES.DELETE_PLATFORM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_PLATFORM_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PLATFORM):
    case FAILURE(ACTION_TYPES.CREATE_PLATFORM):
    case FAILURE(ACTION_TYPES.UPDATE_PLATFORM):
    case FAILURE(ACTION_TYPES.DELETE_PLATFORM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_PLATFORM_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PLATFORM):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PLATFORM):
    case SUCCESS(ACTION_TYPES.UPDATE_PLATFORM):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PLATFORM):
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

const apiUrl = 'api/platforms';

// Actions

export const getEntities: ICrudGetAllAction<IPlatform> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PLATFORM_LIST,
  payload: axios.get<IPlatform>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IPlatform> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PLATFORM,
    payload: axios.get<IPlatform>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IPlatform> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PLATFORM,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPlatform> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PLATFORM,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPlatform> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PLATFORM,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
