import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { withRouter } from 'react-router-dom';

import Constrainer from '../../styles/constrainer';
import Button from '../../styles/button/button';

import { antialiased } from '../../styles/helpers';
import { themeVal } from '../../styles/utils/general';
import Heading from '../../styles/type/heading';

const PageHead = styled.header`
  ${antialiased()}
  background-color: ${themeVal('color.primary')};
  color: #FFF;
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

class AppBar extends React.PureComponent {
  render () {
    const { title, onMenuClick } = this.props;

    return (
      <PageHead>
        <PageHeadInner>
          <PageHeadline>
            <Button
              variation='achromic-plain'
              size='large'
              hideText
              useIcon='hamburguer-menu'
              onClick={onMenuClick}
            >
              Menu
            </Button>
            <Heading size='xlarge'>{title}</Heading>
          </PageHeadline>
        </PageHeadInner>
      </PageHead>
    );
  }
}

AppBar.propTypes = {
  title: T.string,
  onMenuClick: T.func
};

export default withRouter(AppBar);
