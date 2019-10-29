// /////////////////////////////////////////////////////////////////////////////
// Actions
// /////////////////////////////////////////////////////////////////////////////

export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export function openDrawer () {
  return { type: OPEN_DRAWER };
}

export function closeDrawer () {
  return { type: CLOSE_DRAWER };
}

// /////////////////////////////////////////////////////////////////////////////
// Reducer
// /////////////////////////////////////////////////////////////////////////////

const initialState = {
  drawerMenu: false
};

export default function globalReducer (state = initialState, action) {
  switch (action.type) {
    case OPEN_DRAWER: {
      return { ...state, drawerMenu: true };
    }
    case CLOSE_DRAWER: {
      return { ...state, drawerMenu: false };
    }
    default:
      return state;
  }
}
