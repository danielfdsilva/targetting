import styled from 'styled-components';

import { themeVal } from '../../styles/utils/general';

import Button from '../../styles/button/button';

const FabButton = styled(Button).attrs({
  hideText: true,
  variation: 'primary-raised-dark',
  size: 'xlarge'
})`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  border-radius: ${themeVal('shape.ellipsoid')};
`;

export default FabButton;
