import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import T from 'prop-types';
import { Transition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { rgba } from 'polished';

import Button from '../../styles/button/button';
import Heading from '../../styles/type/heading';

import { antialiased, BodyUnscrollable } from '../../styles/helpers';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { closeDrawer as closeDrawerAction } from '../../redux/global';
import { divide, multiply } from '../../styles/utils/math';

const _rgba = stylizeFunction(rgba);

const glsp = themeVal('layout.space');

const MenuOverlay = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  background: rgba(0, 0, 0, 0);

  visibility: hidden;
  transition: all 0.16s ease-in-out;

  ${({ isVisible }) =>
    isVisible &&
    css`
      visibility: visible;
      background: ${themeVal('color.shadow')};
  `}
`;

const Drawer = styled.nav`
  ${antialiased()}
  position: relative;
  left: -15rem;
  background: #fff;
  width: 15rem;
  box-shadow: 4px 0px 8px 0px ${(themeVal('color.mist'))};
  transition: all 0.32s ease-in-out;

  ${({ isVisible }) =>
    isVisible &&
    css`
      left: 0;
    `}
  
  &::before {
    content: '';
    position: absolute;
    left: -3rem;
    bottom: -3rem;
    display: block;
    width: 15rem;
    height: 15rem;
    background-image: url('/assets/graphics/layout/targetting_colored.svg');
    background-repeat: no-repeat;
    opacity: 0.32;
  }
`;

const DrawerHeader = styled.header`
  background: ${themeVal('color.primary')};
  color: #fff;
  padding: ${glsp};
`;

const DrawerHeadline = styled.div`
  margin-top: ${glsp};
`;

const DrawerBody = styled.div`
  padding: ${multiply(glsp, 2)} ${glsp} ${glsp} ${glsp};
`;

const DrawerMenuList = styled.ul`
  margin-right: -${glsp};
  margin-left: -${glsp};

  li:not(:last-child) {
    margin-bottom: ${divide(glsp, 2)};
  }
`;

const DrawerMenuItem = styled(Link)`
  display: block;
  padding: ${divide(glsp, 2)} ${glsp};
  text-transform: uppercase;
  transition: all 0.16s ease-in-out;

  &:hover {
    opacity: 1;
    background: ${_rgba(themeVal('color.primary'), 0.16)}
  }
`;

class DrawerMenu extends React.PureComponent {
  constructor (props) {
    super(props);

    this.onOverlayClick = this.onOverlayClick.bind(this);
  }

  onOverlayClick (e) {
    if (e.target === e.currentTarget) {
      this.props.closeDrawer();
    }
  }

  render () {
    const { isOpen, closeDrawer } = this.props;

    return (
      <Transition
        in={isOpen}
        mountOnEnter
        unmountOnExit
        // https://github.com/reactjs/react-transition-group/issues/223
        // When trying to make an element appear, a change of state is not enough
        // for a reflow (element render). Just be reading the element's height the
        // browser is forced to update the element causing the transition to fire.
        // It shall henceforth be known as Schrödinger's transition.
        onEnter={node => node.offsetHeight}
        timeout={320}
      >
        {state => (
          <MenuOverlay
            onClick={this.onOverlayClick}
            isVisible={state === 'entered' || state === 'entering'}
          >
            <BodyUnscrollable revealed={isOpen} />
            <Drawer isVisible={state === 'entered' || state === 'entering'}>
              <DrawerHeader>
                <Button
                  variation='achromic-plain'
                  size='large'
                  hideText
                  useIcon='xmark'
                  onClick={() => closeDrawer()}
                >
                  Close
                </Button>
                <DrawerHeadline>
                  <Heading size='small'>Welcome</Heading>
                </DrawerHeadline>
              </DrawerHeader>
              <DrawerBody>
                <DrawerMenuList>
                  <li>
                    <DrawerMenuItem to='/' onClick={() => closeDrawer()}>Sessions</DrawerMenuItem>
                  </li>
                  <li>
                    <DrawerMenuItem to='/about' onClick={() => closeDrawer()}>About</DrawerMenuItem>
                  </li>
                </DrawerMenuList>
              </DrawerBody>
            </Drawer>
          </MenuOverlay>
        )}
      </Transition>
    );
  }
}

DrawerMenu.propTypes = {
  closeDrawer: T.func,
  isOpen: T.bool
};

function mapStateToProps (state, props) {
  return {
    isOpen: state.global.drawerMenu
  };
}

const mapDispatchToProps = {
  closeDrawer: closeDrawerAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerMenu);
