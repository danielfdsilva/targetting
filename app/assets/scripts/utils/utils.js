'use strict';
import get from 'lodash.get';
import { getTargetMaxRange } from './targets';

/**
 * Gets the given path from the state or return the default:
 * {
 *   fetched: false,
 *   fetching: false,
 *   data: {},
 *   error: null
 * }
 *
 * @see lodash.get
 *
 * @param {object} state The redux state
 * @param {array | string} path The path to get. Passed to lodash.get
 *
 * @returns {object} State or default
 */
export function getFromState (state, path) {
  return get(state, path, {
    fetched: false,
    fetching: false,
    data: {},
    error: null
  });
}

/**
 * Wraps the api result with helpful functions.
 * To be used in the state selector.
 *
 * @param {object} stateData Object as returned from an api request. Expected to
 *                           be in the following format:
 *                           {
 *                             fetched: bool,
 *                             fetching: bool,
 *                             data: object,
 *                             error: null | error
 *                           }
 *
 * @returns {object}
 * {
 *   raw(): returns the data as is.
 *   isReady(): Whether or not the fetching finished and was fetched.
 *   hasError(): Whether the request finished with an error.
 *   getData(): Returns the data. If the data has a results list will return that
 *   getMeta(): If there's a meta object it will be returned
 *
 * As backward compatibility all data properties are accessible directly.
 * }
 */
export function wrapApiResult (stateData) {
  const { fetched, fetching, data, error } = stateData;
  const ready = fetched && !fetching;
  return {
    raw: () => stateData,
    isReady: () => ready,
    hasError: () => ready && !!error,
    getData: (def = {}) => (ready ? data.results || data : def),
    getMeta: (def = {}) => (ready ? data.meta : def),

    // As backward compatibility
    ...stateData
  };
}

function randomChars (num) {
  return Math.random().toString(36).substring(2, 2 + num);
}

export function generateSessionId () {
  return `${randomChars(3)}-${randomChars(3)}-${randomChars(3)}`;
}

export function collision (circle1, circle2) {
  const { cx: cx1, cy: cy1, r: r1 } = circle1;
  const { cx: cx2, cy: cy2, r: r2 } = circle2;

  const distance = r1 + r2;
  const x = cx1 - cx2;
  const y = cy1 - cy2;

  return distance >= Math.sqrt(x * x + y * y);
}

export const getSessionScore = (session) => {
  const { config: { target, rounds, arrows }, hits } = session;
  const maxTargetScore = getTargetMaxRange(target);
  const maxScore = rounds * arrows.ids.length * maxTargetScore;

  const total = hits.reduce((tot, ht) => {
    if (!ht.length) return tot;
    // Sum points
    return tot + ht.reduce((sum, v) => sum + (v ? v.value : 0), 0);
  }, 0);

  return {
    score: total,
    max: maxScore
  };
};
