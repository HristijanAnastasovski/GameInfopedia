import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICPU, defaultValue } from 'app/shared/model/cpu.model';

export const ACTION_TYPES = {
  FETCH_CPU_LIST: 'cPU/FETCH_CPU_LIST',
  FETCH_CPU: 'cPU/FETCH_CPU',
  CREATE_CPU: 'cPU/CREATE_CPU',
  UPDATE_CPU: 'cPU/UPDATE_CPU',
  DELETE_CPU: 'cPU/DELETE_CPU',
  RESET: 'cPU/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICPU>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CPUState = Readonly<typeof initialState>;

// Reducer

export default (state: CPUState = initialState, action): CPUState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CPU_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CPU):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CPU):
    case REQUEST(ACTION_TYPES.UPDATE_CPU):
    case REQUEST(ACTION_TYPES.DELETE_CPU):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CPU_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CPU):
    case FAILURE(ACTION_TYPES.CREATE_CPU):
    case FAILURE(ACTION_TYPES.UPDATE_CPU):
    case FAILURE(ACTION_TYPES.DELETE_CPU):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CPU_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CPU):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CPU):
    case SUCCESS(ACTION_TYPES.UPDATE_CPU):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CPU):
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

const apiUrl = 'api/cpus';

// Actions

export const getEntities: ICrudGetAllAction<ICPU> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CPU_LIST,
  payload: axios.get<ICPU>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICPU> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CPU,
    payload: axios.get<ICPU>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICPU> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CPU,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICPU> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CPU,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICPU> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CPU,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
