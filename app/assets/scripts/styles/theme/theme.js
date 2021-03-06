import { tint, rgba } from 'polished';

// https://coolors.co/003049-d62828-f77f00-fcbf49-eae2b7
let color = {
  base: '#000000',
  primary: '#d62828',
  secondary: '#FC3D21'
};

color = {
  ...color,
  background: '#FFFFFF',
  link: color.primary,
  danger: '#D85D3F',
  success: '#216869',
  warning: '#FFC700',
  info: '#5860FF',
  mist: rgba(color.base, 0.24),
  shadow: rgba(color.base, 0.48),
  alpha: rgba(color.base, 0.08)
};

const type = {
  base: {
    root: '16px',
    size: '1rem',
    line: '1.5',
    color: tint(0.16, color.base),
    family: '"Open Sans", sans-serif',
    style: 'normal',
    weight: 400,
    light: 300,
    regular: 400,
    medium: 400,
    bold: 600
  },
  heading: {
    family: '"Open Sans", sans-serif',
    style: 'normal',
    weight: 600,
    light: 300,
    regular: 400,
    medium: 400,
    bold: 600
  }
};

const shape = {
  rounded: '0.25rem',
  ellipsoid: '320rem'
};

const layout = {
  space: '1rem',
  border: '1px',
  min: '320px',
  max: '543px'
};

const boxShadow = {
  inset: 'inset 0px 0px 3px 0px rgba(0,0,0,0.2);',
  input: '0 -1px 1px 0 rgba(0,0,0,0.08), 0 2px 6px 0 rgba(0,0,0,0.16);'
};

export default {
  main: {
    layout,
    color,
    type,
    shape,
    boxShadow
  }
};

/**
 * Media query ranges used by the media utility.
 * They're not exported with the main theme because the utility does not
 * build the media functions in runtime, needing the values beforehand.
 */
export const mediaRanges = {
  xsmall: [null, 543],
  small: [544, 767],
  medium: [768, 991],
  large: [992, 1199],
  xlarge: [1200, null]
};
