import styled from 'styled-components';
import { rgba } from 'polished';
import { themeVal, stylizeFunction } from './utils/general';
import { divide } from './utils/math';
import { headingAlt } from './type/heading';

const _rgba = stylizeFunction(rgba);

const Table = styled.table`
  width: 100%;
  max-width: 100%;

  td, th {
    padding: ${divide(themeVal('layout.space'), 2)};
    vertical-align: top;
    text-align: left;

    &:first-child {
      padding-left: ${themeVal('layout.space')};
    }

    &:last-child {
      padding-right: ${themeVal('layout.space')};
    }
  }

  thead th {
    ${headingAlt};
    color: ${_rgba(themeVal('color.base'), 0.64)};
    font-size: 0.875rem;
    line-height: 1.25rem;
    vertical-align: bottom;
    box-shadow: inset 0 -2px 0 0 ${themeVal('color.alpha')};

    a {
      display: inline-flex;
    }

    a,
    a:visited,
    a:hover {
      color: inherit;
    }
  }

  tbody th,
  tbody td {
    text-align: left;
    vertical-align: top;
    border-bottom: ${themeVal('layout.border')} solid ${themeVal('color.alpha')};
  }
`;

export default Table;
