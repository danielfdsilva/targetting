import React from 'react';
import { Link } from 'react-router-dom';

/**
 * When a component is used as the "as" property of styled-components, all the
 * props are passed to it and not filtered before reaching the DOM.
 * React complains about this because the props are not valid.
 *
 * @param {Component} Comp The component
 * @param {array} toFilter The properties to filter out
 */
// eslint-disable-next-line react/display-name
export const componentFilterProps = (Comp, toFilter = []) =>
  React.forwardRef((rawProps, ref) => {
    const props = Object.keys(rawProps).reduce(
      (acc, p) => (toFilter.includes(p) ? acc : { ...acc, [p]: rawProps[p] }),
      {}
    );
    return <Comp ref={ref} {...props} />;
  });

/**
 * Clean version of the Link component
 */
export const CleanLink = componentFilterProps(Link, [
  'useIcon',
  'variant',
  'size',
  'hideText'
]);
