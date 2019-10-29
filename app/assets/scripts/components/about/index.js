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
            About targetting
          </Prose>
        </Constrainer>
      </App>
    );
  }
}

export default About;
