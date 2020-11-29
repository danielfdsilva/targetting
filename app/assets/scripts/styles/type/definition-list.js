import styled, { css } from 'styled-components';
import { rgba } from 'polished';

import { themeVal } from '../utils/general';
import { glsp } from '../utils/theme-values';

const Dl = styled.dl`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: 1fr;
  align-items: baseline;

  dt {
    font-feature-settings: "pnum" 0; /* Use proportional numbers */
    font-family: ${themeVal('type.heading.family')};
    font-weight: ${themeVal('type.heading.regular')};
    text-transform: uppercase;
    color: ${({ theme }) => rgba(theme.type.base.color, 0.64)};
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  ${/* sc-declaration */({ type }) => type === 'horizontal' && css`
    grid-template-columns: max-content max-content;
  `}
`;

export default Dl;
