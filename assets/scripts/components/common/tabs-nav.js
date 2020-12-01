import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { NavLink } from 'react-router-dom';

import { themeVal } from '../../styles/utils/general';
import { multiply, divide } from '../../styles/utils/math';
import { antialiased } from '../../styles/helpers';

const glsp = themeVal('layout.space');

const TabsNavEl = styled.nav`
  margin: -${glsp} -${glsp} ${glsp} -${glsp};
  padding-top: 0.5rem;
  background: ${themeVal('color.primary')};
`;

const Tabs = styled.ul`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  padding: 0 ${glsp};

  &::before {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.125rem;
    width: 100%;
    background: ${themeVal('color.alpha')};
    content: '';
  }
`;

const TabsItem = styled.li`
  ${antialiased()}
  margin-right: ${multiply(glsp, 2)};
  color: #fff;
`;

const TabsLink = styled.a`
  position: relative;
  display: block;
  font-size: 1rem;
  font-weight: ${themeVal('type.base.bold')};
  line-height: 1rem;
  padding: ${divide(glsp, 2)} ${divide(glsp, 2)} ${glsp} ${divide(glsp, 2)};
  color: inherit;
  transition: all 0.24s ease 0s;

  &::before {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.125rem;
    width: 100%;
    background: #fff;
    content: '';
    opacity: 0;
    transition: all 0.24s ease 0s;
  }

  &:visited {
    color: inherit;
  }

  &:hover {
    color: #ffffff77;
    opacity: 1;
  }

  ${({ active }) => (active ? '&,' : '')}
  &.active {
    &,
    &:visited {
      color: #fff;
    }

    &::before {
      opacity: 1;
    }
  }
`;

/* eslint-disable-next-line react/display-name */
const TabsNav = ({ items }) => (
  <TabsNavEl role='navigation'>
    <Tabs>
      {items.map(({ label, ...item }) => (
        <TabsItem key={item.to}>
          <TabsLink as={NavLink} {...item}>
            {label}
          </TabsLink>
        </TabsItem>
      ))}
    </Tabs>
  </TabsNavEl>
);

TabsNav.propTypes = {
  items: T.array
};

export default TabsNav;
