// /////////////////////////////////////////////////////////////////////////////
// Actions
// /////////////////////////////////////////////////////////////////////////////

export const ADD_SESSION = 'ADD_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const DELETE_SESSION = 'DELETE_SESSION';

export function addSession (data) {
  return { type: ADD_SESSION, data };
}
export function updateSession (sessionId, data) {
  return { type: UPDATE_SESSION, sessionId, data };
}

export function deleteSession (sessionId) {
  return { type: DELETE_SESSION, sessionId };
}

// /////////////////////////////////////////////////////////////////////////////
// Reducer
// /////////////////////////////////////////////////////////////////////////////

const initialSessionsState = [

];

export default function sessionsReducer (state = initialSessionsState, action) {
  switch (action.type) {
    case ADD_SESSION: {
      const { data } = action;
      return [...state, data];
    }
    case DELETE_SESSION: {
      const { sessionId } = action;
      return state.filter(s => s.id !== sessionId);
    }
    // Session specific reducers:
    case UPDATE_SESSION:
    case REGISTER_HIT: {
      const { sessionId } = action;
      const sessionIdx = state.findIndex(s => s.id === sessionId);
      if (sessionIdx < 0) throw new Error(`Session not found: ${sessionId}`);
      const session = state[sessionIdx];
      return Object.assign([], state, {
        [sessionIdx]: singleSessionReducer(session, action)
      });
    }
    default:
      return state;
  }
}

// /////////////////////////////////////////////////////////////////////////////
// Actions
// /////////////////////////////////////////////////////////////////////////////

export const REGISTER_HIT = 'REGISTER_HIT';

export function registerHit (sessionId, round, arrow, data) {
  return { type: REGISTER_HIT, sessionId, round, arrow, data };
}

// /////////////////////////////////////////////////////////////////////////////
// Reducer
// /////////////////////////////////////////////////////////////////////////////

export function singleSessionReducer (state = {}, action) {
  switch (action.type) {
    case REGISTER_HIT: {
      const { round, arrow, data } = action;
      const hits = Object.assign([], state.hits, {
        [round]: Object.assign([], state.hits[round] || [], {
          [arrow]: data
        })
      });
      return { ...state, hits };
    }
    case UPDATE_SESSION:
      return { ...state, ...action.data };
    default:
      return state;
  }
}
