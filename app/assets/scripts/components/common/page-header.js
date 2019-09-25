import React from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { antialiased } from '../../styles/helpers';
import { themeVal } from '../../styles/utils/general';
import Constrainer from '../../styles/constrainer';

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

const PageHeadline = styled.div``;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 1;
  text-transform: uppercase;
  margin: 0;

  a {
    color: inherit;
    display: block;
  }
`;

const PageNav = styled.nav`
  display: flex;
  margin: 0 0 0 auto;
`;

class PageHeader extends React.PureComponent {
  render () {
    return (
      <PageHead>
        <PageHeadInner>
          <PageHeadline>
            <PageTitle>
              <Link to='/' title='Go to Homepage'>Targetting</Link>
            </PageTitle>
          </PageHeadline>
        </PageHeadInner>
      </PageHead>
    );
  }
}

export default withRouter(PageHeader);
