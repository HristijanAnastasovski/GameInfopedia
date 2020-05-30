import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IGPU, defaultValue } from 'app/shared/model/gpu.model';

export const ACTION_TYPES = {
  FETCH_GPU_LIST: 'gPU/FETCH_GPU_LIST',
  FETCH_GPU: 'gPU/FETCH_GPU',
  CREATE_GPU: 'gPU/CREATE_GPU',
  UPDATE_GPU: 'gPU/UPDATE_GPU',
  DELETE_GPU: 'gPU/DELETE_GPU',
  RESET: 'gPU/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IGPU>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type GPUState = Readonly<typeof initialState>;

// Reducer

export default (state: GPUState = initialState, action): GPUState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_GPU_LIST):
    case REQUEST(ACTION_TYPES.FETCH_GPU):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_GPU):
    case REQUEST(ACTION_TYPES.UPDATE_GPU):
    case REQUEST(ACTION_TYPES.DELETE_GPU):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_GPU_LIST):
    case FAILURE(ACTION_TYPES.FETCH_GPU):
    case FAILURE(ACTION_TYPES.CREATE_GPU):
    case FAILURE(ACTION_TYPES.UPDATE_GPU):
    case FAILURE(ACTION_TYPES.DELETE_GPU):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_GPU_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_GPU):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_GPU):
    case SUCCESS(ACTION_TYPES.UPDATE_GPU):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_GPU):
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

const apiUrl = 'api/gpus';

// Actions

export const getEntities: ICrudGetAllAction<IGPU> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_GPU_LIST,
  payload: axios.get<IGPU>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IGPU> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_GPU,
    payload: axios.get<IGPU>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IGPU> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_GPU,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IGPU> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_GPU,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IGPU> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_GPU,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
