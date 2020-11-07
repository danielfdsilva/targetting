import React, { Component } from 'react';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import Prose from '../../styles/type/prose';

class About extends Component {
  render () {
    return (
      <App pageTitle='About'>
        <Constrainer>
          <Prose>
            <img
              src='/assets/graphics/layout/targetting_colored.svg'
              alt='Targetting logotype'
              width='96'
              height='96'
            />
            <p>Targetting is an archery scoring application.</p>
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which do not look even slightly believable.</p>
          </Prose>
        </Constrainer>
      </App>
    );
  }
}

export default About;
