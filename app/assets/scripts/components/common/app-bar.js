import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { withRouter } from 'react-router-dom';

import Constrainer from '../../styles/constrainer';
import Button from '../../styles/button/button';

import { antialiased } from '../../styles/helpers';
import { themeVal } from '../../styles/utils/general';
import Heading from '../../styles/type/heading';
import { CleanLink } from '../../utils/react';

const PageHead = styled.header`
  ${antialiased()}
  position: fixed;
  width: 100%;
  z-index: 10;
  background-color: ${themeVal('color.primary')};
  color: #fff;
`;

const PageHeadInner = styled(Constrainer)`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
`;

const PageHeadline = styled.div`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: ${themeVal('layout.space')};
  }
`;

const PageActions = styled.div`
  margin-left: auto;
`;

/* eslint-disable-next-line react/display-name */
export const AppBarButton = React.forwardRef((props, ref) => (
  <Button
    ref={ref}
    variation='achromic-plain'
    size='large'
    hideText
    {...props}
  />
));

class AppBar extends React.PureComponent {
  render () {
    const {
      title,
      onMenuClick,
      onBackClick,
      backTo,
      renderActions
    } = this.props;

    return (
      <PageHead>
        <PageHeadInner>
          <PageHeadline>
            {backTo ? (
              <AppBarButton
                as={CleanLink}
                to={backTo}
                useIcon='arrow-left'
                onClick={onBackClick}
              >
                <span>Go back</span>
              </AppBarButton>
            ) : (
              <AppBarButton useIcon='hamburguer-menu' onClick={onMenuClick}>
                Menu
              </AppBarButton>
            )}

            <Heading size='xlarge'>{title}</Heading>
          </PageHeadline>
          {typeof renderActions === 'function' && (
            <PageActions>{renderActions()}</PageActions>
          )}
        </PageHeadInner>
      </PageHead>
    );
  }
}

AppBar.defaultProps = {
  onBackClick: () => {} // noop
};

AppBar.propTypes = {
  onBackClick: T.func,
  backTo: T.string,
  renderActions: T.func,
  title: T.string,
  onMenuClick: T.func
};

export default withRouter(AppBar);
